'use strict';

import { State } from '../../lib/State';
import { ObjCollection } from '../../lib/ObjCollection';
import { ramp, easeInQuad, easeInCubic } from '../../lib/Maths';

import { Header } from '../objects/Header';
import { Text } from '../objects/Text';
import { LevelNumber } from '../objects/LevelNumber';
import { Deaths } from '../objects/Deaths';
import { TimeLeft } from '../objects/TimeLeft';

const SCORE_MS = 1250;
const FADE_MS = 2000;

const POINTS_PER_SECOND = 1294;
const POINTS_PER_LEVEL = 1250;
const POINTS_PER_DEATH = 123;

const padScore = (num1, num2, length, sign) => {
  const str1 = '' + num1;
  const str2 = '' + num1;
  let ret = '';
  let dots = '.';
  do {
    ret = num1 + ' ' + dots + ' ' + sign + num2;
    dots += '.';
  } while (ret.length < length);
  return ret;
};

class GameOver {
  constructor (layer, game, config) {
    this._layer = layer.newLayer('game-over', null, null, config.zIndex);
    this._ctx = this._layer.ctx;
    this._config = config;

    this._game = game;

    this._textLayer = layer.newLayer('game-over-text', null, null, this._config.zIndex);

    const stateTranstions = {
      'intro': null,
      'space': null,
      'early': null,
      'long': null
    };

    this._state = new State('game-over', stateTranstions, true);

    this._objects = new ObjCollection();

    this._render = 0;
    this._fadeTimestamp = 0;
    this._stepTimestamp = 0;
    this._time = null;
    this._level = null;
    this._deaths = null;
    this._total = null;

    this._delay();
  }

  _delay () {
    window.clearTimeout(this._timeoutId);
    this._timeoutId = window.setTimeout(() => {
      const score = this._game.getScore();
      const text = score.complete ? 'congratulations' : 'game over';
      this._objects.add(new Header(this._layer, { y: this._layer.max.y * 0.15, size: 90, text: text }));
      this._render = 1;
      this._timeoutId = window.setTimeout(() => {
        this._objects.add(new Text(this._textLayer, { y: this._layer.max.y * 0.05, text: '<X> exit' }));
        this._objects.add(new Text(this._textLayer, { y: this._layer.max.y * 0.92, size: 20, text: 'press <SPACE> to restart' }));
      }, 250);
    }, 750);
  }

  // -- AppObject API

  render (delta, timestamp) {
    const ctx = this._ctx;
    const score = this._game.getScore();

    this._fadeTimestamp = this._fadeTimestamp || timestamp;
    if (timestamp - this._fadeTimestamp < FADE_MS) {
      const alpha = ramp((timestamp - this._fadeTimestamp) / FADE_MS, 0, 0.8, easeInCubic);
      this._layer.clear();
      ctx.fillStyle = score.complete ? 'rgba(50,120,20,' + alpha + ')' : 'rgba(120,50,20,' + alpha + ')';
      ctx.fillRect(0, 0, this._layer.size.w, this._layer.size.h);
    }

    if (this._render) {
      this._stepTimestamp = this._stepTimestamp || timestamp;
      const scaleUp = ramp((timestamp - this._stepTimestamp) / SCORE_MS, 0, 1, easeInCubic);
      const x = this._layer.center.x;
      const size = 50;
      const align = 'center';
      const baseline = 'top';
      let time = score.time;
      let level = score.level;
      let deaths = score.deaths;
      let total = time * POINTS_PER_SECOND + level * POINTS_PER_LEVEL - deaths * POINTS_PER_DEATH;
      if (this._render === 1) {
        time = Math.min(score.time, time * scaleUp);
        if (!this._time) {
          this._time = new Text(this._textLayer, { x, size, align, baseline, color: 'green', y: this._layer.max.y * 0.3 });
          this._objects.add(this._time);
        }
        this._time.setText('T' + padScore(Math.ceil(time), Math.ceil(time * POINTS_PER_SECOND), 13, '+'));
      }
      if (this._render === 2) {
        level = Math.min(score.level, level * scaleUp);
        if (!this._level) {
          this._level = new Text(this._textLayer, { x, size, align, baseline, color: 'orange', y: this._layer.max.y * 0.4 });
          this._objects.add(this._level);
        }
        this._level.setText('L' + padScore(Math.ceil(level), Math.ceil(level * POINTS_PER_LEVEL), 13, '+'));
      }
      if (this._render === 3) {
        deaths = Math.min(score.deaths, deaths * scaleUp);
        if (!this._deaths) {
          this._deaths = new Text(this._textLayer, { x, size, align, baseline, color: 'red', y: this._layer.max.y * 0.5 });
          this._objects.add(this._deaths);
        }
        this._deaths.setText('x' + padScore(Math.ceil(deaths), Math.ceil(deaths * POINTS_PER_DEATH), 13, '-'));
      }
      if (this._render === 4) {
        total = Math.min(total, Math.ceil(total * scaleUp));
        if (!this._total) {
          this._total = new Text(this._textLayer, { x, size: size * 1.5, baseline, color: 'white', y: this._layer.max.y * 0.65 });
          this._objects.add(this._total);
        }
        this._total.setText(' > ' + total + ' < ');
      }
      if (scaleUp >= 1) {
        this._stepTimestamp = timestamp;
        this._render++;
        if (this._render > 4) {
          this._render = false;
        }
      }
    }
  }

  resize () {

  }

  destroy () {
    this._layer.destroy();
    this._textLayer.destroy();

    window.clearTimeout(this._timeoutId);
  }
}

export {
  GameOver
};
