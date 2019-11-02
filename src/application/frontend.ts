import { IPlugin, Application } from '@phosphor/application';
import { IIterator } from '@phosphor/algorithm';
import { Widget } from '@phosphor/widgets';

import { ServiceManager } from '@mochi/services';
import { ConnectorRegistry } from '@mochi/connectorregistry';

/**
 * The type for all MochiFrontEnd application plugins.
 *
 * @typeparam T - The type that the plugin `provides` upon being activated.
 */
export type MochiFrontEndPlugin<T> = IPlugin<MochiFrontEnd, T>;

/**
 * The base Jupyter front-end application class.
 *
 * @typeparam `T` - The `shell` type. Defaults to `MochiFrontEnd.IShell`.
 *
 * #### Notes
 * This type is useful as a generic application against which front-end plugins
 * can be authored. It inherits from the phosphor `Application`.
 */
export abstract class MochiFrontEnd<T extends MochiFrontEnd.IShell = MochiFrontEnd.IShell> extends Application<T> {
  protected constructor(options: MochiFrontEnd.IOptions<T>) {
    super(options);

    const registry  = (this.databaseRegistry = new ConnectorRegistry());
    this.serviceManager = options.serviceManager || new ServiceManager({ registry });
  }

  readonly serviceManager: ServiceManager;
  readonly databaseRegistry: ConnectorRegistry;
}

/**
 * The namespace for `MochiFrontEnd` class statics.
 */
export namespace MochiFrontEnd {
  export interface IOptions<T extends IShell = IShell, U = any> extends Application.IOptions<T> {
    /**
     * The service manager used by the application.
     */
    serviceManager?: ServiceManager;
  }

  export interface IShell extends Widget {
    /**
     * Activates a widget inside the application shell.
     *
     * @param id - The ID of the widget being activated.
     */
    activateById(id: string): void;

    /**
     * Add a widget to the application shell.
     *
     * @param widget - The widget being added.
     *
     * @param area - Optional region in the shell into which the widget should
     * be added.
     *
     * @param options - @TODO Optional flags the shell might use when opening the
     *  widget, as defined in the `DocumentRegistry`.
     */
    add(widget: Widget, area?: string /* options?: DocumentRegistry.IOpenOptions */): void;

    /**
     * The focused widget in the application shell.
     *
     * #### Notes
     * Different shell implementations have latitude to decide what "current"
     * or "focused" mean, depending on their user interface characteristics.
     */
    readonly currentWidget: Widget;

    /**
     * Returns an iterator for the widgets inside the application shell.
     *
     * @param area - Optional regions in the shell whose widgets are iterated.
     */
    widgets(area?: string): IIterator<Widget>;
  }
}
