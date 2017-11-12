'use strict';

import { State } from '../../lib/State';
import { ObjCollection } from '../../lib/ObjCollection';

import { Header } from '../objects/Header';
import { Message } from '../objects/Message';

class GameOver {
  constructor (canvas, config) {
    this._canvas = canvas;
    this._config = config;

    this._layer = canvas.newLayer('game-over');
    this._ctx = this._layer.ctx;

    const stateTranstions = {
      'intro': null,
      'space': null,
      'early': null,
      'long': null
    };

    this._state = new State('game-over', stateTranstions, true);

    this._objects = new ObjCollection();

    this._delay();
  }

  _delay () {
    this._slowDown = false;
    window.clearTimeout(this._timeoutId);
    this._timeoutId = window.setTimeout(() => {
      this._objects.add(new Header(this._canvas, { y: this._canvas.max.y * 0.15, size: 90, text: 'game over' }));
      this._timeoutId = window.setTimeout(() => {
        this._objects.add(new Message(this._canvas, { y: this._canvas.max.y * 0.05, text: '<X> exit' }));
        this._objects.add(new Message(this._canvas, { y: this._canvas.max.y * 0.95, size: 20, text: 'press <SPACE> to restart' }));
      }, 250);
      this._slowDown = true;
    }, 750);
  }

  // -- AppObject API

  render (delta, timestamp) {

  }

  resize () {

  }

  destroy () {
    this._canvas.destroyLayer(this._layer);

    window.clearTimeout(this._timeoutId);
  }
}

export {
  GameOver
};
