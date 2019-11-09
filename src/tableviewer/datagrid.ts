import 'slickgrid/slick.core';
import 'slickgrid/lib/jquery.event.drag-2.3.0';
import 'slickgrid/lib/jquery-ui-1.11.3';
import 'slickgrid/slick.dataview';
import 'slickgrid/slick.grid';
import 'slickgrid/slick.editors';

import 'slickgrid/slick.grid.css';
import 'slickgrid/slick-default-theme.css';
import 'jquery-ui-dist/jquery-ui.min.css';

import * as _ from 'lodash';
import { Widget } from '@phosphor/widgets';
import { Message } from '@phosphor/messaging';

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

const data = new Array(500).fill(null).map((_, idx) => ({
  id: idx,
  title: 'Task ' + idx,
  duration: '5 days',
  percentComplete: Math.round(Math.random() * 100),
  start: '01/01/2009',
  finish: '01/05/2009',
  effortDriven: idx % 5 === 0,
}));

export class DataGrid extends Widget {
  constructor(options: DataGrid.IOptions) {
    super();
    this._dv = new Slick.Data.DataView();
    this._dv.setItems(data);
  }

  protected onAfterAttach(msg: Message): void {
    this._grid = new Slick.Grid(this.node, this._dv, columns, _options);
  }

  protected onResize(msg: Widget.ResizeMessage): void {
    // TODO: EXPOSE_CONFIG
    //   Ask user if we should autosize on panel resize.
    this._grid.resizeCanvas();
    this._handleResize();
  }

  private _handleResize = _.once(() => this._grid.autosizeColumns());

  private _grid;
  private readonly _dv;
}

export namespace DataGrid {
  export interface IOptions {
    //
  }
}
