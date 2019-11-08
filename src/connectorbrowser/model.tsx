import * as React from 'react';

import { IDisposable } from '@phosphor/disposable';
import { ISignal, Signal } from '@phosphor/signaling';
import { each, filter, find, toArray } from '@phosphor/algorithm';
import { ITreeNode } from '@blueprintjs/core';

import { ConnectorManager, IConnectionDefinition, IConnectorManager } from '@mochi/connectormanager';
import { ConnectorRegistry } from '@mochi/connectorregistry';

import { TREE_NODE_CLASS } from './tree';
import { BPIcon, Intent } from '@mochi/ui-components';

export class DatabaseBrowserModel implements IDisposable {
  constructor(options: DatabaseBrowserModel.IOptions) {
    this.registry = options.registry;
    this.manager = options.manager;

    this.manager.definitionsChanged.connect((sender, args) => {
      this._onConnectionDefinitionsChange(args);
    });

    this.manager.connectionsChanged.connect((sender, args) => {
      this._onConnectionStateChange(args);
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
   * Handle click event on a tree node.
   */
  clickNode(node: ITreeNode<string>): void {
    Private.forEachNode(this.data, node1 => (node1.isSelected = false));
    this._selectedNode = node.id.toString();
    node.isSelected = true;
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
   * Get tree component data.
   */
  get data(): ITreeNode<string>[] {
    return this._data;
  }

  /**
   * Get definition for the selected node
   */
  get selectedDefinition(): IConnectionDefinition | undefined {
    return find(this.manager.definitions, value => value.name === this._selectedNode);
  }

  /**
   * Handles definition change signals from ConnectorManager.
   */
  private _onConnectionDefinitionsChange(args: ConnectorManager.IChangedArgs): void {
    if (args.change === 'added' || args.change === 'restored') {
      each(this.manager.definitions, value => {
        if (!this._data.some(d => d.id === value.name)) {
          this._data.push(Private.definitionToTreeNode(value));
        }
      });
    }

    if (args.change === 'removed') {
      const filtered = filter(this._data, value => {
        return value.id !== args.name;
      });

      this._data = toArray(filtered);
    }

    this._changed.emit(void 0);
  }

  /**
   * Handle connection state change.
   */
  private async _onConnectionStateChange(args: ConnectorManager.IConnectionChangedArgs): Promise<void> {
    const node = find(this._data, value => value.id === args.name);

    node.secondaryLabel = undefined;
    if (args.change === 'connected') {
      node.secondaryLabel = <BPIcon icon='symbol-circle' intent={Intent.SUCCESS} />;
      const intros = await this.manager.getConnection(args.name).introspect();
      node.childNodes = intros.tables.map(t => Private.tableToTreeNode(t));
    }

    this._changed.emit(void 0);
  }

  readonly registry: ConnectorRegistry;
  readonly manager: IConnectorManager;

  private _isDisposed = false;
  private _selectedNode: string = null;
  private _changed = new Signal<this, void>(this);

  // FIXME: Convert this to a map so we can make faster lookups.
  private _data: ITreeNode<string>[] = [];
}

export namespace DatabaseBrowserModel {
  export interface IOptions {
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

/**
 * Module private statics.
 */
namespace Private {
  /**
   * Incremented id to handout to tree nodes.
   */
  let NODE_ID = 0;

  /**
   * Get a new unique node id.
   */
  export const getNodeId = (): string => {
    return (NODE_ID++).toString();
  };

  /**
   * Convert a definition to a ITreeNode
   */
  export const definitionToTreeNode = (definition: IConnectionDefinition): ITreeNode<string> => {
    return {
      id: definition.name,
      label: definition.displayName,
      className: TREE_NODE_CLASS,
    };
  };

  /**
   * Convert a table info to a ITreeNode
   */
  export const tableToTreeNode = (name: string): ITreeNode<string> => {
    return {
      id: name,
      label: name,
      className: TREE_NODE_CLASS,
    };
  };

  /**
   * Run a callback function for each node.
   */
  export const forEachNode = (nodes: ITreeNode[], callback: (node: ITreeNode) => void) => {
    if (nodes == null) {
      return;
    }

    for (const node of nodes) {
      callback(node);
      forEachNode(node.childNodes, callback);
    }
  };
}
