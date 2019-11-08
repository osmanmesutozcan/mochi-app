import { IMochiShell, MochiFrontEndPlugin } from '@mochi/application';
import { ITableViewer } from '@mochi/tableviewer';

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
};

function activateViewer() {
  return {};
}

const plugins: MochiFrontEndPlugin<any>[] = [viewer];
export default plugins;
