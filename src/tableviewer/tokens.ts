import { Token } from '@phosphor/coreutils';

import { TableViewerModel } from '@mochi/tableviewer/model';

export const ITableViewerFactory = new Token<ITableViewerFactory>('@mochi/table-viewer:ITableViewerFactory');

export interface ITableViewerFactory {
  createViewer: (id: string, options: { label: string, connectionId: string }) => {
    model: TableViewerModel;
  };
}
