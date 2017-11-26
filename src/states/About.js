'use strict';

import { State } from '../../lib/State';
import { ObjCollection } from '../../lib/ObjCollection';

import { Header } from '../objects/Header';
import { Message } from '../objects/Message';
import { Link } from '../objects/Link';

class About {
  constructor (canvas, config) {
    this._canvas = canvas;
    this._config = config;

    this._layer = canvas.newLayer('about');
    this._ctx = this._layer.ctx;

    this._textLayer = canvas.newLayer('about-text', null, null, this._config.zIndex);

    this._objects = new ObjCollection();

    this._delay();
  }

  _delay () {
    this._slowDown = false;
    window.clearTimeout(this._timeoutId);
    this._timeoutId = window.setTimeout(() => {
      this._objects.add(new Header(this._layer, { y: this._canvas.max.y * 0.15, size: 90, text: 'about' }));
      this._objects.add(new Message(this._textLayer, { y: this._canvas.max.y * 0.40, text: 'pixel-run is a javascript / canvas mini game' }));
      this._objects.add(new Message(this._textLayer, { y: this._canvas.max.y * 0.45, text: 'developed by' }));
      this._objects.add(new Link(this._textLayer, { y: this._canvas.max.y * 0.50, color: 'yellow', text: 'andrezero' }));
      this._objects.add(new Message(this._textLayer, { y: this._canvas.max.y * 0.65, text: 'did you like this game?' }));
      this._objects.add(new Link(this._textLayer, { y: this._canvas.max.y * 0.70, color: 'orange', text: 'send your feedback' }));
      this._objects.add(new Message(this._textLayer, { y: this._canvas.max.y * 0.05, text: '<X> exit' }));
      this._objects.add(new Message(this._textLayer, { y: this._canvas.max.y * 0.92, size: 20, text: 'press <SPACE> to start' }));
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
  About
};
