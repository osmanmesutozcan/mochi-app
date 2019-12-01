import { BoxLayout, Widget } from '@phosphor/widgets';

import { Toolbar, ToolbarButton } from '@mochi/apputils';
import { QueryEditorModel } from '@mochi/queryeditor';
import { IDataSourceConnector } from '@mochi/services';

import { Editor } from './editor';

/**
 * The class name added to the query editor toolbar node.
 */
const TOOLBAR_CLASS = 'm-QueryEditor-toolbar';

/**
 * The class name added to the editor node.
 */
const EDITOR_CLASS = 'm-QueryEditor-editor';

export class QueryEditor extends Widget {
  constructor(options: QueryEditor.IOptions) {
    super();

    const id = Private.getId();
    this.id = `queryeditor-widget-${id}`;
    this.title.label = options.label || `Editor ${id}`;

    this.editor = new Editor();
    this.editor.addClass(EDITOR_CLASS);

    this.toolbar = new Toolbar();
    this.toolbar.addClass(TOOLBAR_CLASS);

    this.model = new QueryEditorModel({
      connection: options.connection,
      editor: this.editor,
    });

    const runQuery = new ToolbarButton({
      iconClassName: 'm-RunIcon',
      tooltip: 'Run Query',
      label: 'Run',
      onClick: () => this.model.runQuery(),
    });

    this.toolbar.addItem('runQuery', runQuery);

    const layout = new BoxLayout();
    layout.addWidget(this.toolbar);
    layout.addWidget(this.editor);

    BoxLayout.setStretch(this.toolbar, 0);
    BoxLayout.setStretch(this.editor, 1);

    this.layout = layout;
  }

  readonly model: QueryEditorModel;
  readonly toolbar: Toolbar;
  readonly editor: Editor;
}

export namespace QueryEditor {
  export interface IOptions {
    /**
     * Label of the editor on main tab.
     */
    label?: string;

    /**
     * Data connection which the model is bound to.
     */
    connection: IDataSourceConnector;
  }
}

/**
 * Module private statics.
 */
namespace Private {
  /**
   * Track incremental id.
   */
  let WIDGET_ID_TRACKER = 0;

  /**
   * Get a unique id for the widget.
   */
  export function getId(): string {
    return (WIDGET_ID_TRACKER++).toString();
  }
}
