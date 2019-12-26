import { IConnectorManager } from '@mochi/connectormanager';
import { DataGridModel, Slick } from '@mochi/apputils';
import { SqlQuery } from '@mochi/databaseutils';
import { ColumnType, IQueryResult, IQueryResultColumn, IQueryResultRow } from '@mochi/services';

/**
 * Model for table viewer.
 */
export class TableViewerModel {
  constructor(options: TableViewerModel.IOptions) {
    this.manager = options.manager;
    this.connectionId = options.connectionId;
    this.dataGridModel = new DataGridModel();
  }

  /**
   * Async function to finalize initialization of the model.
   */
  async initialize(table: string): Promise<void> {
    const query = SqlQuery.newBuilder()
      .setSelect()
      .setFrom(table)
      .build();

    const connection = this.manager.getConnection(this.connectionId);
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
    const connection = this.manager.getConnection(this.connectionId);
    const mutation = Object
      .keys(this._result.mutation.diff)
      .map(d => this._result.mutation.diff[d])
      .join(';') + ';';

    // TODO: Free the execution and ask for query confirmation in a dialog.
    await connection.query(mutation);
    this._result.mutation.purge();
  }

  private _result: IQueryResult | null = null;
  readonly connectionId: string;
  readonly manager: IConnectorManager;
  readonly dataGridModel: DataGridModel;
}

/**
 * Table viewer model statics namespace.
 */
export namespace TableViewerModel {
  export interface IOptions {
    manager: IConnectorManager;
    connectionId: string;
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

