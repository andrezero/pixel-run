'use strict';

import { ObjCollection } from '../lib/ObjCollection';

const PADDING = 3;
const FONT_SIZE = 15;
const MIN_FONT_PIXELS = 10;
class Fps {
  constructor (canvas, config) {
    this._canvas = canvas;
    this._config = config;

    this._layer = canvas.newLayer('fps', { w: 90, h: 35 }, {x: 10, y: this._canvas.max.y - 35}, 9000);
    this._ctx = this._layer.ctx;

    this._rect = null;
    this._fontSize = null;

    this._fps = 0;
    this._frameTs = null;
    this._frameCount = 0;

    this.resize();
  }

  // -- AppObject API

  render (delta, timestamp) {
    const ctx = this._ctx;

    this._frameCount++;
    this._frameTs = this._frameTs || timestamp;
    const seconds = Math.floor((timestamp - this._frameTs) / 1000);
    if (seconds > 0) {
      this._frameTs = timestamp;
      this._fps = this._frameCount / seconds;
      this._frameCount = 0;
    }

    const text = '' + this._fps.toFixed(1);

    const dim = this._ctx.measureText(text);
    const rect = [0, 0, 2 * PADDING + dim.width, this._fontSize + 2 * PADDING];

    ctx.clearRect(...(this._lastRect || rect));

    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillRect(...rect);
    ctx.fillStyle = 'white';
    ctx.fillText(text, PADDING - 2, PADDING + 2);

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
  }

  destroy () {
    this._layer.destroy();
  }
}

export {
  Fps
};
