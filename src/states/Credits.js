'use strict';

import { ObjCollection } from '../../lib/ObjCollection';

class Credits {
  constructor (layer, config) {
    this._layer = layer.newLayer('credits');
    this._ctx = this._layer.ctx;
    this._config = config;

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
