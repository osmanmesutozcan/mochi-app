import { Token } from '@phosphor/coreutils';

import { TableViewer } from './viewer';
import { DataGridModel } from '@mochi/apputils';

export const ITableViewerFactory = new Token<ITableViewerFactory>('@mochi/table-viewer:ITableViewerFactory');

export interface ITableViewerFactory {
  createViewer: (id: string, options: TableViewer.IOptions) => {
    model: DataGridModel;
  };
}
