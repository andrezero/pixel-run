'use strict';

import { sin, PI_1H, PI_2H, PI_3H } from '../lib/Maths';
import { level as level1 } from './level1';
import { level as level2 } from './level2';

var CONFIG = {
  debug: false,
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
      speed: 5.5,
      levels: level1.tiles
    },
    instructions: {},
    play: {
      time: 213,
      zIndex: {
        hud: 10,
        player: 5,
        level: 3
      },
      speed: 1.2,
      startLevel: 0,
      levels: level1.tiles
      // levels: [level1.tiles[0],level1.tiles[6]]
    },
    pause: {},
    gameOver: {
      zIndex: 8
    },
    scores: {},
    about: {
      url: {
        author: 'http://andretorgal.com',
        feedback: 'https://andrezero.typeform.com/to/rTl0RU'
      }
    },
    credits: {}
  },
  assets: ['../assets/pixel.woff']
};

export {
  CONFIG
};
