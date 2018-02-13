import { isString } from './util';

import { Surface } from './Surface';
import { Layer } from './Layer';

const MODE_CONTAIN = 'contain';
const MODE_COVER = 'cover';
const VALID_MODES = [MODE_CONTAIN, MODE_COVER];
const ROOT_CLASS_NAME = 'x-canvas';
const SIZER_CLASS_NAME = 'x-canvas-size';
const SCALER_CLASS_NAME = 'x-canvas-scale';
const CANVAS_CLASS_NAME = 'x-canvas-main';
const PX = 'px';
const PC_100 = '100%';
const DIV = 'div';
const CANVAS = 'canvas';
const FLEX = 'flex';
const CENTER = 'center';
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

    this.pixelRatio = null;
    this.width = null;
    this.height = null;
    this.scale = null;
    this.transform = null;
    this.center = null;
    this.offset = null; // @todo
    this.min = null;
    this.max = null;

    if (!this.mode) {
      this.mode = VALID_MODES[0];
    } else if (VALID_MODES.indexOf(this.mode) === -1) {
      throw new Error('Invalid mode "' + this.mode + '"');
    }

    this._layers = [];
    this._layersByName = {};

    container.style.width = PC_100;
    container.style.height = PC_100;

    const root = document.createElement(DIV);
    root.classList.add(ROOT_CLASS_NAME);
    root.style.display = FLEX;
    root.style.alignItems = CENTER;
    root.style.justifyContent = CENTER;
    root.style.width = PC_100;
    root.style.height = PC_100;
    container.appendChild(root);
    this._root = root;

    const sizer = document.createElement(DIV);
    sizer.classList.add(SIZER_CLASS_NAME);
    root.appendChild(sizer);
    this._sizer = sizer;

    const scaler = document.createElement(DIV);
    scaler.classList.add(SCALER_CLASS_NAME);
    sizer.appendChild(scaler);
    this._scaler = scaler;

    this.surface = new Surface(this);
    scaler.appendChild(this.surface._element);

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
    const layer = new Layer(this, name, size, position, zIndex);
    this._layers.push(layer);
    if (!virtual) {
      this._scaler.appendChild(layer._element);
    }

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

  // -- size

  // 800 / 450 > 1.7777 (ratio)
  // 800 / 600 > 1.3333 (aspect ratio)

  resize () {
    const sizer = this._sizer;
    const scaler = this._scaler;

    sizer.style.width = '';
    sizer.style.height = '';
    scaler.style.display = NONE;
    scaler.style.width = '';
    scaler.style.height = '';
    scaler.style.transform = '';

    this.pixelRatio = window.devicePixelRatio || 1;

    const clientWidth = this._container.clientWidth;
    const clientHeight = this._container.clientHeight;

    const clientRatio = clientWidth / clientHeight;
    const horizontallyBound = clientRatio < this.ratio;

    let cWidth;
    let cHeight;
    let width;
    let height;
    let scale;
    let transform;

    // this.offset = { x: 0, y: 0 };
    let min = { x: 0, y: 0 };
    let max = { x: 1000, y: 1000 };

    const applyMaxPixels = (width, height, maxPixels, ratio) => {
      const numPixels = width * height;
      if (numPixels > maxPixels) {
        width = Math.ceil(Math.sqrt(maxPixels * ratio));
        height = Math.ceil(width / ratio);
      }
      return {
        width, height
      };
    };

    if (this.mode === MODE_CONTAIN) {
      if (horizontallyBound) {
        // black bar top/bottom
        cWidth = clientWidth;
        cHeight = Math.round(cWidth / this.ratio);
      } else {
        // black bar left/right
        cHeight = clientHeight;
        cWidth = Math.round(cHeight * this.ratio);
      }
    } else {
      cWidth = clientWidth;
      cHeight = clientHeight;
      this.ratio = cWidth / cHeight;
    }

    ({width, height} = applyMaxPixels(cWidth * this.pixelRatio, cHeight * this.pixelRatio, this.maxPixels, this.ratio));
    scale = (this.scaleAxis === 'width') ? width / 1000 : height / 1000;
    // the if is irrelevant when mode is cover
    if (horizontallyBound) {
      transform = clientWidth / width;
    } else {
      transform = clientHeight / height;
    }

    if (this.scaleAxis === 'width') {
      scale = width / 1000;
      max.y = 1000 / this.ratio;
    } else {
      scale = height / 1000;
      max.x = 1000 * this.ratio;
    }

    sizer.style.width = cWidth + PX;
    sizer.style.height = cHeight + PX;

    scaler.style.display = BLOCK;
    scaler.style.width = width + PX;
    scaler.style.height = height + PX;
    scaler.style.position = RELATIVE;

    if (transform) {
      scaler.style.transform = 'scale(' + transform + ', ' + transform + ')';
      scaler.style.transformOrigin = 'top left';
    }

    this.width = width;
    this.height = height;
    this.scale = scale;
    this.transform = transform;
    this.center = {x: Math.round(max.x / 2), y: Math.round(max.y / 2)};
    this.offset = {x: this._scaler.offsetLeft, y: this._scaler.offsetTop};

    this.min = min;
    this.max = max;

    this.surface.resize();

    for (var ix = 0; ix < this._layers.length; ix++) {
      this._layers[ix].resize();
    }
  }

  scaleValue (val) {
    return Math.round(this.scale * (val + 1));
  }

  normalValue (val) {
    return Math.round(val / this.scale);
  }

  scaleText (val, min = 0) {
    return Math.max(Math.round(this.scale * val), min / this.transform);
  }

  scalePoint (point) {
    return {
      x: Math.round(this.scale * (point.x + 1)),
      y: Math.round(this.scale * (point.y + 1))
    };
  }

  scalePath (path) {
    return path.map((point) => this.scalePoint(point));
  }

  scaleSize (size) {
    return {
      w: Math.round(this.scale * (size.w + 1)),
      h: Math.round(this.scale * (size.h + 1))
    };
  }

  scaleArray (arr) {
    return arr.map((val) => Math.round(this.scale * (val + 1)));
  }

  destroy () {
    this.surface.destroy();
    this._layers.forEach((layer) => layer.destroy());
    this._root.remove();
  }
}

export {
  Canvas
};
