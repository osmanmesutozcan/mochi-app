import { IDisposable } from '@phosphor/disposable';
import { Signal } from '@phosphor/signaling';

export namespace Contents {
  export interface IManager extends IDisposable {

  }
}

export class ContentsManager implements Contents.IManager {
  constructor(options: ContentsManager.IOptions) {
    //
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

export namespace ContentsManager {
  export interface IOptions {
    //
  }
}
