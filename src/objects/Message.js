'use strict';

import { ObjCollection } from '../../lib/ObjCollection';
import { sin, PI_3Q } from '../../lib/Maths';

const PADDING = 10;
const FONT_SIZE = 20;
const MIN_FONT_PIXELS = 12;

class Message {
  constructor (canvas, config) {
    this._canvas = canvas;
    this._config = config;

    this._text = config.text;

    this._layer = canvas.newLayer('player');
    this._ctx = this._layer.ctx;

    this._fontSize = null;
    this._bgColor = config.bgColor || 'rgba(0,0,0,0.4)';
    this._color = config.color || 'white';

    this._pos = null;
    this._scaledPos = null;
    this._dim = null;

    this._requireRender = false;

    this.resize();
  }

  // -- private

  // -- api

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
    const y = pos.y - 10;
    const width = dim.width + 20;
    const height = dim.actualBoundingBoxAscent + dim.actualBoundingBoxDescent + 20;
    const rect = [x, y, width, height];

    ctx.fillStyle = this._bgColor;
    ctx.fillRect(...rect);
    ctx.fillStyle = this._color;
    ctx.fillText(this._text, pos.x, pos.y);
  }

  resize () {
    this._fontSize = this._canvas.scaleText(FONT_SIZE, MIN_FONT_PIXELS);
    this._pos = {
      x: this._canvas.center.x,
      y: this._canvas.max.y * 0.85
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
