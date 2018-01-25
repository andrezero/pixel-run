'use strict';

import { ObjCollection } from '../../lib/ObjCollection';
import { sin, PI_3Q } from '../../lib/Maths';

const DEFAULT_SIZE = 90;

class Header {
  constructor (layer, config) {
    this._layer = layer;
    this._ctx = layer.ctx;
    this._config = config;

    this._config.y = this._config.y || this._layer.center.y;
    this._config.size = this._config.size || DEFAULT_SIZE;

    this._text = config.text;
    this._fontSize = null;
    this._pos = null;
    this._scaledPos = null;

    this._skip = 3;
    this._skipped = 0;
    this._iteration = 0;

    this.resize();

    this._scheduleSlowDown();
  }

  _scheduleSlowDown () {
    this._slowDown = false;
    window.clearTimeout(this._timeoutId);
    this._timeoutId = window.setTimeout(() => {
      this._slowDown = true;
    }, 500);
  }

  // -- private

  // -- api

  // -- AppObject API

  render (delta, timestamp) {
    const ctx = this._ctx;
    const canvas = this._layer;

    if (this._slowDown && this._skipped++ < this._skip) {
      return;
    }

    ctx.font = this._fontSize + 'px pixel';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    this._skipped = 0;
    this._iteration += this._slowDown ? 5 : 55;

    const iteration = this._iteration;

    const pos = this._layer.scalePoint(this._pos);
    const slowDown = this._slowDown;

    let x = canvas.scaleValue(Math.cos(iteration * (slowDown ? 5 : 50)) * 5) + pos.x;
    let y = canvas.scaleValue(Math.sin(iteration * (slowDown ? 5 : 50)) * 5) + pos.y;
    const alpha = slowDown ? 0.6 : 0.9;
    ctx.shadowBlur = slowDown ? 4 : 2;
    ctx.shadowColor = 'hsl(40,50%,50%)';
    ctx.fillStyle = 'hsla(' + iteration * 3 % 100 + ',99%,50%,' + alpha + ')';
    ctx.fillText(this._text, Math.round(x), Math.round(y));

    x = Math.cos(iteration * (slowDown ? 1 : 5)) * (slowDown ? 0.7 : 5) + pos.x;
    y = pos.y;
    ctx.fillStyle = 'black';
    ctx.fillText(this._text, Math.round(x), Math.round(y));
  }

  resize () {
    this._fontSize = this._layer.scaleText(this._config.size);
    this._pos = {
      x: this._layer.center.x,
      y: this._config.y
    };
  }

  destroy () {
    window.clearTimeout(this._timeoutId);
  }
}

export {
  Header
};
