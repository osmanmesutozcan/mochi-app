import { IDatabaseManager } from '@mochi/databasemanager/tokens';
import { ServiceManager } from '@mochi/services';
import { DatabaseRegistry } from '@mochi/databaseregistry';

/**
 * The database manager
 *
 * ### Notes
 * The database manager is used to register model and widget creators,
 * and the database browser uses the database manager to create widgets.
 * The database manager maintains a context for each database/table and
 * model type that is open, and a list of widgets for each context. The
 * database manager is in control of the proper closing of the widgets and
 * contexts.
 */
export class DatabaseManager implements IDatabaseManager {
  constructor(options: DatabaseManager.IOptions) {
    this.services = options.manager;
    this.registry = options.registry;
  }

  /**
   * Get whether the manager has been disposed.
   */
  get isDisposed(): boolean {
    return this._isDisposed;
  }

  /**
   * Dispose of the resources held by the database manager.
   */
  dispose(): void {
    this._isDisposed = true;
  }

  /**
   * The service manager used by the manager.
   */
  readonly services: ServiceManager.IManager;

  /**
   * The registry singleton used by the manager.
   */
  readonly registry: DatabaseRegistry;

  private _isDisposed = false;
}

export namespace DatabaseManager {
  export interface IOptions {
    /**
     * A service manager instance.
     */
    manager: ServiceManager.IManager;

    /**
     * The database registry singleton.
     */
    registry: DatabaseRegistry;
  }
}
