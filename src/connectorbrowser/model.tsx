import * as React from 'react';

import { IDisposable } from '@phosphor/disposable';
import { ISignal, Signal } from '@phosphor/signaling';
import { each, filter, find, toArray } from '@phosphor/algorithm';
import { ITreeNode } from '@blueprintjs/core';

import { ConnectorManager, IConnectionDefinition, IConnectorManager } from '@mochi/connectormanager';
import { ConnectorRegistry } from '@mochi/connectorregistry';
import { BPIcon, Intent } from '@mochi/ui-components';
import { IQueryResultColumn, IQueryResultRow, ColumnType } from '@mochi/services';
import { ITableViewerFactory } from '@mochi/tableviewer';
import { SqlQuery } from '@mochi/databaseutils';
import { DataGridModel, Slick } from "@mochi/apputils";

import { TREE_NODE_CLASS, TREE_LEAF_CLASS } from './tree';
import ITreeNodeData = Private.ITreeNodeData;

export class DatabaseBrowserModel implements IDisposable {
  constructor(private readonly options: DatabaseBrowserModel.IOptions) {
    this.registry = options.registry;
    this.manager = options.manager;

    this.manager.definitionsChanged.connect((sender, args) => {
      this._onConnectionDefinitionsChange(args);
    });

    this.manager.connectionsChanged.connect((sender, args) => {
      void this._onConnectionStateChange(args);
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
  expandNode(node: ITreeNode<ITreeNodeData>): void {
    node.isExpanded = true;
    this._changed.emit(void 0);
  }

  /**
   * Collapse a node in the browser tree.
   */
  collapseNode(node: ITreeNode<Private.ITreeNodeData>): void {
    node.isExpanded = false;
    this._changed.emit(void 0);
  }

  /**
   * Handle click event on a tree node.
   */
  clickNode(node: ITreeNode<Private.ITreeNodeData>): void {
    Private.forEachNode(this.data, node1 => (node1.isSelected = false));
    this._selectedNode = node;
    node.isSelected = true;
    this._changed.emit(void 0);
  }

  /**
   * Handle double click event on a node.
   *
   * ### Note
   * If node is a leaf node. It will open the editor, expand the node otherwise.
   */
  async doubleClickNode(node: ITreeNode<Private.ITreeNodeData>): Promise<void> {
    if (!Array.isArray(node.childNodes)) {
      const activated = this.options.viewerFactory.createViewer(node.id.toString(), {
        label: node.label.toString() || 'Viewer',
      });

      const query = SqlQuery.newBuilder()
        .setFrom(node.label.toString())
        .build();

      const connection = this.manager.getConnection(node.nodeData.dbId);
      const result = await connection.query(query);

      activated.model.setColumns(Private.connectorColumnToViewerColumn(result.columns));
      activated.model.setItems(Private.connectorRowToViewerRow(result.rows));

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
  get data(): ITreeNode<Private.ITreeNodeData>[] {
    return this._data;
  }

  /**
   * Get definition for the selected node
   */
  get selectedDefinition(): { definition: IConnectionDefinition; table: string } {
    if (this._selectedNode.className.includes(TREE_LEAF_CLASS)) {
      return {
        table: this._selectedNode.id.toString(),
        definition: find(this.manager.definitions, value => value.name === this._selectedNode.nodeData.dbId),
      };
    }

    return {
      table: null,
      definition: find(this.manager.definitions, value => value.name === this._selectedNode.id.toString()),
    };
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
      const intros = await this.manager.getConnection(args.name).introspect();
      const definition = find(this.manager.definitions, value => value.name === args.name);

      node.secondaryLabel = <BPIcon icon='symbol-circle' intent={Intent.SUCCESS} />;

      node.childNodes = intros.tables.map(t =>
        Private.tableToTreeNode(
          {
            dbId: args.name,
            dbVisibleName: definition.displayName,
          },
          t,
        ),
      );
    }

    this._changed.emit(void 0);
  }

  readonly registry: ConnectorRegistry;
  readonly manager: IConnectorManager;

  private _isDisposed = false;
  private _selectedNode: ITreeNode<ITreeNodeData> = null;
  private _changed = new Signal<this, void>(this);

  // FIXME: Convert this to a map so we can make faster lookups.
  private _data: ITreeNode<Private.ITreeNodeData>[] = [];
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

    /**
     * Table viewer factory.
     */
    viewerFactory: ITableViewerFactory;
  }
}

/**
 * Module private statics.
 */
namespace Private {
  /**
   * Type for the attached data of ITreeNode
   */
  export interface ITreeNodeData {
    dbId: string;

    dbVisibleName: string;
  }

  /**
   * Incremented id to handout to tree nodes.
   */
  let NODE_ID = 0;

  /**
   * Get a new unique node id.
   */
  export function getNodeId(): string {
    return (NODE_ID++).toString();
  }

  /**
   * Convert a definition to a ITreeNode
   */
  export function definitionToTreeNode(definition: IConnectionDefinition): ITreeNode<ITreeNodeData> {
    return {
      id: definition.name,
      label: definition.displayName,
      className: TREE_NODE_CLASS,
    };
  }

  /**
   * Convert a table info to a ITreeNode
   */
  export function tableToTreeNode(nodeData: ITreeNodeData, tableName: string): ITreeNode<ITreeNodeData> {
    return {
      nodeData,
      id: tableName,
      label: tableName,
      className: TREE_LEAF_CLASS,
    };
  }

  /**
   * Run a callback function for each node.
   */
  export function forEachNode(nodes: ITreeNode[], callback: (node: ITreeNode) => void) {
    if (nodes == null) {
      return;
    }

    for (const node of nodes) {
      callback(node);
      forEachNode(node.childNodes, callback);
    }
  }

  /**
   * Convert a connector query result column into
   * table viewer column.
   * 
   */
  export function connectorColumnToViewerColumn(cols: IQueryResultColumn[]): DataGridModel.IDataGridColumn[] {
    return cols.map(c => ({
      ...c,
      id: c.name,
      field: c.name,
      editor: getCellEditorByType(c.type),
      width: 100,
    }));
  }

  /**
   * 
   * TODO: Check the column type and pass the correct editor by type.
   */
  function getCellEditorByType(type: ColumnType) {
    switch (type) {
      case ColumnType.TEXT: 
        return Slick.Editors.Text;

      case ColumnType.BOOLEAN: 
        return Slick.Editors.CheckBox;

      default: 
        return Slick.Editors.Text;
    }
  }

  /**
   * Convert a connector query result row into
   * table viewer data row.
   */
  export function connectorRowToViewerRow(cols: IQueryResultRow[]): (IQueryResultRow & { id: string | number })[] {
    return cols.map((c, id) => ({ ...c, id }));
  }
}
