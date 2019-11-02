import { Signal } from '@phosphor/signaling';
import { ArrayIterator, IIterator, findIndex } from '@phosphor/algorithm';

import { ServiceManager } from '@mochi/services';
import { ConnectorRegistry } from '@mochi/connectorregistry';

import { IConnectionDefinition, IConnectorManager } from './tokens';

/**
 * The database manager
 *
 * ### Notes
 * The database manager is used to register model and widget creators,
 * and the database browser uses the database manager to create widgets.
 * The database manager maintains a context for each database/table and
 * model type that is open, and a list of widgets for each context. The
 * database manager is in control of the proper closing of the widgets and
 * contexts.
 */
export class ConnectorManager implements IConnectorManager {
  constructor(options: ConnectorManager.IOptions) {
    this.services = options.manager;
    this.registry = options.registry;
  }

  /**
   * Define a new connection and save connection information
   * for later retrieval.
   */
  defineConnection(definition: IConnectionDefinition): void {
    if (!this.registry.getConnectorType(definition.connectorTypeName)) {
      throw new Error(`Cannot find the requested connector type: ${definition.connectorTypeName}`);
    }

    this._definitions.push(definition);
    this._changed.emit({ type: 'connectionDefinition', change: 'added' });
  }

  /**
   * Undefine a connection definition.
   */
  undefineConnection(definition: IConnectionDefinition): void {
    const indexToRemove = findIndex(this._definitions, (_definition: IConnectionDefinition) => {
      return _definition.name === definition.name;
    });
    if (indexToRemove < 0) {
      console.error(`Cannot remove the connection definition ${definition.name}, because it does not exist`);
    }

    this._definitions.splice(indexToRemove, 1);
    this._changed.emit({ type: 'connectionDefinition', change: 'removed'});
  }

  /**
   * Start a connection to a previously defined connection and return
   * a promise which resolves when the connection is ready, or
   * rejected if cannot connect.
   */
  startConnection(name: string): Promise<void> {
    throw new Error('Not implemented');
  }

  /**
   * Get all defined connections.
   */
  get definitions(): IIterator<IConnectionDefinition> {
    return new ArrayIterator(this._definitions);
  }

  /**
   * Get whether the manager has been disposed.
   */
  get isDisposed(): boolean {
    return this._isDisposed;
  }

  /**
   * Dispose of the resources held by the database manager.
   */
  dispose(): void {
    if (this._isDisposed) {
      return;
    }
    this._isDisposed = true;
    Signal.clearData(this);
  }

  /**
   * The service manager used by the manager.
   */
  readonly services: ServiceManager.IManager;

  /**
   * The registry singleton used by the manager.
   */
  readonly registry: ConnectorRegistry;

  private _isDisposed = false;
  private _changed = new Signal<this, ConnectorManager.IChangedArgs>(this);
  private _definitions: IConnectionDefinition[] = [];
}

export namespace ConnectorManager {
  export interface IOptions {
    /**
     * A service manager instance.
     */
    manager: ServiceManager.IManager;

    /**
     * The database registry singleton.
     */
    registry: ConnectorRegistry;
  }

  export interface IChangedArgs {
    /**
     * Type of the change made.
     */
    type: 'connectionDefinition';

    /**
     * Definition of the change.
     */
    change: 'added' | 'removed';
  }
}
