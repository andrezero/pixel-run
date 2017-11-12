'use strict';

import { ObjCollection } from '../../lib/ObjCollection';

import { Drop } from './Drop';
import { LevelNumber } from './LevelNumber';
import { Message } from './Message';
import { Wall } from './Wall';

const DEFAULT_SPEED = 1;

class Level {
  constructor (canvas, number, restarts, player, speed, config) {
    this._canvas = canvas;

    this._restarts = restarts;
    this._player = player;

    config.walls = config.walls || [];
    config.drops = config.drops || [];
    config.messages = config.messages || [];
    this._config = config;

    this._ctx = canvas.ctx;

    this._speed = speed || DEFAULT_SPEED;
    this._timestamp = null;
    this._objects = new ObjCollection();

    if (number >= 0) {
      this._objects.add(new LevelNumber(canvas, config, number + 1, !this._restarts));
    }

    for (let ix = 0; ix < config.walls.length; ix++) {
      let wall = new Wall(canvas, this._speed, config.walls[ix]);
      this._objects.add(wall, null, {collision: true});
    }

    for (let ix = 0; ix < this._config.messages.length; ix++) {
      let msg = this._config.messages[ix];
      msg.y = this._canvas.max.y * 0.95;
      msg.size = 20;
      if (!msg.restarts || this._restarts >= msg.restarts) {
        let message = new Message(this._canvas, msg);
        this._objects.add(message);
      }
    }
  }

  // -- AppObjec API

  update (delta, timestamp) {
    if (!this._timestamp) {
      this._timestamp = timestamp;
    }

    let player = this._player;
    for (var ix = 0; ix < this._objects._objects.length; ix++) {
      if (!this._objects._objects[ix].meta.collision) {
        continue;
      }
      let object = this._objects._objects[ix].obj;
      var collisionLeft = player.pos.x + player.size.w > object.pos.x;
      var collisionRight = player.pos.x < object.pos.x + object.size.w;
      var collisionTop = player.pos.y + player.size.h > object.pos.y;
      var collisionBottom = player.pos.y < object.pos.y + object.size.h;
      if (collisionLeft && collisionRight && collisionTop && collisionBottom) {
        player.die();
      }
    }
  }

  destroy () {
    this._objects.destroyAll();
  }
}

export {
  Level
};
