import { PanelLayout, Widget } from '@phosphor/widgets';

import { Dialog, showDialog, Toolbar, ToolbarButton } from '@mochi/apputils';

import { DatabaseBrowserModel } from './model';

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

    this.toolbar = new Toolbar<Widget>();
    this.toolbar.addClass(TOOLBAR_CLASS);

    const newConnection = new ToolbarButton({
      iconClassName: 'm-AddIcon',
      tooltip: 'New Connection',
      onClick: () => this._onNewConnection(),
    });

    this.toolbar.addItem('newConnection', newConnection);

    const layout = new PanelLayout();
    layout.addWidget(this.toolbar);

    this.layout = layout;
  }

  private async _onNewConnection() {
    const result = await showDialog({
      title: 'Add New Connection',
      body: 'We cannot process this action at the moment',
      buttons: [Dialog.okButton(), Dialog.cancelButton()],
    });

    console.log(result);
  }

  readonly toolbar: Toolbar<Widget>;

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
