import { IStateDB } from '../coreutils';
import { ConnectorManager, IConnectorManager } from '@mochi/connectormanager';
import { IDisposable } from '@phosphor/disposable';
import { ConnectorRegistry } from '@mochi/connectorregistry';

export class DatabaseBrowserModel implements IDisposable {
  constructor(options: DatabaseBrowserModel.IOptions) {
    this.registry = options.registry;
    this.manager = options.manager;
    this.state = options.state;

    this.manager.definitionsChanged.connect((sender, args) => {
      this._onConnectionDefinitionsChange(args);
    });
  }

  /**
   * Test whether the model is disposed.
   */
  get isDisposed(): boolean {
    return this._isDisposed;
  }

  /**
   * Dispose browser model.
   */
  dispose(): void {
    if (this._isDisposed) {
      return;
    }
    this._isDisposed = true;
  }

  /**
   * Handles definition change signals from ConnectorManager.
   */
  private _onConnectionDefinitionsChange(args: ConnectorManager.IChangedArgs): void {
    console.log(this);
    throw new Error('Not implemented');
  }

  readonly registry: ConnectorRegistry;
  readonly manager: IConnectorManager;
  readonly state: IStateDB;

  private _isDisposed = false;
}

export namespace DatabaseBrowserModel {
  export interface IOptions {
    /**
     * State database to restore the model when
     * model is restored.
     */
    state: IStateDB;

    /**
     * A database manager instance.
     */
    manager: IConnectorManager;

    /**
     * A database connector registry.
     */
    registry: ConnectorRegistry;
  }
}
