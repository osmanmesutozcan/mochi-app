import { IDataSourceConnector, IDataIntrospection, IQueryParams, IQueryResult } from './interfaces';

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
   * Runs a query on database and return `IQueryResult`.
   * @param query Query to run.
   * @param params Params to pass into the query.
   */
  abstract async query(query: string, params?: IQueryParams): Promise<IQueryResult>;

  /**
   * Initializes database connection.
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

  get isDisposed(): boolean {
    return this._isDisposed;
  }

  dispose(): void {
    this.logout().then(() => (this._isDisposed = true));
  }

  private _isDisposed = false;
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
