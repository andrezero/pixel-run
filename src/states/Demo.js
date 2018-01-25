'use strict';

import { State } from '../../lib/State';
import { ObjCollection } from '../../lib/ObjCollection';

import { Text } from '../objects/Text';
import { Level } from '../objects/Level';
import { Player } from '../objects/Player';

const GAME_OVER_SEC = 1000;
const DEFAULT_SPEED = 1;

class Demo {
  constructor (layer, speed, levels, config) {
    this._layer = layer;
    this._levels = levels;
    this._config = config;

    this._textLayer = layer.newLayer('demo-text', null, null, this._config.zIndex);
    this._objects = new ObjCollection();

    this._initialSpeed = (speed || DEFAULT_SPEED) * (Math.random(0.5) + 0.5);
    this._speed = this._initialSpeed;

    this._state = null;
    this._restarts = 0;
    this._levelNum = config.startLevel || 0;

    this._startLevel();

    this._delay();
  }

  _delay () {
    window.clearTimeout(this._timeoutId);
    this._timeoutId = window.setTimeout(() => {
      this._objects.add(new Text(this._textLayer, { y: this._layer.max.y * 0.05, text: '<X> exit' }));
      this._timeoutId = window.setTimeout(() => {
        this._objects.add(new Text(this._textLayer, { y: this._layer.max.y * 0.92, text: 'press <SPACE> to start' }));
      }, 2500);
    }, 500);
  }

  // - state

  _destroyLevel () {
    this._objects.destroyOne(this._level);
    this._objects.destroyOne(this._player);
    this._level = null;
    this._player = null;
  }

  _restartLevel () {
    this._speed = this._speed * 1.5;
    this._objects.destroyOne(this._player);
    this._objects.destroyOne(this._level);
    this._startLevel();
  }

  _startLevel () {
    const levelConfig = Object.assign({}, this._levels[this._levelNum]);
    const speed = levelConfig.speed * this._speed; ;
    const player = Object.assign({}, levelConfig.player);
    delete levelConfig.Texts;
    this._player = new Player(this._layer, 4 * speed, player);
    this._objects.add(this._player, 1);
    this._level = new Level(this._layer, -1, null, this._player, speed, levelConfig);
    this._objects.add(this._level, 0);
    this._player.onDie(() => {
      this.deaths++;
      this._restarts++;
      this._restartLevel();
    });
    this._level.onComplete(() => {
      this._speed = this._initialSpeed;
      this._destroyLevel();
      this._restarts = 0;
      this._levelNum++;
      if (this._levelNum === this._levels.length) {
        this._levelNum = 0;
      }
      this._startLevel();
    });
  }

  // -- api

  // -- AppObject API

  destroy () {
    this._textLayer.destroy();
  }
}

export {
  Demo
};
