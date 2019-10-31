import { Mochi } from './application';

import './style/index.css';

window.onload = async () => {
  const mochi = new Mochi();
  mochi.start();
};
