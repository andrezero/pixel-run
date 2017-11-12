'use strict';

import { sin, PI_1H, PI_2H, PI_3H } from '../lib/Maths';
import { level as level1 } from './level1';
import { level as level2 } from './level2';

var CONFIG = {
  debug: true,
  speed: 1,
  frame: {
    interval: false,
    intervalMs: 100
  },
  canvas: {
    mode: 'contain',
    ratio: 1,
    scaleAxis: 'width',
    maxPixels: 1200 * 1200
  },
  state: {
    intro: {},
    splash: {},
    demo: {
      speed: 7,
      levels: level1.tiles
    },
    play: {
      speed: 1.2,
      startLevel: 0,
      levels: level1.tiles
    },
    pause: {},
    gameOver: {},
    scores: {},
    about: {},
    credits: {}
  }
};

export {
  CONFIG
};
