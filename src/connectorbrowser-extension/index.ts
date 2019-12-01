import './index.css';

import { IMochiShell, MochiFrontEnd, MochiFrontEndPlugin } from '@mochi/application';
import { DatabaseBrowser, DatabaseBrowserModel, IDatabaseBrowserFactory } from '@mochi/connectorbrowser';
import { CommandIDs as EditorCommandIDs } from '@mochi/queryeditor-extension';
import { IConnectorManager } from '@mochi/connectormanager';
import { ITableViewerFactory } from '@mochi/tableviewer';

namespace CommandIDs {
  export const OPEN_TABLE_IN_EDITOR = 'databasebrowser:open-editor';
  export const SHOW_BROWSER = 'databasebrowser:show';
  export const NEW_CONNECTION = 'databasebrowser:new-connection';
  export const REMOVE_CONNECTION = 'databasebrowser:remove-connection';
}

/**
 * The default database browser extension.
 */
const browser: MochiFrontEndPlugin<void> = {
  id: '@mochi/databasebrowser-extension:browser',
  requires: [IDatabaseBrowserFactory, IMochiShell],
  autoStart: true,
  activate: activateDatabaseBrowser,
};

/**
 * The default factory browser provider.
 */
const factory: MochiFrontEndPlugin<IDatabaseBrowserFactory> = {
  id: '@mochi/databasebrowser-extension:factory',
  provides: IDatabaseBrowserFactory,
  requires: [IConnectorManager, ITableViewerFactory],
  activate: activateDatabaseBrowserFactory,
};

/**
 * Activate database browser against app shell
 */
function activateDatabaseBrowser(app: MochiFrontEnd, factory: IDatabaseBrowserFactory, shell: IMochiShell): void {
  const { commands } = app;
  const browser = factory.defaultDatabaseBrowser;

  shell.add(browser, 'left');
  addCommands(app, factory, shell);
  addContextMenu(app);

  void commands.execute(CommandIDs.SHOW_BROWSER, void 0);
}

/**
 * Activate browser factory provider.
 */
function activateDatabaseBrowserFactory(
  app: MochiFrontEnd,
  manager: IConnectorManager,
  viewerFactory: ITableViewerFactory,
): IDatabaseBrowserFactory {
  const createDatabaseBrowser = (id: string, options: IDatabaseBrowserFactory.IOptions = {}) => {
    const registry = app.connectorRegistry;

    const model = new DatabaseBrowserModel({ manager, registry, viewerFactory });
    return new DatabaseBrowser({ id, model });
  };

  const defaultDatabaseBrowser = createDatabaseBrowser('databasebrowser');
  return { defaultDatabaseBrowser, createDatabaseBrowser };
}

/**
 * Add context menu items of browser.
 */
function addContextMenu(app: MochiFrontEnd) {
  app.contextMenu.addItem({
    command: CommandIDs.OPEN_TABLE_IN_EDITOR,
    selector: '.m-TreeNode',
    type: 'command',
  });
}

/**
 * Add commands to MochiApp.
 */
function addCommands(app: MochiFrontEnd, factory: IDatabaseBrowserFactory, shell: IMochiShell): void {
  const { commands } = app;
  const browser = factory.defaultDatabaseBrowser;

  commands.addCommand(CommandIDs.OPEN_TABLE_IN_EDITOR, {
    label: 'Open in editor',
    mnemonic: 8,
    execute: () => {
      const { definition } = browser.model.selectedDefinition;
      void commands.execute(EditorCommandIDs.NEW_EDITOR, {
        label: definition.displayName,
        connectionId: definition.name,
      });
    },
  });

  commands.addCommand(CommandIDs.SHOW_BROWSER, {
    execute: args => {
      shell.activateById(browser.id);
    },
  });

  commands.addCommand(CommandIDs.NEW_CONNECTION, {
    execute: async args => {
      await browser.newConnection();
    },
  });

  commands.addCommand(CommandIDs.REMOVE_CONNECTION, {
    execute: async args => {
      await browser.removeConnection();
    },
  });

  commands.addKeyBinding({ command: CommandIDs.SHOW_BROWSER, selector: 'body', keys: ['Accel E'] });
  commands.addKeyBinding({ command: CommandIDs.NEW_CONNECTION, selector: 'body', keys: ['Accel N'] });
  commands.addKeyBinding({ command: CommandIDs.REMOVE_CONNECTION, selector: 'body', keys: ['Delete'] });
}

const plugins: MochiFrontEndPlugin<any>[] = [browser, factory];
export default plugins;
