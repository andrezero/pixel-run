'use strict';

import { ObjCollection } from '../../lib/ObjCollection';

var WIDTH = 10;
var HEIGHT = 50;
var Y_SPEED = 80;

class Drop {
  constructor (canvas, config) {
    this._canvas = canvas;
    this._config = config;

    this._ctx = canvas.ctx;

    this._objects = new ObjCollection();

    this._pos = {
      x: Math.random() * 1000,
      y: -HEIGHT / 2
    };

    this._onDieCallback = null;
  }

  // -- private

  // -- api

  // - callbacks

  onDie (onDieCallback) {
    this._onDieCallback = onDieCallback;
  }

  // -- AppObject API

  update (delta, timestamp) {
    this._pos.y = this._pos.y + Y_SPEED;
    if (this._pos.y > 1000) {
      this._onDieCallback();
    }
  }

  render (delta, timestamp) {
    const rect = this._canvas.scaleArray([this._pos.x, this._pos.y, WIDTH, HEIGHT]);
    this._ctx.fillStyle = 'rgb(255,0,0)';
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
  Drop
};
