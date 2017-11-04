'use strict';

import { isString } from './util';
import { makeEmitter, emitterMixin } from './emitter';

import { Layer } from './Layer';

const MODE_CONTAIN = 'contain';
const MODE_COVER = 'cover';
const VALID_MODES = [MODE_CONTAIN, MODE_COVER];
const WRAPPER_CLASS_NAME = 'x-canvas-wrapper';
const CANVAS_CLASS_NAME = 'x-canvas-main';
const PX = 'px';
const ABSOLUTE = 'absolute';
const RELATIVE = 'relative';
const NONE = 'none';
const BLOCK = 'block';

class Canvas {
  constructor (container, config) {
    this._container = container;
    config = config || {};
    this.ratio = config.ratio || 4 / 3;
    this.scaleAxis = config.scaleAxis || 'width';
    this.mode = config.mode || Canvas.MODE_CONTAIN;
    this.maxPixels = config.maxPixels || 800 * 600;

    if (!this.mode) {
      this.mode = VALID_MODES[0];
    } else if (VALID_MODES.indexOf(this.mode) === -1) {
      throw new Error('Invalid mode "' + this.mode + '"');
    }

    this._emitter = makeEmitter();
    emitterMixin(this, this._emitter);

    this._layers = [];
    this._layersByName = {};
    this._highestZ = 0;

    this.wrapper = document.createElement('div');
    this.wrapper.classList.add(WRAPPER_CLASS_NAME);
    this._container.appendChild(this.wrapper);
    this._element = document.createElement('canvas');
    this._element.classList.add(CANVAS_CLASS_NAME);
    this.wrapper.appendChild(this._element);
    this.ctx = this._element.getContext('2d');

    this.resize();
  }

  static get MODE_COVER () {
    return MODE_COVER;
  }

  static get MODE_CONTAIN () {
    return MODE_CONTAIN;
  }

  // - layers

  newLayer (name, size, position, zIndex, virtual) {
    const layer = new Layer(this, name, size, position, zIndex, virtual);
    this._layers.push(layer);
    return layer;
  }

  newVirtualLayer (name, size, position, zIndex) {
    return this.newLayer(name, size, position, zIndex, true);
  }

  purgeLayer (layer) {
    const index = this._layers.indexOf(layer);
    if (index !== -1) {
      this._layers.splice(index, 1);
    }
  }
  destroyLayer (layer) {
    layer.destroy();
    this.purgeLayer(layer);
  }

  // -- size

  // 800 / 450 > 1.7777 (ratio)
  // 800 / 600 > 1.3333 (aspect ratio)

  resize () {
    this.wrapper.style.display = NONE;

    const clientWidth = this._container.clientWidth;
    const clientHeight = this._container.clientHeight;

    const clientRatio = clientWidth / clientHeight;
    const horizontallyBound = clientRatio < this.ratio;

    let width;
    let height;
    let scale;
    let transform;

    this.offset = { x: 0, y: 0 };
    this.min = { x: 0, y: 0 };
    this.max = { x: 1000, y: 1000 };

    function applyMaxPixels (width, height, maxPixels, ratio) {
      const numPixels = width * height;
      if (numPixels > maxPixels) {
        width = Math.ceil(Math.sqrt(maxPixels * ratio));
        height = Math.ceil(width / ratio);
      }
      return {
        width, height
      };
    }

    if (this.mode === MODE_CONTAIN) {
      if (horizontallyBound) {
        // black bar top/bottom
        width = clientWidth;
        height = Math.round(width / this.ratio);
      } else {
        // black bar left/right
        height = clientHeight;
        width = Math.round(height * this.ratio);
      }
      scale = (this.scaleAxis === 'width') ? width / 1000 : height / 1000;
    } else {
      width = clientWidth;
      height = clientHeight;
      this.ratio = width / height;
    }
    ({width, height} = applyMaxPixels(width, height, this.maxPixels, this.ratio));
    // the if is irrelevant when mode is cover
    if (horizontallyBound) {
      transform = clientWidth / width;
    } else {
      transform = clientHeight / height;
    }

    if (this.scaleAxis === 'width') {
      scale = width / 1000;
      this.max.y = 1000 / this.ratio;
    } else {
      scale = height / 1000;
      this.max.x = 1000 * this.ratio;
    }

    this.wrapper.style.display = BLOCK;
    this.wrapper.style.width = width + PX;
    this.wrapper.style.height = height + PX;
    this.wrapper.style.position = RELATIVE;
    this.ctx.canvas.width = width;
    this.ctx.canvas.height = height;
    this.ctx.canvas.style.position = ABSOLUTE;

    if (transform) {
      this.wrapper.style.transform = 'scale(' + transform + ', ' + transform + ')';
    }

    this.width = width;
    this.height = height;
    this.scale = scale;
    this.transform = transform;

    this.center = {x: Math.round(this.max.x / 2), y: Math.round(this.max.y / 2)};

    for (var ix = 0; ix < this._layers.length; ix++) {
      this._layers[ix].resize();
    }
  }

  scaleValue (val) {
    return Math.round(this.scale * val);
  }

  scalePoint (pos) {
    return {
      x: Math.round(this.scale * pos.x),
      y: Math.round(this.scale * pos.y)
    };
  }

  scaleSize (size) {
    return {
      w: Math.round(this.scale * size.x),
      h: Math.round(this.scale * size.y)
    };
  }

  scaleArray (arr) {
    return arr.map((value) => Math.round(this.scale * value));
  }

  clear () {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  destroy () {
    this._emitter.destroy();
    this._layers.forEach((layer) => layer.destroy());
    this.wrapper.remove();
    this.wrapper = null;
    this._element.remove();
    this._element = null;
  }
}

export {
  Canvas
};
