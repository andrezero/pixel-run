'use strict';

import { Application } from './Application';
import { CONFIG } from '../config/app';

const init = () => {
  const parentElement = document.getElementById('game-container');
  const app = new Application(parentElement, CONFIG);

  window.addEventListener('resize', () => app.resize());

  document.getElementById('btn-reset').addEventListener('click', () => app.reset());
  document.getElementById('btn-intro').addEventListener('click', () => app.intro());
  document.getElementById('btn-splash').addEventListener('click', () => app.splash());
  document.getElementById('btn-demo').addEventListener('click', () => app.demo());
  document.getElementById('btn-instructions').addEventListener('click', () => app.instructions());
  document.getElementById('btn-play').addEventListener('click', () => app.play());
  document.getElementById('btn-pause').addEventListener('click', () => app.pause());
  document.getElementById('btn-game-over').addEventListener('click', () => app.gameOver());
  document.getElementById('btn-scores').addEventListener('click', () => app.scores());
  document.getElementById('btn-about').addEventListener('click', () => app.about());
  document.getElementById('btn-credits').addEventListener('click', () => app.credits());
};

document.addEventListener('DOMContentLoaded', init);
