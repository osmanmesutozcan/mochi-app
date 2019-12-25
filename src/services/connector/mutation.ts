import { IMutationEnvelope } from './interfaces';
import { DataGridModel } from '@mochi/apputils';
import { RowType } from '@mochi/connectorbrowser';
import { ObjectLiteral } from '@mochi/coreutils';

export namespace Mutation {
  /**
   * A generic SQL Mutation envelope implementation.
   */
  export class Envelope implements IMutationEnvelope {
    private _diff: ObjectLiteral<any> = {};

    get diff(): ObjectLiteral<any> {
      return this._diff;
    }

    edit(args: IEditArgs): void {
      console.log('Args', args);
      this._diff[`${args.column.name}_${args.row.index}`] = Private.buildMutationString(
        // FIXME: This should be the primary key column details.
        args.column.name,
        args.value.new,

        args.column.name,
        args.value.new,
      );
    }

    delete(args: IDeleteArgs): void {
      //
    }

    purge(): void {
      this._diff = {};
    }
  }

  /**
   * When user edits a part of the entity.
   *
   * ## Note
   * This also includes removing a cell value (in SQL that is). Removing a cell value
   * is simply setting a cell to NULL
   */
  export interface IEditArgs extends DataGridModel.ICellEditedArgs {
    //
  }

  /**
   * When user deletes a whole entity.
   */
  export interface IDeleteArgs {}
}

namespace Private {
  export function buildMutationString(pkColumn: string, pkValue: RowType, column: string, columnValue: RowType) {
    return `UPDATE ${column} = ${columnValue} WHERE ${pkColumn} = ${pkValue}`;
  }
}
