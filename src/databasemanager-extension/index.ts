import { MochiFrontEnd, MochiFrontEndPlugin } from '@mochi/application';
import { DatabaseManager, IDatabaseManager } from '@mochi/databasemanager';

const manager: MochiFrontEndPlugin<IDatabaseManager> = {
  id: '@mochi/databasemanager-extension:manager',
  autoStart: true,
  activate: activateManager,
  provides: IDatabaseManager,
};

/**
 * Activate the default database manager plugin.
 */
function activateManager(app: MochiFrontEnd): IDatabaseManager {
  const manager = app.serviceManager;
  const registry = app.databaseRegistry;
  return new DatabaseManager({ manager, registry });
}

const plugins: MochiFrontEndPlugin<any>[] = [manager];
export default plugins;
