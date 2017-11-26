'use strict';

import { collision } from './Maths';

const DIV = 'div';
const SURFACE_CLASS_NAME = 'x-canvas-surface';
const PC_100 = '100%';
const ABSOLUTE = 'absolute';

class Surface {
  constructor (canvas) {
    this._canvas = canvas;

    this._bindings = {
      tap: []
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
    this._taps = [];

    this._down = (event, x, y) => {
      this._isDown = true;
      this._taps = this._bindings.tap.filter((binding) => !binding.rect || collision([x, y, 0, 0], binding.rect));
      console.log(this._taps.length, '??', [x, y, 0, 0], this._bindings.tap[0] ? this._bindings.tap[0].rect : '...', this._bindings.tap[1] ? this._bindings.tap[1].rect : '...');
    };

    this._up = (event, x, y) => {
      this._isDown = false;
      this._taps.length = 0;
      const bindings = this._taps.filter((binding) => !binding.rect || collision([x, y, 0, 0], binding.rect));
      if (bindings.length) {
        const evt = {
          event,
          x,
          y
        };
        bindings.forEach((binding) => binding.callback(evt));
      }
    };

    this._touchstart = (event) => {
      event.preventDefault();
      const touch = event.changedTouches[0];
      this._down(event, touch.clientX - this._rect.x, touch.clientY - this._rect.y);
    };

    this._touchmove = (event) => {
      event.preventDefault();
    };

    this._touchend = (event) => {
      event.preventDefault();
      const touch = event.changedTouches[0];
      this._up(event, touch.clientX - this._rect.x, touch.clientY - this._rect.y);
    };

    this._mousedown = (event) => {
      event.preventDefault();
      this._down(event, event.clientX - this._rect.x, event.clientY - this._rect.y);
    };

    this._mousemove = (event) => {
      event.preventDefault();
    };

    this._mouseup = (event) => {
      event.preventDefault();
      this._up(event, event.clientX - this._rect.x, event.clientY - this._rect.y);
    };

    this._mouseover = (event) => {
      event.preventDefault();
    };

    this._mouseout = (event) => {
      event.preventDefault();
    };

    this.resize();

    this._element.addEventListener('touchstart', this._touchstart);
    this._element.addEventListener('touchmove', this._touchmove);
    this._element.addEventListener('touchend', this._touchend);
    this._element.addEventListener('mousedown', this._mousedown);
    this._element.addEventListener('mousemove', this._mousemove);
    this._element.addEventListener('mouseup', this._mouseup);
    this._element.addEventListener('mouseover', this._mouseover);
    this._element.addEventListener('mouseout', this._mouseout);
  }

  // -- private

  _triggerEvent () {
    console.log('!');
  }

  // -- public

  resize () {
    this._rect = this._element.getBoundingClientRect();
  }

  bindEvent (eventName, callback, rect) {
    const binding = {
      eventName,
      callback,
      rect
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
