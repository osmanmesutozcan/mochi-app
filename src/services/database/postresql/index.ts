import * as PG from '@mochi/pg';

import { Token } from '@phosphor/coreutils';

import { DatabaseConnector } from '../connector';
import { IDatabaseConnector, IDatabaseIntrospection, IQueryParams, IQueryResult } from '../interfaces';

export class PostgreSQLConnector extends DatabaseConnector {
  async introspect(): Promise<IDatabaseIntrospection> {
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

  get type(): Token<IDatabaseConnector> {
    return this._type;
  }

  private readonly _type = PostgreSQLConnector.PORTGRESQL_CONNECTOR_TOKEN;
}

export namespace PostgreSQLConnector {
  export const PORTGRESQL_CONNECTOR_TOKEN = new Token<IDatabaseConnector>('@mochi/services:postgresql-connector');
}
