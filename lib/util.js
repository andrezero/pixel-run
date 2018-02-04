const OBJ = '[object ';
const types = {
  I8: OBJ + 'Int8Array]',
  I16: OBJ + 'Int16Array]',
  I32: OBJ + 'Int32Array]',
  F32: OBJ + 'Float32Array]',
  F64: OBJ + 'Float64Array]',
  U8: OBJ + 'Uint8Array]',
  U8C: OBJ + 'Uint8ClampedArray]',
  U16: OBJ + 'Uint16Array]',
  U32: OBJ + 'Uint32Array]',
  AB: OBJ + 'ArrayBuffer]',
  BL: OBJ + 'Boolean]',
  NM: OBJ + 'Number]',
  ST: OBJ + 'String]',
  DT: OBJ + 'Date]',
  RE: OBJ + 'RegExp]',
  BB: OBJ + 'Blob]'
};

const noop = function () {};

function isWindow (value) {
  return value && value.window === value;
}

function isUndefined (value) {
  return typeof value === 'undefined';
}

function isFunction (value) {
  return typeof value === 'function';
}

function isObject (value) {
  return value !== null && typeof value === 'object';
}

const isArray = Array.isArray;

function isString (value) {
  return typeof value === 'string';
}

function isFalse (value) {
  return !value || value === 'false';
}

function isTrue (value) {
  return value !== 'false' && value;
}

function isNumber (value) {
  return typeof value === 'number';
}

function isNode (value) {
  return !!(isObject(value) && value.nodeName);
}

function isRegularExp (value) {
  return window.toString.call(value) === types.RE;
}

function isDate (value) {
  return window.toString.call(value) === types.DT;
}

function deepCopy (source, destination) {
  const stackSource = [];
  const stackDest = [];

  let copyElement;

  const copyType = function (source) {
    let copied;
    let re;
    switch (toString.call(source)) {
      case types.I8:
      case types.I16:
      case types.I32:
      case types.F32:
      case types.F64:
      case types.U8:
      case types.U8C:
      case types.U16:
      case types.U32:
        return new source.constructor(copyElement(source.buffer), source.byteOffset, source.length);

      case types.AB:
        if (!source.slice) {
          // ie10
          copied = new ArrayBuffer(source.byteLength);
          new Uint8Array(copied).set(new Uint8Array(source));
          return copied;
        }
        return source.slice(0);

      case types.BL:
      case types.NM:
      case types.ST:
      case types.DT:
        return new source.constructor(source.valueOf());

      case types.RE:
        re = new RegExp(source.source, source.toString().match(/[^/]*$/)[0]);
        re.lastIndex = source.lastIndex;
        return re;

      case types.BB:
        return new source.constructor([source], {type: source.type});
    }

    if (isFunction(source.cloneNode)) {
      return source.cloneNode(true);
    }
  };

  copyElement = function (source) {
    // Simple values
    if (!isObject(source)) {
      return source;
    }

    // Already copied values
    const index = stackSource.indexOf(source);
    if (index !== -1) {
      return stackDest[index];
    }

    if (isWindow(source)) {
      throw new Error('Can not clone Window.');
    }

    let needsRecurse = false;
    let destination = copyType(source);

    if (destination === undefined) {
      destination = isArray(source) ? [] : Object.create(Object.getPrototypeOf(source));
      needsRecurse = true;
    }

    stackSource.push(source);
    stackDest.push(destination);

    return needsRecurse ? copyRecurse(source, destination) : destination;
  };

  const copyRecurse = function (source, destination) {
    if (isArray(source)) {
      for (let ix = 0, len = source.length; ix < len; ix++) {
        destination.push(copyElement(source[ix]));
      }
    } else if (source !== null && typeof source === 'object' && !Object.getPrototypeOf(source)) {
      // fast path: no prototype, avoids hasOwnProperty
      for (let key in source) {
        destination[key] = copyElement(source[key]);
      }
    } else if (source && typeof source.hasOwnProperty === 'function') {
      // slow path: relies on hasOwnProperty
      for (let key in source) {
        if (source.hasOwnProperty(key)) {
          destination[key] = copyElement(source[key]);
        }
      }
    } else {
      // Slowest path --- hasOwnProperty can't be called as a method
      for (let key in source) {
        if (hasOwnProperty.call(source, key)) {
          destination[key] = copyElement(source[key]);
        }
      }
    }
    return destination;
  };

  // -- main

  if (destination) {
    if (isArray(destination)) {
      destination.length = 0;
    }
    stackSource.push(source);
    stackDest.push(destination);
    return copyRecurse(source, destination);
  }

  return copyElement(source);
}

function deepMergeRecursive (destination, objects) {
  if (isUndefined(destination)) {
    destination = {};
  }

  for (let ix = 0, objectsLength = objects.length; ix < objectsLength; ++ix) {
    const obj = objects[ix];
    if (!isObject(obj) && !isFunction(obj)) continue;
    const keys = Object.keys(obj);
    for (let ox = 0, keysLength = keys.length; ox < keysLength; ox++) {
      const key = keys[ox];
      const src = obj[key];

      if (isObject(src)) {
        if (isDate(src)) {
          destination[key] = new Date(src.valueOf());
        } else if (isRegularExp(src)) {
          destination[key] = new RegExp(src);
        } else if (src.nodeName) {
          destination[key] = src.cloneNode(true);
        } else if (isNode(src)) {
          destination[key] = src.clone();
        } else {
          if (!isObject(destination[key])) destination[key] = isArray(src) ? [] : {};
          deepMergeRecursive(destination[key], [src], true);
        }
      } else {
        destination[key] = src;
      }
    }
  }

  return destination;
}

function deepMerge (destination) {
  return deepMergeRecursive(destination, [].slice.call(arguments, 1));
}

function deepFreeze (value) {
  Object.freeze(value);

  const oIsFunction = typeof value === 'function';
  const hasOwnProp = Object.prototype.hasOwnProperty;

  Object.getOwnPropertyNames(value).forEach(function (prop) {
    if (hasOwnProp.call(value, prop) &&
      (oIsFunction ? prop !== 'caller' && prop !== 'callee' && prop !== 'arguments' : true) &&
      value[prop] !== null &&
      (typeof value[prop] === 'object' || typeof value[prop] === 'function') &&
      !Object.isFrozen(value[prop])) {
      deepFreeze(value[prop]);
    }
  });

  return value;
}

function defaults (data, defaults) {
  for (let key in defaults) {
    if (isUndefined(data[key])) {
      data[key] = defaults[key];
    }
  }
  return data;
}

function addGetter (instance, name, getter) {
  Object.defineProperty(instance, name, {
    get: getter
  });
}

function later (delay) {
  return new Promise(function (resolve) {
    setTimeout(resolve, delay);
  });
}

export {
  noop,
  isWindow,
  isUndefined,
  isFunction,
  isObject,
  isString,
  isFalse,
  isNumber,
  isNode,
  isRegularExp,
  isDate,
  deepCopy,
  deepMerge,
  deepFreeze,
  defaults,
  addGetter,
  later
};
