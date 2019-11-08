import { ISignal } from '@phosphor/signaling';

/**
 * Definition of a general purpose data source connectorRegistry.
 */
export interface IDataSourceConnector {

  /**
   * Signal emitted when connection status change.
   */
  changed: ISignal<this, IChangedArgs>;

  query(query: string, params?: IQueryParams): Promise<IQueryResult>;

  login(): Promise<void>;

  logout(): Promise<void>;

  watchQuery(query: string, params?: IQueryParams): void;

  introspect(): Promise<IDataIntrospection>;
}

export interface IChangedArgs {
  type: 'connectionStatus';
  change: 'connected' | 'disconnected';
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
