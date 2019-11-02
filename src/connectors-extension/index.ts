import { MochiFrontEnd, MochiFrontEndPlugin } from '@mochi/application';

import DefaultConnectors from '@mochi/connectors';

/**
 * Connector extension which provides officially supported connectors.
 */
const connectors: MochiFrontEndPlugin<void> = {
  id: '@mochi/connectors-extension:connectors',
  autoStart: true,
  activate: activateDefaultConnectors,
};

/**
 * Activates the default connectors extension.
 */
function activateDefaultConnectors(app: MochiFrontEnd): void {
  DefaultConnectors.forEach(connector => {
    app.connectorRegistry.addConnector(connector);
  });
}

const plugins: MochiFrontEndPlugin<any>[] = [connectors];
export default plugins;
