'use strict';

import { ObjCollection } from '../../lib/ObjCollection';
import { sin, PI_3Q } from '../../lib/Maths';

const PADDING = 10;
const FONT_SIZE = 25;
const MIN_FONT_PIXELS = 9;

class Menu {
  constructor (canvas, options) {
    this._canvas = canvas;

    this._layer = canvas.newLayer('player');
    this._ctx = this._layer.ctx;

    this._fontSize = null;
    this._text = options.join(' : ');
    this._bgColor = 'rgba(0,0,0,0.5)';
    this._color = 'rgb(230, 230, 230)';

    this._pos = {
      x: this._canvas.max.x,
      y: this._canvas.max.y * 0.05
    };

    this._dim = null;

    this._pauseTimestamp = null;

    this.resize();
  }

  // -- private

  // -- api

  // -- AppObject API

  update (delta, timestamp) {
    if (!this._pauseTimestamp) {
      this._pos.x = this._pos.x - delta / 1.5;
    }

    if (!this._pauseTimestamp && this._pos.x < this._canvas.center.x - this._canvas.normalValue(this._dim.width) / 2) {
      this._pos.x = this._canvas.center.x - this._canvas.normalValue(this._dim.width) / 2;
      this._pauseTimestamp = timestamp;
    }
  }

  render (delta, timestamp) {
    const ctx = this._ctx;
    const canvas = this._canvas;

    const dim = this._dim;

    const x = this._pos.x;
    const y = this._pos.y;

    const width = canvas.normalValue(dim.width) + 2 * PADDING;
    const height = canvas.normalValue(this._fontSize) + 2 * PADDING;
    const rect = canvas.scaleArray([x - PADDING, y - PADDING, width, height]);

    ctx.clearRect(...(this._lastRect || rect));

    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(...rect);
    ctx.fillStyle = this._color;
    ctx.fillText(this._text, canvas.scaleValue(x), canvas.scaleValue(y));

    this._lastRect = rect;
    this._lastRect[2] += 2;
    this._lastRect[3] += 2;
  }

  resize () {
    this._fontSize = this._canvas.scaleText(FONT_SIZE, MIN_FONT_PIXELS);

    const ctx = this._ctx;

    ctx.font = this._fontSize + 'px pixel';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);

    this._dim = this._ctx.measureText(this._text);
  }

  destroy () {
    this._canvas.destroyLayer(this._layer);
  }
}

export {
  Menu
};
