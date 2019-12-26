import { ISignal } from '@phosphor/signaling';
import { DataGridModel } from '@mochi/apputils';
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

  introspect(): Promise<DataIntrospection.IIntrospection>;
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

  mutation: Mutation.IMutationEnvelope | null;
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

export namespace Mutation {
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
   * When user edits a part of the entity.
   *
   * ## Note
   * This also includes removing a cell value (in SQL that is). Removing a cell value
   * is simply setting a cell to NULL
   */
  export interface IEditArgs extends DataGridModel.ICellEditedArgs {
    //
  }
}

export namespace DataIntrospection {
  /**
   * Shape of the connected database.
   */
  export interface IIntrospection {
    tables: ITableIntrospection[];
  }

  interface ITableIntrospection {
    name: string;
  }
}
