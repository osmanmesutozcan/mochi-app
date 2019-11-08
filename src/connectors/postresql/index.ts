import * as PG from '@mochi/pg';

import { ISignal, Signal } from '@phosphor/signaling';
import { IDisposable } from '@phosphor/disposable';

import { DataSourceConnector, IDataIntrospection, IQueryParams, IQueryResult } from '@mochi/services';
import { IChangedArgs } from '@mochi/services/connector';

export class PostgreSQLConnector extends DataSourceConnector implements IDisposable {
  constructor(options: DataSourceConnector.IOptions) {
    super(options);
    this._client = new PG.Client();
    console.log(this._client);
  }

  async introspect(): Promise<IDataIntrospection> {
    throw new Error('Not implemented');
  }

  async login(): Promise<void> {
    throw new Error('Not implemented');
  }

  async logout(): Promise<void> {
    throw new Error('Not implemented');
  }

  async query(query: string, params?: IQueryParams): Promise<IQueryResult> {
    throw new Error('Not implemented');
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
