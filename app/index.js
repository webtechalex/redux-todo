import React, {Component} from 'react';
import {Provider, connect} from 'react-redux';
import {combineReducers, createStore} from 'redux';
import ReactDOM from 'react-dom';

import todos from './reducers/todos';
import visibilityFilter from './reducers/visibilityFilter';

// import App from './components/App.js';

const todoApp = combineReducers({
  todos,
  visibilityFilter
});

// ACTION CREATORS ----------------------------------------
let nextTodoId = 0;
const addTodo = (text) => {
  return {
    type: 'ADD_TODO',
    id: nextTodoId++,
    text
  };
}

const toggleTodo = (id) => {
  return {
    type: 'TOGGLE_TODO',
    id
  };
}

const setVisibilityFilter = (filter) => {
  return {
    type: 'SET_VISIBILITY_FILTER',
    filter
  };
}
// --------------------------------------------------------
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

// This component fits neither the role of container, nor presentational component, but the functionality is very simple
let AddTodo = ({dispatch}) => {
  // as this is a functional component, the input ref can be a variable instead of a property on the class
  let input;
  return (
    <div>
      <input ref={node => {
          input = node;
        }}
      />
      <button
        onClick={() => {
          dispatch(addTodo(input.value));
          input.value = '';
        }}
      >
        Add todo
      </button>
    </div>
  );
}

AddTodo = connect()(AddTodo);

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

const mapStateToTodoListProps = (state) => {
  return {
    todos: getVisibleTodos(
      state.todos,
      state.visibilityFilter
    )
  };
}

const mapDispatchToTodoListProps = (dispatch) => {
  return {
    onTodoClick: (id) =>
      dispatch(toggleTodo(id))
  }
}

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

const VisibleTodoList = connect(
  mapStateToTodoListProps,
  mapDispatchToTodoListProps
)(TodoList);

// each link receives an active prop from its container, to determine whether a span or anchor is rendered
// links also receive an onClick handler from their container
const Link = ({
  active,
  children,
  onClick
}) => {
  if (active) {
    return (
      <span>{children}</span>
    );
  }
  return (
    <a href='#'
      onClick={e => {
        e.preventDefault();
        onClick();
      }}
    >
      {children}
    </a>
  );
}

const mapStateToLinkProps = (state, ownProps) => {
  return {
    active: ownProps.filter === state.visibilityFilter
  }
}

const mapDispatchToLinkProps = (dispatch, ownProps) => {
  return {
    onClick: () =>
      dispatch(setVisibilityFilter(ownProps.filter))
  }
}

const FilterLink = connect(
  mapStateToLinkProps,
  mapDispatchToLinkProps
)(Link);

// pass a filter prop to each filter container to be used when dispatching actions
const Footer = () => (
  <p>
    Show:
    {' '}
    <FilterLink
      filter='SHOW_ALL'
    >
      All
    </FilterLink>
    {' '}
    <FilterLink
      filter='SHOW_ACTIVE'
    >
      Active
    </FilterLink>
    {' '}
    <FilterLink
      filter='SHOW_COMPLETED'
    >
      Completed
    </FilterLink>
  </p>
);

// receive the Redux store state as props and render child components
const App = () => (
  <div>
    <AddTodo />
    <VisibleTodoList />
    <Footer />
  </div>
);

// class Provider extends Component {
//   getChildContext() {
//     return {
//       store: this.props.store
//     };
//   }

//   render() {
//     return this.props.children
//   }
// }
// Provider.childContextTypes = {
//   store: React.PropTypes.object
// }

// render the app  to the destination element and pass in the Redux state as props
ReactDOM.render(
  <Provider store={createStore(todoApp)}>
    <App />
  </Provider>,
  document.getElementById('app')
);
