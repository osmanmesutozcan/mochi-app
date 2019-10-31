import { IMochiShell, MochiFrontEndPlugin, MochiFrontEnd } from '../application';
import { MochiShell } from '../application/shell';

/**
 * The default JupyterLab application shell.
 */
const shell: MochiFrontEndPlugin<IMochiShell> = {
  id: '@jupyterlab/application-extension:shell',
  activate: (app: MochiFrontEnd) => {
    console.log('started');
    if (!(app.shell instanceof MochiShell)) {
      throw new Error(`${shell.id} did not find a LabShell instance.`);
    }
    return app.shell;
  },
  autoStart: true,
  provides: IMochiShell,
};

const plugins: MochiFrontEndPlugin<any>[] = [shell];

export default plugins;
