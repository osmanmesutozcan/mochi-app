import { IDisposable } from '@phosphor/disposable';
import { IIterator } from '@phosphor/algorithm';
import { ISignal } from '@phosphor/signaling';
import { Token } from '@phosphor/coreutils';

import { DataSourceConnector, IDataSourceConnector, ServiceManager } from '@mochi/services';

import { ConnectorManager } from './manager';

export const IConnectorManager = new Token<IConnectorManager>('@mochi/connectormanager:IConnectorManager');

export interface IConnectorManager extends IDisposable {
  /**
   * A service manager instance.
   */
  services: ServiceManager.IManager;

  /**
   * An iterable of all connection definitions.
   */
  definitions: IIterator<IConnectionDefinition>;

  /**
   * A signal emitted when manager state change.
   */
  definitionsChanged: ISignal<IConnectorManager, ConnectorManager.IChangedArgs>;

  /**
   * A signal emitted when managed connections state change.
   */
  connectionsChanged: ISignal<IConnectorManager, ConnectorManager.IConnectionChangedArgs>;

  /**
   * Define a new connection and save connection information
   * for later retrieval.
   */
  defineConnection(definition: IConnectionDefinition): void;

  /**
   * Undefine a connection and remove connection information.
   */
  undefineConnection(definition: IConnectionDefinition): void;

  /**
   * Start a connection to a previously defined connection and return
   * a promise which resolves when the connection is ready, or
   * rejected if cannot connect.
   */
  startConnection(name: string): Promise<void>;

  /**
   * Get a connection instance.
   */
  getConnection(name: string): IDataSourceConnector;
}

/**
 * Definition of the connection provided by the user.
 */
export interface IConnectionDefinition {
  /**
   * A name for the defined connection.
   */
  name: string;

  /**
   * A human readable name for the defined connection.
   */
  displayName: string;

  /**
   * Type name of the connector to use for the connection.
   */
  connectorTypeName: string;

  /**
   * Options to pass to when initalizing the connection.
   */
  options: DataSourceConnector.IOptions;
}
