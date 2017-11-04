'use strict';

import { ObjCollection } from '../../lib/ObjCollection';
import { sin, easeInCubic } from '../../lib/Maths';

const SIZE = 40;
const X_SPEED = 10;
const HEALTH_DEC = 0.01;
const HEALTH_INTERVAL_MSEC = 30;
const DYING_MS = 500;

class Player {
  constructor (canvas, config) {
    this._canvas = canvas;
    this._config = config;

    this._layer = canvas.newLayer('player');
    this._ctx = this._layer.ctx;

    this._speed = config.speed || 0.1;

    this._objects = new ObjCollection();

    this.size = {
      w: SIZE,
      h: SIZE
    };
    this.pos = {
      x: SIZE / -2,
      y: canvas.center.y - SIZE / 2
    };

    this._onDieCallback = null;
    this._onCompleteLevelCallback = null;

    this._paused = null;
    this._health = 1;
    this._healthIntervalId = null;

    this._dyingTimeoutId = null;
    this._dyingTimestamp = null;
    this._isDying = null;

    this._keyIsDown = false;

    this._keydown = () => {
      if (!this._keyIsDown) {
        this.pause();
        this._keyIsDown = true;
      }
    };

    this._keyup = () => {
      if (this._keyIsDown) {
        this.resume();
        this._keyIsDown = false;
      }
    };

    this._bindKeys();
  }

  _unbindKeys () {
    document.removeEventListener('keydown', this._keydown);
    document.removeEventListener('keyup', this._keyup);
  }

  _bindKeys () {
    document.addEventListener('keydown', this._keydown);
    document.addEventListener('keyup', this._keyup);
  }

  // -- public

  // - setup

  onDie (onDieCallback) {
    this._onDieCallback = onDieCallback;
  }

  onCompleteLevel (onCompleteLevelCallback) {
    this._onCompleteLevelCallback = onCompleteLevelCallback;
  }

  // - state

  pause () {
    if (!this._paused) {
      this._paused = true;
      this._healthIntervalId = window.setInterval(() => {
        this._health -= HEALTH_DEC;
        if (this._health <= 0) {
          this.die();
        }
      }, HEALTH_INTERVAL_MSEC);
    }
  }

  resume () {
    if (this._paused && !this._isDying) {
      this._paused = false;
      window.clearInterval(this._healthIntervalId);
    }
  }

  die () {
    if (this._isDying) {
      return;
    }
    this._unbindKeys();
    this._isDying = true;
    this._paused = false;
    window.clearInterval(this._healthIntervalId);
    this._dyingTimeoutId = window.setTimeout(() => {
      this._onDieCallback();
    }, DYING_MS);
  }

  // -- AppObject API

  update (delta, timestamp) {
    this.pos.x = this.pos.x + this._speed * delta * (this._paused ? 0.2 : 1); // * (this.heath / INITIAL_HEALTH);
    if (this.pos.x > 1000) {
      this._onCompleteLevelCallback();
    }
    this._objects.update(delta, timestamp);
  }

  render (delta, timestamp) {
    const ctx = this._ctx;
    const rect = [this.pos.x, this.pos.y, this.size.w, this.size.h];

    let red;
    let green;
    let blue = 30;
    let alpha;
    let rgba;
    let shadowBlur;
    let shadowColor;
    if (!this._isDying) {
      let pulse = sin(timestamp, 10 * this._speed * (this.paused ? 2 * (1 - this._health) : this._health));
      red = Math.round(255 * (1 - this._health));
      green = Math.round(255 * this._health);
      alpha = 0.75 + 0.25 * this._health;
      shadowBlur = Math.round((1 - this._health) * 10 + 20 * pulse);
      shadowColor = 'rgb(' + red + ',' + green + ',10)';
      rgba = 'rgba(' + red + ',' + green + ',0,' + alpha + ')';
    } else {
      this._dyingTimestamp = this._dyingTimestamp || timestamp;

      let scaleUp = easeInCubic((timestamp - this._dyingTimestamp) / DYING_MS);
      let scaleDown = 1 - scaleUp;
      red = Math.round(50 * scaleUp + 200);
      green = Math.round(150 * scaleDown + 50);
      blue = Math.round(100 * scaleUp);
      alpha = 0.5 + 0.5 * scaleDown;
      shadowBlur = Math.round(scaleDown * 100);
      shadowColor = 'rgb(' + green + ',' + red + ',100)';

      rect[0] -= Math.round(scaleUp * rect[0]);
      rect[1] += Math.round(this.size.h / 4 + scaleUp * 4);
      rect[2] = Math.round(this.size.w * (2 + scaleUp * 3));
      rect[3] = Math.round(this.size.h * scaleDown / 2);

      shadowBlur = 10;
      shadowColor = 'hsl(40,50%,50%)';
    }

    rgba = 'rgba(' + red + ',' + green + ',' + blue + ',' + alpha + ')';

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.shadowBlur = shadowBlur;
    ctx.shadowColor = shadowColor;
    ctx.fillStyle = rgba;
    ctx.fillRect(...this._canvas.scaleArray(rect));
    this._objects.render(delta, timestamp);
  }

  destroy () {
    this._canvas.destroyLayer(this._layer);

    this._onDieCallback = null;
    this._onCompleteLevelCallback = null;

    document.removeEventListener('keydown', this._keydown);
    document.removeEventListener('keyup', this._keyup);

    window.clearInterval(this._healthIntervalId);
    window.clearTimeout(this._dyingTimeoutId);

    this._objects.destroyAll();
  }
}

export {
  Player
};
