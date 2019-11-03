// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import { MochiFrontEnd, MochiFrontEndPlugin } from '@mochi/application';

import { IIconRegistry, defaultIconRegistry } from '@mochi/ui-components';

import './index.css';

const iconRegistry: MochiFrontEndPlugin<IIconRegistry> = {
  id: '@mochi/ui-components-extension:default-icon-registry',
  provides: IIconRegistry,
  autoStart: true,
  activate: (app: MochiFrontEnd) => {
    return defaultIconRegistry;
  },
};

const plugins: MochiFrontEndPlugin<any>[] = [iconRegistry];
export default plugins;
