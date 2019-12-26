import { ConnectorRegistry } from '@mochi/connectorregistry';

import { PostgreSQLConnector } from './postresql';

/**
 * The default postgresql connector.
 */
const postgresql: ConnectorRegistry.IConnector = {
  type: {
    name: 'postgresql',
    displayName: 'PostgreSQL',
  },
  factory: {
    create: options => new PostgreSQLConnector(options),
  },
};

/**
 * Placeholder.
 */
const mysql: ConnectorRegistry.IConnector = {
  type: {
    name: 'mysql',
    displayName: 'MySQL',
  },
  factory: {
    create: options => new PostgreSQLConnector(options),
  },
};

const connectors: ConnectorRegistry.IConnector[] = [postgresql, mysql];
export default connectors;
