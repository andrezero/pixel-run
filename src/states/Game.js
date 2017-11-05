'use strict';

import { ObjCollection } from '../../lib/ObjCollection';

import { Level } from '../objects/Level';
import { Player } from '../objects/Player';

const GAME_OVER_SEC = 1000;

class Game {
  constructor (canvas, config) {
    this._canvas = canvas;
    this._config = config;

    this._ctx = canvas.ctx;

    this._objects = new ObjCollection();

    this._levels = config.levels;

    this._state = null;
    this._restarts = 0;
    this._levelNum = config.startLevel || 0;

    // timeouts/intervals/animationFrame
    this._intervalId = null;
    this._frameId = null;

    this._startLevel();
  }

  // - state

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
    this._player = new Player(this._canvas, this._levels[this._levelNum].player);
    this._objects.add(this._player, 1);
    this._level = new Level(this._canvas, this._levels[this._levelNum], this._levelNum, this._restarts, this._player);
    this._objects.add(this._level, 0);
    this._player.onDie(() => {
      this.deaths++;
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

  gameOver () {
    this._player = null;
    window.clearInterval(this._enemiesIntervalId);

    window.setTimeout(() => {
      this.init();
    }, GAME_OVER_SEC * 1000);
  }

  // -- AppObject API
}

export {
  Game
};
