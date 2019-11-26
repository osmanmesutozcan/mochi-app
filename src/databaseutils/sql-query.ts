export namespace SqlQuery {
  /**
   * An sql query builder.
   */
  class SqlQueryBuilder {
    private _select: string | string[];
    private _from: string;
    private _where: string;
    private _limit = 100;

    setSelect(s: string | string[]) {
      this._select = s;
      return this;
    }

    setFrom(value: string) {
      this._from = value;
      return this;
    }

    setWhere(value: string) {
      this._where = value;
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

      const where = this._where ? `WHERE ${this._where}` : '';
      const limit = this._limit ? `LIMIT ${this._limit}` : '';

      return `SELECT ${select} FROM ${this._from} ${where} ${limit}`;
    }
  }

  /**
   * Create new query builder
   */
  export function newBuilder() {
    return new SqlQueryBuilder();
  }
}
