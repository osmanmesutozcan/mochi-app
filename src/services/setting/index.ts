import { IDisposable } from '@phosphor/disposable';
import { Signal } from '@phosphor/signaling';

import { DataConnector, ISettingRegistry } from '@mochi/coreutils';

export class SettingManager extends DataConnector<ISettingRegistry.IPlugin, string> {
  constructor(options: SettingManager.IOptions) {
    super();
  }

  async fetch(id: string): Promise<ISettingRegistry.IPlugin | undefined> {
    throw new Error('Not implemented');
  }

  /**
   * Dispose of resources held by the manager.
   */
  dispose(): void {
    if (this.isDisposed) {
      return;
    }
    this._isDisposed = true;
    Signal.clearData(this);
  }

  /**
   * Test whether the instance is disposed.
   */
  get isDisposed(): boolean {
    return this._isDisposed;
  }

  private _isDisposed = false;
}

export namespace SettingManager {
  export interface IOptions {
    //
  }
}

export namespace Settings {
  export interface IManager extends IDisposable {

  }
}
