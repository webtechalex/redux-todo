import {expect} from 'chai';
import deepFreeze from 'deep-freeze';

import todos from '../app/reducers/todos.js';

describe('testing the todos reducer', function() {
  const initialState = [];

  it('should add a given todo to the state', function(done) {
    const action = {
      type: 'ADD_TODO',
      id: 0,
      text: 'Learn Redux'
    };

    // The reducer should be pure
    deepFreeze(initialState);
    deepFreeze(action);

    const newState = [
      {
        id: 0,
        text: 'Learn Redux',
        completed: false
      }
    ];
    expect(todos(initialState, action))
      .to.deep.equal(newState);
    done();
  });

  it('should return the current state given an unkown action', function(done) {
    const action = {
      type: 'BLAH',
      id: 1,
      text: 'trick!'
    };

    // The reducer should be pure
    deepFreeze(initialState);
    deepFreeze(action);

    expect(todos(initialState, action))
      .to.deep.equal(initialState);
    done();
  });
});