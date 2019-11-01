import { IStateDB } from '../coreutils';
import { IDatabaseManager } from '@mochi/databasemanager/tokens';

export class DatabaseBrowserModel {
  constructor(options: DatabaseBrowserModel.IOptions) {
    //
  }
}

export namespace DatabaseBrowserModel {
  export interface IOptions {
    /**
     * The time interval for browser refreshing, in ms.
     */
    refreshInterval?: number;

    /**
     * State database to restore the model when
     * model is restored.
     */
    state: IStateDB;

    /**
     * A database manager instance.
     */
    manager: IDatabaseManager;
  }
}
