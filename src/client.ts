import { Mochi } from './application';

import AppUtilsExtension from './apputils-extension';
import ApplicationExtension from './application-extension';
import DatabaseBrowserExtension from './databasebrowser-extension';

window.onload = async () => {
  const mochi = new Mochi();

  // Register plugins
  mochi.registerPlugins(AppUtilsExtension);
  mochi.registerPlugins(ApplicationExtension);
  mochi.registerPlugins(DatabaseBrowserExtension);

  return mochi.start();
};
