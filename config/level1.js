'use strict';

import { sin, PI_1H, PI_2H, PI_3H } from '../lib/Maths';

const level = {
  tiles: [{
    speed: 1,
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
      {pos: 'bottom', x: 100, h: 300, w: 410, color: 'rgb(30,30,150)'},
      {pos: 'bottom', x: 510, h: 400, w: 170, color: 'rgb(30,30,150)'},
      {pos: 'bottom', x: 680, h: 380, w: 50, color: 'rgb(30,30,150)'},
      {pos: 'bottom', x: 730, h: 400, w: 270, color: 'rgb(30,30,150)'}
    ],
    drops: [
      {trigger: 300, pos: 400, freq: 1}
    ],
    messages: [
      {restarts: 1, text: 'slowing down for too long will kill you'}
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
      {pos: 'bottom', x: 0, h: 400, w: 260, color: 'rgb(30,30,150)'},
      {pos: 'bottom', x: 260, h: 380, w: 50, color: 'rgb(30,30,150)'},
      {pos: 'bottom', x: 310, h: 400, w: 190, color: 'rgb(30,30,150)'},
      {pos: 'bottom', x: 500, h: 300, w: 400, color: 'rgb(30,30,150)'},
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
    speed: 1.15,
    player: {},
    walls: [
      {pos: 'top', x: 250, h: 100, grow: 500, freq: 0.5},
      {pos: 'bottom', x: 500, h: 200, grow: 350, freq: 0.3},
      {pos: 'top', x: 650, h: 100, grow: 500, freq: 0.5},
      {pos: 'bottom', x: 900, h: 200, grow: 300, freq: 0.3},
      {pos: 'top', x: 0, h: 400, w: 210, color: 'rgb(50,50,180)'},
      {pos: 'top', x: 210, h: 350, w: 490, color: 'rgb(50,50,180)'},
      {pos: 'top', x: 700, h: 400, w: 310, color: 'rgb(50,50,180)'},
      {pos: 'bottom', x: 0, h: 400, w: 450, color: 'rgb(30,30,150)'},
      {pos: 'bottom', x: 450, h: 350, w: 500, color: 'rgb(30,30,150)'},
      {pos: 'bottom', x: 950, h: 400, w: 50, color: 'rgb(30,30,150)'}
    ],
    drops: [
      {trigger: 300, pos: 400, freq: 1}
    ],
    messages: [
      {restarts: 1, text: 'slowing down for too long will kill you'}
    ]
  }, {
    speed: 1.2,
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
    speed: 1.3,
    player: {},
    walls: [
      {pos: 'bottom', x: 240, h: 200, grow: 500, phase: 0, freq: 0.4},
      {pos: 'top', x: 420, h: 300, grow: 300, phase: PI_2H, freq: 0.6},
      {pos: 'bottom', x: 420, h: 300, grow: 300, phase: PI_2H, freq: 0.6},
      {pos: 'bottom', x: 580, h: 400, grow: 400, phase: PI_1H, freq: 0.1},
      {pos: 'top', x: 800, h: 300, grow: 400, phase: PI_1H, freq: 0.2},
      {pos: 'bottom', x: 800, h: 300, grow: 400, phase: PI_1H, freq: 0.2},
      {pos: 'top', x: 0, h: 400, w: 200, color: 'rgb(50,50,180)'},
      {pos: 'top', x: 200, h: 350, w: 440, color: 'rgb(50,50,180)'},
      {pos: 'top', x: 640, h: 400, w: 360, color: 'rgb(50,50,180)'},
      {pos: 'bottom', x: 0, h: 400, w: 400, color: 'rgb(30,30,150)'},
      {pos: 'bottom', x: 400, h: 380, w: 50, color: 'rgb(30,30,150)'},
      {pos: 'bottom', x: 450, h: 400, w: 330, color: 'rgb(30,30,150)'},
      {pos: 'bottom', x: 780, h: 380, w: 50, color: 'rgb(30,30,150)'},
      {pos: 'bottom', x: 830, h: 400, w: 170, color: 'rgb(30,30,150)'}
    ],
    drops: [
      {trigger: 300, pos: 400, freq: 1}
    ]
  }, {
    speed: 1.4,
    player: {},
    walls: [
      {pos: 'top', x: 150, h: 400, grow: 200, phase: PI_2H, freq: 0.5},
      {pos: 'top', x: 250, h: 400, grow: 200, phase: PI_1H, freq: 0.6},
      {pos: 'top', x: 350, h: 400, grow: 200, phase: PI_1H, freq: 0.4},
      {pos: 'top', x: 450, h: 380, grow: 200, phase: PI_3H, freq: 0.8},
      {pos: 'bottom', x: 550, h: 400, grow: 200, phase: PI_3H, freq: 0.5},
      {pos: 'bottom', x: 600, h: 200, grow: 400, phase: PI_2H, freq: 0.4},
      {pos: 'bottom', x: 800, h: 300, w: 140, grow: 300, phase: PI_3H, freq: 0.3},
      {pos: 'top', x: 0, h: 400, w: 120, color: 'rgb(50,50,180)'},
      {pos: 'top', x: 120, h: 350, w: 370, color: 'rgb(50,50,180)'},
      {pos: 'top', x: 490, h: 400, w: 170, color: 'rgb(50,50,180)'},
      {pos: 'top', x: 640, h: 460, w: 360, color: 'rgb(50,50,180)'},
      {pos: 'bottom', x: 0, h: 400, w: 520, color: 'rgb(30,30,150)'},
      {pos: 'bottom', x: 520, h: 350, w: 120, color: 'rgb(30,30,150)'},
      {pos: 'bottom', x: 640, h: 460, w: 360, color: 'rgb(30,30,150)'}
    ],
    drops: [
      {trigger: 300, pos: 400, freq: 1}
    ]
  }]
};

export {
  level
};
