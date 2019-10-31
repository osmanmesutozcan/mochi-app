import { MochiFrontEnd } from './frontend';
import { IMochiShell, MochiShell } from './shell';

export class Mochi extends MochiFrontEnd<IMochiShell> {
  constructor() {
    super({ shell: new MochiShell() });
  }
}
