'use strict';

import { State } from '../../lib/State';
import { ObjCollection } from '../../lib/ObjCollection';

import { Header } from '../objects/Header';
import { Text } from '../objects/Text';

class Instructions {
  constructor (layer, config) {
    this._layer = layer.newLayer('instructions');
    this._ctx = this._layer.ctx;
    this._config = config;

    this._textLayer = layer.newLayer('instructions-text', null, null, this._config.zIndex);

    const stateTranstions = {
      'intro': null,
      'space': null,
      'early': null,
      'long': null
    };

    this._state = new State('Instructions', stateTranstions, true);

    this._objects = new ObjCollection();

    this._delay();
  }

  _delay () {
    this._slowDown = false;
    window.clearTimeout(this._timeoutId);
    this._timeoutId = window.setTimeout(() => {
      this._objects.add(new Header(this._layer, { y: this._layer.max.y * 0.15, size: 90, text: 'instructions' }));
      this._objects.add(new Text(this._textLayer, { y: this._layer.max.y * 0.05, text: '<X> exit' }));
      this._objects.add(new Text(this._textLayer, { y: this._layer.max.y * 0.40, text: 'complete all levels before time runs out' }));
      this._objects.add(new Text(this._textLayer, { y: this._layer.max.y * 0.45, text: 'try not to collide with walls and obstacles' }));
      this._objects.add(new Text(this._textLayer, { y: this._layer.max.y * 0.50, text: 'press <SPACE> to slow down' }));
      this._objects.add(new Text(this._textLayer, { y: this._layer.max.y * 0.55, text: 'slowing down for too long will kill you' }));
      this._objects.add(new Text(this._textLayer, { y: this._layer.max.y * 0.60, text: 'slow down early to recover speed sooner' }));
      this._objects.add(new Text(this._textLayer, { y: this._layer.max.y * 0.92, size: 20, text: 'press <SPACE> to start' }));
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
    this._textLayer.destroy();

    window.clearTimeout(this._timeoutId);
  }
}

export {
  Instructions
};
