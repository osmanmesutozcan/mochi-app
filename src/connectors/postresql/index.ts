import * as PG from '@mochi/pg';

import { ISignal, Signal } from '@phosphor/signaling';
import { IDisposable } from '@phosphor/disposable';

import { DataSourceConnector, DataIntrospection, IQueryParams, IQueryResult } from '@mochi/services';
import { IChangedArgs, ColumnType } from '@mochi/services/connector';

import { MutationImpl } from './mutation';

export class PostgreSQLConnector extends DataSourceConnector implements IDisposable {
  constructor(options: DataSourceConnector.IOptions) {
    super(options);
    this._client = new PG.Client({ ...options, host: options.hostname });
  }

  async introspect(): Promise<DataIntrospection.IIntrospection> {
    const tables = await this._client.query(Private.ALL_PUBLIC_TABLES_WITH_PK);
    return { tables: tables.rows.map((v: any) => ({
        name: v.table_name,
        pk: v.key_columns.split(', ')
    })) };
  }

  async login(): Promise<void> {
    await this._client.connect();
    this._changed.emit({ change: 'connected', type: 'connectionStatus' });
  }

  async logout(): Promise<void> {
    throw new Error('Not implemented');
  }

  async query(query: string, params?: IQueryParams): Promise<IQueryResult> {
    const result = await this._client.query(query);
    return {
      // FIXME: Figure out what does dataTypeId mean
      columns: result.fields.map((f: any) => ({ name: f.name, type: ColumnType.TEXT })),
      rows: result.rows,
      // TODO: Try to reuse the introspection throughout the application.
      mutation: new MutationImpl.Envelope(await this.introspect()),
    };
  }

  get changed(): ISignal<this, IChangedArgs> {
    return this._changed;
  }

  get isDisposed(): boolean {
    return this._isDisposed;
  }

  dispose(): void {
    if (this._isDisposed) {
      return;
    }

    this._isDisposed = true;
    this._client = null;
    Signal.clearData(this);
    this.logout().then(() => ({}));
  }

  private _client: PG.Client;
  private _changed = new Signal<this, IChangedArgs>(this);
  private _isDisposed = false;
}

export namespace PostgreSQLConnector {
  //
}

namespace Private {
  export const ALL_TABLES = `SELECT table_name FROM information_schema.tables`;

  export const ALL_PUBLIC_TABLES = `SELECT * FROM information_schema.tables where table_schema='public'`;

  export const ALL_PUBLIC_TABLES_WITH_PK = `
    select kcu.table_schema,
         kcu.table_name,
         tco.constraint_name,
         string_agg(kcu.column_name,', ') as key_columns
    from information_schema.table_constraints tco
    join information_schema.key_column_usage kcu 
         on kcu.constraint_name = tco.constraint_name
         and kcu.constraint_schema = tco.constraint_schema
         and kcu.constraint_name = tco.constraint_name
    where tco.constraint_type = 'PRIMARY KEY'
    group by tco.constraint_name,
           kcu.table_schema,
           kcu.table_name
    order by kcu.table_schema,
             kcu.table_name;
  `;
}
