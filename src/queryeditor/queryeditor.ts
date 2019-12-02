import { BoxLayout, SplitPanel, Widget } from '@phosphor/widgets';

import { IDataSourceConnector, IQueryResultColumn, IQueryResultRow } from '@mochi/services';
import { DataGrid, DataGridModel, Toolbar, ToolbarButton } from '@mochi/apputils';
import { QueryEditorModel } from '@mochi/queryeditor';

import { Editor } from './editor';

/**
 * The class name added to the query editor toolbar node.
 */
const TOOLBAR_CLASS = 'm-QueryEditor-toolbar';

/**
 * The class name added to the editor node.
 */
const EDITOR_CLASS = 'm-QueryEditor-editor';

export class QueryEditor extends Widget {
  constructor(options: QueryEditor.IOptions) {
    super();

    const id = Private.getId();
    this.id = `queryeditor-widget-${id}`;
    this.title.label = options.label || `Editor ${id}`;

    this.editor = new Editor();
    this.editor.addClass(EDITOR_CLASS);

    this.toolbar = new Toolbar();
    this.toolbar.addClass(TOOLBAR_CLASS);

    this.datagridModel = new DataGridModel();
    this.datagrid = new DataGrid({ model: this.datagridModel });

    this.model = new QueryEditorModel({
      editor: this.editor,
      connection: options.connection,
    });

    this.model.onQuerySuccess.connect((sender, args) => {
      this.datagridModel.setColumns(Private.connectorColumnToViewerColumn(args.result.columns));
      this.datagridModel.setItems(Private.connectorRowToViewerRow(args.result.rows));
    });

    const runQuery = new ToolbarButton({
      label: 'Run',
      tooltip: 'Run Query',
      iconClassName: 'm-RunIcon',
      onClick: () => this.model.runQuery(),
    });

    this.toolbar.addItem('runQuery', runQuery);

    const panels = new SplitPanel({ orientation: 'vertical' });
    panels.addWidget(this.editor);
    panels.addWidget(this.datagrid);

    const layout = new BoxLayout();
    layout.addWidget(this.toolbar);
    layout.addWidget(panels);

    BoxLayout.setStretch(this.toolbar, 0);
    BoxLayout.setStretch(panels, 1);

    this.layout = layout;
  }

  readonly toolbar: Toolbar;

  readonly model: QueryEditorModel;
  readonly editor: Editor;

  readonly datagridModel: DataGridModel;
  readonly datagrid: DataGrid;
}

export namespace QueryEditor {
  export interface IOptions {
    /**
     * Label of the editor on main tab.
     */
    label?: string;

    /**
     * Data connection which the model is bound to.
     */
    connection: IDataSourceConnector;
  }
}

/**
 * Module private statics.
 */
namespace Private {
  /**
   * Track incremental id.
   */
  let WIDGET_ID_TRACKER = 0;

  /**
   * Get a unique id for the widget.
   */
  export function getId(): string {
    return (WIDGET_ID_TRACKER++).toString();
  }
}

namespace Private {
  /**
   * Convert a connector query result column into
   * table viewer column.
   */
  export function connectorColumnToViewerColumn(cols: IQueryResultColumn[]): DataGridModel.IDataGridColumn[] {
    return cols.map(c => ({ ...c, id: c.name, field: c.name }));
  }

  /**
   * Convert a connector query result row into
   * table viewer data row.
   */
  export function connectorRowToViewerRow(cols: IQueryResultRow[]): (IQueryResultRow & { id: string | number })[] {
    return cols.map((c, id) => ({ ...c, id }));
  }
}
