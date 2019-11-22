import { IDisposable } from '@phosphor/disposable';

const Slick = (window as any).Slick;

const data = new Array(500).fill(null).map((_, idx) => ({
  id: idx,
  title: 'Task ' + idx,
  duration: '5 days',
  percentComplete: Math.round(Math.random() * 100),
  start: '01/01/2009',
  finish: '01/05/2009',
  effortDriven: idx % 5 === 0,
}));

export class TableViewerModel implements IDisposable {
  constructor(options: TableViewerModel.IOptions = {}) {
    this._data = new Slick.Data.DataView();
    this._data.setItems(data);
  }

  // Get the underlying data view.
  get dataView() {
    return this._data;
  }

  /**
   * Test whether the model is disposed.
   */
  get isDisposed(): boolean {
    return this._isDisposed;
  }

  /**
   * Dispose browser model.
   */
  dispose(): void {
    if (this._isDisposed) {
      return;
    }
    this._isDisposed = true;
  }

  private _isDisposed = false;
  private _data = null; // Slick.DataView
}

export namespace TableViewerModel {
  export interface IOptions {
    //
  }
}
