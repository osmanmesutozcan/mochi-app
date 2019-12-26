import { RowType } from '@mochi/connectorbrowser';

export namespace SqlQuery {
  /**
   * An sql query builder.
   */
  class SqlQueryBuilder {
    private readonly _DEFAULT_LIMIT = 100;

    private _select: string | string[];
    private _update: string;
    private _from: string;
    private _where: string[] = [];
    private _limit: number;

    setSelect(s?: string | string[]) {
      this._select = s || '*';
      return this;
    }

    setUpdate(column: string, value: RowType) {
      this._update = Private.normalizeColumnValue(column, value);
      return this;
    }

    setFrom(value: string) {
      this._from = value;
      return this;
    }

    setWhere(column: string, value: RowType) {
      this._where.push(Private.normalizeColumnValue(column, value));
      return this;
    }

    setLimit(value: number) {
      this._limit = value;
      return this;
    }

    build(): string {
      if (!this._from) {
        throw new Error('`from` param must be set');
      }

      let select = this._select || '*';
      if (Array.isArray(select)) {
        select = `(${select.join(',')})`;
      }

      let update = this._update;
      const where = this._where.length > 0 ? `WHERE ${this._where.join(' AND ')}` : '';
      const limit = this._limit || this._select ? `LIMIT ${this._limit || this._DEFAULT_LIMIT}` : '';

      return `${this._select ? 'SELECT' : 'UPDATE'} ${this._select ? select : update} FROM ${this._from} ${where} ${limit}`;
    }
  }

  /**
   * Create new query builder
   */
  export function newBuilder() {
    return new SqlQueryBuilder();
  }
}

/**
 * Module private statics.
 */
namespace Private {
  /**
   * Given a value add double quotes to value if needed.
   */
  export function normalizeColumnValue(column: string, value: RowType): string {
    return `${column} = ${`${typeof value === 'string' ? `"${value}"` : value}`}`;
  }
}