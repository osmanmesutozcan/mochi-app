import { JSONArray } from '@phosphor/coreutils';
import { ISignal, Signal } from '@phosphor/signaling';
import { ArrayIterator, IIterator, findIndex } from '@phosphor/algorithm';

import { ServiceManager } from '@mochi/services';
import { ConnectorRegistry } from '@mochi/connectorregistry';

import { IConnectionDefinition, IConnectorManager } from './tokens';
import { IStateDB } from '@mochi/coreutils';

/**
 * Stat database key of connector manager.
 */
const CONNECTOR_MANAGER_STATE_KEY = 'connectormanager';

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
    this.state = options.state;

    this._restoreManager().then();

    // FIXME: Maybe we should save the state before we emit the signal?
    //  Because if state save goes wrong we will lose the definition on change. It could be better
    //  to actually save first.
    this._definitionsChanged.connect(() => {
      // FIXME: Fix this cast
      return this.state.save(CONNECTOR_MANAGER_STATE_KEY, (this._definitions as any) as JSONArray);
    });
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
    this._definitionsChanged.emit({ type: 'connectionDefinition', change: 'added' });
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
    this._definitionsChanged.emit({ type: 'connectionDefinition', change: 'removed' });
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
   * A signal emitted when manager definitionsChanged.
   */
  get definitionsChanged(): ISignal<this, ConnectorManager.IChangedArgs> {
    return this._definitionsChanged;
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

  private async _restoreManager(): Promise<void> {
    const result = (await this.state.fetch(CONNECTOR_MANAGER_STATE_KEY)) as JSONArray;
    if (result.length > 0) {
      // FIXME: Fix this typecast...
      this._definitions = (result as unknown) as IConnectionDefinition[];
      this._definitionsChanged.emit({ type: 'connectionDefinition', change: 'added' });
    }
  }

  /**
   * The service manager used by the manager.
   */
  readonly services: ServiceManager.IManager;

  /**
   * The registry singleton used by the manager.
   */
  readonly registry: ConnectorRegistry;

  /**
   * State database used by the manager;
   */
  readonly state: IStateDB;

  private _isDisposed = false;
  private _definitionsChanged = new Signal<this, ConnectorManager.IChangedArgs>(this);
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

    /**
     * State database of the manager.
     */
    state: IStateDB;
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
