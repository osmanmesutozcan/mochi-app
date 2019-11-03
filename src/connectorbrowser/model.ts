import { IStateDB } from '../coreutils';
import { ConnectorManager, IConnectorManager } from '@mochi/connectormanager';
import { IDisposable } from '@phosphor/disposable';

export class DatabaseBrowserModel implements IDisposable {
  constructor(options: DatabaseBrowserModel.IOptions) {
    this._manager = options.manager;
    this._state = options.state;

    this._manager.definitionsChanged.connect((sender, args) => {
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

  private readonly _manager: IConnectorManager;
  private readonly _state: IStateDB;

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
  }
}
