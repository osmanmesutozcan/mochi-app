import { IDatabaseConnector } from '@mochi/services/database/interfaces';
import { Token } from '@phosphor/coreutils';

export class DatabaseManager implements DatabaseManager.IManager {
  async start(id: Token<IDatabaseConnector>): Promise<void> {
    throw new Error('Not implemented');
  }

  private readonly _connectors: IDatabaseConnector[] = [];
}

export namespace DatabaseManager {
  export interface IManager {
    /**
     * Start a registered connector by its id.
     */
    start(id: Token<IDatabaseConnector>): Promise<void>;
  }
}
