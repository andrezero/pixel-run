
import { isFunction } from 'lodash-es/isFunction';

// https://hacks.mozilla.org/2016/06/webfont-preloading-for-html5-games/
const FontFaceObserver = require('fontfaceobserver');

const tests = [{
  pattern: /\.woff$/,
  method: '_loadFont'
}];

class Loader {
  _loadFont (resource) {
    const matches = resource.match(/([a-z]+)\.woff$/i);
    if (!matches) {
      throw new Error('invalid font filename "' + resource + '"');
    }
    const face = matches[1];
    const head = document.querySelector('head');
    const style = document.createElement('style');
    style.innerText = `@font-face { font-family: '${face}'; src: url('${resource}');}`;
    head.appendChild(style);
    const font = new FontFaceObserver(face);
    return font.load();
  }

  _load (resource) {
    const loader = tests.find((item) => {
      return item.pattern.test(resource);
    });
    if (!loader) {
      throw new Error('no loader for "' + resource + '"');
    }
    return this[loader.method](resource);
  }

  load (resources) {
    const promises = resources.map((resource) => this._load(resource));
    return Promise.all(promises);
  }
};

export {
  Loader
};
