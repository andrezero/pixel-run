'use strict';

import { ObjCollection } from '../../lib/ObjCollection';
import { sin, PI_3Q } from '../../lib/Maths';

const DEFAULT_SPEED = 1;
const WIDTH = 10;

class Wall {
  constructor (layer, speed, config) {
    this._layer = layer;
    this._ctx = layer.ctx;
    this._config = config;

    this._objects = new ObjCollection();

    this._speed = speed || DEFAULT_SPEED;
    this._color = config.color || 'red';
    this._grow = config.grow;
    this._freq = config.freq;
    this._phase = config.phase || 0;

    this.size = { w: config.w || WIDTH, h: config.h };
    this.pos = { x: config.x };

    this._minSize = this.size.h;
    this._maxSize = this._minSize + config.grow;

    this._timestamp = null;

    if (this._config.pos === 'top') {
      this.pos.y = 0;
    } else {
      this.pos.y = this._layer.max.y - this.size.h;
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

      this.size.h = Math.round(sin(time * this._freq * this._speed, this._minSize, this._maxSize, this._phase));
      if (this._config.pos === 'bottom') {
        this.pos.y = this._layer.max.y - this.size.h;
      }
    }
  }

  render (delta, timestamp) {
    const rect = this._layer.scaleArray([this.pos.x, this.pos.y, this.size.w, this.size.h]);
    this._ctx.fillStyle = this._color;
    this._ctx.fillRect(...rect);
  }
}

export {
  Wall
};
