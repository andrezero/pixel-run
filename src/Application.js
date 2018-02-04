import { Loader } from '../lib/Loader.js';
import { State } from '../lib/State.js';
import { ObjCollection } from '../lib/ObjCollection.js';
import { Frame } from '../lib/Frame.js';
import { Canvas } from '../lib/Canvas.js';
import { Fps } from '../lib/Fps.js';
import { later } from '../lib/util.js';

import { Intro } from './states/Intro.js';
import { Splash } from './states/Splash.js';
import { Demo } from './states/Demo.js';
import { Instructions } from './states/Instructions.js';
import { Game } from './states/Game.js';
import { GameOver } from './states/GameOver.js';
import { Scores } from './states/Scores.js';
import { About } from './states/About.js';
import { Credits } from './states/Credits.js';

import style from './styles/style.css';

const SPEED = 1;
const RESET_SEC = 0.1;
const INTRO_SEC = 0.5;
const SPLASH_SEC = 5;
const DEMO_SEC = 5;
const GAME_OVER_SEC = 1;
const CREDITS_SEC = 10;

class Application {
  constructor (container, config) {
    this._container = container;
    config = config || {};
    config.frame = config.frame || {};
    config.canvas = config.canvas || {};
    this._config = config;
    this._speed = this._config.speed;

    const stateTranstions = {
      'reset': null,
      'intro': ['reset'],
      'splash': [
        'intro',
        'demo',
        'instructions',
        'scores',
        'game-over',
        'about',
        'credits'
      ],
      'demo': ['splash'],
      'instructions': ['splash', 'demo', 'play', 'pause', 'game-over'],
      'play': [
        'intro',
        'splash',
        'demo',
        'instructions',
        'pause',
        'game-over',
        'scores',
        'about'
      ],
      'pause': ['play'],
      'game-over': ['play'],
      'scores': ['splash', 'demo', 'game-over'],
      'about': ['splash', 'demo', 'game-over'],
      'credits': ['splash', 'game-over']
    };

    this._state = new State('App', stateTranstions, true);

    this._loader = new Loader();
    this._loaded = this._loader.load(config.assets);

    this._objects = new ObjCollection();
    this._canvas = new Canvas(this._container, this._config.canvas);
    this._frame = new Frame(this._objects, this._canvas, config.frame);
    this._frame.start();

    this._fps = null;
    this._game = null;
    this._lastGame = null;

    // -- main

    const keypress = (event) => {
      if (!event.ctrlKey) {
        return;
      }
      switch (event.code) {
        case 'KeyK': this.reset(); break;
        case 'KeyF': this.toggleFps(); break;
      }
    };
    document.addEventListener('keypress', keypress);

    this.reset();
  }

  // -- public

  showFps () {
    if (!this._fps) {
      this._fps = new Fps(this._canvas);
      this._objects.add(this._fps);
    }
  }

  hideFps () {
    if (this._fps) {
      this._objects.destroyOne(this._fps);
      this._fps = null;
    }
  }

  toggleFps () {
    if (this._fps) {
      this.hideFps();
    } else {
      this.showFps();
    }
  }

  reset () {
    const enterState = () => {
      this._objects.destroyAll();

      if (this._debug) {
        this.showFps();
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

    const canEnterState = oldState => true;

    const enterState = () => {
      this._intro = new Intro(this._canvas, this._config.state.intro);
      this._objects.add(this._intro);

      const delay = later(INTRO_SEC * 1000);

      Promise.all([delay, this._loaded]).then(() => {
        this.splash();
      });
    };

    const leaveState = (newState) => {
      window.clearTimeout(autoTransition);
    };

    this._state.to('intro', canEnterState, enterState, leaveState);
  }

  splash () {
    let splash;
    let autoTransition;
    let keyup;

    const canEnterState = oldState => true;

    const enterState = () => {
      if (!this._intro) {
        this._intro = new Intro(this._canvas, this._config.state.intro);
        this._objects.add(this._intro);
      }
      splash = new Splash(this._canvas, this._config.state.splash);
      this._objects.add(splash);

      keyup = (event) => {
        switch (event.which) {
          case 32: this.play(); break;
          case 65: this.about(); break;
          case 72: this.scores(); break;
          case 73: this.instructions(); break;
        }
      };
      document.addEventListener('keyup', keyup);

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
      document.removeEventListener('keyup', keyup);
    };

    this._state.to('splash', canEnterState, enterState, leaveState);
  }

  demo () {
    let demo;
    let autoTransition;
    let keyup;

    const canEnterState = oldState => true;

    const enterState = () => {
      const speed = this._speed * this._config.state.demo.speed;
      demo = new Demo(this._canvas, speed, this._config.state.play.levels, this._config.state.demo);
      this._objects.add(demo);

      keyup = (event) => {
        switch (event.which) {
          case 27: this.splash(); break;
          case 88: this.splash(); break;
          case 32: this.play(); break;
        }
      };
      document.addEventListener('keyup', keyup);

      autoTransition = window.setTimeout(() => {
        this.splash();
      }, DEMO_SEC * 1000);
    };

    const leaveState = (newState) => {
      this._objects.destroyOne(demo);
      window.clearTimeout(autoTransition);
      document.removeEventListener('keyup', keyup);
    };

    this._state.to('demo', canEnterState, enterState, leaveState);
  }

  instructions () {
    let instructions;
    let autoTransition;
    let keyup;

    const canEnterState = oldState => true;

    const enterState = () => {
      instructions = new Instructions(this._canvas, this._config.state.instructions);
      this._objects.add(instructions);

      keyup = (event) => {
        switch (event.which) {
          case 27: this.splash(); break;
          case 88: this.splash(); break;
          case 32: this.play(); break;
        }
      };
      document.addEventListener('keyup', keyup);
    };

    const leaveState = (newState) => {
      this._objects.destroyOne(instructions);
      document.removeEventListener('keyup', keyup);
    };

    this._state.to('instructions', canEnterState, enterState, leaveState);
  }

  play () {
    let game;

    const handleGameOver = () => {
      this.gameOver();
    };

    const canEnterState = oldState => true;

    const enterState = () => {
      if (!this._game) {
        const speed = this._speed * this._config.state.play.speed;
        game = new Game(this._canvas, speed, this._config.state.play);
        game.onGameOver(handleGameOver);
        game.onComplete(handleGameOver);
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
        this._lastGame = this._game;
      }
    };

    this._state.to('play', canEnterState, enterState, leaveState);
  }

  pause () {
    const canEnterState = oldState => true;

    const enterState = () => {};

    const leaveState = (newState) => {};

    this._state.to('pause', canEnterState, enterState, leaveState);
  }

  gameOver () {
    let gameOver;
    let autoTransition;
    let keyup;

    const canEnterState = oldState => true;

    const enterState = () => {
      gameOver = new GameOver(this._canvas, this._game, this._config.state.gameOver);
      this._objects.add(gameOver);

      keyup = (event) => {
        switch (event.which) {
          case 27: this.splash(); break;
          case 88: this.splash(); break;
          case 32: this.play(); break;
        }
      };
      autoTransition = window.setTimeout(() => {
        document.addEventListener('keyup', keyup);
      }, GAME_OVER_SEC * 1000);
    };

    const leaveState = (newState) => {
      window.clearTimeout(autoTransition);
      document.removeEventListener('keyup', keyup);
      this._objects.destroyOne(gameOver);
      this._objects.destroyOne(this._game);
      this._game = null;
    };

    this._state.to('game-over', canEnterState, enterState, leaveState);
  }

  scores () {
    let scores;
    let autoTransition;
    let keyup;

    const canEnterState = oldState => true;

    const enterState = () => {
      scores = new Scores(this._canvas, this._config.state.scores);
      this._objects.add(scores);

      keyup = (event) => {
        switch (event.which) {
          case 27: this.splash(); break;
          case 88: this.splash(); break;
          case 32: this.play(); break;
        }
      };
      document.addEventListener('keyup', keyup);
    };

    const leaveState = (newState) => {
      this._objects.destroyOne(scores);
      document.removeEventListener('keyup', keyup);
    };

    this._state.to('scores', canEnterState, enterState, leaveState);
  }

  about () {
    let about;
    let autoTransition;
    let keyup;

    const canEnterState = oldState => true;

    const enterState = () => {
      about = new About(this._canvas, this._config.state.about);
      this._objects.add(about);

      keyup = (event) => {
        switch (event.which) {
          case 27: this.splash(); break;
          case 88: this.splash(); break;
          case 32: this.play(); break;
        }
      };
      document.addEventListener('keyup', keyup);
    };

    const leaveState = (newState) => {
      this._objects.destroyOne(about);
      document.removeEventListener('keyup', keyup);
    };

    this._state.to('about', canEnterState, enterState, leaveState);
  }

  credits () {
    let credits;
    let autoTransition;

    const canEnterState = oldState => this._lastGame.isCompleted();

    const enterState = () => {
      credits = new Credits(this._canvas, this._config.state.credits);
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
