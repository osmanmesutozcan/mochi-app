import { Token } from '@phosphor/coreutils';
import { DisposableSet, IDisposable } from '@phosphor/disposable';

import { IDataConnector } from './interfaces';
import { ConnectorRegistry } from '@mochi/connectorregistry';

export class ConnectorManager implements Connectors.IManager {
  constructor(options: ConnectorManager.IOptions) {
    this.registry = options.registry;
  }

  async startNew(id: Token<IDataConnector>): Promise<void> {
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
   * A connector registry instance.
   */
  readonly registry: ConnectorRegistry;

  private readonly _connectors = new Set<IDataConnector>();
  private readonly _disposables = new DisposableSet();
  private _isDisposed = false;
}

export namespace ConnectorManager {
  /**
   * Database manager options.
   */
  export interface IOptions {
    /**
     * A database registry instance.
     */
    readonly registry: ConnectorRegistry;
  }
}

export namespace Connectors {
  export interface IManager extends IDisposable {
    /**
     * Start a registered connector by its id.
     */
    startNew(id: Token<IDataConnector>): Promise<void>;

    /**
     * A database registry instance.
     */
    registry: ConnectorRegistry;
  }
}
