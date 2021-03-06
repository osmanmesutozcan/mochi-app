import { IIterator, map } from '@phosphor/algorithm';
import { IDisposable } from '@phosphor/disposable';

import { DataSourceConnector, IDataSourceConnector } from '@mochi/services';
import { ISignal, Signal } from '@phosphor/signaling';

/**
 * A class which manages database type which the application
 * is able to interact with.
 */
export class ConnectorRegistry implements IDisposable {
  /**
   * Register a new connectorRegistry type definition and a factory.
   *
   * ### Note
   * A connectorRegistry factory must also declare a new type of connectorRegistry.
   * This is because we intended to have one type of connectorRegistry for each
   * available data source.
   */
  addConnector(connector: ConnectorRegistry.IConnector): void {
    const name = connector.type.name.toLowerCase();
    if (name.length === 0) {
      throw new Error('Invalid connector type name');
    }
    if (this._connectors[name]) {
      console.error(`Connector type name ${name} is already registered`);
      return;
    }

    this._connectors[name] = connector;
  }

  /**
   * Get a connector with a factory function by type name.
   */
  getConnector(name: string): ConnectorRegistry.IConnector | undefined {
    return this._connectors[name];
  }

  /**
   * Get a connectorRegistry type registered with a factory function
   * by type name.
   */
  getConnectorType(name: string): ConnectorRegistry.IConnectorType | undefined {
    return this._connectors[name].type;
  }

  /**
   * Get all connector types that are currently registered.
   */
  getConnectorTypes(): IIterator<ConnectorRegistry.IConnectorType> {
    return map(Object.keys(this._connectors), name => this._connectors[name].type);
  }

  /**
   * Get whether the registry is disposed.
   */
  get isDisposed(): boolean {
    return this._isDisposed;
  }

  /**
   * Dispose all resources help by the registry.
   */
  dispose(): void {
    if (this._isDisposed) {
      return;
    }
    this._isDisposed = true;
    Signal.clearData(this);
  }

  /**
   * A signal emitted when the registry has definitionsChanged.
   */
  get changed(): ISignal<this, ConnectorRegistry.IChangedArgs> {
    return this._changed;
  }

  private _connectors: { [name: string]: ConnectorRegistry.IConnector } = Object.create(null);

  private _isDisposed = false;
  private _changed = new Signal<this, ConnectorRegistry.IChangedArgs>(this);
}

export namespace ConnectorRegistry {
  export interface IConnector {
    type: IConnectorType;
    factory: IConnectorFactory;
  }

  export interface IConnectorType {
    /**
     * unique name of the connector.
     */
    name: string;

    /**
     * human readable name of the connector.
     */
    displayName: string;

    // TODO:
    // icon?: something
  }

  export interface IConnectorFactory {
    /**
     * Create a new connectorRegistry.
     */
    create(options: DataSourceConnector.IOptions): IDataSourceConnector;
  }

  export interface IChangedArgs {
    /**
     * Type of the definitionsChanged item.
     */
    readonly type: 'connectorFactory';

    /**
     * Type name of the connector being definitionsChanged.
     */
    readonly name: string;

    /**
     * Change made to the item.
     */
    readonly changed: 'added' | 'removed';
  }
}
