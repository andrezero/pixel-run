'use strict';

import { ObjCollection } from '../../lib/ObjCollection';
import { ramp, sin, easeOutCubic, easeInCubic } from '../../lib/Maths';

const PADDING = 4;
const FONT_SIZE = 40;
const MIN_FONT_PIXELS = 20;

class LevelNumber {
  constructor (layer, number, config) {
    this._layer = layer.newLayer('foooo-num', null, null, config.zIndex);
    this._ctx = this._layer.ctx;
    this._config = config;

    this._number = number;
    this._maxFontSize = null;
    this._fontSize = null;

    this._dim = null;

    this._timeoutId = 0;
    this._timestamp = null;

    this.resize();
  }

  // -- AppObject API

  render (delta, timestamp) {
    const ctx = this._ctx;

    if (!this._timestamp) {
      this._timestamp = timestamp;
    }

    const hue = Math.round(30 * sin(timestamp));

    const x = this._layer.scaleValue(this._layer.max.x * 0.98);
    const y = this._layer.scaleValue(this._layer.max.y * 0.02);

    const dim = this._dim;
    const width = dim.width - 2;
    const height = this._fontSize - 3;
    const rect = [x - width - PADDING, y - PADDING, width + PADDING * 4, height + PADDING * 2 - 3];

    ctx.clearRect(...rect);

    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(...rect);
    ctx.fillStyle = 'hsl(' + hue + ',95%,60%)';
    ctx.fillText('L' + this._number, x + PADDING, y);
  }

  resize () {
    this._fontSize = this._layer.scaleText(FONT_SIZE, MIN_FONT_PIXELS);
    this._maxFontSize = this._layer.scaleText(100);

    const ctx = this._ctx;

    ctx.font = this._fontSize + 'px pixel';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'top';

    this._dim = this._ctx.measureText('L' + this._number);
  }

  destroy () {
    this._layer.destroy();
    window.clearTimeout(this._timeoutId);
  }
}

export {
  LevelNumber
};
