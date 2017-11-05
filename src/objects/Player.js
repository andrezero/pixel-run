'use strict';

import { ObjCollection } from '../../lib/ObjCollection';
import { sin, easeInCubic } from '../../lib/Maths';

const SIZE = 40;
const DYING_MS = 500;
const MAX_ENERGY = 3;

class Player {
  constructor (canvas, config) {
    this._canvas = canvas;
    this._config = config;

    this._layer = canvas.newLayer('player');
    this._ctx = this._layer.ctx;

    this._speed = config.speed || 0.1;
    this._maxBreakingSec = config._maxBreakingSec || 4;

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

    this._isHolding = null;
    this._health = 1;

    this._energy = 0;
    this._direction = 0;
    this._swingTimestamp = null;
    this._pressUp = false;
    this._pressDown = false;

    this._isDying = null;
    this._dyingTimestamp = null;

    this._keydown = (event) => {
      if (event.which === 32) {
        this._hold();
      }
      if (event.which === 38) {
        this._up(true);
      }
      if (event.which === 40) {
        this._down(true);
      }
    };

    this._keyup = (event) => {
      if (event.which === 32) {
        this._release();
      }
      if (event.which === 38) {
        this._up();
      }
      if (event.which === 40) {
        this._down();
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

  _hold () {
    if (!this._isHolding && !this._isDying) {
      this._isHolding = true;
    }
  }

  _release () {
    if (this._isHolding && !this._isDying) {
      this._isHolding = false;
    }
  }

  _up (on) {
    if (!this._isDying) {
      this._pressUp = on;
    }
  }

  _down (on) {
    if (!this._isDying) {
      this._pressDown = on;
    }
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

  die () {
    if (this._isDying) {
      return;
    }
    this._unbindKeys();
    this._isDying = true;
    this._isHolding = false;
  }

  // -- AppObject API

  update (delta, timestamp) {
    if (this._isDying) {
      this._dyingTimestamp = this._dyingTimestamp || timestamp;
      if (timestamp - this._dyingTimestamp > DYING_MS) {
        this._isDying = false;
        this._onDieCallback();
      }
    } else if (this.pos.x > 1000) {
      this._onCompleteLevelCallback();
    } else {
      if (this._pressUp && !this._pressDown) {
        if (!this._energy) {
          this._energy = delta;
        } else if (this._direction < 0) {
          this._energy += delta;
        } else {
          this._energy -= delta;
        }
      } else if (this._pressDown && !this._pressUp) {
        if (!this._energy) {
          this._energy = -delta;
        } else if (this._direction < 0) {
          this._energy -= delta;
        } else {
          this._energy += delta;
        }
      }

      console.log(this._energy);

      // if (this._tone) {
      //   this._toneTimestamp = this._toneTimestamp || timestamp;
      //   this.pos.wave = sin((timestamp - this._toneTimestamp) / 2) * this._tone * 100 - this._tone * 50;
      // } else {
      //   this.pos.wave = 0;
      // }
      if (this._isHolding) {
        this.pos.x = this.pos.x + this._speed * delta * 0.2;
        this._health -= 1 / (this._maxBreakingSec * 1000) * delta;
      } else {
        this.pos.x = this.pos.x + this._speed * delta;
      }
    }
    if (this._health <= 0) {
      this.die();
    }
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
    if (this._isDying) {
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
    } else {
      let pulse = sin(timestamp, 10 * this._speed * (this.breakd ? 2 * (1 - this._health) : this._health));
      red = Math.round(255 * (1 - this._health));
      green = Math.round(255 * this._health);
      alpha = 0.75 + 0.25 * this._health;
      shadowBlur = Math.round((1 - this._health) * 10 + 20 * pulse);
      shadowColor = 'rgb(' + red + ',' + green + ',10)';
      rgba = 'rgba(' + red + ',' + green + ',0,' + alpha + ')';
    }

    rgba = 'rgba(' + red + ',' + green + ',' + blue + ',' + alpha + ')';

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.shadowBlur = shadowBlur;
    ctx.shadowColor = shadowColor;
    ctx.fillStyle = rgba;
    ctx.fillRect(...this._canvas.scaleArray(rect));
  }

  destroy () {
    this._canvas.destroyLayer(this._layer);

    this._onDieCallback = null;
    this._onCompleteLevelCallback = null;

    document.removeEventListener('keydown', this._keydown);
    document.removeEventListener('keyup', this._keyup);
  }
}

export {
  Player
};
