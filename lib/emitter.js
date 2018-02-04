'use strict';

const makeEmitter = () => {
  const callbacks = {};
  const obj = {};

  /**
   * Listen on the given `event` with `fn`.
   *
   * @param {String} event
   * @param {Function} fn
   * @return {Emitter}
   */
  obj.on = (event, fn) => {
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
  obj.once = (event, fn) => {
    const on = () => {
      obj.off(event, on);
      fn.apply(this, arguments);
    };
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
  obj.off = (event, fn) => {
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
  obj.emit = (event) => {
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

  obj.destroy = () => {
    for (let event in callbacks) {
      let eventCallbacks = callbacks[event];
      eventCallbacks.splice(0, eventCallbacks.length);
    }
  };

  return obj;
};

const emitterMixin = (object, emitter, methods) => {
  methods = methods || ['on', 'once', 'off'];

  methods.forEach((method) => {
    object[method] = (event, callback) => {
      emitter[method](event, callback);
    };
  });
};

export {
  makeEmitter,
  emitterMixin
};
