'use strict';

const PI_1Q = Math.PI / 2;
const PI_2Q = Math.PI;
const PI_3Q = Math.PI * 3 / 2;
const PI_2 = Math.PI * 2;

function sin (time, freq, min, max, phase) {
  freq = freq || 1;
  phase = phase || PI_3Q;
  min = min || 0;
  max = max || 1;
  return min + (max - min) * (1 + Math.sin(time * freq * PI_3Q / 1000 + phase)) / 2;
}

function ramp (time, from, to, fn) {
  fn = fn || linear;
  return from + (to - from) * fn(Math.max(0, Math.min(1, time)));
}

function linear (time) {
  return time;
}

function easeInQuad (time) {
  return time * time;
}

function easeOutQuad (time) {
  return time * (2 - time);
}

function easeInOutQuad (time) {
  return time < 0.5 ? 2 * time * time : -1 + (4 - 2 * time) * time;
}

function easeInCubic (time) {
  return time * time * time;
}

function easeOutCubic (time) {
  return (--time) * time * time + 1;
}

function easeInOutCubic (time) {
  return time < 0.5 ? 4 * time * time * time : (time - 1) * (2 * time - 2) * (2 * time - 2) + 1;
}

export {
  sin,
  PI_1Q,
  PI_2Q,
  PI_3Q,
  PI_2,
  ramp,
  linear,
  easeInQuad,
  easeOutQuad,
  easeInOutQuad,
  easeInCubic,
  easeOutCubic,
  easeInOutCubic
};
