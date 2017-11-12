'use strict';

class ObjCollection {
  constructor () {
    this._objects = [];
  }

  each (fn) {
    this._objects.forEach(fn);
  }

  map (fn) {
    return this._objects.map(fn);
  }

  filter (fn) {
    return this._objects.filter(fn);
  }

  find (fn) {
    return this._objects.find(fn);
  }

  add (object, zIndex, meta) {
    zIndex = zIndex || this._objects.length + 1;
    meta = meta || {};
    this._objects.push({ obj: object, zIndex: zIndex || 0, meta });
    this._objects.sort((a, b) => a.zIndex - b.zIndex);
  }

  resize () {
    for (let ix = 0; ix < this._objects.length; ix++) {
      let object = this._objects[ix].obj;
      if (object.resize) {
        object.resize();
      }
      if (object._objects) {
        object._objects.resize();
      }
    }
  }

  update (delta, timestamp) {
    for (let ix = 0; ix < this._objects.length; ix++) {
      let object = this._objects[ix].obj;
      if (object.update) {
        object.update(delta, timestamp);
      }
      if (object._objects) {
        object._objects.update(delta, timestamp);
      }
    }
  }

  render (delta, timestamp) {
    for (let ix = 0; ix < this._objects.length; ix++) {
      let object = this._objects[ix].obj;
      if (object.render) {
        object.render(delta, timestamp);
      }
      if (object._objects) {
        object._objects.render(delta, timestamp);
      }
    }
  }

  removeOne (object) {
    let index = -1;
    for (let ix = 0; ix < this._objects.length; ix++) {
      if (this._objects[ix].obj === object) {
        index = ix;
        break;
      }
    }
    if (index !== -1) {
      this._objects.splice(index, 1);
    }
  }

  destroyOne (object) {
    this.removeOne(object);
    if (object.destroy) {
      object.destroy();
    }
    if (object._objects) {
      object._objects.destroyAll();
    }
  }

  destroyAll () {
    for (let ix = 0; ix < this._objects.length; ix++) {
      let object = this._objects[ix].obj;
      if (object.destroy) {
        object.destroy();
      }
      if (object._objects) {
        object._objects.destroyAll();
      }
    }
    this._objects.splice(0);
  }

  dump () {
    return this._objects.map((item) => {
      let _ = item.obj.dump ? item.obj.dump() : item.obj;
      if (item.obj._objects) {
        return {_, __: item.obj._objects.dump()};
      } else {
        return _;
      }
    });
  }
}

export {
  ObjCollection
};
