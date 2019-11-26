import * as _ from 'lodash';
import { Widget } from '@phosphor/widgets';
import { Message } from '@phosphor/messaging';
import { TableViewerModel } from '@mochi/tableviewer/model';

const Slick = (window as any).Slick;

const _options = {
  enableCellNavigation: true,
  enableColumnReorder: true,
  autosizeColsMode: Slick.GridAutosizeColsMode.FitColsToViewport,
};

export class DataGrid extends Widget {
  constructor(options: DataGrid.IOptions) {
    super();
    this._model = options.model || new TableViewerModel();
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
  private readonly _model: TableViewerModel;
}

export namespace DataGrid {
  export interface IOptions {
    model?: TableViewerModel;
  }
}
