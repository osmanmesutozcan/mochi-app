import { IDatabaseManager } from '@mochi/databasemanager/tokens';
import { ServiceManager } from '@mochi/services';
import { DatabaseRegistry } from '@mochi/databaseregistry';

export class DatabaseManager implements IDatabaseManager {
  constructor(options: DatabaseManager.IOptions) {
    this.services = options.manager;
    this.registry = options.registry;
  }

  get isDisposed(): boolean {
    return this._isDisposed;
  }

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
