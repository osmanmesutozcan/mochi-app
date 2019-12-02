import * as _ from 'lodash';
import { Widget } from '@phosphor/widgets';
import { Message } from '@phosphor/messaging';
import { IDisposable } from '@phosphor/disposable';
import { ISignal, Signal } from '@phosphor/signaling';

export const Slick = (window as any).Slick;

const _options = {
  enableCellNavigation: true,
  enableColumnReorder: true,
  autosizeColsMode: Slick.GridAutosizeColsMode.FitColsToViewport,
};

export class DataGrid extends Widget {
  constructor(options: DataGrid.IOptions) {
    super();
    this._model = options.model || new DataGridModel();
  }

  protected onAfterAttach(msg: Message): void {
    this._grid = new Slick.Grid(this.node, this._model.dataView, this._model.columns, _options);

    this._model.onColumnsChange.connect((sender, args) => {
      this._grid.setColumns(args.columns);
    });

    this._model.onDataItemsChange.connect(() => {
      this._grid.updateRowCount();
      this._grid.render();
    });
  }

  protected onResize(msg: Widget.ResizeMessage): void {
    // TODO: EXPOSE_CONFIG
    //   Ask user if we should autosize on panel resize.
    this._grid.resizeCanvas();
    this._handleResize();
  }

  protected onFitRequest(msg: Message): void {
    this._grid.autosizeColumns();
  }

  private _handleResize = _.once(() => this._grid.autosizeColumns());

  private _grid;
  private readonly _model: DataGridModel;
}

export namespace DataGrid {
  export interface IOptions {
    model?: DataGridModel;
  }
}

export class DataGridModel implements IDisposable {
  constructor(options: DataGridModel.IOptions = {}) {
    this._data = new Slick.Data.DataView();
  }

  setItems(data: any[]) {
    this._data.beginUpdate();
    this._data.setItems(data);
    this._data.endUpdate();

    this._onDataItemsChange.emit(void 0);
  }

  setColumns(columns: DataGridModel.IDataGridColumn[]) {
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
  get onColumnsChange(): ISignal<this, DataGridModel.IChangeArgs> {
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
  private readonly _onColumnsChange = new Signal<this, DataGridModel.IChangeArgs>(this);
  private readonly _onDataItemsChange = new Signal<this, void>(this);
}

export namespace DataGridModel {
  export interface IChangeArgs {
    columns: IDataGridColumn[];
  }

  export interface IOptions {
    //
  }

  export interface IDataGridColumn {
    id: string;
    name: string;
    field: string;
  }
}
