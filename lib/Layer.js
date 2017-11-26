'use strict';

import { makeEmitter, emitterMixin } from './emitter';

const ABSOLUTE = 'absolute';
const CLASS_NAME = 'x-canvas-layer';

class Layer {
  constructor (canvas, name, size, position, zIndex) {
    this._canvas = canvas;

    this.name = name;
    this.size = size;
    this.position = position;
    this.zIndex = zIndex;

    this._element = document.createElement('canvas');
    this._element.classList.add(CLASS_NAME);
    this._element.setAttribute('data-x-layer', name);
    this.ctx = this._element.getContext('2d');

    this.resize();
  }

  // -- api

  getDrawingRect () {
    return {
      data: this._element.toDataURL()
    };
  }

  clear () {
    this.ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
  }

  resize () {
    let canvas = this._canvas;
    let size = this.size;
    let position = this.position || {x: 0, y: 0};
    let zIndex = this.zIndex;
    if (size) {
      this._element.width = canvas.scaleValue(size.w);
      this._element.height = canvas.scaleValue(size.h);
    } else {
      this._element.width = canvas.width;
      this._element.height = canvas.height;
    }

    this._element.style.position = ABSOLUTE;
    this._element.style.left = canvas.scaleValue(position.x) + 'px';
    this._element.style.top = canvas.scaleValue(position.y) + 'px';

    if (zIndex) {
      this._element.style.zIndex = zIndex;
    }
  }

  destroy () {
    this._canvas.purgeLayer(this);
    this._element.remove();
  }
}

export {
  Layer
};
