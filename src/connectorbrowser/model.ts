import { IStateDB } from '../coreutils';
import { ConnectorManager, IConnectorManager } from '@mochi/connectormanager';
import { IDisposable } from '@phosphor/disposable';
import { ISignal, Signal } from '@phosphor/signaling';
import { ITreeNode } from '@blueprintjs/core';

import { ConnectorRegistry } from '@mochi/connectorregistry';

import { TREE_NODE_CLASS } from './tree';

/**
 * Mock browser tree data.
 */
const mock: ITreeNode<string>[] = [
  {
    id: 0,
    label: 'Local',
    className: TREE_NODE_CLASS,
    icon: 'database',
    childNodes: [
      {
        id: 3,
        label: 'schemas',
        className: TREE_NODE_CLASS,
        childNodes: [
          {
            id: 6,
            label: 'users',
            className: TREE_NODE_CLASS,
          },
          {
            id: 7,
            label: 'users',
            className: TREE_NODE_CLASS,
          },
          {
            id: 8,
            label: 'users',
            className: TREE_NODE_CLASS,
          },
        ],
      },
    ],
  },
  {
    id: 1,
    label: 'Staging',
    icon: 'database',
    className: TREE_NODE_CLASS,
    childNodes: [
      {
        id: 4,
        className: TREE_NODE_CLASS,
        label: 'schemas',
      },
    ],
  },
  {
    id: 2,
    label: 'Prod',
    className: TREE_NODE_CLASS,
    icon: 'database',
    childNodes: [
      {
        id: 5,
        label: 'schemas',
        className: TREE_NODE_CLASS,
      },
    ],
  },
];

export class DatabaseBrowserModel implements IDisposable {
  constructor(options: DatabaseBrowserModel.IOptions) {
    this.registry = options.registry;
    this.manager = options.manager;
    this.state = options.state;

    this.manager.definitionsChanged.connect((sender, args) => {
      this._onConnectionDefinitionsChange(args);
    });
  }

  /**
   * Test whether the model is disposed.
   */
  get isDisposed(): boolean {
    return this._isDisposed;
  }

  /**
   * Dispose browser model.
   */
  dispose(): void {
    if (this._isDisposed) {
      return;
    }
    this._isDisposed = true;
  }

  /**
   * Expand a node in the browser tree
   */
  expandNode(node: ITreeNode<string>): void {
    node.isExpanded = true;
    this._changed.emit(void 0);
  }

  /**
   * Collapse a node in the browser tree.
   */
  collapseNode(node: ITreeNode<string>): void {
    node.isExpanded = false;
    this._changed.emit(void 0);
  }

  /**
   * Handle double click event on a node.
   *
   * ### Note
   * If node is a leaf node. It will open the editor, expand the node otherwise.
   */
  doubleClickNode(node: ITreeNode<string>): void {
    if (!Array.isArray(node.childNodes)) {
      console.error('Cannot open the editor yet!');
      return;
    }

    if (node.isExpanded) {
      this.collapseNode(node);
    } else {
      this.expandNode(node);
    }
  }

  get changed(): ISignal<this, void> {
    return this._changed;
  }

  /**
   * Handles definition change signals from ConnectorManager.
   */
  private _onConnectionDefinitionsChange(args: ConnectorManager.IChangedArgs): void {
    this._changed.emit(void 0);
  }

  readonly registry: ConnectorRegistry;
  readonly manager: IConnectorManager;
  readonly state: IStateDB;
  readonly mock: ITreeNode<string>[] = mock;

  private _isDisposed = false;
  private _changed = new Signal<this, void>(this);
}

export namespace DatabaseBrowserModel {
  export interface IOptions {
    /**
     * State database to restore the model when
     * model is restored.
     */
    state: IStateDB;

    /**
     * A database manager instance.
     */
    manager: IConnectorManager;

    /**
     * A database connector registry.
     */
    registry: ConnectorRegistry;
  }
}
