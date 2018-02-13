import { Application } from './Application';
import { CONFIG } from '../config/app';

const init = () => {
  const parentElement = document.getElementById('game-container');
  const app = new Application(parentElement, CONFIG);

  window.addEventListener('resize', () => app.resize());
};

document.addEventListener('DOMContentLoaded', init);
