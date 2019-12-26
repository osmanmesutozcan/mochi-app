import { IConnectorManager } from '@mochi/connectormanager';
import { DataGridModel, Slick } from '@mochi/apputils';
import { SqlQuery } from '@mochi/databaseutils';
import { ColumnType, IQueryResult, IQueryResultColumn, IQueryResultRow } from '@mochi/services';
import { Simulate } from 'react-dom/test-utils';
import mouseUp = Simulate.mouseUp;

/**
 * Model for table viewer.
 */
export class TableViewerModel {
  constructor(options: TableViewerModel.IOptions) {
    this.manager = options.manager;
    this.dataGridModel = new DataGridModel();
  }

  /**
   * Async function to finalize initialization of the model.
   */
  async initialize(table: string, connectionId: string): Promise<void> {
    const query = SqlQuery.newBuilder()
      .setSelect()
      .setFrom(table)
      .build();

    const connection = this.manager.getConnection(connectionId);
    const result = this._result = await connection.query(query);

    this.dataGridModel.setColumns(Private.connectorColumnToViewerColumn(result.columns));
    this.dataGridModel.setItems(Private.connectorRowToViewerRow(result.rows));

    this.dataGridModel.onCellEdited.connect((sender, args) => {
      if (result.mutation) {
        result.mutation.edit({
          ...args,
          db: {
            table: {
              name: table,
            }
          }
        });
      }
    });
  }

  async commit(): Promise<void> {
    console.log('Commit this', this._result.mutation.diff);

    // Cleanup the mutation diff after commit.
    this._result.mutation.purge();
  }

  private _result: IQueryResult | null = null;
  readonly manager: IConnectorManager;
  readonly dataGridModel: DataGridModel;
}

/**
 * Table viewer model statics namespace.
 */
export namespace TableViewerModel {
  export interface IOptions {
    manager: IConnectorManager;
  }
}

/**
 * Module private statics.
 */
namespace Private {

  /**
   * Convert a connector query result column into
   * table viewer column.
   *
   */
  export function connectorColumnToViewerColumn(cols: IQueryResultColumn[]): DataGridModel.IDataGridColumn[] {
    return cols.map(c => ({
      ...c,
      id: c.name,
      field: c.name,
      editor: getCellEditorByType(c.type),
      width: 100,
    }));
  }

  /**
   *
   * TODO: Check the column type and pass the correct editor by type.
   */
  function getCellEditorByType(type: ColumnType) {
    switch (type) {
      case ColumnType.TEXT:
        return Slick.Editors.Text;

      case ColumnType.BOOLEAN:
        return Slick.Editors.CheckBox;

      default:
        return Slick.Editors.Text;
    }
  }

  /**
   * Convert a connector query result row into
   * table viewer data row.
   */
  export function connectorRowToViewerRow(cols: IQueryResultRow[]): (IQueryResultRow & { id: string | number })[] {
    return cols.map((c, id) => ({ ...c, id }));
  }
}

