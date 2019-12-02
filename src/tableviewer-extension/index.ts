import './index.css';

import { IMochiShell, MochiFrontEnd, MochiFrontEndPlugin } from '@mochi/application';
import { ITableViewerFactory, TableViewer } from '@mochi/tableviewer';
import { DataGridModel } from '@mochi/apputils';

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
    const model = new DataGridModel();
    const viewer = new TableViewer({ model, ...options });
    shell.add(viewer);
    return { model };
  };

  return { createViewer };
}

const plugins: MochiFrontEndPlugin<any>[] = [viewer];
export default plugins;
