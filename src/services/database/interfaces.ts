import { IDisposable } from '@phosphor/disposable';

/**
 * Definition of a general purpose database connector.
 */
export interface IDatabaseConnector extends IDisposable {

  query(query: string, params?: IQueryParams): Promise<IQueryResult>;

  login(): Promise<void>;

  logout(): Promise<void>;

  watchQuery(query: string, params?: IQueryParams): void;

  introspect(): Promise<IDatabaseIntrospection>;
}

export interface IQueryParams {
  [param: string]: string;
}

/**
 * Database query result returned from the connector.
 */
export interface IQueryResult {
  //
}

/**
 * Shape of the connected database.
 */
export interface IDatabaseIntrospection {
  //
}
