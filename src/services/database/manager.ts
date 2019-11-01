import { Token } from '@phosphor/coreutils';
import { IDisposable } from '@phosphor/disposable';

import { IDatabaseConnector } from './interfaces';

export class DatabaseManager implements Databases.IManager {
  constructor(options: DatabaseManager.IOptions = {}) {
    //
  }

  async start(id: Token<IDatabaseConnector>): Promise<void> {
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
    this._connectors.forEach(connector => connector.dispose());
  }

  private readonly _connectors: IDatabaseConnector[] = [];

  private _isDisposed = false;
}

export namespace DatabaseManager {
  /**
   * Database manager options.
   */
  export interface IOptions {
    //
  }
}

export namespace Databases {
  export interface IManager extends IDisposable {
    /**
     * Start a registered connector by its id.
     */
    start(id: Token<IDatabaseConnector>): Promise<void>;
  }
}
