import { IDataSourceConnector, IDataIntrospection, IQueryParams, IQueryResult, IChangedArgs } from './interfaces';
import { ISignal } from '@phosphor/signaling';

/**
 * An abstract client definition to
 * communicate with different types of underlying
 * database connections.
 *
 * @typeparam T - Type of the query.
 * @typeparam U - Type of the params.
 */
export abstract class DataSourceConnector implements IDataSourceConnector {
  constructor(options: DataSourceConnector.IOptions) {
    //
  }

  /**
   * Signal emitted when connection status change.
   */
  abstract changed: ISignal<this, IChangedArgs>;

  /**
   * Runs a query on database and return `IQueryResult`.
   * @param query Query to run.
   * @param params Params to pass into the query.
   */
  abstract async query(query: string, params?: IQueryParams): Promise<IQueryResult>;

  /**
   * Initializes database connection.
   * Method must be idempotent since consumers
   * might call this multiple times.
   */
  abstract async login(): Promise<void>;

  /**
   * Terminates database connection.
   */
  abstract async logout(): Promise<void>;

  /**
   * Introspect the database to get overall database shape.
   */
  abstract async introspect(): Promise<IDataIntrospection>;

  /**
   * Runs a query on database and return an observable
   *  which subscribes to query changes.
   *
   * @TODO Setup observables to support this.
   *
   * @NOTE This will be implemented if database supports it.
   *
   * @param query Query to run.
   * @param params Params to pass into the query.
   */
  watchQuery(query: string, params?: IQueryParams): void {
    throw new Error('DataSourceConnector#watchQuery is not implemented');
  }
}

export namespace DataSourceConnector {
  /**
   * Database connectorRegistry options.
   */
  export interface IOptions {
    user?: string;
    password?: string;
    hostname?: string;
    port?: string;
    database?: string;
    connectionString?: string;
  }
}
