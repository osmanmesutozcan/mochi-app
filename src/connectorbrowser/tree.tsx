import * as React from 'react';

import { Tree as BPTree } from '@blueprintjs/core';

import { ReactWidget, UseSignal } from '@mochi/apputils';

import { DatabaseBrowserModel } from './model';

/**
 * Class name to append to all tree child elements.
 */
export const TREE_NODE_CLASS = 'm-TreeNode';

/**
 * Class name to append to all tree leaf elements.
 */
export const TREE_LEAF_CLASS = 'm-TreeLeaf';

export class Tree extends ReactWidget {
  constructor(props: Tree.IProps) {
    super();
    this._model = props.model;
  }

  render() {
    return (
      <UseSignal signal={this._model.changed}>
        {() => (
          <BPTree
            contents={this._model.data}
            className={TREE_NODE_CLASS}
            onNodeExpand={node => this._model.expandNode(node)}
            onNodeCollapse={node => this._model.collapseNode(node)}
            onNodeClick={node => this._model.clickNode(node)}
            onNodeDoubleClick={node => this._model.doubleClickNode(node)}
            onNodeContextMenu={node => this._model.clickNode(node)}
          />
        )}
      </UseSignal>
    );
  }

  private readonly _model: DatabaseBrowserModel;
}

export namespace Tree {
  /**
   *
   */
  export interface IProps {
    /**
     * Database browser model.
     */
    model: DatabaseBrowserModel;
  }
}
