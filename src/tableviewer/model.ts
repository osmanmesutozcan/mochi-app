import { IDisposable } from '@phosphor/disposable';
import { ISignal, Signal } from '@phosphor/signaling';
import { Slick } from '@mochi/apputils';

export class TableViewerModel implements IDisposable {
  constructor(options: TableViewerModel.IOptions = {}) {
    this._data = new Slick.Data.DataView();
  }

  setItems(data: any[]) {
    this._data.beginUpdate();
    this._data.setItems(data);
    this._data.endUpdate();

    this._onDataItemsChange.emit(void 0);
  }

  setColumns(columns: TableViewerModel.ITableViewerColumn[]) {
    this._onColumnsChange.emit({ columns });
  }

  /*
   * Get the underlying data view.
   */
  get dataView() {
    return this._data;
  }

  /**
   * Get grid columns
   */
  get columns() {
    return this._columns;
  }

  /**
   * Test whether the model is disposed.
   */
  get isDisposed(): boolean {
    return this._isDisposed;
  }

  /**
   * Signal emitted when columns definition change.
   */
  get onColumnsChange(): ISignal<this, TableViewerModel.IChangeArgs> {
    return this._onColumnsChange;
  }

  /**
   * Signal emitted when columns definition change.
   */
  get onDataItemsChange(): ISignal<this, void> {
    return this._onDataItemsChange;
  }

  /**
   * Dispose browser model.
   */
  dispose(): void {
    if (this._isDisposed) {
      return;
    }
    this._isDisposed = true;
    Signal.clearData(this);
  }

  private _isDisposed = false;
  private readonly _data = null; // Slick.DataView
  private readonly _columns = [];
  private readonly _onColumnsChange = new Signal<this, TableViewerModel.IChangeArgs>(this);
  private readonly _onDataItemsChange = new Signal<this, void>(this);
}

export namespace TableViewerModel {
  export interface IChangeArgs {
    columns: ITableViewerColumn[];
  }

  export interface IOptions {
    //
  }

  export interface ITableViewerColumn {
    id: string;
    name: string;
    field: string;
  }
}
