import { IMochiShell, MochiFrontEnd, MochiFrontEndPlugin } from '@mochi/application';

import { QueryEditor } from '../queryeditor';
import './index.css';
import { IConnectorManager } from '@mochi/connectormanager';

export namespace CommandIDs {
  /**
   * Creates a new editor and binds it to a connection.
   */
  export const NEW_EDITOR = 'queryeditor:NEW_EDITOR';
}

const editor: MochiFrontEndPlugin<void> = {
  id: '@mochi/queryeditor-extension',
  requires: [IMochiShell, IConnectorManager],
  activate: activateEditor,
  autoStart: true,
};

/**
 * Activate the query editor.
 */
function activateEditor(app: MochiFrontEnd, shell: IMochiShell, manager: IConnectorManager): void {
  const { commands } = app;

  commands.addCommand(CommandIDs.NEW_EDITOR, {
    label: 'Open editor',
    execute: (args: { connectionId: string; label: string }) => {
      shell.add(queryEditorFactory(app, manager, { label: args.label, connId: args.connectionId }), 'main');
    },
  });
}

function queryEditorFactory(
  app: MochiFrontEnd,
  manager: IConnectorManager,
  options: Partial<QueryEditor.IOptions> & { connId: string },
) {
  const connection = manager.getConnection(options.connId);
  return new QueryEditor({ ...options, connection });
}

const plugins: MochiFrontEndPlugin<any>[] = [editor];
export default plugins;
