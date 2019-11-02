import { DataSourceConnector, IDataSourceConnector } from '@mochi/services';

/**
 * A class which manages database type which the application
 * is able to interact with.
 */
export class ConnectorRegistry {
  /**
   * Register a new connectorRegistry type definition and a factory.
   *
   * ### Note
   * A connectorRegistry factory must also declare a new type of connectorRegistry.
   * This is because we intended to have one type of connectorRegistry for each
   * available data source.
   */
  addConnector(connector: ConnectorRegistry.IConnector): void {
    throw new Error('Not implemented');
  }

  /**
   * Get a connectorRegistry type registered with a factory function.
   */
  getConnectorType(type: ConnectorRegistry.IConnectorType): void {
    throw new Error('Not implemented');
  }
}

export namespace ConnectorRegistry {
  export interface IConnector {
    type: IConnectorType;
    factory: IConnectorFactory;
  }

  export interface IConnectorType {
    /**
     * human readable name of the connectorRegistry.
     */
    name: string;

    // TODO:
    // icon?: something
  }

  export interface IConnectorFactory {
    /**
     * Create a new connectorRegistry.
     */
    create(options: DataSourceConnector.IOptions): IDataSourceConnector;
  }
}
