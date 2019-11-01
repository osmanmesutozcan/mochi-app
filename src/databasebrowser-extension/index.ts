import './index.css';

import { IStateDB } from '../coreutils';
import { IMochiShell, MochiFrontEnd, MochiFrontEndPlugin } from '../application';
import { DatabaseBrowser, IDatabaseBrowserFactory, DatabaseBrowserModel } from '../databasebrowser';

namespace CommandIDs {
  export const SHOW_BROWSER = 'databasebrowser:show';
}

/**
 * The default database browser extension.
 */
const browser: MochiFrontEndPlugin<void> = {
  activate: activateDatabaseBrowser,
  id: '@mochi/databasebrowser-extension:browser',
  requires: [IDatabaseBrowserFactory, IMochiShell],
  autoStart: true,
};

/**
 * The default factory browser provider.
 */
const factory: MochiFrontEndPlugin<IDatabaseBrowserFactory> = {
  activate: activateDatabaseBrowserFactory,
  id: '@mochi/databasebrowser-extension:factory',
  provides: IDatabaseBrowserFactory,
  requires: [IStateDB],
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
function activateDatabaseBrowserFactory(app: MochiFrontEnd, state: IStateDB): IDatabaseBrowserFactory {
  const createDatabaseBrowser = (id: string, options: IDatabaseBrowserFactory.IOptions = {}) => {
    const model = new DatabaseBrowserModel({ refreshInterval: options.refreshInterval, state });
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
}

const plugins: Array<MochiFrontEndPlugin<any>> = [browser, factory];
export default plugins;
