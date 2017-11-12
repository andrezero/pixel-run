'use strict';

import { ObjCollection } from '../../lib/ObjCollection';
import { ramp, sin, easeOutCubic, easeInCubic } from '../../lib/Maths';

const WIDTH = 200;
const HEIGHT = 20;

class TimeBar {
  constructor (canvas, config, max) {
    this._canvas = canvas;
    this._config = config;
    this._max = max;
    this._value = max;

    this._layer = canvas.newLayer('time-bar');
    this._ctx = this._layer.ctx;

    this._requireRender = true;
  }

  // -- public

  setMax (max) {
    this._max = max;
  }

  setValue (value) {
    this._value = value;
  }

  // -- AppObject API

  render (delta, timestamp) {
    const ctx = this._ctx;

    if (!this._requireRender) {
      return;
    }

    const ratio = 1 - (this._max - this._value) / this._max;

    const x = this._canvas.scaleValue(this._canvas.center.x - WIDTH / 2);
    const y = this._canvas.scaleValue(this._canvas.max.y * 0.05);
    const width = Math.round(WIDTH * ratio);
    const hue = Math.round(ratio * 100 + 30 * sin(timestamp * (1 - ratio)));
    const rect = [x, y, WIDTH, HEIGHT];
    const rect2 = [x + 1, y + 1, WIDTH - 2, HEIGHT - 2];
    const rect3 = [x + 2, y + 2, width - 4, HEIGHT - 4];

    ctx.clearRect(...rect);

    ctx.fillStyle = 'rgba(10, 10, 10, 0.5)';
    ctx.fillRect(...rect);
    ctx.strokeStyle = 'rgb(200, 200, 200)';
    ctx.strokeRect(...rect);
    ctx.fillStyle = 'hsl(' + hue + ',95%,60%)';
    ctx.fillRect(...rect3);
  }

  destroy () {
    this._canvas.destroyLayer(this._layer);
  }
}

export {
  TimeBar
};
