import { Widget } from "@phosphor/widgets";
import { Message } from "@phosphor/messaging";

import * as Monaco from "monaco-editor";

export class Editor extends Widget {
  constructor(options: Editor.IOptions = {}) {
    super();
  }

  protected onAfterAttach(msg: Message): void {
    this._monaco = Private.createEditor(this.node);
  }

  protected onResize(msg: Widget.ResizeMessage): void {
    this._monaco.layout();
  }

  /**
   * Monaco editor instance.
   */
  private _monaco: Monaco.editor.IStandaloneCodeEditor;
}

/**
 * Query editor statics namespace
 */
export namespace Editor {
  /**
   * Query editor options.
   */
  export interface IOptions {
  }
}

/**
 * Module private statics.
 */
namespace Private {
  /**
   * Get worker source url for a language label.
   */
  function getWorkerUrl(label: string): string {
    const chromeUrl = (prefix: string) => chrome.runtime.getURL(`js/${prefix}.worker.js`);
    switch (label) {
      case "html":
      case "json":
      case "css":
        return chromeUrl(label);
      case "javascript":
      case "typescript":
        return chromeUrl("typescript");
      default:
        return chromeUrl("editor");
    }
  }

  /**
   * Create a new monaco editor instance.
   */
  export function createEditor(node: HTMLElement): Monaco.editor.IStandaloneCodeEditor {
    (window as any).MonacoEnvironment = {
      getWorkerUrl: (_, label) => getWorkerUrl(label),
    };

    return Monaco.editor.create(node, {
      value: "SELECT * FROM 'test'",
      language: "sql",
      minimap: {
        enabled: false,
      },
    });
  }
}
