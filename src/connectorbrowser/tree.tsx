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
    hasCaret: true,
    label: 'Local',
    className: TREE_NODE_CLASS,
    icon: 'database',
    childNodes: [
      {
        id: 3,
        hasCaret: false,
        label: 'users',
        className: TREE_NODE_CLASS,
      },
    ],
  },
  {
    id: 1,
    hasCaret: true,
    label: 'Staging',
    icon: 'database',
    className: TREE_NODE_CLASS,
    childNodes: [
      {
        id: 4,
        hasCaret: false,
        className: TREE_NODE_CLASS,
        label: 'users',
      },
    ],
  },
  {
    id: 2,
    hasCaret: true,
    label: 'Prod',
    className: TREE_NODE_CLASS,
    icon: 'database',
    childNodes: [
      {
        id: 5,
        hasCaret: false,
        label: 'users',
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
        {
          () => <BPTree
            contents={mock}
            className={TREE_NODE_CLASS}
            onNodeExpand={({id}) => this._model.expandNode(id)}
            onNodeCollapse={({id}) => this._model.collapseNode(id)}
          />
        }
      </UseSignal>
    );
  }

  private readonly _model;
}

export namespace Tree {
  export class Model implements IDisposable {

    expandNode(id: string | number): void {
      const idx = findIndex(this.data, n => n.id === id);
      const node = this.data[idx];

      node.isExpanded = true;
      this.data[idx] = node;

      this._changed.emit(void 0);
    }

    collapseNode(id: string | number): void {
      const idx = findIndex(this.data, n => n.id === id);
      const node = this.data[idx];

      node.isExpanded = false;
      this.data[idx] = node;

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
