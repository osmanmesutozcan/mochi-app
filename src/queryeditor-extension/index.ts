import "./index.css";

import { QueryEditor } from "../queryeditor";
import { IMochiShell, MochiFrontEnd, MochiFrontEndPlugin } from "@mochi/application";

const editor: MochiFrontEndPlugin<void> = {
  id: "@mochi/queryeditor-extension",
  requires: [IMochiShell],
  activate: activateEditor,
  autoStart: true,
};

function activateEditor(app: MochiFrontEnd, shell: IMochiShell): void {
  shell.add(new QueryEditor(), "main");
}

const plugins: MochiFrontEndPlugin<any>[] = [editor];
export default plugins;
