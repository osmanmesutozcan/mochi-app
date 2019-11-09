import { ArrayExt, find, IIterator } from "@phosphor/algorithm";
import { MessageLoop, IMessageHandler, Message } from "@phosphor/messaging";

import {
  Widget,
  Panel,
  BoxPanel,
  SplitPanel,
  DockPanel,
  FocusTracker,
  TabBar,
  StackedPanel,
  Title,
  BoxLayout,
} from "@phosphor/widgets";
import { Signal, ISignal } from "@phosphor/signaling";
import { Token } from "@phosphor/coreutils";
import { Debouncer } from "../coreutils";
import { MochiFrontEnd } from "./frontend";

/**
 * The class name added to the MochiShell instances
 */
const APPLICATION_SHELL_CLASS = "m-MochiShell";

/**
 * The class name added to the SideBar instances.
 */
const SIDEBAR_CLASS = "m-SideBar";

/**
 * The class name added to the current widget's title.
 */
const CURRENT_CLASS = "m-mod-current";

/*
 * The class name added to the active widget's title.
 */
const ACTIVE_CLASS = "m-mod-active";

const ACTIVITY_CLASS = "m-Activity";

/**
 * Default rank for widget added to the shell.
 */
const DEFAULT_RANK = 400;

/**
 * The Mochi application shell token.
 */
export const IMochiShell = new Token<IMochiShell>("@mochi/application:IMochiShell");

/**
 * The Mochi application shell interface.
 */
export interface IMochiShell extends MochiShell {}

/**
 * The namespace for `IMochiShell` the information.
 */
export namespace IMochiShell {
  /**
   * The areas of the application shell where widgets can reside.
   */
  export type Area = "main" | "header" | "top" | "left" | "right" | "bottom";

  /**
   * An arguments object for the definitionsChanged signals.
   */
  export type IChangedArgs = FocusTracker.IChangedArgs<Widget>;
}

/**
 * The application shell for Mochi
 */
export class MochiShell extends Widget implements MochiFrontEnd.IShell {
  constructor() {
    super();
    this.addClass(APPLICATION_SHELL_CLASS);
    this.id = "main";

    let headerPanel = (this._headerPanel = new Panel());
    let topHandler = (this._topHandler = new Private.PanelHandler());
    let bottomPanel = (this._bottomPanel = new BoxPanel());
    let hboxPanel = new BoxPanel();
    let dockPanel = (this._dockPanel = new DockPanel());
    MessageLoop.installMessageHook(dockPanel, this._dockChildHook);

    let hsplitPanel = new SplitPanel();
    let leftHandler = (this._leftHandler = new Private.SideBarHandler());
    let rightHandler = (this._rightHandler = new Private.SideBarHandler());
    let rootLayout = new BoxLayout();

    headerPanel.id = "m-header-panel";
    topHandler.panel.id = "m-top-panel";
    bottomPanel.id = "m-bottom-panel";
    hboxPanel.id = "m-main-content-panel";
    dockPanel.id = "m-main-dock-panel";
    hsplitPanel.id = "m-main-split-panel";

    leftHandler.sideBar.addClass(SIDEBAR_CLASS);
    leftHandler.sideBar.addClass("m-mod-left");
    leftHandler.stackedPanel.id = "m-left-stack";

    rightHandler.sideBar.addClass(SIDEBAR_CLASS);
    rightHandler.sideBar.addClass("m-mod-right");
    rightHandler.stackedPanel.id = "m-right-stack";

    hboxPanel.spacing = 0;
    dockPanel.spacing = 5;
    hsplitPanel.spacing = 1;

    hboxPanel.direction = "left-to-right";
    hsplitPanel.orientation = "horizontal";
    bottomPanel.direction = "bottom-to-top";

    SplitPanel.setStretch(leftHandler.stackedPanel, 0);
    SplitPanel.setStretch(dockPanel, 1);
    SplitPanel.setStretch(rightHandler.stackedPanel, 0);

    BoxPanel.setStretch(leftHandler.sideBar, 0);
    BoxPanel.setStretch(hsplitPanel, 1);
    BoxPanel.setStretch(rightHandler.sideBar, 0);

    hsplitPanel.addWidget(leftHandler.stackedPanel);
    hsplitPanel.addWidget(dockPanel);
    hsplitPanel.addWidget(rightHandler.stackedPanel);

    hboxPanel.addWidget(leftHandler.sideBar);
    hboxPanel.addWidget(hsplitPanel);
    hboxPanel.addWidget(rightHandler.sideBar);

    rootLayout.direction = "top-to-bottom";
    rootLayout.spacing = 0;

    // Use relatice sizing to set the width of the side panels.
    // This will still respect the min-size of children widget in the stacked
    // panel.
    hsplitPanel.setRelativeSizes([0.7, 2.5, 0.7]);

    BoxLayout.setStretch(headerPanel, 0);
    BoxLayout.setStretch(topHandler.panel, 0);
    BoxLayout.setStretch(hboxPanel, 1);
    BoxLayout.setStretch(bottomPanel, 0);

    rootLayout.addWidget(headerPanel);
    rootLayout.addWidget(topHandler.panel);
    rootLayout.addWidget(hboxPanel);
    rootLayout.addWidget(bottomPanel);

    // Initially hiding header and bottom panel when no elements inside.
    this._headerPanel.hide();
    this._bottomPanel.hide();

    this.layout = rootLayout;

    // Connect change listeners.
    this._tracker.currentChanged.connect(this._onCurrentChanged, this);
    this._tracker.activeChanged.connect(this._onActiveChanged, this);

    // Connect main layout change listener.
    this._dockPanel.layoutModified.connect(this._onLayoutModified, this);

    // Catch current definitionsChanged events on the side handlers.
    this._leftHandler.sideBar.currentChanged.connect(this._onLayoutModified, this);
    this._rightHandler.sideBar.currentChanged.connect(this._onLayoutModified, this);
  }

  /**
   * A signal emitted when main area's active focus changes.
   */
  get activeChanged(): ISignal<this, IMochiShell.IChangedArgs> {
    return this._activeChanged;
  }

  /**
   * The active widget in the shell's main area.
   */
  get activeWidget(): Widget | null {
    return this._tracker.activeWidget;
  }

  add(widget: Widget, area: IMochiShell.Area = "main"): void {
    switch (area || "main") {
      case "main":
        return this._addToMainArea(widget);
      case "left":
        return this._addToLeftArea(widget);
      case "right":
        throw new Error("Not implemented");
      // return this._addToRightArea(widget, options);
      case "header":
        throw new Error("Not implemented");
      // return this._addToHeaderArea(widget, options);
      case "top":
        throw new Error("Not implemented");
      // return this._addToTopArea(widget, options);
      case "bottom":
        throw new Error("Not implemented");
      // return this._addToBottomArea(widget, options);
      default:
        throw new Error(`Invalid area: ${area}`);
    }
  }

  /**
   * Returns the widgets for an application area.
   */
  widgets(area?: IMochiShell.Area): IIterator<Widget> {
    throw new Error("Not Implemented");
  }

  /**
   * The current widget in the shell's main area.
   */
  get currentWidget(): Widget | null {
    return this._tracker.currentWidget;
  }

  /**
   * A signal emitted when the main area's layout is modified.
   */
  get layoutModified(): ISignal<this, void> {
    return this._layoutModified;
  }

  /**
   * Whether the left area is collapsed.
   */
  get leftCollapsed(): boolean {
    return !this._leftHandler.sideBar.currentTitle;
  }

  /**
   * Whether the left area is collapsed.
   */
  get rightCollapsed(): boolean {
    return !this._rightHandler.sideBar.currentTitle;
  }

  /**
   * A signal emitted when main area's current focus changes.
   */
  get currentChanged(): ISignal<this, IMochiShell.IChangedArgs> {
    return this._currentChanged;
  }

  /**
   * Activate a widget in its area.
   */
  activateById(id: string): void {
    if (this._leftHandler.has(id)) {
      this._leftHandler.activate(id);
      return;
    }

    if (this._rightHandler.has(id)) {
      this._rightHandler.activate(id);
      return;
    }

    const dock = this._dockPanel;
    const widget = find(dock.widgets(), value => value.id === id);

    if (widget) {
      dock.activateWidget(widget);
    }
  }

  /**
   * Add a widget to the left content area.
   *
   * #### Notes
   * Widgets must have a unique `id` property, which will be used as the DOM id.
   */
  private _addToLeftArea(widget: Widget): void {
    if (!widget.id) {
      console.error("Widgets added to app shell must have unique id property.");
      return;
    }
    this._leftHandler.addWidget(widget, DEFAULT_RANK);
    this._onLayoutModified();
  }

  /**
   * Add a widget to the main content area.
   *
   * #### Notes
   * Widgets must have a unique `id` property, which will be used as the DOM id.
   * All widgets added to the main area should be disposed after removal
   * (disposal before removal will remove the widget automatically).
   *
   * In the options, `ref` defaults to `null`, `mode` defaults to `'tab-after'`,
   * and `activate` defaults to `true`.
   */
  private _addToMainArea(widget: Widget): void {
    if (!widget.id) {
      console.error("Widgets added to app shell must have unique id property.");
      return;
    }

    const dock = this._dockPanel;
    const mode = "tab-after";
    let ref: Widget | null = this.currentWidget;

    // Add widget ID to tab so that we can get a handle on the tab's widget
    // (for context menu support)
    widget.title.dataset = { ...widget.title.dataset, id: widget.id };

    dock.addWidget(widget, { mode, ref });
    dock.activateWidget(widget);
  }

  /**
   * Handle a change to the dock area active widget.
   */
  private _onActiveChanged(sender: any, args: FocusTracker.IChangedArgs<Widget>): void {
    if (args.newValue) {
      args.newValue.title.className += ` ${ACTIVE_CLASS}`;
    }
    if (args.oldValue) {
      args.oldValue.title.className = args.oldValue.title.className.replace(ACTIVE_CLASS, "");
    }
    this._activeChanged.emit(args);
  }

  /**
   * Handle a change to the dock area current widget.
   */
  private _onCurrentChanged(sender: any, args: FocusTracker.IChangedArgs<Widget>): void {
    if (args.newValue) {
      args.newValue.title.className += ` ${CURRENT_CLASS}`;
    }
    if (args.oldValue) {
      args.oldValue.title.className = args.oldValue.title.className.replace(CURRENT_CLASS, "");
    }
    this._currentChanged.emit(args);
  }

  /**
   * Handle a change to the layout.
   */
  private _onLayoutModified(): void {
    void this._layoutDebouncer.invoke();
  }

  /**
   * A message hook for child add/remove messages on the main area dock panel.
   */
  private _dockChildHook = (handler: IMessageHandler, msg: Message): boolean => {
    switch (msg.type) {
      case "child-added":
        (msg as Widget.ChildMessage).child.addClass(ACTIVITY_CLASS);
        this._tracker.add((msg as Widget.ChildMessage).child);
        break;
      case "child-removed":
        (msg as Widget.ChildMessage).child.removeClass(ACTIVITY_CLASS);
        this._tracker.remove((msg as Widget.ChildMessage).child);
        break;
      default:
        break;
    }
    return true;
  }

  private _activeChanged = new Signal<this, IMochiShell.IChangedArgs>(this);
  private _currentChanged = new Signal<this, IMochiShell.IChangedArgs>(this);
  private _layoutModified = new Signal<this, void>(this);
  private _layoutDebouncer = new Debouncer(() => {
    this._layoutModified.emit(undefined);
  }, 0);

  private readonly _headerPanel: Panel;
  private readonly _topHandler: Private.PanelHandler;
  private readonly _bottomPanel: BoxPanel;
  private readonly _dockPanel: DockPanel;

  private readonly _leftHandler: Private.SideBarHandler;
  private readonly _rightHandler: Private.SideBarHandler;
  private _tracker = new FocusTracker<Widget>();
}

namespace Private {
  /**
   * An object which holds a widget and its sort rank.
   */
  export interface IRankItem {
    /**
     * The widget for the item.
     */
    widget: Widget;

    /**
     * The sort rank of the widget.
     */
    rank: number;
  }

  /**
   * A less-than comparison function for side bar rank items.
   */
  export function itemCmp(first: IRankItem, second: IRankItem): number {
    return first.rank - second.rank;
  }

  /**
   * A class which manages a panel and sorts its widgets by rank.
   */
  export class PanelHandler {
    get panel() {
      return this._panel;
    }

    addWidget(widget: Widget, rank: number): void {
      widget.parent = null;
      const item = { widget, rank };
      const index = ArrayExt.upperBound(this._items, item, Private.itemCmp);
      ArrayExt.insert(this._items, index, item);
      this._panel.insertWidget(index, widget);
    }

    private _items = new Array<Private.IRankItem>();
    private _panel = new Panel();
  }

  /**
   * A class which manages a side bar and related stacked panel.
   */
  export class SideBarHandler {
    constructor() {
      this._sideBar = new TabBar({
        insertBehavior: "none",
        removeBehavior: "none",
        allowDeselect: true,
      });

      this._stackedPanel = new StackedPanel();
      this._sideBar.hide();
      this._stackedPanel.hide();
      this._lastCurrent = null;
      this._sideBar.currentChanged.connect(this._onCurrentChanged, this);
    }

    get sideBar(): TabBar<Widget> {
      return this._sideBar;
    }

    get stackedPanel(): StackedPanel {
      return this._stackedPanel;
    }

    /**
     * Expand the sidebar.
     *
     * #### Notes
     * This will open the most recently used tab, or the first tab
     * if there is no most recently used.
     */
    expand(): void {
      const previous = this._lastCurrent || (this._items.length > 0 && this._items[0].widget);
      if (previous) {
        this.activate(previous.id);
      }
    }

    /**
     * Activate a widget residing in the side bar by ID.
     *
     * @param id - The widget's unique ID.
     */
    activate(id: string): void {
      let widget = this._findWidgetByID(id);
      if (widget) {
        this._sideBar.currentTitle = widget.title;
        widget.activate();
      }
    }

    /**
     * Test whether the sidebar has the given widget by id.
     */
    has(id: string): boolean {
      return this._findWidgetByID(id) !== null;
    }

    /**
     * Collapse the sidebar so no items are expanded.
     */
    collapse(): void {
      this._sideBar.currentTitle = null;
    }

    /**
     * Add a widget and its title to the stacked panel and side bar.
     *
     * If the widget is already added, it will be moved.
     */
    addWidget(widget: Widget, rank: number): void {
      widget.parent = null;
      widget.hide();
      let item = { widget, rank };
      let index = this._findInsertIndex(item);
      ArrayExt.insert(this._items, index, item);
      this._stackedPanel.insertWidget(index, widget);
      const title = this._sideBar.insertTab(index, widget.title);
      // Store the parent id in the title dataset
      // in order to dispatch click events to the right widget.
      title.dataset = { id: widget.id };
      this._refreshVisibility();
    }

    /**
     * Find the insertion index for a rank item.
     */
    private _findInsertIndex(item: Private.IRankItem): number {
      return ArrayExt.upperBound(this._items, item, Private.itemCmp);
    }

    /**
     * Find the widget which owns the given title, or `null`.
     */
    private _findWidgetByTitle(title: Title<Widget>): Widget | null {
      let item = find(this._items, value => value.widget.title === title);
      return item ? item.widget : null;
    }

    /**
     * Find the widget with the given id, or `null`.
     */
    private _findWidgetByID(id: string): Widget | null {
      let item = find(this._items, value => value.widget.id === id);
      return item ? item.widget : null;
    }

    /**
     * Refresh the visibility of the sidebar and stacked panel.
     */
    private _refreshVisibility(): void {
      this._sideBar.setHidden(this._sideBar.titles.length === 0);
      this._stackedPanel.setHidden(this._sideBar.currentTitle === null);
    }

    /**
     *  Handle the `currentChanged` signa from the sidebar.
     */
    private _onCurrentChanged(sender: TabBar<Widget>, args: TabBar.ICurrentChangedArgs<Widget>): void {
      const oldWidget = args.previousTitle ? this._findWidgetByTitle(args.previousTitle) : null;
      const newWidget = args.currentTitle ? this._findWidgetByTitle(args.currentTitle) : null;
      if (oldWidget) {
        oldWidget.hide();
      }
      if (newWidget) {
        newWidget.show();
      }
      this._lastCurrent = newWidget || oldWidget;
      this._refreshVisibility();
    }

    private _items = new Array<Private.IRankItem>();
    private _sideBar: TabBar<Widget>;
    private _stackedPanel: StackedPanel;
    private _lastCurrent: Widget | null;
  }
}
