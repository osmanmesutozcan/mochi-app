import { IMochiShell, MochiFrontEnd, MochiFrontEndPlugin } from '@mochi/application';
import { ITableViewer, TableViewer } from '@mochi/tableviewer';

namespace CommandIDs {
  //
}

/**
 * Default extension to view table data.
 */
const viewer: MochiFrontEndPlugin<ITableViewer> = {
  id: '@mochi/table-viewer-extension:viewer',
  requires: [IMochiShell],
  provides: ITableViewer,
  activate: activateViewer,

  // FIXME: Remove this!
  autoStart: true,
};

function activateViewer(app: MochiFrontEnd, shell: IMochiShell) {
  shell.add(new TableViewer({}), 'main');
  shell.add(new TableViewer({}), 'main');
  shell.add(new TableViewer({}), 'main');
  return {};
}

const plugins: MochiFrontEndPlugin<any>[] = [viewer];
export default plugins;
