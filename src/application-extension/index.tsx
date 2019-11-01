import './index.css';

import { IMochiShell, MochiFrontEndPlugin, MochiFrontEnd } from '../application';
import { MochiShell } from '../application/shell';

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
