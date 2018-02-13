import { makeEmitter, emitterMixin } from '../../lib/emitter';
import { State } from '../../lib/State';
import { ObjCollection } from '../../lib/ObjCollection';

import { Header } from '../objects/Header';
import { Text } from '../objects/Text';
import { Button } from '../objects/Button';

import { buttonPrimary as btnStyle, buttonSecondary as btnSecStyle } from '../styles';

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

    this._emitter = makeEmitter();
    emitterMixin(this, this._emitter);

    this.keyup = (event) => {
      switch (event.which) {
        case 32: this._emitter.emit('play', 'keyboard'); break;
        case 27: this._emitter.emit('exit'); break;
      }
    };
    document.addEventListener('keyup', this.keyup);

    this._delay();
  }

  _delay () {
    this._slowDown = false;
    window.clearTimeout(this._timeoutId);
    this._timeoutId = window.setTimeout(() => {
      this._objects.add(new Header(this._layer, { y: this._layer.max.y * 0.15, size: 90, text: 'instructions' }));

      const buttonExit = new Button(this._textLayer, Object.assign({}, { y: this._layer.max.y * 0.05, x: this._layer.max.x * 0.92, text: '<ESC>' }, btnSecStyle));
      buttonExit.on('tap', (evt) => this._emitter.emit('exit'));
      this._objects.add(buttonExit);

      this._objects.add(new Text(this._textLayer, { y: this._layer.max.y * 0.40, text: 'complete all levels before time runs out' }));
      this._objects.add(new Text(this._textLayer, { y: this._layer.max.y * 0.45, text: 'try not to collide with walls and obstacles' }));
      this._objects.add(new Text(this._textLayer, { y: this._layer.max.y * 0.50, text: 'tap and hold / hold down <SPACE> to slow down' }));
      this._objects.add(new Text(this._textLayer, { y: this._layer.max.y * 0.55, text: 'slowing down for too long will kill you' }));
      this._objects.add(new Text(this._textLayer, { y: this._layer.max.y * 0.60, text: 'slow down early to recover speed sooner' }));

      this._objects.add(new Text(this._textLayer, { y: this._layer.max.y * 0.90, size: 20, text: 'or <SPACE> to start' }));
      const buttonStart = new Button(this._textLayer, Object.assign({}, { y: this._layer.max.y * 0.80, size: 50, text: ' play ' }, btnStyle));
      buttonStart.on('tap', (evt) => this._emitter.emit('play'));
      this._objects.add(buttonStart);
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
    document.removeEventListener('keyup', this.keyup);
  }
}

export {
  Instructions
};
