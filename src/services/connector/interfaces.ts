import { ISignal } from '@phosphor/signaling';
import { DataGridModel } from '@mochi/apputils';
import { Mutation } from '@mochi/services';
import { ObjectLiteral } from '@mochi/coreutils';

/**
 * Definition of a general purpose data source connectorRegistry.
 */
export interface IDataSourceConnector {

  /**
   * Signal emitted when connection status change.
   */
  changed: ISignal<this, IChangedArgs>;

  /**
   * Run a query on using the connector.
   *
   * @TODO: We need to be able to cancel inflight requests.
   */
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
  columns: IQueryResultColumn[];

  rows: IQueryResultRow[];

  mutation: IMutationEnvelope | null;
}

export interface IQueryResultColumn {
  name: string;

  type: ColumnType;
}

export enum ColumnType {
  TEXT = 'TEXT',

  BOOLEAN = 'BOOLEAN',
}

export interface IQueryResultRow {
  //
}

/**
 * A container for building up the diff made to the query result.
 */
export interface IMutationEnvelope {
  edit(args: Mutation.IEditArgs): void;

  purge(): void;

  /**
   * Array of changes made to the data.
   */
  diff: ObjectLiteral<any>;
}

/**
 * Shape of the connected database.
 */
export interface IDataIntrospection {
  /**
   * List of available tables.
   */
  tables: string[];
}
