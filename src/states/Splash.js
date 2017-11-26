'use strict';

import { ObjCollection } from '../../lib/ObjCollection';

import { Header } from '../objects/Header';
import { Message } from '../objects/Message';
import { Menu } from '../objects/Menu';

class Splash {
  constructor (canvas, config) {
    this._canvas = canvas;
    this._config = config;

    this._layer = canvas.newLayer('splash');
    this._ctx = this._layer.ctx;

    this._textLayer = canvas.newLayer('splash-text', null, null, this._config.zIndex);

    this._fontSize = null;
    this._center = null;

    this._objects = new ObjCollection();

    this._delay();
  }

  _delay () {
    this._timeoutId = window.setTimeout(() => {
      this._objects.add(new Header(this._layer, { y: this._canvas.center.y, size: 150, text: 'pixel-run' }));
      this._objects.add(new Message(this._textLayer, { y: this._canvas.max.y * 0.90, size: 30, text: 'press <SPACE> to start' }));
      this._objects.add(new Menu(this._textLayer, ['<I> instructions', '<H> high scores', '<A> about']));
    }, 500);
  }

  // -- AppObject API

  render (delta, timestamp) {
    const ctx = this._ctx;
  }

  destroy () {
    this._layer.destroy();
    this._textLayer.destroy();

    window.clearTimeout(this._timeoutId);
  }
}

export {
  Splash
};
