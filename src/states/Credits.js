'use strict';

import { ObjCollection } from '../../lib/ObjCollection';

class Credits {
  constructor (canvas, config) {
    this._canvas = canvas;
    this._config = config;

    this._layer = canvas.newLayer('credits');
    this._ctx = this._layer.ctx;

    var stateTranstions = {};

    this._on = false;
    this._color = {
      r: 0,
      g: 0,
      b: 0
    };
  }

  // -- public

  // -- AppObject API

  update (delta, timestamp) {
  }

  render (delta, timestamp) {
  }

  destroy () {
    this._layer.destroy();
  }
}

export {
  Credits
};
