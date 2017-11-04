'use strict';

class ObjCollection {
  constructor () {
    this._objects = [];
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

  add (object, zIndex) {
    this._objects.push({obj: object, zIndex: zIndex || 0});
    this._objects.sort((a, b) => b.zIndex - a.Zindex);
  }

  resize () {
    for (let ix = 0; ix < this._objects.length; ix++) {
      if (this._objects[ix].obj.resize) {
        this._objects[ix].obj.resize();
      }
    }
  }

  update (delta, timestamp) {
    for (let ix = 0; ix < this._objects.length; ix++) {
      if (this._objects[ix].obj.update) {
        this._objects[ix].obj.update(delta, timestamp);
      }
    }
  }

  render (delta, timestamp) {
    for (let ix = 0; ix < this._objects.length; ix++) {
      if (this._objects[ix].obj.render) {
        this._objects[ix].obj.render(delta, timestamp);
      }
    }
  }

  destroyOne (object) {
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
    if (object.destroy) {
      object.destroy();
    }
  }

  destroyAll () {
    for (let ix = 0; ix < this._objects.length; ix++) {
      if (this._objects[ix].obj.destroy) {
        this._objects[ix].obj.destroy();
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
