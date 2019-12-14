import { IMutationEnvelope } from './interfaces'

export namespace Mutation {
    export class Envelope implements IMutationEnvelope {
        private _diff: (IEdit | IDelete)[] = [];

        edit(pk: number | string, column: string, change: string | number | boolean) {
            //
        }

        delete(pk: number | string) {
            //
        }
    }

    /**
     * When user edits a part of the entity.
     * 
     * ## Note
     * This also includes removing a cell value (in SQL that is). Removing a cell value
     * is simply setting a cell to NULL
     */
    export interface IEdit {
        //
    }

    /**
     * When user deletes a whole entity.
     */
    export interface IDelete {

    }
}