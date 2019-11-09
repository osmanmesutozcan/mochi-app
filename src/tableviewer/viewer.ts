import { BoxPanel } from '@phosphor/widgets';

import { DataGrid } from './datagrid';

/**
 * Class added to the table viewer instances.
 */
const TABLE_VIEWER_CLASS = 'm-TableViewer';

/**
 * Table viewer widget.
 */
export class TableViewer extends BoxPanel {
  constructor(options: TableViewer.IOptions) {
    super();

    const id = Private.getNewID();
    this.id = `table-viewer-${id}-widget`;
    this.addClass(TABLE_VIEWER_CLASS);

    const grid = new DataGrid({ id });
    this.addWidget(grid);
  }

  private _grid: DataGrid;
}

export namespace TableViewer {
  /**
   * Options for the viewer extension.
   */
  export interface IOptions {
    //
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
