import './index.css';

import { IMochiShell, MochiFrontEnd, MochiFrontEndPlugin } from '@mochi/application';
import { DatabaseBrowser, DatabaseBrowserModel, IDatabaseBrowserFactory } from '@mochi/connectorbrowser';
import { CommandIDs as EditorCommandIDs } from '@mochi/queryeditor-extension';
import { IConnectorManager } from '@mochi/connectormanager';
import { ITableViewerFactory } from '@mochi/tableviewer';

namespace CommandIDs {
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

    const commands = {
      handleOpenDatabase: async connectionId => {
        const model = await app.commands.execute(EditorCommandIDs.NEW_EDITOR, { connectionId });
        console.log(model);
      },
    };

    const model = new DatabaseBrowserModel({ manager, registry, commands, viewerFactory });
    return new DatabaseBrowser({ id, model });
  };

  const defaultDatabaseBrowser = createDatabaseBrowser('databasebrowser');
  return { defaultDatabaseBrowser, createDatabaseBrowser };
}

/**
 * Add commands to MochiApp.
 */
function addCommands(app: MochiFrontEnd, factory: IDatabaseBrowserFactory, shell: IMochiShell): void {
  const { commands } = app;
  const browser = factory.defaultDatabaseBrowser;

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
