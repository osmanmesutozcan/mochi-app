import * as React from 'react';

import { findIndex } from '@phosphor/algorithm';
import { IDisposable } from '@phosphor/disposable';
import { ISignal, Signal } from '@phosphor/signaling';
import { ITreeNode, Tree as BPTree } from '@blueprintjs/core';

import { ReactWidget, UseSignal } from '@mochi/apputils';

/**
 * Class name to append to tree component.
 */
const TREE_CLASS = 'm-Tree';

/**
 * Class name to append to all tree child elements.
 */
const TREE_NODE_CLASS = 'm-TreeNode';

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

export class Tree extends ReactWidget {
  constructor(props: Tree.IProps = {}) {
    super();
    this._model = props.model || new Tree.Model();
  }

  render() {
    return (
      <UseSignal signal={this._model.changed}>
        {() => (
          <BPTree
            contents={mock}
            className={TREE_NODE_CLASS}
            onNodeExpand={node => this._model.expandNode(node)}
            onNodeCollapse={node => this._model.collapseNode(node)}
          />
        )}
      </UseSignal>
    );
  }

  private readonly _model;
}

export namespace Tree {
  /**
   * Model for database tree.
   */
  export class Model implements IDisposable {
    /**
     * Expand a node in the tree
     */
    expandNode(node: ITreeNode<string>): void {
      node.isExpanded = true;
      this._changed.emit(void 0);
    }

    /**
     * Collapse a node in the tree.
     */
    collapseNode(node: ITreeNode<string>): void {
      node.isExpanded = false;
      this._changed.emit(void 0);
    }

    get changed(): ISignal<this, void> {
      return this._changed;
    }

    get isDisposed(): boolean {
      return this._isDisposed;
    }

    dispose(): void {
      if (this._isDisposed) {
        return;
      }
      this._isDisposed = true;
    }

    readonly data = mock;

    private _isDisposed = false;
    private _changed = new Signal<this, void>(this);
  }

  /**
   *
   */
  export interface IProps {
    model?: Model;
  }
}
