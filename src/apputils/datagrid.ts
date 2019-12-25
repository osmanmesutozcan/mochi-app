import * as _ from 'lodash';
import { Widget } from '@phosphor/widgets';
import { Message } from '@phosphor/messaging';
import { IDisposable } from '@phosphor/disposable';
import { ISignal, Signal } from '@phosphor/signaling';
import { ObjectLiteral } from '@mochi/coreutils';
import { RowType } from '@mochi/connectorbrowser';

export const Slick = (window as any).Slick;

const _options = {
  editable: true,
  autoEdit: false,
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
    this._grid = new Slick.Grid(this.node, this._model.dataView, this._model.columns, {
      ..._options,
      editCommandHandler: this._model.setCell.bind(this._model),
    });

    this._grid.setSelectionModel(new Slick.CellSelectionModel());

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

  // HACK: Fixes data grid glitch after first render.
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

  setCell(item: any, column: any, command: Private.ICellEditCommand) {
    command.execute();

    this._onCellEdited.emit({
      row: {
        index: command.row,
        content: this._data.getItem(command.row),
      },
      column: {
        name: column.id,
      },
      value: {
        new: command.serializedValue,
        old: command.prevSerializedValue,
      },
    });
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
  get onColumnsChange(): ISignal<this, DataGridModel.IColumnsChangeArgs> {
    return this._onColumnsChange;
  }

  /**
   * Signal emitted when columns definition change.
   */
  get onDataItemsChange(): ISignal<this, void> {
    return this._onDataItemsChange;
  }

  /**
   * Signal emitted when cell edited.
   */
  get onCellEdited(): ISignal<this, DataGridModel.ICellEditedArgs> {
    return this._onCellEdited;
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
  private readonly _onDataItemsChange = new Signal<this, void>(this);
  private readonly _onCellEdited = new Signal<this, DataGridModel.ICellEditedArgs>(this);
  private readonly _onColumnsChange = new Signal<this, DataGridModel.IColumnsChangeArgs>(this);
}

export namespace DataGridModel {
  export interface IOptions {
    //
  }

  export interface IColumnsChangeArgs {
    /**
     * New columns
     */
    columns: IDataGridColumn[];
  }

  export interface ICellEditedArgs {
    /**
     * Row which the change is applied
     */
    row: {
      index: number;
      content: ObjectLiteral<RowType>;
    };

    /**
     * Column which the change is applied
     */
    column: {
      name: string;
    };

    /**
     * Value change made to data.
     */
    value: {
      new: string | number | boolean;
      old: string | number | boolean;
    };
  }

  export interface IDataGridColumn {
    id: string;
    name: string;
    field: string;

    // Slick editor
    editor?: any;

    // TODO:
    // readonly: boolean;
  }
}

namespace Private {
  export interface ICellEditCommand {
    row: number;
    execute: () => void;
    undo: () => void;
    serializedValue: string;
    prevSerializedValue: string;
  }
}
