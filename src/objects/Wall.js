'use strict';

import { ObjCollection } from '../../lib/ObjCollection';
import { sin, PI_3Q } from '../../lib/Maths';

var WIDTH = 10;

class Wall {
  constructor (canvas, config) {
    this._canvas = canvas;
    this._config = config;

    this._ctx = canvas.ctx;

    this._objects = new ObjCollection();

    this._color = config.color || 'red';

    this.size = {w: config.w || WIDTH, h: config.h};
    this.pos = {x: config.x};

    this._minSize = this.size.h;
    this._start = config.start || 0;
    this._grow = config.grow;
    this._freq = config.freq;
    this._maxSize = this._minSize + config.grow;

    this._timestamp = null;

    if (this._config.pos === 'top') {
      this.pos.y = 0;
    } else {
      this.pos.y = this._canvas.max.y - this.size.h;
    }
  }

  // -- private

  // -- api

  // -- AppObject API

  update (delta, timestamp) {
    if (!this._timestamp) {
      this._timestamp = timestamp;
    }

    if (this._grow) {
      const time = this._timestamp - timestamp;

      this.size.h = Math.round(sin(time, this._freq, this._minSize, this._maxSize));
      if (this._config.pos === 'bottom') {
        this.pos.y = this._canvas.max.y - this.size.h;
      }
    }
  }

  render (delta, timestamp) {
    const rect = this._canvas.scaleArray([this.pos.x, this.pos.y, this.size.w, this.size.h]);
    this._ctx.fillStyle = this._color;
    this._ctx.fillRect(...rect);
  }

  destroy () {
    this._canvas = null;
    this._ctx = null;
    this._onDieCallback = null;

    this._objects.destroyAll();
  }
}

export {
  Wall
};
