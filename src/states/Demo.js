import { makeEmitter, emitterMixin } from '../../lib/emitter';
import { State } from '../../lib/State';
import { ObjCollection } from '../../lib/ObjCollection';

import { Header } from '../objects/Header';
import { Text } from '../objects/Text';
import { Level } from '../objects/Level';
import { Player } from '../objects/Player';
import { Button } from '../objects/Button';

import { buttonPrimary as btnStyle, buttonSecondary as btnSecStyle } from '../styles';

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

    this._emitter = makeEmitter();
    emitterMixin(this, this._emitter);

    this.keyup = (event) => {
      switch (event.which) {
        case 32: this._emitter.emit('play', 'keyboard'); break;
        case 27: this._emitter.emit('exit'); break;
      }
    };
    document.addEventListener('keyup', this.keyup);

    this._startLevel();

    this._delay();
  }

  _delay () {
    window.clearTimeout(this._timeoutId);
    this._timeoutId = window.setTimeout(() => {
      this._objects.add(new Header(this._textLayer, { y: this._layer.max.y * 0.15, size: 100, text: 'pixel-run' }));
    }, 250);

    this._timeoutId = window.setTimeout(() => {
      const buttonExit = new Button(this._textLayer, Object.assign({}, { y: this._layer.max.y * 0.05, x: this._layer.max.x * 0.92, text: '<ESC>' }, btnSecStyle));
      buttonExit.on('tap', (evt) => this._emitter.emit('exit'));
      this._objects.add(buttonExit);
    }, 400);

    this._timeoutId = window.setTimeout(() => {
      this._objects.add(new Text(this._textLayer, { y: this._layer.max.y * 0.90, size: 20, text: 'or <SPACE> to start' }));
      const buttonStart = new Button(this._textLayer, Object.assign({}, { y: this._layer.max.y * 0.80, size: 50, text: ' play ' }, btnStyle));
      buttonStart.on('tap', (evt) => this._emitter.emit('play'));
      this._objects.add(buttonStart);
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

    document.removeEventListener('keyup', this.keyup);
  }
}

export {
  Demo
};
