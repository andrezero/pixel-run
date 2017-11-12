'use strict';

import { ObjCollection } from '../../lib/ObjCollection';

import { TimeBar } from '../objects/TimeBar';

const PADDING = 4;
const FONT_SIZE = 20;
const MIN_FONT_PIXELS = 10;

function padLeft (number) {
  let str = '' + number;
  if (str.length < 2) {
    str = '0' + str;
  }
  return str;
}

class TimeLeft {
  constructor (canvas, config, time) {
    this._canvas = canvas;
    this._config = config;
    this._time = time;

    this._layer = canvas.newLayer('time-left');
    this._ctx = this._layer.ctx;

    this._objects = new ObjCollection();

    this._timeBar = new TimeBar(this._canvas, null, this._time);
    this._objects.add(this._timeBar);

    this._over = false;
    this._onTimeCallback = null;

    this._maxFontSize = null;
    this._fontSize = null;

    this._dim = null;

    this._timestamp = null;

    this._requireRender = true;

    this.resize();
  }

  // -- public

  addTime (value) {
    this._time += value;
    this._timestamp = null;
    this._timeBar.setMax(this._time);
    this.resize();
  }

  onTime (onTimeCallback) {
    this._onTimeCallback = onTimeCallback;
  }

  // -- AppObject API

  update (delta, timestamp) {
    if (!this._timestamp) {
      this._timestamp = timestamp;
    }
    if (!this._over) {
      const previousTimeLeft = this._timeLeft;
      this._timeLeft = this._time - Math.round((timestamp - this._timestamp) / 1000);
      this._requireRender = this._timeLeft !== previousTimeLeft;
      if (this._requireRender) {
        this._timeBar.setValue(this._timeLeft);
      }
      if (this._timeLeft <= 0) {
        this._over = true;
        this._onTimeCallback();
      }
    }
  }

  render (delta, timestamp) {
    const ctx = this._ctx;

    if (!this._requireRender) {
      return;
    }

    const dim = this._dim;

    const x = this._canvas.scaleValue(this._canvas.center.x - dim.width / 2) - PADDING * 2;
    const y = this._canvas.scaleValue(this._canvas.max.y * 0.02);

    const width = dim.width + PADDING * 3;
    const height = this._fontSize + PADDING;
    const rect = [x, y, width, height];

    const time = this._timeLeft;
    const seconds = padLeft(time % 60);
    const minutes = padLeft(Math.floor(time / 60));
    const text = minutes + ':' + seconds;

    ctx.clearRect(...rect);

    ctx.fillStyle = 'rgba(10, 10, 10, 0.5)';
    ctx.fillRect(...rect);
    ctx.fillStyle = 'rgb(230, 230, 230)';
    ctx.fillText(text, x + PADDING, y + PADDING);
  }

  resize () {
    this._fontSize = this._canvas.scaleText(FONT_SIZE, MIN_FONT_PIXELS);
    this._maxFontSize = this._canvas.scaleText(100);

    const ctx = this._ctx;

    ctx.font = this._fontSize + 'px pixel';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    this._dim = this._ctx.measureText('00:00');
  }

  destroy () {
    this._canvas.destroyLayer(this._layer);

    this._onTimeCallback = null;
  }
}

export {
  TimeLeft
};
