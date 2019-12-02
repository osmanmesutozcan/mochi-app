import { IDataSourceConnector, IQueryResult } from '@mochi/services';
import { Editor } from '@mochi/queryeditor';
import { ISignal, Signal } from '@phosphor/signaling';

export class QueryEditorModel {
  constructor(options: QueryEditorModel.IOptions) {
    this._connection = options.connection;
    this._editor = options.editor;
  }

  async runQuery(): Promise<void> {
    const query = this._editor.getContent();
    if (query === '') {
      return void 0;
    }

    // We can also have a simple interface to set some params.
    //   We can use those params to easily adopt queries.
    const result = await this._connection.query(query);
    this._onQuerySuccess.emit({ result });
  }

  get onQuerySuccess(): ISignal<this, QueryEditorModel.IQuerySuccessArgs> {
    return this._onQuerySuccess;
  }

  private _editor: Editor;
  private _connection: IDataSourceConnector;
  private _onQuerySuccess = new Signal<this, QueryEditorModel.IQuerySuccessArgs>(this);
}

export namespace QueryEditorModel {
  export interface IOptions {
    /**
     * Data connection which the model is bound to.
     */
    connection: IDataSourceConnector;

    /**
     * Editor managed by the model.
     */
    editor: Editor;
  }

  export interface IQuerySuccessArgs {
    result: IQueryResult;
  }
}
