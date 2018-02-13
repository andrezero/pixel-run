import { isUndefined, isString, isObject, deepCopy } from './util';

/**
 * @description
 * Deep get an object property by supplying the property path.
 *
 * Given the object:
 *
 * ```
 * let obj = {
 *     foo: {
 *         bar: 'baz'
 *     }
 * };
 * ```
 *
 * Supply a path in dot notation to retrieve a value:
 *
 * ```corkDeepPath.get(obj, 'foo.bar'); // 'baz'</pre>
 *
 * If the object does not have the requested property, it throws an Error.
 *
 * ```
 * corkDeepPath.get(obj, 'foo.foo'); // Error: Path "foo.bar" is not defined.
 * ```
 *
 * Supply a default value (something different from `undefined`) to suppress the error.
 *
 * You will get the default back if the object does not have the requested property.
 *
 * ```
 * corkDeepPath.get(obj, 'foo.foo', 'default value'); // 'default value'
 * ```
 *
 * *NOTE:* The retrieved value is a copy of the data held by the provided `obj`. Therefore, modifying the return
 * value of `corkDeepPath.get(obj, ...)` will not modify the object itself (and vice-versa).
 *
 * @param {object} obj The object to read from.
 * @param {string} path The property path to read from, in dot notation. ex: `foo.bar.baz`
 * @param {*=} defaultValue A value to be returned in case the path is undefined.
 * @returns {*} The property value.
 */
function deepPathGet (obj, path, defaultValue) {
  let parts;
  let value = obj;
  let key;
  let args;

  if (isUndefined(path) || isString(path)) {
    parts = path ? path.split('.') : [];
    while (parts.length && value) {
      key = parts.shift();
      if (value.hasOwnProperty(key)) {
        value = value[key];
      } else {
        return defaultValue;
      }
    }
  } else {
    throw new Error('Invalid path "' + path + '"');
  }

  return isObject(value) ? deepCopy(value) : value;
}

/**
 * @description
 * Deep set the value of an object property by supplying a property path and a new value.
 *
 * ```
 * corkDeepPath.set(obj, 'foo.qux', 'new value'); // obj.foo.qux = 'new value'
 * ```
 *
 * *NOTE:* The data stored in the object is a deep copy of the provided value. Therefore, modifying the `value` after
 * calling `corkDeepPath.set(obj, path, value)` will not modify the object itself (and vice-versa).
 *
 * @param {object} obj The object to write to.
 * @param {string} path The property path to write to, in dot notation. ex: `foo.bar.baz`
 * @param {*} value The value to set.
 */
function deepPathSet (obj, path, value) {
  let parts;
  let val = obj;
  let key;

  if (isString(path)) {
    parts = path.split('.');
    while (parts.length > 1 && val) {
      key = parts.shift();
      if (!val.hasOwnProperty(key) || !isObject(val[key])) {
        val[key] = {};
      }
      val = val[key];
    }

    key = parts.shift();
    val[key] = isObject(value) ? deepCopy(value) : value;
  } else {
    throw new Error('Invalid path "' + path + '"');
  }
}

/**
 * @description
 * Deep delete an object property by supplying the property path.
 *
 * ```
 * corkDeepPath.del(obj, 'foo'); // obj.foo = undefined, obj = {baz: [101]}
 * ```
 *
 * @param {object} obj The object to write to.
 * @param {string} path The property path to delete, in dot notation. ex: `foo.bar.baz`
 */
function deepPathDel (obj, path) {
  let parts;
  let value = obj;
  let key;
  let args;

  if (isString(path)) {
    parts = path ? path.split('.') : [];
    while (parts.length && value) {
      key = parts[0];
      if (parts.length === 1) {
        if (value.hasOwnProperty(key)) {
          delete value[key];
        }
        return;
      }
      value = value[key];
      parts.shift();
    }
  } else {
    throw new Error('Invalid path "' + path + '"');
  }
}

/**
 * @description
 * Constructor.
 *
 * ```
 * let obj = new ObjDeepPath({foo: bar});
 * ```
 *
 * @param {object} data Seed data.
 */
function ObjDeepPath (data, readOnly) {
  /**
   * @description
   * Deep get a property of the object by supplying the property path.
   *
   * Supply a path in dot notation to retrieve a value:
   *
   * ```
   * obj.get('foo.bar'); // 'baz'</pre>
   * ```
   *
   * If the object does not have the requested property, it throws an Error.
   *
   * ```
   * obj.get(obj, 'foo.foo'); // Error: Path "foo.bar" is not defined.
   * ```
   *
   * Supply a default value (something different from `undefined`) to suppress the error.
   *
   * You will get the default back if the object does not have the requested property.
   *
   * ```
   * obj.get('foo.foo', 'default value'); // 'default value'
   * ```
   *
   * *NOTE:* The retrieved value is a copy of the data held by the provided `obj`. Therefore, modifying the return
   * value of `obj.get(...)` will not modify the object itself (and vice-versa).
   *
   * @param {string} path The property path to read from, in dot notation. ex: `foo.bar.baz`
   * @param {*=} defaultValue A value to be returned in case the object does not have the requested property.
   * @returns {*} The property value.
   */
  this.get = (path, defaultValue) => {
    return deepPathGet(data, path, defaultValue);
  };

  /**
   * @description
   * Deep set the value of a property of the object by supplying the property path and a new value.
   *
   * ```
   * obj.set('foo.qux', 'new value'); // obj.foo.qux = 'new value'
   * ```
   *
   * *NOTE:* The data stored in the object is a deep copy of the provided value. Therefore, modifying the `value` after
   * calling `obj.set(path, value)` will not modify the object itself (and vice-versa).
   *
   * @param {string} path The property path to write to, in dot notation. ex: `foo.bar.baz`
   * @param {*} value The value to set.
   */
  function set (path, value) {
    deepPathSet(this, path, value);
  }

  /**
   * @description
   * Deep delete a property of the object by supplying the property path.
   *
   * ```
   * obj.del('foo'); // obj.foo = undefined, obj = {baz: [101]}
   * ```
   *
   * @param {object} data Data to replace with.
   *
   * @param {string} path The property path to delete, in dot notation. ex: `foo.bar.baz`
   */
  function del (path) {
    deepPathDel(this, path);
  }

  if (!readOnly) {
    this.set = set;
    this.del = del;
  }
}

export {
  deepPathSet,
  deepPathGet,
  deepPathDel,
  ObjDeepPath
};
