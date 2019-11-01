import { IDisposable } from '@phosphor/disposable';
import { Token } from '@phosphor/coreutils';

export const IDatabaseManager = new Token<IDatabaseManager>('@mochi/databasemanager:IDatabaseManager');

export interface IDatabaseManager extends IDisposable {
  //
}
