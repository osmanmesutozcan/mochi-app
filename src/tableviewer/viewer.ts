import { BoxLayout, Widget } from '@phosphor/widgets';

import { DataGrid, DataGridModel, Toolbar, ToolbarButton } from '@mochi/apputils';
import { TableViewerModel } from '@mochi/tableviewer/model';
import { IConnectorManager } from '@mochi/connectormanager';

/**
 * Class added to the table viewer instances.
 */
const TABLE_VIEWER_CLASS = 'm-TableViewer';

/**
 * Table viewer widget.
 */
export class TableViewer extends Widget {
  constructor(options: TableViewer.IOptions) {
    super();

    const id = Private.getNewID();
    const model = options.model;

    this.addClass(TABLE_VIEWER_CLASS);
    this.title.label = options.label || `Output ${id}`;
    this.id = `table-viewer-${id}-widget`;

    this.grid = new DataGrid({ model:  options.model.dataGridModel });

    const fitButton = new ToolbarButton({
      iconClassName: 'm-RefreshIcon',
      tooltip: 'Fit To View',
      label: 'Fit',
      onClick: () => this.grid.fit(),
    });

    const commitButton = new ToolbarButton({
      iconClassName: 'm-RefreshIcon',
      tooltip: 'Commit changes',
      label: 'Commit',
      onClick: () => model.commit(),
    });

    const toolbar = new Toolbar();
    toolbar.addItem('fitToView', fitButton);
    toolbar.addItem('commitChanges', commitButton);

    const layout = new BoxLayout();
    layout.addWidget(toolbar);
    layout.addWidget(this.grid);

    BoxLayout.setStretch(toolbar, 0);
    BoxLayout.setStretch(this.grid, 1);

    this.layout = layout;
  }

  readonly grid: DataGrid;
}

export namespace TableViewer {
  /**
   * Options for the viewer extension.
   */
  export interface IOptions {
    /**
     * Tab label of the viewer.
     */
    label?: string;

    /**
     * Reference to the application connector manager.
     */
    manager?: IConnectorManager;

    /**
     * Model of the viewer.
     */
    model: TableViewerModel;

    /**
     * Id of the connection managed by this viewer.
     */
    connectionId: string;
  }
}

namespace Private {
  /**
   * Track the latest id given out.
   */
  let WIDGET_ID_TRACKER = 0;

  export const getNewID = (): string => {
    return (WIDGET_ID_TRACKER++).toString();
  };
}
