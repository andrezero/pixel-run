const ABSOLUTE = 'absolute';
const CLASS_NAME = 'x-canvas-layer';

const EXPOSED_CANVAS_METHODS = ['newLayer', 'newVirtualLayer', 'purgeLayer', 'scaleValue', 'normalValue', 'scaleText', 'scalePoint', 'scalePath', 'scaleSize', 'scaleArray'];
const EXPOSED_CANVAS_PROPS = ['surface', 'pixelRatio', 'scale', 'transform', 'center', 'offset', 'min', 'max'];

class Layer {
  constructor (canvas, name, size, position, zIndex) {
    this._canvas = canvas;

    this.name = name;
    this.size = size = size || {};
    this.position = position;
    this.zIndex = zIndex;

    this.size.w = size.w ? canvas.scaleValue(size.w) : canvas.width;
    this.size.h = size.h ? canvas.scaleValue(size.h) : canvas.height;

    this._element = document.createElement('canvas');
    this._element.classList.add(CLASS_NAME);
    this._element.setAttribute('data-x-layer', name);
    this.ctx = this._element.getContext('2d');

    EXPOSED_CANVAS_METHODS.forEach((method) => {
      this[method] = canvas[method].bind(canvas);
    });
    EXPOSED_CANVAS_PROPS.forEach((prop) => {
      Object.defineProperty(this, prop, { get: () => canvas[prop] });
    });

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
    this._element.width = size.w;
    this._element.height = size.h;
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
