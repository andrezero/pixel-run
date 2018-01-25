'use strict';

const PADDING = 10;
const FONT_SIZE = 25;
const MIN_FONT_PIXELS = 9;

class Menu {
  constructor (layer, options) {
    this._layer = layer.newLayer('menu');
    this._ctx = this._layer.ctx;

    this._fontSize = null;
    this._text = options.join(' : ');
    this._bgColor = 'rgba(0,0,0,0.5)';
    this._color = 'rgb(230, 230, 230)';

    this._pos = {
      x: this._layer.max.x,
      y: this._layer.max.y * 0.05
    };

    this._dim = null;

    this._pauseTimestamp = null;

    this.resize();
  }

  // -- private

  _formatText () {
    const ctx = this._ctx;

    ctx.font = this._fontSize + 'px pixel';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    this._dim = this._ctx.measureText(this._text);
  }

  // -- api

  // -- AppObject API

  update (delta, timestamp) {
    if (!this._pauseTimestamp) {
      this._pos.x = this._pos.x - delta / 1.5;
    }

    if (!this._pauseTimestamp && this._pos.x < this._layer.center.x - this._layer.normalValue(this._dim.width) / 2) {
      this._pos.x = this._layer.center.x - this._layer.normalValue(this._dim.width) / 2;
      this._pauseTimestamp = timestamp;
    }
  }

  render (delta, timestamp) {
    const ctx = this._ctx;

    const dim = this._dim;

    const x = this._pos.x;
    const y = this._pos.y;

    const width = this._layer.normalValue(dim.width) + 2 * PADDING;
    const height = this._layer.normalValue(this._fontSize) + 2 * PADDING;
    const rect = this._layer.scaleArray([x - PADDING, y - PADDING, width, height]);

    ctx.clearRect(...(this._lastRect || rect));

    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(...rect);

    this._formatText();
    ctx.fillStyle = this._color;
    ctx.fillText(this._text, this._layer.scaleValue(x), this._layer.scaleValue(y));

    this._lastRect = rect;
    this._lastRect[2] += 2;
    this._lastRect[3] += 2;
  }

  resize () {
    this._fontSize = this._layer.scaleText(FONT_SIZE, MIN_FONT_PIXELS);

    this._formatText();
    this._dim = this._ctx.measureText(this._text);
  }

  destroy () {
    this._layer.destroy();
  }
}

export {
  Menu
};
