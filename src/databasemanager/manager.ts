import { IDatabaseManager } from '@mochi/databasemanager/tokens';

export class DatabaseManager implements IDatabaseManager {
  get isDisposed(): boolean {
    return this._isDisposed;
  }

  dispose(): void {
    this._isDisposed = true;
  }

  private _isDisposed = false;
}
