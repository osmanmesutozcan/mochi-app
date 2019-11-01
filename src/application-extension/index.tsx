import './index.css';

import { MochiShell, IMochiShell, MochiFrontEndPlugin, MochiFrontEnd } from '@mochi/application';

/**
 * The default JupyterLab application shell.
 */
const shell: MochiFrontEndPlugin<IMochiShell> = {
  id: '@mochi/application-extension:shell',
  autoStart: true,
  provides: IMochiShell,
  activate: (app: MochiFrontEnd) => {
    if (!(app.shell instanceof MochiShell)) {
      throw new Error(`${shell.id} did not find a LabShell instance.`);
    }
    return app.shell;
  },
};

const plugins: MochiFrontEndPlugin<any>[] = [shell];
export default plugins;
