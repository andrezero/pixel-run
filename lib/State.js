'use strict';

class State {
  constructor (name, transitions, debug) {
    const self = this;

    self._name = name;
    self._transitions = transitions;
    self._debug = debug;

    self._state = null;
    self._leaveStateFn = null;
  }

  to (newState, canEnterStateFn, enterStateFn, leaveStateFn) {
    const self = this;
    const oldState = self._state;

    const validStates = self._transitions[newState];

    if (validStates && validStates.indexOf(self._state) === -1) {
      throw new Error('Invalid state transition in "' + self._name + '" from "' + oldState + '" to "' + newState + '"');
    }

    if (canEnterStateFn && !canEnterStateFn(oldState)) {
      if (self._debug) {
        console.warn(self._name + ' > refused transition ' + oldState + ' > ' + newState);
      }
      return false;
    }

    if (self._leaveStateFn) {
      self._leaveStateFn(newState);
    }

    self._state = newState;
    self._leaveStateFn = leaveStateFn;
    if (self._debug) {
      console.log(self._name + ' > ' + oldState + ' to ' + newState);
    }

    enterStateFn();
  }
}

export {
  State
};
