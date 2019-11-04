import { PanelLayout, Widget } from '@phosphor/widgets';

import { Dialog, showDialog, Toolbar, ToolbarButton } from '@mochi/apputils';

import { DatabaseBrowserModel } from './model';
import { NewConnectionDialogBody } from './dialog';
import { Tree } from './tree';

/**
 * The class name added to DatabaseBrowser instances.
 */
const DATABASE_BROWSER_CLASS = 'm-DatabaseBrowser';

/**
 * The class name added to the database browser toolbar node.
 */
const TOOLBAR_CLASS = 'm-DatabaseBrowser-toolbar';

/**
 * A widget which hosts a database browser.
 */
export class DatabaseBrowser extends Widget {
  constructor(options: DatabaseBrowser.IOptions) {
    super();
    this.addClass(DATABASE_BROWSER_CLASS);
    this.id = options.id;

    this.model = options.model;

    this.toolbar = new Toolbar<Widget>();
    this.toolbar.addClass(TOOLBAR_CLASS);

    this.tree = new Tree();

    const newConnection = new ToolbarButton({
      iconClassName: 'm-AddIcon',
      tooltip: 'New Connection',
      onClick: () => this._onNewConnection(),
    });

    this.toolbar.addItem('newConnection', newConnection);

    const layout = new PanelLayout();
    layout.addWidget(this.toolbar);
    layout.addWidget(this.tree);

    this.layout = layout;
  }

  private async _onNewConnection() {
    const result = await showDialog({
      title: 'Add New Connection',
      body: new NewConnectionDialogBody({ model: this.model }),
      buttons: [Dialog.okButton(), Dialog.cancelButton()],
    });
  }

  readonly toolbar: Toolbar<Widget>;

  readonly tree: Tree;

  readonly model: DatabaseBrowserModel;
}

export namespace DatabaseBrowser {
  /**
   * Options for initializing a database browser widget.
   */
  export interface IOptions {
    /**
     * The widget/DOM id of the database browser.
     */
    id: string;

    /**
     * Underlying model of database browser.
     */
    model: DatabaseBrowserModel;
  }
}
