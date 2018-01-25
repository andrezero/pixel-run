'use strict';

import { ObjCollection } from './ObjCollection';
import { makeEmitter, emitterMixin } from './emitter';

const PADDING = 10;
const DEFAULT_SIZE = 20;
const MIN_FONT_PIXELS = 9;
const DEFAULT_COLOR = 'rgb(230, 230, 230)';

class Interactive {
  constructor (layer, collisionFn, cursorStyle, cursorFn) {
    this._layer = layer;

    this._emitter = makeEmitter();
    emitterMixin(this, this._emitter);

    this._down = (event) => {
      this._emitter.emit('down', event);
    };

    this._up = (event) => {
      this._emitter.emit('up', event);
    };

    this._tap = (event) => {
      this._emitter.emit('tap', event);
    };

    this._over = (event) => {
      this._emitter.emit('over', event);
    };

    this._out = (event) => {
      this._emitter.emit('out', event);
    };

    this._layer.surface.on('down', this._down, collisionFn);
    this._layer.surface.on('up', this._up, collisionFn);
    this._layer.surface.on('tap', this._tap, collisionFn);
    this._layer.surface.on('over', this._over, collisionFn);
    this._layer.surface.on('out', this._out, collisionFn);

    if (cursorStyle || cursorFn) {
      cursorFn = cursorFn || collisionFn;
      this._layer.surface.cursor('pointer', cursorFn);
    }
  }

  // -- AppObject API

  destroy () {
    this._emitter.destroy();
  }
}

export {
  Interactive
};
