import { RowType } from '@mochi/connectorbrowser';
import { ObjectLiteral } from '@mochi/coreutils';
import { DataIntrospection, Mutation } from '@mochi/services/connector';
import { SqlQuery } from '@mochi/databaseutils';

export namespace MutationImpl {
  /**
   * A generic SQL Mutation envelope implementation.
   *
   * @TODO: Should be able handle introspection change.
   */
  export class Envelope implements Mutation.IMutationEnvelope {
    private _diff: ObjectLiteral<any> = {};

    constructor(introspection: DataIntrospection.IIntrospection) {
      this._introspection = Private.normalizeIntrospection(introspection);
    }

    edit(args: Mutation.IEditArgs): void {
      const intro = this._introspection[args.db.table.name];
      this._diff[`${args.column.name}_${args.row.index}_${args.db.table.name}`] = Private.buildMutationString(
        args.db.table.name,

        intro.pk,
        intro.pk.map(pk => args.row.content[pk]),

        args.column.name,
        args.value.new,
      );
    }

    purge(): void {
      this._diff = {};
    }

    get diff(): ObjectLiteral<any> {
      return this._diff;
    }

    private readonly _introspection: ObjectLiteral<DataIntrospection.ITableIntrospection>;
  }
}

namespace Private {
  export function buildMutationString(table: string, pkColumn: string[], pkValue: RowType[], column: string, columnValue: RowType) {
    const builder = SqlQuery.newBuilder()
      .setUpdate(column, columnValue)
      .setFrom(table);

    pkColumn.forEach((pk, idx) => {
      builder.setWhere(pk, pkValue[idx]);
    });

    return builder.build();
  }
  
  export function normalizeIntrospection(intro: DataIntrospection.IIntrospection): ObjectLiteral<DataIntrospection.ITableIntrospection> {
    return intro
      .tables
      .reduce<ObjectLiteral<DataIntrospection.ITableIntrospection>>((acc, t) => {
        acc[t.name] = t;
        return acc;
      }, {});
  }
}
