'use strict';

import { ObjCollection } from '../../lib/ObjCollection';

import { Level } from '../objects/Level';
import { Player } from '../objects/Player';
import { Deaths } from '../objects/Deaths';
import { TimeLeft } from '../objects/TimeLeft';

const GAME_OVER_SEC = 1000;
const DEFAULT_SPEED = 1;

class Game {
  constructor (canvas, speed, config) {
    this._canvas = canvas;
    this._config = config;

    this._ctx = canvas.ctx;

    this._speed = speed || DEFAULT_SPEED;

    this._objects = new ObjCollection();

    this._timeLeft = new TimeLeft(this._canvas, null, config.time);
    this._objects.add(this._timeLeft);
    this._timeLeft.onTime(() => {
      this._objects.destroyOne(this._timeLeft);
      if (this._level) {
        this._level.hideMessages();
      }
      this._gameOver();
    });

    this._onGameOverCallback = null;

    this._levels = config.levels;

    this._state = null;
    this._deaths = 0;
    this._restarts = 0;
    this._levelNum = config.startLevel || 0;

    this._startLevel();
  }

  // - state

  _gameOver () {
    this._state = 'game-over';
    this._onGameOverCallback();
    this._player.explode();
  }

  _destroyLevel () {
    this._objects.destroyOne(this._level);
    this._objects.destroyOne(this._player);
    this._level = null;
    this._player = null;
  }

  _restartLevel () {
    this._objects.destroyOne(this._player);
    this._objects.destroyOne(this._level);
    this._startLevel();
  }

  _startLevel () {
    const levelConfig = this._levels[this._levelNum];
    const speed = levelConfig.speed * this._speed; ;
    const player = levelConfig.player;
    this._player = new Player(this._canvas, speed, player);
    this._objects.add(this._player, 1);
    this._level = new Level(this._canvas, this._levelNum, this._restarts, this._player, speed, levelConfig);
    this._objects.add(this._level, 0);
    this._player.onDie(() => {
      if (!this._deaths) {
        this._deathsDisplay = new Deaths(this._canvas);
        this._objects.add(this._deathsDisplay, 0);
      }
      this._deaths++;
      this._deathsDisplay.setNumber(this._deaths);
      this._restarts++;
      this._restartLevel();
    });
    this._player.onCompleteLevel(() => {
      this._destroyLevel();
      this._restarts = 0;
      this._levelNum++;
      this._startLevel();
    });
  }

  // -- api

  onGameOver (onGameOverCallback) {
    this._onGameOverCallback = onGameOverCallback;
  }

  // -- AppObject API

  destroy () {
    this._onGameOverCallback = null;
  }
}

export {
  Game
};
