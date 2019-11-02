import * as PG from '@mochi/pg';

import { DatabaseConnector } from '../connector';
import { IDatabaseIntrospection, IQueryParams, IQueryResult } from '../interfaces';

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
}

export namespace PostgreSQLConnector {
  //
}
