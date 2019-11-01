import { Widget } from '@phosphor/widgets';
import { DatabaseBrowserModel } from './model';

/**
 * The class name added to DatabaseBrowser instances.
 */
const DATABASE_BROWSER_CLASS = 'm-DatabaseBrowser';

/**
 * A widget which hosts a database browser.
 */
export class DatabaseBrowser extends Widget {
  constructor(options: DatabaseBrowser.IOptions) {
    super();
    this.addClass(DATABASE_BROWSER_CLASS);
    this.id = options.id;
  }
}

export namespace DatabaseBrowser {
  /**
   * An options onbecj for initializing a database browser widget.
   */
  export interface IOptions {
    /**
     * The widget/DOM id of the database browser.
     */
    id: string;

    /**
     * Underlying model of database browser.
     */
    model: DatabaseBrowserModel;
  }
}
