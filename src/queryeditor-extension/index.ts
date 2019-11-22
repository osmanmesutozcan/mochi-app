import './index.css';

import { QueryEditor } from '../queryeditor';
import { IMochiShell, MochiFrontEnd, MochiFrontEndPlugin } from '@mochi/application';

export namespace CommandIDs {
  /**
   * Creates a new editor and binds it to a connection.
   */
  export const NEW_EDITOR = 'NEW_EDITOR';
}

const editor: MochiFrontEndPlugin<void> = {
  id: '@mochi/queryeditor-extension',
  requires: [IMochiShell],
  activate: activateEditor,
  autoStart: true,
};

/**
 * Activate the query editor.
 */
function activateEditor(app: MochiFrontEnd, shell: IMochiShell): void {
  const { commands } = app;

  commands.addCommand(CommandIDs.NEW_EDITOR, {
    execute: (args: { connectionId: string }) => {
      shell.add(queryEditorFactory({ label: args.connectionId }), 'main');
    },
  });
}

function queryEditorFactory(options: QueryEditor.IOptions = {}) {
  return new QueryEditor(options);
}

const plugins: MochiFrontEndPlugin<any>[] = [editor];
export default plugins;
