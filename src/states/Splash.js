'use strict';

import { ObjCollection } from '../../lib/ObjCollection';

import { Header } from '../objects/Header';
import { Text } from '../objects/Text';
import { Menu } from '../objects/Menu';

class Splash {
  constructor (layer, config) {
    this._layer = layer.newLayer('splash');
    this._ctx = this._layer.ctx;
    this._config = config;

    this._textLayer = layer.newLayer('splash-text', null, null, this._config.zIndex);

    this._fontSize = null;
    this._center = null;

    this._objects = new ObjCollection();

    this._delay();
  }

  _delay () {
    this._timeoutId = window.setTimeout(() => {
      this._objects.add(new Header(this._layer, { y: this._layer.center.y, size: 150, text: 'pixel-run' }));
      this._objects.add(new Text(this._textLayer, { y: this._layer.max.y * 0.90, size: 30, text: 'press <SPACE> to start' }));
      this._objects.add(new Text(this._textLayer, { y: this._layer.max.y * 0.60, size: 15, text: '(c) 2017 andrezero' }));
      this._objects.add(new Menu(this._textLayer, ['<I> instructions', '<A> about']));
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
