'use strict';

import { ObjCollection } from '../lib/ObjCollection';

const PADDING = 2;
const FONT_SIZE = 12;
const MIN_FONT_PIXELS = 12;
class Fps {
  constructor (canvas, config) {
    this._canvas = canvas;
    this._config = config;

    this._layer = canvas.newLayer('fps', {w: 500, h: 50}, {x: 100, y: 100}, 9000);
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
    const rect = [0, 0, PADDING * 2 + dim.width, PADDING * 2 + dim.actualBoundingBoxAscent + dim.actualBoundingBoxDescent];

    ctx.clearRect(0, 0, this._layer.size.w, this._layer.size.h);

    ctx.fillStyle = 'rgba(0,0,0,1)';
    ctx.fillRect(...rect);
    ctx.fillStyle = 'white';
    ctx.fillText(text, PADDING, PADDING - 1);
  }

  resize () {
    this._fontSize = this._canvas.scaleText(FONT_SIZE, MIN_FONT_PIXELS);

    const ctx = this._ctx;

    ctx.font = this._fontSize + 'px pixel';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
  }

  destroy () {
    this._canvas.destroyLayer(this._layer);
  }
}

export {
  Fps
};
