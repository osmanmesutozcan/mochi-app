import { IDisposable } from '@phosphor/disposable';

/**
 * Definition of a general purpose data source connectorRegistry.
 */
export interface IDataSourceConnector extends IDisposable {

  query(query: string, params?: IQueryParams): Promise<IQueryResult>;

  login(): Promise<void>;

  logout(): Promise<void>;

  watchQuery(query: string, params?: IQueryParams): void;

  introspect(): Promise<IDataIntrospection>;
}

export interface IQueryParams {
  [param: string]: string;
}

/**
 * Database query result returned from the connectorRegistry.
 */
export interface IQueryResult {
  //
}

/**
 * Shape of the connected database.
 */
export interface IDataIntrospection {
  //
}
