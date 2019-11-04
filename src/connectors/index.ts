import { ConnectorRegistry } from '@mochi/connectorregistry';

import { PostgreSQLConnector } from './postresql';

/**
 * The default postgresql connectorRegistry.
 */
const postgresql: ConnectorRegistry.IConnector = {
  type: {
    name: 'postgresql',
    displayName: 'Postgresql',
  },
  factory: {
    create: options => new PostgreSQLConnector(options),
  },
};

const connectors: ConnectorRegistry.IConnector[] = [postgresql];
export default connectors;
