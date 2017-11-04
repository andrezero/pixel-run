'use strict';

import { ObjCollection } from '../../lib/ObjCollection';
import { ramp, sin, easeOutCubic, easeInCubic } from '../../lib/Maths';

const ZOOM_OUT_MS = 500;
const ZOOM_OUT_DELAY = 250;

class LevelNumber {
  constructor (canvas, config, number, shouldZoom) {
    this._canvas = canvas;
    this._config = config;
    this._number = number;
    this._shouldZoom = true || shouldZoom;

    this._layer = canvas.newLayer('level-num');
    this._ctx = this._layer.ctx;

    this._auxLayer = canvas.newVirtualLayer('splash-aux');
    this._auxCtx = this._auxLayer.ctx;

    this._maxFontSize = null;
    this._fontSize = null;

    this._zoomOut = false;
    this._zoomedOut = false;
    this._skip = 20;
    this._skipped = 0;

    this._timeoutId = 0;
    this._timestamp = null;

    this.resize();
  }

  _scheduleZoomOut (timestamp) {
    this._timeoutId = window.setTimeout(() => {
      this._zoomOut = true;
      this._zoomOutTimestamp = timestamp + ZOOM_OUT_DELAY;
      window.clearTimeout(this._timeoutId);
      this._timeoutId = window.setTimeout(() => {
        this._zoomOut = false;
        this._zoomedOut = true;
      }, ZOOM_OUT_MS);
    }, ZOOM_OUT_DELAY);
  }

  // -- AppObject API

  render (delta, timestamp) {
    const ctx = this._ctx;

    if (!this._timestamp) {
      this._timestamp = timestamp;
      this._scheduleZoomOut(timestamp);
    }

    if (this._zoomedOut && this._skipped !== this._skip) {
      this._skipped++;
      return;
    }
    this._skipped = 0;

    let fontSize;
    let x;
    let y;

    if (this._shouldZoom && this._zoomOut) {
      let time = (timestamp - this._zoomOutTimestamp) / ZOOM_OUT_MS;
      fontSize = ramp(time, this._maxFontSize, this._fontSize, easeOutCubic);
      ctx.font = 'bold ' + fontSize + 'px arial';
      x = ramp(time, this._canvas.max.x * 0.90, this._canvas.max.x * 0.98, easeOutCubic);
      y = ramp(time, this._canvas.max.y * 0.15, this._canvas.max.y * 0.02, easeOutCubic);
      ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    } else if (this._shouldZoom && !this._zoomedOut) {
      fontSize = this._maxFontSize;
      ctx.font = 'bold ' + fontSize + 'px arial';
      x = this._canvas.max.x * 0.90;
      y = this._canvas.max.y * 0.15;
    } else {
      fontSize = this._fontSize;
      x = this._canvas.max.x * 0.98;
      y = this._canvas.max.y * 0.02;
    }

    const alpha = this._zoomedOut ? 0.5 : 0.3;
    const hue = Math.round(50 * sin(timestamp));

    x = this._canvas.scaleValue(x);
    y = this._canvas.scaleValue(y);

    ctx.shadowBlur = this._zoomedOut ? 2 : 5;
    ctx.shadowColor = 'hsl(' + hue + ',50%,50%)';
    ctx.strokeStyle = 'hsl(' + hue + ',99%,50%)';
    ctx.strokeText(2, x, y);
  }

  resize () {
    this._fontSize = Math.round(this._canvas.max.x / 15);
    this._maxFontSize = Math.round(this._canvas.max.x / 10);

    const ctx = this._ctx;

    ctx.font = 'bold ' + this._fontSize + 'px arial';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'top';
  }

  destroy () {
    this._canvas.destroyLayer(this._layer);
    this._canvas.destroyLayer(this._auxLayer);

    window.clearTimeout(this._timeoutId);
  }
}

export {
  LevelNumber
};
