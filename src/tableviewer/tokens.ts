import { Token } from '@phosphor/coreutils';

import { TableViewer } from './viewer';
import { TableViewerModel } from './model';

export const ITableViewerFactory = new Token<ITableViewerFactory>('@mochi/table-viewer:ITableViewerFactory');

export interface ITableViewerFactory {
  createViewer: (id: string, options: TableViewer.IOptions) => {
    viewer: TableViewer;
    model: TableViewerModel;
  };
}
