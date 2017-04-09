import React, {Component} from 'react';
import {combineReducers, createStore} from 'redux';
import ReactDOM from 'react-dom';

import todos from './reducers/todos';
import visibilityFilter from './reducers/visibilityFilter';

// import App from './components/App.js';

const todoApp = combineReducers({
  todos,
  visibilityFilter
});
const store = createStore(todoApp);
let nextTodoId = 0;

// pre-filter the list of todos against the visibilityFilter state before passing to TodoList
const getVisibleTodos = (
  todos,
  filter
) => {
  switch (filter) {
    case 'SHOW_ALL':
      return todos;
    case 'SHOW_ACTIVE':
      return todos.filter(todo => !todo.completed);
    case 'SHOW_COMPLETED':
      return todos.filter(todo => todo.completed);
  }
}

// receive ADD_TODO dispatch call and call it on button click, passing the input value and nextTodoId
const AddTodo = ({
  onAddClick
}) => {

  // as this is a functional component, the ref can be a variable instead of a property on the class
  let input;

  return (
    <div>
      <input ref={node => {
          input = node;
        }}
      />
      <button
        onClick={() => {
          onAddClick(input.value);
          input.value = '';
        }}
      >
        Add todo
      </button>
    </div>
  );
}

// each Todo needs an onClick handler which is passed in to the TodoList component, dispatching TOGGLE_TODO
// each Todo also needs to know its text, and completed values for content and styling
const Todo = ({
  onClick,
  completed,
  text
}) => (
  <li
    onClick={onClick}
    style={{
      textDecoration: completed ?
        'line-through' :
        'none',
      cursor: 'pointer'
    }}
  >
    {text}
  </li>
);

// render each Todo item from the passed-in todos array, pre-filtered by the visibility filter
const TodoList = ({
  todos,
  onTodoClick
}) => (
  <ul>
    {todos.map((todo) => 
      <Todo
        key={todo.id}
        {...todo}
        onClick={() => onTodoClick(todo.id)}
      />
    )}
  </ul>
);

// each link receives a fixed filter prop to compare to the state, to determine whether a span or anchor is rendered
// links also send their filter prop to the onClick handler to dispatch the SET_VISIBILITY_FILTER action
const FilterLink = ({
  filter,
  currentFilter,
  children,
  onClick
}) => {
  if (filter === currentFilter) {
    return (
      <span>{children}</span>
    );
  }
  return (
    <a href='#'
      onClick={e => {
        e.preventDefault();
        onClick(filter);
      }}
    >
      {children}
    </a>
  );
}

// take the visibilityFilter from state and a handler to control clicking of each filter
const Footer = ({
  visibilityFilter,
  onFilterClick
}) => (
  <p>
    Show:
    {' '}
    <FilterLink
      filter='SHOW_ALL'
      currentFilter={visibilityFilter}
      onClick={onFilterClick}
    >
      All
    </FilterLink>
    {' '}
    <FilterLink
      filter='SHOW_ACTIVE'
      currentFilter={visibilityFilter}
      onClick={onFilterClick}
    >
      Active
    </FilterLink>
    {' '}
    <FilterLink
      filter='SHOW_COMPLETED'
      currentFilter={visibilityFilter}
      onClick={onFilterClick}
    >
      Completed
    </FilterLink>
  </p>
);

// receive the Redux store state as props and render child components
const App = ({
  todos,
  visibilityFilter
}) => (
  <div>
    <AddTodo
      onAddClick={text =>
        store.dispatch({
          type: 'ADD_TODO',
          id: nextTodoId++,
          text
        })
      }
    />
    <TodoList
      todos={
        getVisibleTodos(
          todos,
          visibilityFilter
        )
      }
      onTodoClick={id =>
        store.dispatch({
          type: 'TOGGLE_TODO',
          id
        })
      }
    />
    <Footer
      visibilityFilter={visibilityFilter}
      onFilterClick={filter =>
        store.dispatch({
          type: 'SET_VISIBILITY_FILTER',
          filter
        })
      }
    />
  </div>
);

// render the app  to the destination element and pass in the Redux state as props
const render = () => {
  ReactDOM.render(
    <App
      todos={store.getState().todos}
      visibilityFilter={store.getState().visibilityFilter}
    />,
    document.getElementById('app')
  );
}

// subscribe the app to the Redux store so that it can receive the state objects as props
store.subscribe(render);

// render the app for the first time
render();