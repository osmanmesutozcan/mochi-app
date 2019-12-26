import './index.css';

import { IMochiShell, MochiFrontEnd, MochiFrontEndPlugin } from '@mochi/application';
import { ITableViewerFactory, TableViewer } from '@mochi/tableviewer';
import { IConnectorManager } from '@mochi/connectormanager';
import { TableViewerModel } from '@mochi/tableviewer/model';
import { DataIntrospection } from '@mochi/services';

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
  const createViewer = (id: string, options: {
    label: string,
    connectionId: string,
    introspection: DataIntrospection.ITableIntrospection
  }) => {
    const model = new TableViewerModel({
      manager,
      connectionId: options.connectionId,
    });

    const viewer = new TableViewer({ model, manager, ...options });
    shell.add(viewer);

    return { model };
  };

  return { createViewer };
}

const plugins: MochiFrontEndPlugin<any>[] = [viewer];
export default plugins;
