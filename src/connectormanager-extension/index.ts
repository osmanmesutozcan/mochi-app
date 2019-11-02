import { MochiFrontEnd, MochiFrontEndPlugin } from '@mochi/application';
import { ConnectorManager, IConnectorManager } from '@mochi/connectormanager';

const manager: MochiFrontEndPlugin<IConnectorManager> = {
  id: '@mochi/databasemanager-extension:manager',
  autoStart: true,
  activate: activateManager,
  provides: IConnectorManager,
};

/**
 * Activate the default database manager plugin.
 */
function activateManager(app: MochiFrontEnd): IConnectorManager {
  const manager = app.serviceManager;
  const registry = app.databaseRegistry;
  return new ConnectorManager({ manager, registry });
}

const plugins: MochiFrontEndPlugin<any>[] = [manager];
export default plugins;
