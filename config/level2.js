'use strict';

import { sin, PI_1H, PI_2H, PI_3H } from '../lib/Maths';

const level = {
  tiles: [{
    speed: 1.1,
    player: {},
    walls: [
      // {pos: 'top', x: 450, h: 450, grow: 100, freq: 0.25},
      // {pos: 'bottom', x: 550, h: 450, grow: 100, freq: 0.25},
      // {pos: 'top', x: 650, h: 450, grow: 100, phase: PI_1H, freq: 0.25},
      {pos: 'top', x: 990, h: 900, grow: 100, phase: PI_1H, freq: 0.25}
      // {pos: 'top', x: 0, h: 400, w: 1000, color: 'rgb(180,50,80)'},
      // {pos: 'bottom', x: 0, h: 400, w: 1000, color: 'rgb(150,30,80)'}
    ],
    drops: [
      {trigger: 300, pos: 400, freq: 1}
    ],
    messages: [
      {restarts: 1, text: 'press UP or DOWN to start swinging'}
    ]
  }, {
    speed: 1.14,
    player: {},
    walls: [
      {pos: 'top', x: 350, h: 500, grow: 200, freq: 0.25},
      {pos: 'bottom', x: 650, h: 500, grow: 400, freq: 0.25},
      {pos: 'top', x: 0, h: 300, w: 500, color: 'rgb(180,50,80)'},
      {pos: 'top', x: 500, h: 100, w: 300, color: 'rgb(180,50,80)'},
      {pos: 'top', x: 800, h: 300, w: 200, color: 'rgb(180,50,80)'},
      {pos: 'bottom', x: 0, h: 400, w: 200, color: 'rgb(150,30,80)'},
      {pos: 'bottom', x: 200, h: 100, w: 500, color: 'rgb(150,30,80)'},
      {pos: 'bottom', x: 500, h: 400, w: 500, color: 'rgb(150,30,80)'}
    ],
    drops: [
      {trigger: 300, pos: 400, freq: 1}
    ],
    messages: [
      {restarts: 1, text: 'press UP or DOWN against swing to swing less'}
    ]
  }, {
    speed: 1.15,
    player: {},
    walls: [
      {pos: 'top', x: 500, h: 500, grow: 100, freq: 1}
    ],
    drops: [
      {trigger: 300, pos: 400, freq: 1}
    ]
  }, {
    speed: 1.16,
    player: {},
    walls: [
      {pos: 'top', x: 500, h: 500, grow: 100, freq: 1}
    ],
    drops: [
      {trigger: 300, pos: 400, freq: 1}
    ]
  }, {
    speed: 1.17,
    player: {},
    walls: [
      {pos: 'top', x: 500, h: 500, grow: 100, freq: 1}
    ],
    drops: [
      {trigger: 300, pos: 400, freq: 1}
    ]
  }, {
    speed: 1.18,
    player: {},
    walls: [
      {pos: 'top', x: 500, h: 500, grow: 100, freq: 1}
    ],
    drops: [
      {trigger: 300, pos: 400, freq: 1}
    ]
  }, {
    speed: 1.19,
    player: {},
    walls: [
      {pos: 'top', x: 500, h: 500, grow: 100, freq: 1}
    ],
    drops: [
      {trigger: 300, pos: 400, freq: 1}
    ]
  }, {
    speed: 1.20,
    player: {},
    walls: [
      {pos: 'top', x: 500, h: 500, grow: 100, freq: 1}
    ],
    drops: [
      {trigger: 300, pos: 400, freq: 1}
    ]
  }, {
    speed: 1.21,
    player: {},
    walls: [
      {pos: 'top', x: 500, h: 500, grow: 100, freq: 1}
    ],
    drops: [
      {trigger: 300, pos: 400, freq: 1}
    ]
  }]
};

export {
  level
};
