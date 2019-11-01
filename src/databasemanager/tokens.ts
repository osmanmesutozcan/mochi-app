import { IDisposable } from '@phosphor/disposable';
import { Token } from '@phosphor/coreutils';
import { ServiceManager } from '@mochi/services';

export const IDatabaseManager = new Token<IDatabaseManager>('@mochi/databasemanager:IDatabaseManager');

export interface IDatabaseManager extends IDisposable {
  /**
   * A service manager instance.
   */
  services: ServiceManager.IManager;
}
