'use strict';

import { ObjCollection } from '../../lib/ObjCollection';
import { Message } from '../objects/Message';

class Splash {
  constructor (canvas, config) {
    this._canvas = canvas;
    this._config = config;

    this._layer = canvas.newLayer('splash');
    this._ctx = this._layer.ctx;

    this._text = 'pixel-run';

    this._iteration = 0;

    this._fontSize = null;
    this._center = null;
    this._slowDown = false;
    this._skip = 50;
    this._skipped = 0;

    this._objects = new ObjCollection();

    this.resize();

    this._scheduleSlowDown();
  }

  _scheduleSlowDown () {
    this._slowDown = false;
    window.clearTimeout(this._timeoutId);
    this._timeoutId = window.setTimeout(() => {
      const message = new Message(this._canvas, { text: 'press any key to start' });
      this._objects.add(message);
      this._slowDown = true;
    }, 500);
  }

  // -- AppObject API

  render (delta, timestamp) {
    const ctx = this._ctx;

    if (this._slowDown && this._skipped === this._skip) {
      this._skipped = 0;
      return;
    }
    this._skipped++;

    this._iteration += this._slowDown ? 5 : 55;

    const iteration = this._iteration;
    const center = this._center;
    const slowDown = this._slowDown;

    let x = Math.cos(iteration * (slowDown ? 5 : 50)) * 10 + center.x;
    let y = Math.sin(iteration * (slowDown ? 5 : 50)) * 10 + center.y;
    const alpha = slowDown ? 0.6 : 0.9;
    ctx.shadowBlur = slowDown ? 10 : 2;
    ctx.shadowColor = 'hsl(40,50%,50%)';
    ctx.fillStyle = 'hsla(' + iteration * 3 % 100 + ',99%,50%,' + alpha + ')';
    ctx.fillText(this._text, Math.round(x), Math.round(y));

    x = Math.cos(iteration * (slowDown ? 1 : 5)) * (slowDown ? 0.7 : 5) + center.x;
    y = center.y;
    ctx.fillStyle = 'black';
    ctx.fillText(this._text, Math.round(x), Math.round(y));
  }

  resize () {
    this._center = this._canvas.scalePoint(this._canvas.center);
    this._fontSize = this._canvas.scaleText(150);

    const ctx = this._ctx;

    ctx.font = 'bold ' + this._fontSize + 'px pixel';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    this._scheduleSlowDown();
  }

  destroy () {
    this._canvas.destroyLayer(this._layer);

    window.clearTimeout(this._timeoutId);
  }
}

export {
  Splash
};
