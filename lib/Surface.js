const DIV = 'div';
const SURFACE_CLASS_NAME = 'x-canvas-surface';
const PC_100 = '100%';
const ABSOLUTE = 'absolute';

class Surface {
  constructor (canvas) {
    this._canvas = canvas;

    this._bindings = {
      down: [],
      up: [],
      tap: [],
      over: [],
      out: [],
      move: [],
      _cursor: []
    };

    const element = document.createElement(DIV);
    element.classList.add(SURFACE_CLASS_NAME);
    element.style.position = ABSOLUTE;
    element.style.top = 0;
    element.style.left = 0;
    element.style.zIndex = 1000;
    element.style.width = PC_100;
    element.style.height = PC_100;
    this._element = element;

    this._isDown = false;
    this._downOnTaps = [];
    this._activeOverBindings = [];
    this._activeOutBindings = [];

    // -- private

    this._filter = (arr, evt) => {
      return arr.filter((binding) => !binding.filterFn || binding.filterFn(evt));
    };

    this._trigger = (arr, evt, noFilter) => {
      (noFilter ? arr : this._filter(arr, evt)).forEach((binding) => binding.callback(evt));
    };

    this._down = (event, x, y) => {
      this._isDown = true;

      const evt = {
        event,
        x,
        y
      };
      this._trigger(this._bindings.down, evt);

      this._downOnTaps = this._filter(this._bindings.tap, evt);
    };

    this._up = (event, x, y) => {
      this._isDown = false;

      const evt = {
        event,
        x,
        y
      };
      this._trigger(this._downOnTaps, evt);
      this._trigger(this._bindings.up, evt);

      this._downOnTaps.length = 0;
    };

    this._move = (event, x, y) => {
      const evt = {
        event,
        x: x,
        y: y
      };
      this._trigger(this._bindings.move, evt);

      const previouslyActiveOverBindings = this._activeOverBindings;
      this._activeOverBindings = this._filter(this._bindings.over, evt);
      const triggersOver = this._activeOverBindings.filter(activeItem => {
        return !previouslyActiveOverBindings.find((previousItem) => previousItem === activeItem);
      });
      this._trigger(triggersOver, evt);

      const previouslyActiveOutBindings = this._activeOutBindings;
      this._activeOutBindings = this._filter(this._bindings.out, evt);
      const triggersOut = previouslyActiveOutBindings.filter(previousItem => {
        return !this._activeOutBindings.find((activeItem) => activeItem === previousItem);
      });
      this._trigger(triggersOut, evt, true);

      const cursorBindings = this._filter(this._bindings._cursor, evt);
      if (cursorBindings.length) {
        document.body.style.cursor = cursorBindings[0].value;
      } else {
        document.body.style.cursor = 'default';
      }
    };

    this._touchstart = (event) => {
      event.preventDefault();
      const touch = event.changedTouches[0];
      this._down(event, (touch.pageX - this._canvas.offset.x) / this._scale.x, (touch.pageY - this._canvas.offset.y) / this._scale.y);
    };

    this._touchend = (event) => {
      event.preventDefault();
      const touch = event.changedTouches[0];
      this._up(event, (touch.pageX - this._canvas.offset.x) / this._scale.x, (touch.pageY - this._canvas.offset.y) / this._scale.y);
    };

    this._touchmove = (event) => {
      event.preventDefault();
      const touch = event.changedTouches[0];
      // this._move(event, (touch.pageX - this._canvas.offset.x) / this._scale.x, (touch.pageY - this._canvas.offset.y) / this._scale.y);
    };

    this._mousedown = (event) => {
      event.preventDefault();
      this._down(event, event.offsetX, event.offsetY);
    };

    this._mouseup = (event) => {
      event.preventDefault();
      this._up(event, event.offsetX, event.offsetY);
    };

    this._mousemove = (event) => {
      event.preventDefault();
      this._move(event, event.offsetX, event.offsetY);
    };

    this.resize();

    this._element.addEventListener('touchstart', this._touchstart);
    this._element.addEventListener('touchmove', this._touchmove);
    this._element.addEventListener('touchend', this._touchend);
    this._element.addEventListener('mousedown', this._mousedown);
    this._element.addEventListener('mouseup', this._mouseup);
    this._element.addEventListener('mousemove', this._mousemove);
  }

  // -- public

  resize () {
    this._scale = {
      x: this._canvas.transform,
      y: this._canvas.transform
    };
  }

  on (eventName, callback, filterFn) {
    const binding = {
      eventName,
      callback,
      filterFn
    };
    binding.unbind = () => {
      const index = this._bindings[eventName].indexOf(binding);
      if (index !== -1) {
        this._bindings[eventName].splice(index, 1);
      }
    };
    this._bindings[eventName].push(binding);
    return binding;
  }

  cursor (value, filterFn) {
    const binding = {
      value,
      filterFn
    };
    binding.unbind = () => {
      const index = this._bindings._cursor.indexOf(binding);
      if (index !== -1) {
        this._bindings._cursor.splice(index, 1);
      }
    };
    this._bindings._cursor.push(binding);
    return binding;
  }

  destroy () {
    for (let key in this._bindings) {
      this._bindings[key] = [];
    }

    this._element.removeEventListener('touchstart', this._touchstart);
    this._element.removeEventListener('touchmove', this._touchmove);
    this._element.removeEventListener('touchend', this._touchend);
    this._element.removeEventListener('mousedown', this._mousedown);
    this._element.removeEventListener('mousemove', this._mousemove);
    this._element.removeEventListener('mouseup', this._mouseup);
    this._element.removeEventListener('mouseover', this._mouseover);
    this._element.removeEventListener('mouseout', this._mouseout);
  }
}

export {
  Surface
};
