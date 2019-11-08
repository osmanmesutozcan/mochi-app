import { Mochi } from './application';

import AppUtilsExtension from './apputils-extension';
import ApplicationExtension from './application-extension';
import DatabaseManagerExtension from './connectormanager-extension';
import DatabaseBrowserExtension from './connectorbrowser-extension';
import DefaultConnectorsExtension from './connectors-extension';
import UIComponentsExtension from './ui-components-extension';
import TableViewerExtension from './tableviewer-extension';

window.onload = async () => {
  const mochi = new Mochi();

  // Register plugins.
  mochi.registerPlugins(AppUtilsExtension);
  mochi.registerPlugins(ApplicationExtension);
  mochi.registerPlugins(UIComponentsExtension);
  mochi.registerPlugins(DatabaseBrowserExtension);
  mochi.registerPlugins(DefaultConnectorsExtension);
  mochi.registerPlugins(DatabaseManagerExtension);
  mochi.registerPlugins(TableViewerExtension);

  return mochi.start();
};
