import { IDisposable } from '@phosphor/disposable';
import { Token } from '@phosphor/coreutils';
import { ServiceManager } from '@mochi/services';

export const IConnectorManager = new Token<IConnectorManager>('@mochi/connectormanager:IConnectorManager');

export interface IConnectorManager extends IDisposable {
  /**
   * A service manager instance.
   */
  services: ServiceManager.IManager;
}
