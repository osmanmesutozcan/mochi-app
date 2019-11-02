import { Token } from '@phosphor/coreutils';
import { DisposableSet, IDisposable } from '@phosphor/disposable';

import { IDatabaseConnector } from './interfaces';
import { DatabaseRegistry } from '@mochi/databaseregistry';

export class DatabaseManager implements Databases.IManager {
  constructor(options: DatabaseManager.IOptions) {
    this.registry = options.registry;
  }

  async startNew(id: Token<IDatabaseConnector>): Promise<void> {
    throw new Error('Not implemented');
  }

  get isDisposed(): boolean {
    return this._isDisposed;
  }

  dispose(): void {
    if (this._isDisposed) {
      return;
    }
    this._isDisposed = true;
    this._disposables.dispose();
  }

  /**
   * A database registry instance.
   */
  readonly registry: DatabaseRegistry;

  private readonly _connectors = new Set<IDatabaseConnector>();
  private readonly _disposables = new DisposableSet();
  private _isDisposed = false;
}

export namespace DatabaseManager {
  /**
   * Database manager options.
   */
  export interface IOptions {
    /**
     * A database registry instance.
     */
    readonly registry: DatabaseRegistry;
  }
}

export namespace Databases {
  export interface IManager extends IDisposable {
    /**
     * Start a registered connector by its id.
     */
    startNew(id: Token<IDatabaseConnector>): Promise<void>;

    /**
     * A database registry instance.
     */
    registry: DatabaseRegistry;
  }
}
