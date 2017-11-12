'use strict';

import { ObjCollection } from '../../lib/ObjCollection';
import { ramp, sin, easeOutCubic, easeInCubic } from '../../lib/Maths';

const WIDTH = 40;
const PADDING = 4;
const FONT_SIZE = 40;
const MIN_FONT_PIXELS = 20;

class Deaths {
  constructor (canvas, config, number) {
    this._canvas = canvas;
    this._config = config;
    this._number = number;

    this._layer = canvas.newLayer('level-num');
    this._ctx = this._layer.ctx;

    this._maxFontSize = null;
    this._fontSize = null;

    this._dim = null;

    this._timestamp = null;

    this._requireRender = false;

    this.resize();
  }

  // -- public

  setNumber (value) {
    this._number = value;
    this._timestamp = null;
    this._requireRender = true;
    this.resize();
  }

  // -- AppObject API

  render (delta, timestamp) {
    const ctx = this._ctx;

    if (!this._requireRender) {
      return;
    }

    if (!this._timestamp) {
      this._timestamp = timestamp;
    }

    const x = this._canvas.scaleValue(this._canvas.max.x * 0.02);
    const y = this._canvas.scaleValue(this._canvas.max.y * 0.02);

    const dim = this._dim;
    const width = WIDTH + dim.width - 2;
    const height = this._fontSize - 3;
    const rect = [x - PADDING, y - PADDING, width + PADDING * 4, height + PADDING * 2 - 5];
    const rect1 = [rect[0] + 10, rect[1], 5, 25];
    const rect2 = [rect[0], rect[1] + 10, 25, 5];

    ctx.clearRect(...rect);

    ctx.fillStyle = 'rgba(10, 10, 10, 0.5)';
    ctx.fillRect(...rect);
    ctx.fillStyle = 'rgb(230, 230, 230)';
    ctx.fillText(this._number, x + WIDTH, y);
    ctx.fillText('x', x, y);
  }

  resize () {
    this._fontSize = this._canvas.scaleText(FONT_SIZE, MIN_FONT_PIXELS);
    this._maxFontSize = this._canvas.scaleText(100);

    const ctx = this._ctx;

    ctx.font = this._fontSize + 'px pixel';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    this._dim = this._ctx.measureText(this._number);
  }

  destroy () {
    this._canvas.destroyLayer(this._layer);

    window.clearTimeout(this._timeoutId);
  }
}

export {
  Deaths
};
