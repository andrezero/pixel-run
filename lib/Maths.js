const PI_1H = Math.PI / 2;
const PI_2H = Math.PI;
const PI_3H = Math.PI * 3 / 2;

const sin = (time, min, max, phase) => {
  phase = phase || 0;
  min = min || 0;
  max = max || 1;
  return min + (max - min) * (1 + Math.sin(time * 2 * Math.PI / 1000 + phase)) / 2;
};

const cos = (time, min, max, phase) => {
  phase = phase || 0;
  min = min || 0;
  max = max || 1;
  return min + (max - min) * (1 + Math.cos(time * 2 * Math.PI / 1000 + phase)) / 2;
};

const ramp = (time, from, to, fn) => {
  fn = fn || linear;
  return from + (to - from) * fn(Math.max(0, Math.min(1, time)));
};

const linear = (time) => {
  return time;
};

const easeInQuad = (time) => {
  return time * time;
};

const easeOutQuad = (time) => {
  return time * (2 - time);
};

const easeInOutQuad = (time) => {
  return time < 0.5 ? 2 * time * time : -1 + (4 - 2 * time) * time;
};

const easeInCubic = (time) => {
  return time * time * time;
};

const easeOutCubic = (time) => {
  return (--time) * time * time + 1;
};

const easeInOutCubic = (time) => {
  return time < 0.5 ? 4 * time * time * time : (time - 1) * (2 * time - 2) * (2 * time - 2) + 1;
};

const collision = (rect1, rect2) => {
  const collisionLeft = rect1[0] + rect1[2] >= rect2[0];
  const collisionRight = rect1[0] <= rect2[0] + rect2[2];
  const collisionTop = rect1[1] + rect1[3] >= rect2[1];
  const collisionBottom = rect1[1] <= rect2[1] + rect2[3];
  return collisionLeft && collisionRight && collisionTop && collisionBottom;
};

export {
  sin,
  cos,
  PI_1H,
  PI_2H,
  PI_3H,
  ramp,
  linear,
  easeInQuad,
  easeOutQuad,
  easeInOutQuad,
  easeInCubic,
  easeOutCubic,
  easeInOutCubic,
  collision
};
