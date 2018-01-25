'use strict';

import { State } from '../../lib/State';
import { ObjCollection } from '../../lib/ObjCollection';

import { Header } from '../objects/Header';
import { Text } from '../objects/Text';
import { Button } from '../objects/Button';

class About {
  constructor (layer, config) {
    this._layer = layer.newLayer('about');
    this._ctx = this._layer.ctx;
    this._config = config;

    this._textLayer = layer.newLayer('about-text', null, null, config.zIndex);
    this._objects = new ObjCollection();

    this._linkConfig = {
      bgColor: 'orange', color: 'black',
      over: { bgColor: 'white', color: 'black' },
      on: { bgColor: 'yellow', color: 'black' },
    };

    this._delay();
  }

  _delay () {
    this._slowDown = false;
    window.clearTimeout(this._timeoutId);
    this._timeoutId = window.setTimeout(() => {
      this._objects.add(new Header(this._layer, { y: this._layer.max.y * 0.15, size: 90, text: 'about' }));
      this._objects.add(new Text(this._textLayer, { y: this._layer.max.y * 0.40, text: 'pixel-run is a javascript / canvas mini game' }));
      this._objects.add(new Text(this._textLayer, { y: this._layer.max.y * 0.45, text: 'developed by' }));

      let button1 = new Button(this._textLayer, Object.assign({}, { y: this._layer.max.y * 0.50, text: 'andrezero' }, this._linkConfig));
      button1.on('tap', function () {
        // window.location.href = 'http://google.com/';
        console.log('=>');
      });
      this._objects.add(button1);

      this._objects.add(new Text(this._textLayer, { y: this._layer.max.y * 0.65, text: 'did you like this game?' }));

      let button2 = new Button(this._textLayer, Object.assign({}, { y: this._layer.max.y * 0.70, text: 'send your feedback' }, this._linkConfig));
      this._objects.add(button2);
      button2.on('tap', () => {
        // window.location.href = 'http://google.com/';
        console.log('=>');
      });

      this._objects.add(new Text(this._textLayer, { y: this._layer.max.y * 0.05, text: '<X> exit' }));
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
  About
};
