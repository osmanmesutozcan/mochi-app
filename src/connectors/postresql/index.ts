import * as PG from '@mochi/pg';

import { DataSourceConnector, IDataIntrospection, IQueryParams, IQueryResult } from '@mochi/services';

export class PostgreSQLConnector extends DataSourceConnector {
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
