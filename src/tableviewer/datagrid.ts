import * as _ from 'lodash';
import { Widget } from '@phosphor/widgets';
import { Message } from '@phosphor/messaging';
import { TableViewerModel } from '@mochi/tableviewer/model';

const Slick = (window as any).Slick;

const columns = [
  { id: 'title', name: 'Title', field: 'title' },
  { id: 'duration', name: 'Duration', field: 'duration' },
  { id: '%', name: '% Complete', field: 'percentComplete' },
  { id: 'start', name: 'Start', field: 'start' },
  { id: 'finish', name: 'Finish', field: 'finish' },
  { id: 'effort-driven', name: 'Effort Driven', field: 'effortDriven' },
];

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
    this._grid = new Slick.Grid(this.node, this._model.dataView, columns, _options);
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
