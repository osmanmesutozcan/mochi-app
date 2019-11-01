/**
 * An abstract client definition to
 * communicate with different types of underlying
 * database connections.
 */
import { IDatabaseConnector, IQueryResult } from './interfaces';

export abstract class DatabaseConnector<T = string, U = T> implements IDatabaseConnector<T, U> {
  protected constructor(options: DatabaseConnector.IOptions) {
    //
  }

  /**
   * Runs a query on database and return `IQueryResult`.
   * @param query Query to run.
   * @param params Params to pass into the query.
   */
  abstract async query(query: T, params?: U): Promise<IQueryResult>;

  /**
   * Initializes database connection.
   */
  abstract async login(): Promise<void>;

  /**
   * Terminates database connection.
   */
  abstract async logout(): Promise<void>;

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
  watchQuery(query: T, params?: U): void {
    throw  new Error('Not implemented');
  }

  get isDisposed(): boolean {
    return this._isDisposed;
  }

  dispose(): void {
    this
      .logout()
      .then(() => (this._isDisposed = true));
  }

  private _isDisposed = false;
}

export namespace DatabaseConnector {
  /**
   * Database connector options.
   */
  export interface IOptions {
    user?: string;
    password?: string;
    hostname?: string;
    port?: string;
    connectionString?: string;
  }
}
