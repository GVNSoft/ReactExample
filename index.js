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

const FilterLink = ({filter,currentFilter,children}) => {

	if (filter === currentFilter) {
		return <span> {children} </span>
	}

	return (
		<a href='#'
			onClick={e => {
				e.preventDefault();
				store.dispatch({
					type: 'SET_VISIBILITY_FILTER',
					filter
				});
			}}
		>
			{children}
		</a>
	);
};

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
class TodoApp extends Component {
	render() {

		const { todos, visibilityFilter} = this.props;

		const visibleTodos = getVisibleTodos(
			todos,
			visibilityFilter
		);

		return (
			<div>
				<input ref={h => this.input = h} />
				<button onClick={() => {
					store.dispatch({
						type: 'ADD_TODO',
						text: this.input.value,
						id: nextTodoId++
					});
				}}>
				Add Todo
				</button>

				<TodoList
					todos= {visibleTodos}
					onTodoClick = {id => 
						store.dispatch( {
							type: 'TOGGLE_TODO',
							id: id
						})
					}
				/>

				<p>
				 	Show : {'      '}
				 	<FilterLink filter='SHOW_ALL'
				 				currentFilter={visibilityFilter}
				 				children='ALL'>
				 	 </FilterLink>
				 	{'      '}
				 	<FilterLink filter='SHOW_ACTIVE'
				 				currentFilter={visibilityFilter}
				 				children='ACTIVE'>
				 	</FilterLink>
				 	{'      '}
				 	<FilterLink filter='SHOW_COMPLETED'
				 				currentFilter={visibilityFilter}
				 				children='Completed'>
				 	 </FilterLink>
				 </p>
			</div>
		);
	}
}

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