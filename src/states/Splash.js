import { makeEmitter, emitterMixin } from '../../lib/emitter';
import { ObjCollection } from '../../lib/ObjCollection';

import { Header } from '../objects/Header';
import { Button } from '../objects/Button';
import { Text } from '../objects/Text';
import { Menu } from '../objects/Menu';

import { buttonPrimary as btnStyle, buttonSecondary as btnSecStyle } from '../styles';

class Splash {
  constructor (layer, config) {
    this._layer = layer.newLayer('splash');
    this._ctx = this._layer.ctx;
    this._config = config;

    this._textLayer = layer.newLayer('splash-text', null, null, this._config.zIndex);

    this._fontSize = null;
    this._center = null;

    this._objects = new ObjCollection();

    this._emitter = makeEmitter();
    emitterMixin(this, this._emitter);

    this.keyup = (event) => {
      switch (event.which) {
        case 32: this._emitter.emit('play', 'keyboard'); break;
        case 65: this._emitter.emit('about'); break;
        case 72: this._emitter.emit('scores'); break;
        case 73: this._emitter.emit('instructions'); break;
      }
    };
    document.addEventListener('keyup', this.keyup);

    this._delay();
  }

  _delay () {
    this._timeoutId = window.setTimeout(() => {
      this._objects.add(new Header(this._layer, { y: this._layer.center.y, size: 150, text: 'pixel-run' }));
      this._objects.add(new Text(this._textLayer, { y: this._layer.max.y * 0.20, size: 15, text: '(c) 2017 andrezero' }));
    }, 500);

    this._timeoutId = window.setTimeout(() => {
      const buttonInstructions = new Button(this._textLayer, Object.assign({}, { y: this._layer.max.y * 0.67, text: ' <I> instructions ' }, btnSecStyle));
      buttonInstructions.on('tap', (evt) => this._emitter.emit('instructions'));
      this._objects.add(buttonInstructions);
    }, 650);

    this._timeoutId = window.setTimeout(() => {
      const buttonAbout = new Button(this._textLayer, Object.assign({}, { y: this._layer.max.y * 0.72, text: ' <A> about ' }, btnSecStyle));
      buttonAbout.on('tap', (evt) => this._emitter.emit('about'));
      this._objects.add(buttonAbout);
    }, 800);

    this._timeoutId = window.setTimeout(() => {
      const buttonStart = new Button(this._textLayer, Object.assign({}, { y: this._layer.max.y * 0.80, size: 50, text: ' play ' }, btnStyle));
      buttonStart.on('tap', (evt) => this._emitter.emit('play'));
      this._objects.add(buttonStart);
      this._objects.add(new Text(this._textLayer, { y: this._layer.max.y * 0.90, size: 20, text: 'or <SPACE> to start' }));
    }, 1000);
  }

  // -- AppObject API

  render (delta, timestamp) {
    const ctx = this._ctx;
  }

  destroy () {
    this._emitter.destroy();
    this._layer.destroy();
    this._textLayer.destroy();

    document.removeEventListener('keyup', this.keyup);
    window.clearTimeout(this._timeoutId);
  }
}

export {
  Splash
};
