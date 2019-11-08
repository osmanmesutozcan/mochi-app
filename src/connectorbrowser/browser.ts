import { PanelLayout, Title, Widget } from '@phosphor/widgets';

import { Dialog, showDialog, Toolbar, ToolbarButton } from '@mochi/apputils';

import { DatabaseBrowserModel } from './model';
import { NewConnectionDialogBody } from './dialog';
import { Tree } from './tree';
import { UUID } from '@phosphor/coreutils';

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
    this.title.label = 'Database';

    this.model = options.model;

    this.toolbar = new Toolbar<Widget>();
    this.toolbar.addClass(TOOLBAR_CLASS);

    this.tree = new Tree({ model: this.model });

    const newConnection = new ToolbarButton({
      iconClassName: 'm-AddIcon',
      tooltip: 'New Connection',
      onClick: () => this.newConnection(),
    });

    const startConnection = new ToolbarButton({
      iconClassName: 'm-RunIcon',
      tooltip: 'Start Connection',
      onClick: () => console.log('RUN!'),
    });

    const stopConnection = new ToolbarButton({
      iconClassName: 'm-StopIcon',
      tooltip: 'Stop Connection',
      onClick: () => this.removeConnection(),
    });

    this.toolbar.addItem('newConnection', newConnection);
    this.toolbar.addItem('startConnection', startConnection);
    this.toolbar.addItem('stopConnection', stopConnection);

    const layout = new PanelLayout();
    layout.addWidget(this.toolbar);
    layout.addWidget(this.tree);

    this.layout = layout;
  }

  async newConnection() {
    const result = await showDialog({
      title: 'Add New Connection',
      body: new NewConnectionDialogBody({ model: this.model }),
      buttons: [Dialog.okButton(), Dialog.cancelButton()],
    });

    if (!result.value) {
      return;
    }

    this.model.manager.defineConnection({
      name: UUID.uuid4(),
      displayName: result.value.name,
      connectorTypeName: result.value.type,
      options: {
        user: result.value.user,
        password: result.value.password,
        hostname: result.value.hostname,
        port: result.value.port,
        database: result.value.database,
        connectionString: '',
      },
    });
  }

  async removeConnection(): Promise<void> {
    const definition = this.model.selectedDefinition;
    if (!definition) {
      return;
    }

    this.model.manager.undefineConnection(definition);
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
