import { collision } from '../../lib/Maths';
import { ObjCollection } from '../../lib/ObjCollection';
import { makeEmitter, emitterMixin } from '../../lib/emitter';
import { Interactive } from '../../lib/Interactive';

import { Text } from './Text';

const PADDING = 10;
const DEFAULT_SIZE = 20;
const MIN_FONT_PIXELS = 9;
const DEFAULT_COLOR = 'rgb(230, 230, 230)';

class Button {
  constructor (layer, config, text) {
    this._layer = layer;
    this._ctx = layer.ctx;
    this._config = config;
    this._configOn = Object.assign({}, this._config, this._config.on);
    this._configOff = Object.assign({}, this._config, this._config.off);
    this._configOver = Object.assign({}, this._config, this._config.over);
    this._configOut = Object.assign({}, this._config, this._config.out);
    this._currentConfig = this._config;
    this._text = text;

    this._objects = new ObjCollection();

    this._label = new Text(this._layer, this._configOff, text);
    this._objects.add(this._label);

    const overFn = (evt) => collision([evt.x, evt.y, 0, 0], this._label._rect);
    this._interactive = new Interactive(this._layer, overFn, 'pointer');

    this._initEVentListeners();

    this._objects.add(this._interactive);

    this._emitter = makeEmitter();
    emitterMixin(this, this._emitter);

    this._requireRender = true;
  }

  // -- private

  _initEVentListeners () {
    this._interactive.on('down', () => {
      this._configure(this._configOn);
    });

    this._interactive.on('tap', (event) => {
      this._emitter.emit('tap', event);
    });

    this._interactive.on('up', () => {
      this._configure(this._configOff);
    });

    this._interactive.on('over', (event) => {
      this._configure(this._configOver);
    });

    this._interactive.on('out', (event) => {
      this._configure(this._configOut);
    });
  }

  _configure (config) {
    this._currentConfig = config;
    this._objects.destroyOne(this._label);
    this._label = new Text(this._layer, config, this._text);
    this._objects.add(this._label);
    this._requireRender = true;
  }

  // -- api

  hide () {
    this._hidden = true;
    this._requireRender = true;
  }

  // -- AppObject API

  render (delta, timestamp) {
    if (!this._requireRender || this._hidden) {
      return;
    }
    this._requireRender = false;
    const ctx = this._ctx;

    ctx.clearRect(...this._label._rect);

    ctx.fillStyle = this._currentConfig.fillStyle;
    ctx.fillRect(...this._label._rect);
  }

  destroy () {
    this._emitter.destroy();
    this._interactive.destroy();
  }
}

export {
  Button
};
