'use strict';

import { ObjCollection } from '../../lib/ObjCollection';
import { sin, PI_3Q } from '../../lib/Maths';

const PADDING = 10;
const DEFAULT_SIZE = 20;
const MIN_FONT_PIXELS = 9;

class Message {
  constructor (canvas, config) {
    this._canvas = canvas;
    this._config = config;

    this._config.y = this._config.y || this._canvas.center.y;
    this._config.size = this._config.size || DEFAULT_SIZE;

    this._text = config.text;

    this._layer = canvas.newLayer('player');
    this._ctx = this._layer.ctx;

    this._fontSize = null;
    this._bgColor = config.bgColor || 'rgba(0,0,0,0.4)';
    this._color = config.color || 'rgb(230, 230, 230)';
    this._pos = null;
    this._scaledPos = null;
    this._dim = null;

    this._hidden = false;
    this._requireRender = false;

    this.resize();
  }

  // -- private

  // -- api

  hide () {
    this._hidden = true;
    this._requireRender = true;
  }

  // -- AppObject API

  render (delta, timestamp) {
    if (!this._requireRender) {
      return;
    }
    this._requireRender = false;
    const ctx = this._ctx;

    const pos = this._scaledPos;
    const dim = this._dim;

    const x = pos.x - dim.width / 2 - PADDING;
    const y = pos.y - PADDING;
    const width = dim.width + 2 * PADDING;
    const height = this._fontSize + 2 * PADDING;
    const rect = [x, y, width, height];

    ctx.clearRect(...rect);

    if (!this._hidden) {
      ctx.fillStyle = this._bgColor;
      ctx.fillRect(...rect);
      ctx.fillStyle = this._color;
      ctx.fillText(this._text, pos.x, pos.y);
    }
  }

  resize () {
    this._fontSize = this._canvas.scaleText(this._config.size, MIN_FONT_PIXELS);
    this._pos = {
      x: this._canvas.center.x,
      y: this._config.y
    };

    const ctx = this._ctx;

    ctx.font = this._fontSize + 'px pixel';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    this._scaledPos = this._canvas.scalePoint(this._pos);
    this._dim = this._ctx.measureText(this._text);

    this._requireRender = true;
  }

  destroy () {
    this._canvas.destroyLayer(this._layer);
  }
}

export {
  Message
};
