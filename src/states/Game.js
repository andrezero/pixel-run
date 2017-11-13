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
      this._gameOver();
    });

    this._onGameOverCallback = null;
    this._onCompleteCallback = null;

    this._levels = config.levels;

    this._state = null;
    this._deaths = 0;
    this._restarts = 0;
    this._levelNum = config.startLevel || 0;
    this._isComplete = false;

    this._startLevel();
  }

  // - state

  _gameOver () {
    if (this._level) {
      this._level.freeze();
    }
    if (this._deathsDisplay) {
      this._objects.destroyOne(this._deathsDisplay);
    }
    this._state = 'game-over';
    this._onGameOverCallback();
    this._player.explode();
  }

  _complete () {
    if (this._level) {
      this._level.freeze();
    }
    if (this._deathsDisplay) {
      this._objects.destroyOne(this._deathsDisplay);
    }
    this._state = 'game-over';
    this._onCompleteCallback();
    this._player.expand();
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
    this._level.onComplete(() => {
      this._restarts = 0;
      if (this._levelNum + 1 < this._levels.length) {
        this._destroyLevel();
        this._levelNum++;
        this._startLevel();
      } else {
        this._timeLeft.stop();
        this._objects.destroyOne(this._timeLeft);
        this._isComplete = true;
        this._complete();
      }
    });
  }

  // -- api

  onGameOver (onGameOverCallback) {
    this._onGameOverCallback = onGameOverCallback;
  }

  onComplete (onCompleteCallback) {
    this._onCompleteCallback = onCompleteCallback;
  }

  getScore () {
    return {
      complete: this._isComplete,
      time: this._timeLeft.getTime(),
      level: this._levelNum,
      deaths: this._deaths
    };
  }

  // -- AppObject API

  destroy () {
    this._onGameOverCallback = null;
    this._onCompleteCallback = null;
  }
}

export {
  Game
};
