'use strict';

import { State } from '../lib/State.js';
import { ObjCollection } from '../lib/ObjCollection.js';
import { Frame } from '../lib/Frame.js';
import { Canvas } from '../lib/Canvas.js';
import { Fps } from '../lib/Fps.js';

import { Intro } from './states/Intro.js';
import { Splash } from './states/Splash.js';
import { Game } from './states/Game.js';
import { About } from './states/About.js';
import { Credits } from './states/Credits.js';

const RESET_SEC = 0.1;
const INTRO_SEC = 1;
const SPLASH_SEC = 10;
const DEMO_SEC = 1;
const CREDITS_SEC = 10;

class Application {
  constructor (container, config) {
    this._container = container;
    config = config || {};
    config.frame = config.frame || {};
    config.canvas = config.canvas || {};
    this._config = config;

    const stateTranstions = {
      'reset': null,
      'intro': ['reset'],
      'splash': ['intro', 'demo', 'instructions', 'scores', 'about', 'credits'],
      'demo': ['splash'],
      'instructions': ['splash', 'demo', 'play', 'pause', 'game-over'],
      'play': ['intro', 'splash', 'demo', 'instructions', 'pause', 'game-over', 'scores', 'about'],
      'pause': ['play'],
      'game-over': ['play'],
      'scores': ['splash', 'demo', 'game-over'],
      'about': ['splash', 'demo', 'game-over', 'scores'],
      'credits': ['splash', 'game-over']
    };

    this._state = new State('App', stateTranstions, this._debug);

    this._objects = new ObjCollection();
    this._canvas = new Canvas(this._container, this._config.canvas);
    this._frame = new Frame(this._objects, this._canvas, config.frame);
    this._frame.start();

    this._fps = null;
    this._game = null;
    this._lastGame = null;

    // -- main

    this.reset();
  }

  // -- public

  reset () {
    const enterState = () => {
      this._objects.destroyAll();

      if (this._config.debug) {
        this._fps = new Fps(this._canvas);
        this._objects.add(this._fps);
      }

      this._game = null;
      this._lastGame = null;

      window.setTimeout(() => {
        this.intro();
      }, RESET_SEC * 1000);
    };

    this._state.to('reset', null, enterState);
  }

  resize () {
    this._canvas.resize();
    this._objects.resize();
  }

  // -- states

  intro () {
    let autoTransition;

    const canEnterState = (oldState) => {
      return true;
    };

    const enterState = () => {
      this._intro = new Intro(this._canvas, this._config.state.intro, this._debug);
      this._objects.add(this._intro);

      autoTransition = window.setTimeout(() => {
        this.splash();
      }, INTRO_SEC * 1000);
    };

    const leaveState = (newState) => {
      window.clearTimeout(autoTransition);
    };

    this._state.to('intro', canEnterState, enterState, leaveState);
  }

  splash () {
    let splash;
    let autoTransition;
    let click;

    const canEnterState = (oldState) => {
      return true;
    };

    const enterState = () => {
      if (!this._intro) {
        this._intro = new Intro(this._canvas, this._config.state.intro, this._debug);
        this._objects.add(this._intro);
      }
      splash = new Splash(this._canvas, this._config.state.splash, this._debug);
      this._objects.add(splash);

      click = () => this.play();
      document.addEventListener('click', click);

      autoTransition = window.setTimeout(() => {
        this.demo();
      }, SPLASH_SEC * 1000);
    };

    const leaveState = (newState) => {
      if (this._intro) {
        this._objects.destroyOne(this._intro);
        this._intro = null;
      }
      this._objects.destroyOne(splash);
      window.clearTimeout(autoTransition);
      document.removeEventListener('click', click);
    };

    this._state.to('splash', canEnterState, enterState, leaveState);
  }

  demo () {
    let autoTransition;
    let click;

    const canEnterState = (oldState) => {
      return true;
    };

    const enterState = () => {
      click = () => this.play();
      document.addEventListener('click', click);

      autoTransition = window.setTimeout(() => {
        this.splash();
      }, DEMO_SEC * 1000);
    };

    const leaveState = (newState) => {
      window.clearTimeout(autoTransition);
      document.removeEventListener('click', click);
    };

    this._state.to('demo', canEnterState, enterState, leaveState);
  }

  instructions () {
    const canEnterState = (oldState) => {
      return true;
    };

    const enterState = () => {};

    const leaveState = (newState) => {};

    this._state.to('instructions', canEnterState, enterState, leaveState);
  }

  play () {
    let game;

    const canEnterState = (oldState) => {
      return true;
    };

    const enterState = () => {
      if (!this._game) {
        game = new Game(this._canvas, this._config.state.play, this._debug);
        this._game = game;
        this._objects.add(game);
      } else {
        this._game.resume();
      }
    };

    const leaveState = (newState) => {
      if (newState === 'pause' || newState === 'instructions') {
        game.pause();
      } else {
        if (this._lastGame) {
          this._objects.destroyOne(this._lastGame);
        }
        this._lastGame = game;
      }
    };

    this._state.to('play', canEnterState, enterState, leaveState);
  }

  pause () {
    const canEnterState = (oldState) => {
      return true;
    };

    const enterState = () => {};

    const leaveState = (newState) => {};

    this._state.to('pause', canEnterState, enterState, leaveState);
  }

  gameOver () {
    const canEnterState = (oldState) => {
      return true;
    };

    const enterState = () => {};

    const leaveState = (newState) => {};

    this._state.to('game-over', canEnterState, enterState, leaveState);
  }

  scores () {
    const canEnterState = (oldState) => {
      return true;
    };

    const enterState = () => {};

    const leaveState = (newState) => {};

    this._state.to('scores', canEnterState, enterState, leaveState);
  }

  about () {
    let about;

    const canEnterState = (oldState) => {
      return true;
    };

    const enterState = () => {
      about = new About(this._canvas, this._config.state.about, this._debug);
      this._objects.add(about);
    };

    const leaveState = (newState) => {
      this._objects.destroyOne(about);
    };

    this._state.to('about', canEnterState, enterState, leaveState);
  }

  credits () {
    let credits;
    let autoTransition;

    const canEnterState = (oldState) => {
      return this._lastGame.isCompleted();
    };

    const enterState = () => {
      credits = new Credits(this._canvas, this._config.state.credits, this._debug);
      this._objects.add(credits);

      autoTransition = window.setTimeout(() => {
        this.splash();
      }, CREDITS_SEC * 1000);
    };

    const leaveState = (newState) => {
      this._objects.destroyOne(credits);
      window.clearTimeout(autoTransition);
    };

    this._state.to('credits', canEnterState, enterState, leaveState);
  }
}

export {
  Application
};
