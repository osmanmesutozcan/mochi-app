import { MochiShell, IMochiShell } from './shell';
import { MochiFrontEnd } from './frontend';

export class Mochi extends MochiFrontEnd<IMochiShell> {
  constructor() {
    super({ shell: new MochiShell() });
  }
}
