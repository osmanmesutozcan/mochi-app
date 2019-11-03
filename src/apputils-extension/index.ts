import './index.css';

import { MochiFrontEndPlugin } from '@mochi/application';
import { StateDB, IStateDB, SettingRegistry, ISettingRegistry } from '@mochi/coreutils';

/**
 * The default settings registry provider.
 */
const settings: MochiFrontEndPlugin<SettingRegistry> = {
  id: '@mochi/apputils-extension:settings',
  autoStart: true,
  provides: ISettingRegistry,
  activate: async app => {
    const connector = app.serviceManager.settings;

    // TODO: Use settings registry to load the plugin data.
    return new SettingRegistry({ connector, plugins: undefined });
  },
};

/**
 * State database provider.
 */
const state: MochiFrontEndPlugin<IStateDB> = {
  id: '@mochi/apputils-extension:state',
  autoStart: true,
  provides: IStateDB,
  activate: app => {
    const db = new StateDB();
    // tslint:disable-next-line:no-console
    db.changed.connect(() => console.log('DB State definitionsChanged', db.toJSON()));
    return db;
  },
};

const plugins: Array<MochiFrontEndPlugin<any>> = [settings, state];
export default plugins;
