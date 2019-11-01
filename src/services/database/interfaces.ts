import { IDisposable } from '@phosphor/disposable';

/**
 * Definition of a general purpose database connector.
 *
 * @typeparam T - The basic query type.
 *
 * @typeparam U - The basic query params type.
 */
export interface IDatabaseConnector<T, U = T> extends IDisposable {
  query(query: T, params?: U): Promise<IQueryResult>;

  login(): Promise<void>;

  logout(): Promise<void>;

  watchQuery(query: T, params?: U): void;
}

/**
 * Database query result returned from the connector.
 */
export interface IQueryResult {
  //
}
