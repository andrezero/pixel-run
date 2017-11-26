'use strict';

import { Canvas } from './Canvas';

const INTERVAL_MS = 100;

class Frame {
  constructor (objects, canvas, config) {
    config = config || {};

    this._objects = objects;
    this._canvas = canvas;
    this._config = config;

    this._intervalId = null;
    this._frameId = null;

    this._lastTs = null;
  }

  // -- private

  _clearCallbacks () {
    if (this._config.interval) {
      window.clearInterval(this._intervalId);
    } else {
      window.cancelAnimationFrame(this._frameId);
    }
  }

  _frame (timestamp) {
    const delta = this._lastTs ? timestamp - this._lastTs : 0;
    this._lastTs = timestamp;
    this._objects.update(delta, timestamp);
    this._objects.render(delta, timestamp);
  }

  _animationFrame () {
    this._frameId = window.requestAnimationFrame((timestamp) => {
      this._frame(timestamp);
      this._animationFrame();
    });
  }

  _setInterval () {
    this._intervalId = window.setInterval(() => {
      const timestamp = new Date();
      this._frame(timestamp);
    }, this._config.intervalMs);
  }

  _setCallbacks () {
    if (this._config.interval) {
      this._setInterval();
    } else {
      this._animationFrame();
    }
  }

  // -- public

  start () {
    this._setCallbacks();
  }

  pause () {
    this._clearCallbacks();
  }

  resume () {
    this._setCallbacks();
  }
}

export {
  Frame
};
