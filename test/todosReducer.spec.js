import {expect} from 'chai';
import deepFreeze from 'deep-freeze';

import todos from '../app/reducers/todos.js';
import visibilityFilter from '../app/reducers/visibilityFilter.js';
import todoApp from '../app/reducers/todoApp.js';
// console.log(todoApp());

describe('testing the todos reducer', function() {
  it('should add a given todo to the state', function(done) {
    const initialState = [];
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
    const initialState = [];
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

  it('should return a toggled todo, given the appropriate action', function(done) {
    const initialState = [
      {
        id: 0,
        text: 'Learn Redux',
        completed: false
      },
      {
        id: 1,
        text: 'Go shopping',
        completed: false
      }
    ];
    const action = {
      type: 'TOGGLE_TODO',
      id: 1
    }
    const newState = [
      {
        id: 0,
        text: 'Learn Redux',
        completed: false
      },
      {
        id: 1,
        text: 'Go shopping',
        completed: true
      }
    ];
    deepFreeze(initialState);
    deepFreeze(action);

    expect(todos(initialState, action))
      .to.deep.equal(newState);
    done();
  });

  it('should return initial states when calling the main reducer with no arguments', function(done) {
    const initialState = {
      todos: [],
      visibilityFilter: 'SHOW_ALL'
    }
    expect(todoApp())
      .to.deep.equal(initialState)
    done();
  });
});