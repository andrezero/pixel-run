'use strict';

class State {
  constructor (name, transitions, debug) {
    this._name = name;
    this._transitions = transitions;
    this._debug = debug;

    this._state = null;
    this._leaveStateFn = null;
  }

  to (newState, canEnterStateFn, enterStateFn, leaveStateFn) {
    const oldState = this._state;

    const validStates = this._transitions[newState];

    if (validStates && validStates.indexOf(this._state) === -1) {
      throw new Error('Invalid state transition in "' + this._name + '" from "' + oldState + '" to "' + newState + '"');
    }

    if (canEnterStateFn && !canEnterStateFn(oldState)) {
      if (this._debug) {
        console.warn(this._name + ' > refused transition ' + oldState + ' > ' + newState);
      }
      return false;
    }

    if (this._leaveStateFn) {
      this._leaveStateFn(newState);
    }

    this._state = newState;
    this._leaveStateFn = leaveStateFn;
    if (this._debug) {
      console.log(this._name + ' > ' + oldState + ' to ' + newState);
    }

    enterStateFn();
  }
}

export {
  State
};
