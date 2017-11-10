'use strict';

import { sin, PI_1H, PI_2H, PI_3H } from '../lib/Maths';

var CONFIG = {
  debug: true,
  speed: 1,
  frame: {
    interval: false,
    intervalMs: 250
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
    demo: {},
    play: {
      speed: 1.5,
      startLevel: 0,

      // LEVEL 1

      levels: [{
        speed: 1.2,
        player: {
          maxHoldSec: 60
        },
        walls: [
          {pos: 'bottom', x: 280, h: 400, grow: 300, phase: PI_2H, freq: 0.15},
          {pos: 'bottom', x: 700, h: 300, grow: 200, phase: 0, freq: 0.3},
          {pos: 'top', x: 700, h: 300, grow: 200, phase: 0, freq: 0.3},
          {pos: 'top', x: 0, h: 400, w: 100, color: 'rgb(50,50,180)'},
          {pos: 'top', x: 100, h: 300, w: 400, color: 'rgb(50,50,180)'},
          {pos: 'top', x: 500, h: 400, w: 500, color: 'rgb(50,50,180)'},
          {pos: 'bottom', x: 0, h: 400, w: 100, color: 'rgb(30,30,150)'},
          {pos: 'bottom', x: 100, h: 300, w: 400, color: 'rgb(30,30,150)'},
          {pos: 'bottom', x: 500, h: 400, w: 500, color: 'rgb(30,30,150)'}
        ],
        drops: [
          {trigger: 300, pos: 400, freq: 1}
        ],
        messages: [
          {restarts: 1, text: 'press SPACE to slow down ;-)'}
        ]
      }, {
        speed: 1.1,
        player: {},
        walls: [
          {pos: 'top', x: 280, h: 300, grow: 200, phase: 0, freq: 0.3},
          {pos: 'bottom', x: 280, h: 300, grow: 200, phase: 0, freq: 0.3},
          {pos: 'bottom', x: 700, h: 400, grow: 300, phase: 0, freq: 0.3},
          {pos: 'top', x: 0, h: 400, w: 500, color: 'rgb(50,50,180)'},
          {pos: 'top', x: 500, h: 300, w: 400, color: 'rgb(50,50,180)'},
          {pos: 'top', x: 900, h: 400, w: 100, color: 'rgb(50,50,180)'},
          {pos: 'bottom', x: 0, h: 400, w: 500, color: 'rgb(30,30,150)'},
          {pos: 'bottom', x: 500, h: 300, w: 400, color: 'rgb(30,30,150)'},
          {pos: 'bottom', x: 900, h: 400, w: 100, color: 'rgb(30,30,150)'}
        ],
        drops: [
          {trigger: 300, pos: 400, freq: 1}
        ],
        messages: [
          {restarts: 1, text: 'slow down early to recover speed sooner'}
        ]
      }, {
        speed: 1.13,
        player: {},
        walls: [
          {pos: 'top', x: 250, h: 100, grow: 500, freq: 0.5},
          {pos: 'bottom', x: 500, h: 200, grow: 300, freq: 0.3},
          {pos: 'top', x: 650, h: 100, grow: 500, freq: 0.5},
          {pos: 'bottom', x: 900, h: 200, grow: 300, freq: 0.3},
          {pos: 'top', x: 0, h: 400, w: 1000, color: 'rgb(50,50,180)'},
          {pos: 'bottom', x: 0, h: 400, w: 1000, color: 'rgb(30,30,150)'}
        ],
        drops: [
          {trigger: 300, pos: 400, freq: 1}
        ]
      }, {
        speed: 1.14,
        player: {},
        walls: [
          {pos: 'top', x: 250, h: 300, grow: 400, phase: PI_1H, freq: 0.3},
          {pos: 'bottom', x: 250, h: 300, grow: 400, phase: PI_1H, freq: 0.3},
          {pos: 'top', x: 500, h: 350, grow: 300, phase: PI_1H, freq: 0.5},
          {pos: 'top', x: 0, h: 400, w: 400, color: 'rgb(50,50,180)'},
          {pos: 'top', x: 400, h: 350, w: 200, color: 'rgb(50,50,180)'},
          {pos: 'top', x: 600, h: 400, w: 400, color: 'rgb(50,50,180)'},
          {pos: 'bottom', x: 0, h: 400, w: 400, color: 'rgb(30,30,150)'},
          {pos: 'bottom', x: 400, h: 350, w: 200, color: 'rgb(30,30,150)'},
          {pos: 'bottom', x: 600, h: 400, w: 400, color: 'rgb(30,30,150)'}
        ],
        drops: [
          {trigger: 300, pos: 400, freq: 1}
        ]
      }, {
        speed: 1.15,
        player: {},
        walls: [
          {pos: 'bottom', x: 240, h: 200, grow: 400, phase: 0, freq: 0.4},
          {pos: 'top', x: 420, h: 300, grow: 300, phase: PI_2H, freq: 0.6},
          {pos: 'bottom', x: 420, h: 300, grow: 300, phase: PI_2H, freq: 0.6},
          {pos: 'bottom', x: 580, h: 400, grow: 400, phase: PI_1H, freq: 0.1},
          {pos: 'top', x: 800, h: 300, grow: 400, phase: PI_1H, freq: 0.2},
          {pos: 'bottom', x: 800, h: 300, grow: 400, phase: PI_1H, freq: 0.2},
          {pos: 'top', x: 0, h: 400, w: 1000, color: 'rgb(50,50,180)'},
          {pos: 'bottom', x: 0, h: 400, w: 1000, color: 'rgb(30,30,150)'}
        ],
        drops: [
          {trigger: 300, pos: 400, freq: 1}
        ]
      }, {
        speed: 1.16,
        player: {},
        walls: [
          {pos: 'top', x: 150, h: 420, grow: 200, phase: PI_2H, freq: 0.5},
          {pos: 'top', x: 250, h: 400, grow: 200, phase: PI_1H, freq: 0.6},
          {pos: 'top', x: 350, h: 400, grow: 200, phase: PI_1H, freq: 0.4},
          {pos: 'top', x: 450, h: 380, grow: 200, phase: PI_3H, freq: 0.8},
          {pos: 'bottom', x: 550, h: 400, grow: 200, phase: PI_3H, freq: 0.5},
          {pos: 'bottom', x: 700, h: 0, grow: 600, phase: PI_3H, freq: 0.5},
          {pos: 'bottom', x: 800, h: 300, w: 140, grow: 300, phase: PI_3H, freq: 0.3},
          {pos: 'top', x: 0, h: 400, w: 1000, color: 'rgb(50,50,180)'},
          {pos: 'bottom', x: 0, h: 400, w: 1000, color: 'rgb(30,30,150)'}
        ],
        drops: [
          {trigger: 300, pos: 400, freq: 1}
        ]
      },

      // LEVEL 2

      {
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
