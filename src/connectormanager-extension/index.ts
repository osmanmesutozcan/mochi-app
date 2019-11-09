import { MochiFrontEnd, MochiFrontEndPlugin } from '@mochi/application';
import { ConnectorManager, IConnectorManager } from '@mochi/connectormanager';
import { IStateDB } from '@mochi/coreutils';

const manager: MochiFrontEndPlugin<IConnectorManager> = {
  id: '@mochi/databasemanager-extension:manager',
  autoStart: true,
  activate: activateManager,
  provides: IConnectorManager,
  requires: [IStateDB],
};

/**
 * Activate the default database manager plugin.
 */
function activateManager(app: MochiFrontEnd, state: IStateDB): IConnectorManager {
  const manager = app.serviceManager;
  const registry = app.connectorRegistry;
  return new ConnectorManager({ manager, registry, state });
}

const plugins: MochiFrontEndPlugin<any>[] = [manager];
export default plugins;
