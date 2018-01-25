'use strict';

function makeEmitter () {
  const callbacks = {};
  const obj = {};

  /**
   * Listen on the given `event` with `fn`.
   *
   * @param {String} event
   * @param {Function} fn
   * @return {Emitter}
   */
  obj.on = function (event, fn) {
    (callbacks[event] = callbacks[event] || []).push(fn);
    return this;
  };

  /**
   * Adds an `event` listener that will be invoked a single
   * time then automatically removed.
   *
   * @param {String} event
   * @param {Function} fn
   * @return {Emitter}
   */
  obj.once = function (event, fn) {
    function on () {
      obj.off(event, on);
      fn.apply(this, arguments);
    }
    obj.on(event, on);
    return this;
  };

  /**
   * Remove the given callback for `event` or all
   * registered callbacks.
   *
   * @param {String} event
   * @param {Function} fn
   * @return {Emitter}
   */
  obj.off = function (event, fn) {
    // specific event
    const eventCallbacks = callbacks[event];
    if (!eventCallbacks) {
      return this;
    }

    // remove specific handler
    let callback;
    for (let ix = 0; ix < eventCallbacks.length; ix++) {
      callback = eventCallbacks[ix];
      if (callback === fn) {
        eventCallbacks.splice(ix, 1);
        break;
      }
    }
    return this;
  };

  /**
   * Emit `event` with the given args.
   *
   * @param {String} event
   * @param {Mixed} ...
   * @return {Emitter}
   */
  obj.emit = function (event) {
    const args = [].slice.call(arguments, 1);
    let eventCallbacks = callbacks[event];

    if (eventCallbacks) {
      eventCallbacks = eventCallbacks.slice(0);
      for (let ix = 0, len = eventCallbacks.length; ix < len; ++ix) {
        eventCallbacks[ix].apply(this, args);
      }
    }

    return this;
  };

  obj.destroy = function () {
    for (let event in callbacks) {
      let eventCallbacks = callbacks[event];
      eventCallbacks.splice(0, eventCallbacks.length);
    }
  };

  return obj;
}

function emitterMixin (object, emitter, methods) {
  methods = methods || ['on', 'once', 'off'];

  methods.forEach(function (method) {
    object[method] = function (event, callback) {
      emitter[method](event, callback);
    };
  });
}

export {
  makeEmitter,
  emitterMixin
};
