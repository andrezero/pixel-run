'use strict';

const bytes = [];
for (let ix = 0; ix < 256; ix++) {
  bytes[ix] = (ix < 16 ? '0' : '') + (ix).toString(16);
}

/**
 * Fast UUID generator, RFC4122 version 4 compliant.
 * @author Jeff Ward (jcward.com).
 * @license MIT license
 * @link http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/21963136#21963136
 */
const uuid = () => {
  var d0 = Math.random() * 0xffffffff | 0;
  var d1 = Math.random() * 0xffffffff | 0;
  var d2 = Math.random() * 0xffffffff | 0;
  var d3 = Math.random() * 0xffffffff | 0;
  return bytes[d0 & 0xff] + bytes[d0 >> 8 & 0xff] + bytes[d0 >> 16 & 0xff] + bytes[d0 >> 24 & 0xff] + '-' + bytes[d1 & 0xff] + bytes[d1 >> 8 & 0xff] + '-' + bytes[d1 >> 16 & 0x0f | 0x40] + bytes[d1 >> 24 & 0xff] + '-' + bytes[d2 & 0x3f | 0x80] + bytes[d2 >> 8 & 0xff] + '-' + bytes[d2 >> 16 & 0xff] + bytes[d2 >> 24 & 0xff] + bytes[d3 & 0xff] + bytes[d3 >> 8 & 0xff] + bytes[d3 >> 16 & 0xff] + bytes[d3 >> 24 & 0xff];
};

export {
  uuid
};
