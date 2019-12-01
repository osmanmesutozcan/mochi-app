import { IDataSourceConnector } from '@mochi/services';
import { Editor } from '@mochi/queryeditor';

export class QueryEditorModel {
  constructor(options: QueryEditorModel.IOptions) {
    this._connection = options.connection;
    this._editor = options.editor;
  }

  // FIXME: What should we do with the response we got?
  //   One options is to let editor model also manage a data table.
  //    Which I think is the way to go.
  async runQuery(): Promise<void> {
    const query = this._editor.getContent();
    if (query === '') {
      return void 0;
    }

    // We can also have a simple interface to set some params.
    //   We can use those params to easily adopt queries.
    const result = await this._connection.query(query);
    console.log(result);
  }

  private _editor: Editor;
  private _connection: IDataSourceConnector;
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
}
