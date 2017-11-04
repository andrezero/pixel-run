'use strict';

import { ObjCollection } from '../lib/ObjCollection';

const GAME_OVER_SEC = 1000;

class Fps {
  constructor (canvas, config) {
    this._canvas = canvas;
    this._config = config;

    this._layer = canvas.newLayer('fps', {w: 50, h: 40}, {x: 100, y: 100}, 9000);
    this._ctx = this._layer.ctx;

    this._rect = canvas.scaleArray([0, 0, 50, 40]);
    this._fontSize = canvas.scaleValue(25);
    this._fontPos = canvas.scaleArray([5, 25]);

    this._fps = 0;
    this._frameTs = null;
    this._frameCount = 0;
  }

  // -- AppObject API

  render (delta, timestamp) {
    this._frameCount++;
    this._frameTs = this._frameTs || timestamp;
    const seconds = Math.floor((timestamp - this._frameTs) / 1000);
    if (seconds > 0) {
      this._frameTs = timestamp;
      this._fps = this._frameCount / seconds;
      this._frameCount = 0;
    }

    this._ctx.font = this._fontSize + 'px arial';
    this._ctx.fillStyle = 'rgba(0,0,0,0.5)';
    this._ctx.fillRect(...this._rect);
    this._ctx.fillStyle = 'white';
    this._ctx.fillText('' + this._fps, ...this._fontPos);
  }

  destroy () {
    this._canvas.destroyLayer(this._layer);
  }
}

export {
  Fps
};
