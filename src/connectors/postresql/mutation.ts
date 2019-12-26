import { RowType } from '@mochi/connectorbrowser';
import { ObjectLiteral } from '@mochi/coreutils';
import { Mutation } from '@mochi/services/connector';

export namespace MutationImpl {
  /**
   * A generic SQL Mutation envelope implementation.
   */
  export class Envelope implements Mutation.IMutationEnvelope {
    private _diff: ObjectLiteral<any> = {};

    get diff(): ObjectLiteral<any> {
      return this._diff;
    }

    edit(args: Mutation.IEditArgs): void {
      console.log('Args', args);
      this._diff[`${args.column.name}_${args.row.index}`] = Private.buildMutationString(
        // FIXME: This should be the primary key column details.
        args.column.name,
        args.value.new,

        args.column.name,
        args.value.new,
      );
    }

    purge(): void {
      this._diff = {};
    }
  }
}

namespace Private {
  export function buildMutationString(pkColumn: string, pkValue: RowType, column: string, columnValue: RowType) {
    return `UPDATE ${column} = ${columnValue} WHERE ${pkColumn} = ${pkValue}`;
  }
}
