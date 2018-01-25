'use strict';

import { State } from '../../lib/State';
import { ObjCollection } from '../../lib/ObjCollection';

import { Header } from '../objects/Header';
import { Text } from '../objects/Text';
import { Menu } from '../objects/Menu';

class Scores {
  constructor (layer, config) {
    this._layer = layer.newLayer('scores');
    this._ctx = this._layer.ctx;
    this._config = config;

    const stateTranstions = {
      'intro': null,
      'space': null,
      'early': null,
      'long': null
    };

    this._state = new State('Scores', stateTranstions, true);

    this._objects = new ObjCollection();

    this._delay();
  }

  _delay () {
    this._slowDown = false;
    window.clearTimeout(this._timeoutId);
    this._timeoutId = window.setTimeout(() => {
      this._objects.add(new Header(this._layer, { y: this._layer.max.y * 0.15, size: 90, text: 'high scores' }));
      this._objects.add(new Text(this._layer, { y: this._layer.max.y * 0.05, text: '<X> exit' }));
      this._objects.add(new Text(this._layer, { y: this._layer.max.y * 0.92, size: 20, text: 'press <SPACE> to start' }));
      this._slowDown = true;
    }, 500);
  }

  // -- AppObject API

  render (delta, timestamp) {

  }

  resize () {

  }

  destroy () {
    this._layer.destroy();

    window.clearTimeout(this._timeoutId);
  }
}

export {
  Scores
};
