import './index.css';

import { IMochiShell, MochiFrontEnd, MochiFrontEndPlugin } from '@mochi/application';
import { ITableViewerFactory, TableViewer } from '@mochi/tableviewer';
import { DataGridModel } from '@mochi/apputils';
import { IConnectorManager } from '@mochi/connectormanager';
import { TableViewerModel } from '@mochi/tableviewer/model';

namespace CommandIDs {
  //
}

/**
 * Default extension to view table data.
 */
const viewer: MochiFrontEndPlugin<ITableViewerFactory> = {
  id: '@mochi/table-viewer-extension:viewer',
  requires: [IMochiShell, IConnectorManager],
  provides: ITableViewerFactory,
  activate: activateFactory,
};

function activateFactory(app: MochiFrontEnd, shell: IMochiShell, manager: IConnectorManager): ITableViewerFactory {
  const createViewer = (id: string, options: { label: string, connectionId: string }) => {
    const model = new TableViewerModel({
      manager
    });

    const viewer = new TableViewer({ model, manager, ...options });
    shell.add(viewer);

    return { model };
  };

  return { createViewer };
}

const plugins: MochiFrontEndPlugin<any>[] = [viewer];
export default plugins;
