'use strict';

import { sin, PI_1Q, PI_2Q, PI_3Q } from '../lib/Maths';

var CONFIG = {
  debug: true,
  frame: {
    interval: false,
    intervalMs: 250
  },
  canvas: {
    mode: 'contain',
    ratio: 1,
    scaleAxis: 'width',
    maxPixels: 800 * 600
  },
  state: {
    intro: {},
    splash: {},
    demo: {},
    play: {
      levels: [{
        player: {
          speed: 0.1
        },
        walls: [
          {pos: 'top', x: 160, h: 300, grow: 200, start: Math.PI, freq: 0.7},
          {pos: 'bottom', x: 160, h: 300, grow: 200, start: Math.PI, freq: 0.7},
          {pos: 'bottom', x: 800, h: 400, grow: 200, freq: 0.3},
          {pos: 'top', x: 0, h: 400, w: 1000, color: 'rgb(50,50,180)'},
          {pos: 'bottom', x: 0, h: 400, w: 1000, color: 'rgb(30,30,150)'}
        ],
        drops: [
          {trigger: 300, pos: 400, freq: 1}
        ]
      }, {
        player: {
          speed: 0.1
        },
        walls: [
          {pos: 'top', x: 160, h: 300, grow: 200, start: Math.PI, freq: 0.7},
          {pos: 'bottom', x: 160, h: 300, grow: 200, start: Math.PI, freq: 0.7},
          {pos: 'bottom', x: 800, h: 400, grow: 200, freq: 0.3},
          {pos: 'top', x: 0, h: 400, w: 1000, color: 'rgb(50,50,180)'},
          {pos: 'bottom', x: 0, h: 400, w: 1000, color: 'rgb(30,30,150)'}
        ],
        drops: [
          {trigger: 300, pos: 400, freq: 1}
        ]
      }, {
        player: {
          speed: 0.11
        },
        walls: [
          {pos: 'top', x: 150, h: 100, grow: 700, freq: 0.5},
          {pos: 'bottom', x: 500, h: 200, grow: 300, freq: 0.3},
          {pos: 'top', x: 650, h: 100, grow: 700, freq: 0.5},
          {pos: 'bottom', x: 900, h: 200, grow: 300, freq: 0.3},
          {pos: 'top', x: 0, h: 400, w: 1000, color: 'rgb(50,50,180)'},
          {pos: 'bottom', x: 0, h: 400, w: 1000, color: 'rgb(30,30,150)'}
        ],
        drops: [
          {trigger: 300, pos: 400, freq: 1}
        ]
      }, {
        player: {
          speed: 0.12
        },
        walls: [
          {pos: 'top', x: 150, h: 420, grow: 200, start: PI_3Q, freq: 1},
          {pos: 'top', x: 250, h: 400, grow: 200, start: PI_2Q, freq: 1},
          {pos: 'top', x: 350, h: 320, grow: 200, start: PI_1Q, freq: 0.8},
          {pos: 'top', x: 450, h: 380, grow: 200, start: PI_2Q, freq: 0.8},
          {pos: 'top', x: 600, h: 400, grow: 200, start: PI_3Q, freq: 0.5},
          {pos: 'bottom', x: 700, h: 0, grow: 600, start: PI_3Q, freq: 0.5},
          {pos: 'bottom', x: 800, h: 400, w: 200, grow: 200, start: PI_3Q, freq: 0.4}
          // {pos: 'top', x: 0, h: 400, w: 1000, color: 'rgb(50,50,180)'},
          // {pos: 'bottom', x: 0, h: 400, w: 1000, color: 'rgb(30,30,150)'}
        ],
        drops: [
          {trigger: 300, pos: 400, freq: 1}
        ]
      }, {
        player: {
          speed: 0.13
        },
        walls: [
          {pos: 'top', x: 500, h: 500, grow: 100, freq: 1}
        ],
        drops: [
          {trigger: 300, pos: 400, freq: 1}
        ]
      }, {
        player: {
          speed: 0.14
        },
        walls: [
          {pos: 'top', x: 500, h: 500, grow: 100, freq: 1}
        ],
        drops: [
          {trigger: 300, pos: 400, freq: 1}
        ]
      }, {
        player: {
          speed: 0.15
        },
        walls: [
          {pos: 'top', x: 500, h: 500, grow: 100, freq: 1}
        ],
        drops: [
          {trigger: 300, pos: 400, freq: 1}
        ]
      }, {
        player: {
          speed: 0.16
        },
        walls: [
          {pos: 'top', x: 500, h: 500, grow: 100, freq: 1}
        ],
        drops: [
          {trigger: 300, pos: 400, freq: 1}
        ]
      }, {
        player: {
          speed: 0.17
        },
        walls: [
          {pos: 'top', x: 500, h: 500, grow: 100, freq: 1}
        ],
        drops: [
          {trigger: 300, pos: 400, freq: 1}
        ]
      }, {
        player: {
          speed: 0.18
        },
        walls: [
          {pos: 'top', x: 500, h: 500, grow: 100, freq: 1}
        ],
        drops: [
          {trigger: 300, pos: 400, freq: 1}
        ]
      }, {
        player: {
          speed: 0.19
        },
        walls: [
          {pos: 'top', x: 500, h: 500, grow: 100, freq: 1}
        ],
        drops: [
          {trigger: 300, pos: 400, freq: 1}
        ]
      }, {
        player: {
          speed: 0.20
        },
        walls: [
          {pos: 'top', x: 500, h: 500, grow: 100, freq: 1}
        ],
        drops: [
          {trigger: 300, pos: 400, freq: 1}
        ]
      }, {
        player: {
          speed: 0.21
        },
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
