import './index.css';

import { IStateDB } from '@mochi/coreutils';
import { IMochiShell, MochiFrontEnd, MochiFrontEndPlugin } from '@mochi/application';
import {
  DatabaseBrowser,
  IDatabaseBrowserFactory,
  DatabaseBrowserModel,
} from '@mochi/connectorbrowser';

import { IConnectorManager } from '@mochi/connectormanager/tokens';

namespace CommandIDs {
  export const SHOW_BROWSER = 'databasebrowser:show';
  export const NEW_CONNECTION = 'databasebrowser:new-connection';
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
  requires: [IStateDB, IConnectorManager],
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
function activateDatabaseBrowserFactory(app: MochiFrontEnd, state: IStateDB, manager: IConnectorManager): IDatabaseBrowserFactory {
  const createDatabaseBrowser = (id: string, options: IDatabaseBrowserFactory.IOptions = {}) => {
    const model = new DatabaseBrowserModel({ state, manager });
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

  commands.addCommand(CommandIDs.SHOW_BROWSER, { execute: args => {shell.activateById(browser.id); } });
  commands.addKeyBinding({ command: CommandIDs.SHOW_BROWSER, selector: 'body', keys: ['Accel E'] });

  commands.addCommand(CommandIDs.NEW_CONNECTION, { execute: async args => {await browser.newConnection(); } });
  commands.addKeyBinding({ command: CommandIDs.NEW_CONNECTION, selector: 'body', keys: ['Accel N'] });
}

const plugins: MochiFrontEndPlugin<any>[] = [browser, factory];
export default plugins;
