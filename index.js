import deepFreeze from 'deep-freeze'
import expect from 'expect'
import { createStore, combineReducers } from 'redux'
import ReactDOM from 'react-dom'
import React, { Component } from 'react'

const todo = (state, action) => {
	switch (action.type) {
		case 'ADD_TODO' :
			return  {
				id: action.id,
				text: action.text,
				completed: false
			};

		case 'TOGGLE_TODO':
			if (state.id !== action.id) {
				return state;
			}

			//console.log(state.completed);
			
			return Object.assign({}, state, {
				completed: !state.completed
			});

		default:
			return state;

	}
}

const visibilityFilter = (state = 'SHOW_ALL', action) => {
	switch (action.type) {
		case 'SET_VISIBILITY_FILTER':
			return action.filter;
		default:
			return state;
	}
}

const todos =  (state = [], action) => {
	switch (action.type) {
		case 'ADD_TODO' :
			return [
				...state,
				todo(undefined, action)
			];
		case 'TOGGLE_TODO':
			return state.map(t => todo(t, action));
		default:
			return state;
	}

};

/*const combineReducers = (reducers) => {
	return (state = {}, action => {
		return Object.keys(reducers).reduce(
			(nextState, key) => {
				nextState[key] = reducers[key]	(
					state[key],
					action
				);
				return nextState;
			},
			{}
		);
	});
};*/

const todoApp = combineReducers({
	todos,
	visibilityFilter
});

/*const todoApp = (state = {}, action)  => {
	return {
		todos: todos(
			state.todos,
			action
		),
		visibilityFilter:  visibilityFilter(
			state.visibilityFilter,
			action
		)
	};
}; */


const store = createStore(todoApp);

const FilterLink = ({filter,currentFilter,children, onClick}) => {

	if (filter === currentFilter) {
		return <span> {children} </span>
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
};


const Footer = ({ visibilityFilter, onFilterClick  }) => (
	<p>
	 	Show : {'      '}
	 	<FilterLink filter='SHOW_ALL'
	 				currentFilter={visibilityFilter}
	 				children='ALL'
	 				onClick={onFilterClick}>
	 	 </FilterLink>
	 	{'      '}
	 	<FilterLink filter='SHOW_ACTIVE'
	 				currentFilter={visibilityFilter}
	 				children='ACTIVE'
	 				onClick={onFilterClick}>
	 	</FilterLink>
	 	{'      '}
	 	<FilterLink filter='SHOW_COMPLETED'
	 				currentFilter={visibilityFilter}
	 				children='Completed'
	 				onClick={onFilterClick}>
	 	 </FilterLink>
	 </p>
);

const Todo = ({ onClick, completed, text }) => (
	<li  onClick={onClick}
		style={{
			textDecoration:
			completed ? 'line-through' : 'none'
		}}>
		{text}
	</li>
);

const TodoList = ({ todos, onTodoClick }) => (
	<ul>
		{todos.map(todo =>
			<Todo key={todo.id}
				{...todo} onClick={() => onTodoClick(todo.id)}
			/>
		)}
	</ul>

);

const AddTodo = ({ onAddClick }) => {
	let input;

	return (
		<div>
			<input ref={h => input = h} />
			<button onClick={() => {
				onAddClick(input.value);
				input.value = '';
			}}>
			Add Todo
			</button>
		</div>

	)
}

const getVisibleTodos = (todos, filter) => {
	switch (filter) {
		case 'SHOW_ALL':
			return todos;
		case 'SHOW_ACTIVE':
			return todos.filter(
				t => !t.completed
			);
		case 'SHOW_COMPLETED' : 
			return todos.filter(
				t => t.completed
			);
	}
};

let nextTodoId = 0;
const TodoApp = ({ todos, visibilityFilter }) =>
(
	<div>			
		<AddTodo
			onAddClick={text => 
				store.dispatch({
					type: 'ADD_TODO',
					text: text,
					id: nextTodoId++
				})
			}
		/>

		<TodoList
			todos= {
					getVisibleTodos(
						todos,
						visibilityFilter
					)
			}

			onTodoClick = {id => 
				store.dispatch( {
					type: 'TOGGLE_TODO',
					id: id
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

const render = () => {
	ReactDOM.render(
		<TodoApp {...store.getState()} />,
		document.getElementById('root')
	);
};

store.subscribe(render);
render();









/*const testAddTodo = () => {
	const stateBefore  = [];
	const action = {
			type : 'ADD_TODO',
			id: 0, 
			text: 'Learn Redux'
	};
	const stateAfter = [
		{
			id: 0, 
			text: 'Learn Redux',
			completed: false
		}
	];

	deepFreeze(stateBefore);
	deepFreeze(action);

	expect(
		todos(stateBefore, action)
	).toEqual(stateAfter);
};

const testToggleTodo = () => {

	const stateBefore= [
		{
			id: 0, 
			text: 'Learn Redux',
			completed: false
		}, 
		{
			id: 1, 
			text: 'GoShopping',
			completed: false
		}

	];

	const action = {
		type: 'TOGGLE_TODO',
		id: 1
	};

	const stateAfter = [
		{
			id: 0, 
			text: 'Learn Redux',
			completed: false
		}, 
		{
			id: 1, 
			text: 'GoShopping',
			completed: true
		}
	];

	deepFreeze(stateBefore);
	deepFreeze(action);

	expect(
		todos(stateBefore, action)
	).toEqual(stateAfter);

}

testAddTodo();
testToggleTodo();


console.log("All tests are passed.");*/