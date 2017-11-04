'use strict';

// http://thecodeplayer.com/walkthrough/matrix-rain-animation-html5-canvas-javascript

import { ObjCollection } from '../../lib/ObjCollection';

const RANDOM_HEIGHT = 20;
const COLUMNS = 40;
const DISTANCE = 3;
const BOX_PADDING = 15;
const FADE = 0.9;

class Intro {
  constructor (canvas, config) {
    this._canvas = canvas;
    this._config = config;

    this._layer = canvas.newLayer('intro');
    this._ctx = this._layer.ctx;

    this._auxLayer = canvas.newVirtualLayer('intro-aux');
    this._auxCtx = this._auxLayer.ctx;

    this._columns = COLUMNS;
    this._size = Math.round(1000 / this._columns);

    this._slowDown = false;

    this.resize();

    this._scheduleSlowDown();
  }

  _scheduleSlowDown () {
    this._slowDown = false;
    window.clearTimeout(this._timeoutId);
    this._timeoutId = window.setTimeout(() => {
      this._slowDown = true;
    }, 1000);
  }

  // -- api

  // -- AppObject API

  update (delta, timestamp) {
    for (let ix = 0; ix < this._drops.length; ix++) {
      if (this._drops[ix].y >= this._canvas.height) {
        this._drops[ix].y = -1 * RANDOM_HEIGHT * Math.random();
      }
      if (!this._slowDown || Math.random() < 0.3) {
        this._drops[ix].y += this._size * DISTANCE;
        this._drops[ix].update = true;
      }
    }
  }

  render (delta, timestamp) {
    const ctx = this._ctx;
    const width = this._canvas.width;
    const height = this._canvas.height;

    this._auxCtx.clearRect(0, 0, width, height);
    this._auxCtx.globalAlpha = FADE;
    this._auxCtx.drawImage(this._layer.element, 0, 0);

    // ctx.clearRect(0, 0, width, height);
    ctx.globalCompositeOperation = 'copy';
    ctx.drawImage(this._auxLayer.element, 0, 0);

    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = 'rgba(80, 200, 80, ' + (this._slowDown ? '0.3' : '1') + ')';
    ctx.strokeStyle = 'rgba(20, 100, 20, ' + (this._slowDown ? '0.3' : '1') + ')';
    for (let ix = 0; ix < this._drops.length; ix++) {
      if (!this._drops[ix].update) {
        continue;
      }
      const x = Math.round(ix * this._size);
      const y = Math.round(this._drops[ix].y);
      ctx.fillRect(x - BOX_PADDING, y - BOX_PADDING, this._size + BOX_PADDING, this._size + BOX_PADDING);
    }
  }

  resize () {
    this._drops = [];
    for (let ix = 0; ix < this._columns; ix++) {
      const y = -this._size + RANDOM_HEIGHT * Math.random();
      this._drops.push({update: true, y: y});
      this._slowDown = false;
    }

    this._scheduleSlowDown();
  }

  destroy () {
    this._canvas.destroyLayer(this._layer);
    this._canvas.destroyLayer(this._auxLayer);

    window.clearTimeout(this._timeoutId);
  }
}

export {
  Intro
};
