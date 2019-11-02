import { IStateDB } from '../coreutils';
import { IConnectorManager } from '@mochi/connectormanager';

export class DatabaseBrowserModel {
  constructor(options: DatabaseBrowserModel.IOptions) {
    this._manager = options.manager;
    this._state = options.state;
  }

  private _manager: IConnectorManager;
  private _state: IStateDB;
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
