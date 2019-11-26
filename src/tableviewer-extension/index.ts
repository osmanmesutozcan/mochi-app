import './index.css';

import { IMochiShell, MochiFrontEnd, MochiFrontEndPlugin } from '@mochi/application';
import { ITableViewerFactory, TableViewer } from '@mochi/tableviewer';
import { TableViewerModel } from '@mochi/tableviewer/model';

namespace CommandIDs {
  //
}

/**
 * Default extension to view table data.
 */
const viewer: MochiFrontEndPlugin<ITableViewerFactory> = {
  id: '@mochi/table-viewer-extension:viewer',
  requires: [IMochiShell],
  provides: ITableViewerFactory,
  activate: activateFactory,
};

function activateFactory(app: MochiFrontEnd, shell: IMochiShell): ITableViewerFactory {
  const createViewer = (id: string, options: TableViewer.IOptions) => {
    const model = options.model || new TableViewerModel();
    const viewer = new TableViewer({ model, ...options });
    shell.add(viewer);
    return { model, viewer };
  };

  return { createViewer };
}

const plugins: MochiFrontEndPlugin<any>[] = [viewer];
export default plugins;
