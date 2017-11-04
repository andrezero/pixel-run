'use strict';

import { makeEmitter, emitterMixin } from './emitter';

const ABSOLUTE = 'absolute';
const CLASS_NAME = 'x-canvas-layer';

class Layer {
  constructor (canvas, name, size, position, zIndex, virtual) {
    this._canvas = canvas;

    this.name = name;
    this.size = size;
    this.position = position;
    this.virtual = virtual;

    this.element = document.createElement('canvas');
    if (size) {
      this.element.width = canvas.scaleValue(size.w);
      this.element.height = canvas.scaleValue(size.h);
    } else {
      this.element.width = canvas.width;
      this.element.height = canvas.height;
    }
    if (position) {
      this.element.style.left = canvas.scaleValue(position.w);
      this.element.style.top = canvas.scaleValue(position.h);
    }
    if (zIndex) {
      this.element.style.zIndex = zIndex;
    }
    this.element.classList.add(CLASS_NAME);
    this.element.setAttribute('data-x-layer', name);
    this.ctx = this.element.getContext('2d');

    if (!virtual) {
      this._canvas._scaler.appendChild(this.element);
      this.element.style.position = ABSOLUTE;
    }
  }

  // -- api

  getDrawingRect () {
    return {
      data: this._canvas.toDataURL()
    };
  }

  resize () {
    let canvas = this._canvas;
    let size = this.size;
    let position = this._position;
    if (size) {
      this.element.width = canvas.scaleValue(size.w);
      this.element.height = canvas.scaleValue(size.h);
    } else {
      this.element.width = canvas.width;
      this.element.height = canvas.height;
    }
    if (position) {
      this.element.style.left = canvas.scaleValue(position.w);
      this.element.style.top = canvas.scaleValue(position.h);
    }
  }

  destroy () {
    this._canvas.purgeLayer(this);
    this.destroyed = true;
    this.element.remove();
    this.element = null;
    this._canvas = null;
  }
}

export {
  Layer
};
