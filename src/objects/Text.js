'use strict';

const PADDING = 10;
const DEFAULT_SIZE = 20;
const MIN_FONT_PIXELS = 9;
const DEFAULT_COLOR = 'rgb(230, 230, 230)';

class Text {
  constructor (layer, config) {
    this._layer = layer;
    this._ctx = layer.ctx;
    this._config = config;

    this._config.x = this._config.x || this._layer.center.x;
    this._config.y = this._config.y || this._layer.center.y;
    this._config.color = this._config.color || DEFAULT_COLOR;
    this._config.size = this._config.size || DEFAULT_SIZE;
    this._config.bgColor = this._config.bgColor;
    this._config.align = this._config.align || 'center';
    this._config.baseline = this._config.baseline || 'top';

    this._text = config.text;
    this._fontSize = null;
    this._pos = null;
    this._scaledPos = null;
    this._dim = null;

    this._hidden = false;
    this._requireRender = false;

    this.resize();
  }

  // -- private

  _formatText () {
    const ctx = this._ctx;

    ctx.font = this._fontSize + 'px pixel';
    ctx.textAlign = this._config.align;
    ctx.textBaseline = this._config.baseline;

    this._dim = this._ctx.measureText(this._text);
  }

  // -- api

  hide () {
    this._hidden = true;
    this._requireRender = true;
  }

  setText (text) {
    this._text = text;
    this.resize();
  }

  // -- AppObject API

  render (delta, timestamp) {
    if (!this._requireRender || this._hidden) {
      return;
    }
    this._requireRender = false;

    const ctx = this._ctx;
    const pos = this._layer.scalePoint(this._pos);

    this._formatText();

    ctx.clearRect(...this._rect);

    if (this._config.bgColor) {
      ctx.fillStyle = this._config.bgColor;
      ctx.fillRect(...this._rect);
    }

    ctx.fillStyle = this._config.color;
    ctx.fillText(this._text, pos.x, pos.y);
  }

  resize () {
    this._fontSize = this._layer.scaleText(this._config.size, MIN_FONT_PIXELS);
    this._pos = {
      x: this._config.x,
      y: this._config.y
    };

    const pos = this._layer.scalePoint(this._pos);

    this._formatText();

    let x = pos.x;
    const y = pos.y - PADDING;
    const width = Math.round(this._dim.width + 2 * PADDING);
    const height = this._fontSize + 2 * PADDING;

    if (this._config.align === 'center') {
      x -= Math.round(this._dim.width / 2 + PADDING);
    }
    if (this._config.align === 'right') {
      x -= Math.round(this._dim.width - PADDING * 2);
    }

    this._rect = [x, y, width, height];
    this._requireRender = true;
  }
}

export {
  Text
};
