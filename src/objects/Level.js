'use strict';

import { ObjCollection } from '../../lib/ObjCollection';
import { collision } from '../../lib/Maths';

import { Drop } from './Drop';
import { LevelNumber } from './LevelNumber';
import { Text } from './Text';
import { Wall } from './Wall';

const DEFAULT_SPEED = 1;

class Level {
  constructor (layer, number, restarts, player, speed, config) {
    this._layer = layer;
    this._config = config;

    this._layers = {
      walls: layer.newLayer('walls', null, null, this._config.zIndex),
      messages: layer.newLayer('messages', null, null, this._config.zIndex)
    };

    this._restarts = restarts;
    this._player = player;

    config.walls = config.walls || [];
    config.drops = config.drops || [];
    config.messages = config.messages || [];
    config.maxX = config.maxX || 1000;
    this._config = config;

    this._onCompleteCallback = null;

    this._speed = speed || DEFAULT_SPEED;
    this._timestamp = null;
    this._objects = new ObjCollection();

    for (let ix = 0; ix < config.walls.length; ix++) {
      let wall = new Wall(this._layers.walls, this._speed, config.walls[ix]);
      this._objects.add(wall, null, {collision: true});
    }

    for (let ix = 0; ix < this._config.messages.length; ix++) {
      let msg = this._config.messages[ix];
      msg.y = this._layer.max.y * 0.95;
      msg.size = 20;
      if (!msg.restarts || this._restarts >= msg.restarts) {
        let message = new Text(this._layers.messages, msg);
        this._objects.add(message);
      }
    }
  }

  // -- public

  onComplete (onCompleteCallback) {
    this._onCompleteCallback = onCompleteCallback;
  }

  freeze () {
    this._objects.each((item) => {
      if (item.obj.hide) {
        item.obj.hide();
      }
    });
  }

  // -- AppObjec API

  update (delta, timestamp) {
    if (!this._timestamp) {
      this._timestamp = timestamp;
    }

    let player = this._player;

    if (!player.isDead && player.pos.x > this._config.maxX) {
      this._onCompleteCallback();
      return;
    }

    for (var ix = 0; ix < this._objects._objects.length; ix++) {
      if (!this._objects._objects[ix].meta.collision) {
        continue;
      }
      let object = this._objects._objects[ix].obj;
      let rect1 = [player.pos.x, player.pos.y, player.size.w, player.size.h];
      let rect2 = [object.pos.x, object.pos.y, object.size.w, object.size.h];
      if (collision(rect1, rect2)) {
        player.die();
      }
    }
  }

  render () {
    this._layers.walls.clear();
  }

  destroy () {
    for (let key in this._layers) {
      this._layers[key].destroy();
    }

    this._onCompleteCallback = null;
  }
}

export {
  Level
};
