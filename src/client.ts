import { Mochi } from './application';

import ApplicationExtension from './application-extension';

import './style/index.css';

window.onload = async () => {
  const mochi = new Mochi();

  // Register plugins
  mochi.registerPlugins(ApplicationExtension);

  mochi.start();
};
