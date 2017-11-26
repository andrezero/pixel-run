'use strict';

import { ObjCollection } from '../../lib/ObjCollection';
import { sin, cos, ramp, easeInCubic, PI_1H, PI_2H, PI_3H } from '../../lib/Maths';

const SIZE = 40;
const DEFAULT_SPEED = 1;
const SPEED_FACTOR = 0.1;
const MAX_HOLD_SEC = 4;
const HOLD_START_FACTOR = 0.9;
const HOLD_RAMP_MS = 1000;
const HOLD_MIN_FACTOR = 0.1;
const ACCELERATE_RAMP_MS = 1000;
const PUSH_ENERGY = 10;
const ENERGY_FACTOR = 1.5;
const MAX_ENERGY = 150;
const WAVE_LENGTH = 2;
const PUSH_AVAILABLE_WAVE_THRESHOLD = 0.3;
const PUSH_MS = 150;
const COLLINDING_MS = 500;
const EXPLODNG_MS = 750;

class Player {
  constructor (canvas, speed, config) {
    this._canvas = canvas;
    this._config = config;

    this._layer = canvas.newLayer('player', null, null, this._config.zIndex);
    this._ctx = this._layer.ctx;

    this._objects = new ObjCollection();

    this._speed = speed || DEFAULT_SPEED;
    this._maxHoldSec = config.maxHoldSec || MAX_HOLD_SEC;
    this._holdStartFactor = config.holdStartFactor || HOLD_START_FACTOR;
    this._holdRampMs = config.holdRampMs || HOLD_RAMP_MS;
    this._holdMinFactor = config.holdMinFactor || HOLD_MIN_FACTOR;
    this._accelerateRampMs = config.accelerateRampMs || ACCELERATE_RAMP_MS;
    this._pushEnergy = config.pushEnergy || PUSH_ENERGY;
    this._energyFactor = config.energyFactor || ENERGY_FACTOR;
    this._maxEnergy = config.maxEnergy || MAX_ENERGY;
    this._waveLength = config.waveLength || WAVE_LENGTH;

    this.size = {
      w: SIZE,
      h: SIZE
    };
    this.pos = {
      x: SIZE / -2,
      y: canvas.center.y - SIZE / 2
    };

    this._onDieCallback = null;

    this._health = 1;

    this._isHolding = null;
    this._holdingTimestamp = null;
    this._holdFactor = null;
    this._acceleratingTimestamp = null;
    this._acceleratingFromFactor = null;

    this._energy = 0;
    this._wave = 0;
    this._wavePrevious = 0;
    this._swingTimestamp = null;
    this._pressUp = false;
    this._pushUp = false;
    this._pushValid = null;
    this._pushTimestsamp = null;
    this._pressDown = false;
    this._pushDown = false;
    this._pushLock = false;

    this.isDead = false;
    this._deadTimestamp = null;
    this._isColliding = false;
    this._isExploding = false;
    this._isExpanding = false;

    this._keydown = (event) => {
      if (event.which === 32) {
        this._hold();
      }
      // if (event.which === 38 && !this._pressUp) {
      //   this._pressUp = true;
      //   this._up();
      // }
      // if (event.which === 40 && !this._pressDown) {
      //   this._pressDown = true;
      //   this._down();
      // }
    };

    this._keyup = (event) => {
      if (event.which === 32) {
        this._release();
      }
      // if (event.which === 38) {
      //   this._pressUp = false;
      // }
      // if (event.which === 40) {
      //   this._pressDown = false;
      // }
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
    if (!this._isHolding && !this.isDead) {
      this._isHolding = true;
      this._holdingTimestamp = null;
    }
  }

  _release () {
    if (this._isHolding && !this.isDead) {
      this._isHolding = false;
      this._isAccelerating = true;
      this._acceleratingTimestamp = null;
      this._acceleratingFromFactor = this._holdFactor;
    }
  }

  _up () {
    if (!this._isColliding && !this.isDead) {
      this._pushUp = true;
      this._pushValid = false;
      this._pushLock = true;
    }
  }

  _down () {
    if (!this._isColliding && !this.isDead) {
      this._pushDown = true;
      this._pushValid = false;
      this._pushLock = true;
    }
  }

  // -- public

  onDie (onDieCallback) {
    this._onDieCallback = onDieCallback;
  }

  // - state

  die () {
    if (this.isDead) {
      return;
    }
    this._unbindKeys();
    this.isDead = true;
    this._isColliding = true;
    this._isHolding = false;
    this._isAccelerating = false;
  }

  explode () {
    if (this._isExploding) {
      return;
    }
    this._unbindKeys();
    this.isDead = true;
    this._isExploding = true;
    this._isHolding = false;
    this._isAccelerating = false;
  }

  expand () {
    if (this._isExpanding) {
      return;
    }
    this._unbindKeys();
    this.isDead = true;
    this._isExpanding = true;
    this._isHolding = false;
    this._isAccelerating = false;
  }

  // -- AppObject API

  update (delta, timestamp) {
    if (this.isDead) {
      this._deadTimestamp = this._deadTimestamp || timestamp;
    }
    if (this._isColliding && !this._isExploding) {
      if (timestamp - this._deadTimestamp > COLLINDING_MS) {
        this._isColliding = false;
        this._onDieCallback();
      }
    } else if (this._isExploding) {
      this.pos.x = this.pos.x + SPEED_FACTOR * this._speed * delta * 0.2;
    } else {
      // if (this._pushUp) {
      //   this._pushTimestsamp = timestamp;
      //   this._pushUp = false;
      //   console.log('push up');
      //   if (!this._energy) {
      //     this._energy = this._pushEnergy;
      //     this._phase = PI_3H;
      //     this._pushValid = true;
      //     console.log('--valid');
      //   } else if (this._wave < -1 * PUSH_AVAILABLE_WAVE_THRESHOLD) {
      //     this._pushValid = true;
      //     console.log('--valid', this._wave);
      //     this._energy = Math.min(this._maxEnergy, this._energy * this._energyFactor);
      //   } else {
      //     console.log('-in-valid', this._wave);
      //   }
      // } else if (this._pushDown) {
      //   this._pushTimestsamp = timestamp;
      //   this._pushDown = false;
      //   console.log('push down');
      //   if (!this._energy) {
      //     this._energy = this._pushEnergy;
      //     this._phase = PI_1H;
      //     this._pushValid = true;
      //     console.log('--valid');
      //   } else if (this._wave > PUSH_AVAILABLE_WAVE_THRESHOLD) {
      //     this._pushValid = true;
      //     console.log('--valid', this._wave);
      //     this._energy = Math.min(this._maxEnergy, this._energy * this._energyFactor);
      //   } else {
      //     console.log('-in-valid', this._wave);
      //   }
      // }

      // if (this._energy < 0) {
      //   this._energy = 0;
      //   this._swingTimestamp = null;
      //   this._wavePrevious = 0;
      //   this._wave = 0;
      //   this._pushLock = false;
      // } else if (this._energy) {
      //   this._swingTimestamp = this._swingTimestamp || timestamp - 1;
      //   const swingDelta = (timestamp - this._swingTimestamp) / this._waveLength;
      //   const wave = sin(swingDelta, -1, 1, this._phase);
      //   this._wave = wave;
      //   this.pos.y += wave * this._energy / this._waveLength;
      //   if (this._wavePrevious && this._wavePrevious * this._wave < 0) {
      //     this._pushLock = false;
      //   }
      //   this._wavePrevious = this._wave;
      // }

      if (this._isHolding) {
        this._holdingTimestamp = this._holdingTimestamp || timestamp;
        let time = (timestamp - this._holdingTimestamp) / this._holdRampMs;
        this._holdFactor = ramp(time, this._holdStartFactor, this._holdMinFactor);
        this._health -= 1 / (this._maxHoldSec * 1000) * delta;
        this._energy = Math.max(0, this._energy * (1000 - delta * 4) / 1000);
      } else if (this._isAccelerating) {
        this._acceleratingTimestamp = this._acceleratingTimestamp || timestamp;
        let time = (timestamp - this._acceleratingTimestamp) / this._accelerateRampMs;
        this._holdFactor = ramp(time, this._acceleratingFromFactor, 1);
      } else {
        this._holdFactor = 1;
      }

      this.pos.x = this.pos.x + SPEED_FACTOR * this._speed * delta * this._holdFactor;
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

    let scaleUp = easeInCubic((timestamp - this._deadTimestamp) / EXPLODNG_MS);
    let scaleDown = 1 - scaleUp;

    if (this._isExpanding) {
      red = Math.round(150 * scaleUp + 100);
      green = 255;
      blue = Math.round(150 * scaleUp + 100);
      alpha = 0.5 + 0.5 * scaleDown;
      shadowBlur = Math.round(10 + scaleUp * 100);
      shadowColor = 'rgb(' + red + ',' + green + ',' + blue + ')';
      ctx.shadowOffsetY = 0;
      ctx.shadowOffsetX = 0;

      rect[0] -= Math.round(scaleUp * rect[0]);
      rect[1] -= Math.round(scaleUp * rect[1]);
      rect[2] += Math.round(this.size.w * scaleUp * 25);
      rect[3] += Math.round(this.size.h * scaleUp * 25);

      shadowColor = 'hsl(40,50%,50%)';
    } else if (this._isExploding) {
      red = 255;
      green = Math.round(50 * scaleUp + 200);
      blue = Math.round(150 * scaleUp + 100);
      alpha = 0.5 + 0.5 * scaleDown;
      shadowBlur = Math.round(5 + scaleUp * 20);
      shadowColor = 'rgb(' + red + ',' + green + ',' + blue + ')';
      ctx.shadowOffsetY = Math.round(5 + 100 * scaleUp);
      ctx.shadowOffsetX = 0;

      rect[0] += Math.round(scaleUp * 40);
      rect[1] -= Math.round(scaleUp * rect[1]);
      rect[2] -= Math.round(2 + this.size.w * scaleUp / 2);
      rect[3] += Math.round(2 + this.size.h * scaleUp * 20);

      shadowColor = 'hsl(40,50%,50%)';
    } else if (this._isColliding) {
      red = Math.round(50 * scaleUp + 200);
      green = Math.round(150 * scaleDown + 50);
      blue = Math.round(100 * scaleUp);
      alpha = 0.5 + 0.5 * scaleDown;
      shadowBlur = Math.round(5 + scaleDown * 10);
      shadowColor = 'rgb(' + green + ',' + red + ',100)';
      ctx.shadowOffsetX = Math.round(5 + 100 * scaleUp);

      rect[0] -= Math.round(scaleUp * rect[0]);
      rect[1] += Math.round(this.size.h / 4 + scaleUp * 4);
      rect[2] = Math.round(this.size.w * (2 + scaleUp * 3));
      rect[3] = Math.round(this.size.h * scaleDown / 2);

      shadowColor = 'hsl(40,50%,50%)';
    } else {
      const halfHealthFactor = 0.5 + 0.5 * this._health;
      const doubleUnhealthyFactor = 2 - this._health;
      const pulse = sin(timestamp * this._speed * (this._isHolding ? doubleUnhealthyFactor : halfHealthFactor));
      red = Math.round(255 * (1 - this._health) * (this._isHolding ? 0.7 : 1));
      green = Math.round(255 * this._health * (this._isHolding ? 0.7 : 1));
      alpha = 0.75 + 0.25 * this._health;
      shadowBlur = Math.round(5 + 40 * pulse * halfHealthFactor); // Math.round((1 - this._health) * 10 + 20);
      shadowColor = 'rgb(' + red + ',' + green + ',10)';
      ctx.shadowOffsetX = Math.round(2 + 3 * pulse);
    }

    if (timestamp - this._pushTimestsamp < PUSH_MS) {
      if (this._pushValid) {
        red = Math.max(255, red * 2);
        green = Math.max(255, green * 2);
      } else {
        red = 100;
        green = 100;
        alpha = 0.5;
      }
    }

    rgba = 'rgba(' + red + ',' + green + ',' + blue + ',' + alpha + ')';

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.shadowBlur = shadowBlur;
    ctx.shadowColor = shadowColor;
    ctx.fillStyle = rgba;
    ctx.fillRect(...this._canvas.scaleArray(rect));

    let showTriangle = this._energy && Math.abs(this._wave) > PUSH_AVAILABLE_WAVE_THRESHOLD;
    showTriangle = showTriangle || timestamp - this._pushTimestsamp < PUSH_MS;

    if (!this._isColliding && showTriangle) {
      const center = {
        x: rect[0] + rect[2] / 2,
        y: rect[1] + rect[3] / 2
      };

      const triangle = [];
      const direction = this._wavePrevious > 0 ? -1 : 1;
      triangle.push({ x: center.x - this.size.w / 3, y: center.y + this.size.h / 3 * direction });
      triangle.push({ x: center.x, y: center.y - this.size.h / 3 * direction });
      triangle.push({ x: center.x + this.size.w / 3, y: center.y + this.size.h / 3 * direction });

      const path = this._canvas.scalePath(triangle);

      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.beginPath();
      ctx.moveTo(path[0].x, path[0].y);
      ctx.lineTo(path[1].x, path[1].y);
      ctx.lineTo(path[2].x, path[2].y);
      ctx.fill();
    }
  }

  destroy () {
    this._layer.destroy();

    this._onDieCallback = null;

    document.removeEventListener('keydown', this._keydown);
    document.removeEventListener('keyup', this._keyup);
  }
}

export {
  Player
};
