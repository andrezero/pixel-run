import { ObjCollection } from '../../lib/ObjCollection';

import { Level } from '../objects/Level';
import { LevelNumber } from '../objects/LevelNumber';
import { Player } from '../objects/Player';
import { Deaths } from '../objects/Deaths';
import { TimeLeft } from '../objects/TimeLeft';

const GAME_OVER_SEC = 1000;
const DEFAULT_SPEED = 1;

class Game {
  constructor (layer, speed, config) {
    this._layer = layer;
    this._speed = speed || DEFAULT_SPEED;
    this._config = config;

    this._objects = new ObjCollection();

    this._timeLeft = new TimeLeft(this._layer, config.time, { zIndex: this._config.zIndex.hud });
    this._objects.add(this._timeLeft);
    this._timeLeft.onTime(() => {
      this._gameOver();
    });

    this._deathsDisplay = new Deaths(this._layer, { zIndex: this._config.zIndex.hud });
    this._deathsDisplay.setNumber(0);
    this._objects.add(this._deathsDisplay, 0);

    this._onGameOverCallback = null;
    this._onCompleteCallback = null;

    this._levels = config.levels;

    this._state = null;
    this._deaths = 0;
    this._restarts = 0;
    this._levelIx = config.startLevel || 0;
    this._isComplete = false;

    this._startLevel();
  }

  // - state

  _destroyHud () {
    if (this._level) {
      this._level.freeze();
    }
    window.setTimeout(() => this._objects.destroyOne(this._deathsDisplay), 500);
    window.setTimeout(() => this._objects.destroyOne(this._timeLeft), 750);
    window.setTimeout(() => this._objects.destroyOne(this._levelNumber), 1000);
  }

  _gameOver () {
    this._state = 'game-over';
    this._onGameOverCallback();
    this._player.explode();
    this._destroyHud();
  }

  _complete () {
    this._state = 'game-over';
    this._onCompleteCallback();
    this._player.expand();
    this._destroyHud();
  }

  _destroyLevel () {
    this._objects.destroyOne(this._level);
    this._objects.destroyOne(this._levelNumber);
    this._objects.destroyOne(this._player);
  }

  _restartLevel () {
    this._destroyLevel();
    this._startLevel();
  }

  _startLevel () {
    this._levelNumber = new LevelNumber(this._layer, this._levelIx + 1, { zIndex: this._config.zIndex.hud });
    this._objects.add(this._levelNumber);
    const levelConfig = Object.assign({}, this._levels[this._levelIx], { zIndex: this._config.zIndex.level });
    const speed = levelConfig.speed * this._speed; ;
    const playerConfig = Object.assign({}, levelConfig.player, { zIndex: this._config.zIndex.player });
    this._player = new Player(this._layer, speed, playerConfig);
    this._objects.add(this._player, 1);
    this._level = new Level(this._layer, this._levelIx, this._restarts, this._player, speed, levelConfig);
    this._objects.add(this._level, 0);
    this._player.onDie(() => {
      this._deaths++;
      this._deathsDisplay.setNumber(this._deaths);
      this._restarts++;
      this._restartLevel();
    });
    this._level.onComplete(() => {
      this._restarts = 0;
      if (this._levelIx + 1 < this._levels.length) {
        this._destroyLevel();
        this._levelIx++;
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
      level: this._levelIx,
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
