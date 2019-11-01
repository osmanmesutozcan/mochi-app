import { Contents, ContentsManager } from './contents';
import { Settings, SettingManager } from './setting';
import { IDisposable } from '@phosphor/disposable';
import { Signal } from '@phosphor/signaling';

export class ServiceManager implements ServiceManager.IServiceManager {
  constructor(options: ServiceManager.IOptions = {}) {
    let resolveReadyPromise: () => void;
    this._readyPromise = new Promise<void>(res => resolveReadyPromise = res);

    this.settings = new SettingManager(options);
    this.contents = new ContentsManager(options);

    resolveReadyPromise();
  }

  get isReady(): boolean {
    return this._isReady;
  }

  get ready(): Promise<void> {
    return this._readyPromise;
  }

  get isDisposed(): boolean {
    return this._isDisposed;
  }

  /**
   * Dispose of the resources held by the manager.
   */
  dispose(): void {
    if (this._isDisposed) {
      return;
    }

    this._isDisposed = true;
    Signal.clearData(this);

    this.contents.dispose();
    this.settings.dispose();
  }

  /**
   * Get the contents manager instance.
   */
  readonly contents: ContentsManager;

  /**
   * Get the settings manager instance.
   */
  readonly settings: SettingManager;

  private _isDisposed = false;
  private _isReady = false;
  private _readyPromise: Promise<void>;
}

export namespace ServiceManager {
  export interface IServiceManager extends IDisposable {
    /**
     * Test whether the manager is ready.
     */
    readonly isReady: boolean;

    /**
     * A promise which fulfills when the manager is ready.
     */
    readonly ready: Promise<void>;

    // List of managers managed by the service manager.
    readonly contents: Contents.IManager;
    readonly settings: Settings.IManager;
  }

  export interface IOptions {
    //
  }
}
