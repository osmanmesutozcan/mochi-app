import * as PG from '@mochi/pg';

import { DataConnector, IDataIntrospection, IQueryParams, IQueryResult } from '@mochi/services';

export class PostgreSQLConnector extends DataConnector {
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
}

export namespace PostgreSQLConnector {
  //
}
