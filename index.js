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

const Link = ({active, children, onClick}) => {
	if (active) {
		return <span> {children} </span>
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
};

class FilterLink extends Component {
	componentDidMount() {
		const { store } = this.props;
		this.unsubscribe = store.subscribe(() =>
			this.forceUpdate());
	}

	componentWillUnmount() {
		this.unsubscribe();
	}

	render() {
		const props = this.props;
		const { store } = props;
		const state = store.getState();

		return (
			<Link
				active={
					props.filter ===
					state.visibilityFilter
				}
				onClick={() => 
					store.dispatch({
						type: 'SET_VISIBILITY_FILTER',
						filter : props.filter
					})
				}
			>

				{ props.children }
			</Link>
		);
	}
}

const Footer = ({ store }) => (
	<p>
	 	Show : {'      '}
	 	<FilterLink filter='SHOW_ALL'
	 				children = 'ALL'
	 				store={store}
	 	>
	 	 </FilterLink>
	 	{'      '}
	 	<FilterLink filter='SHOW_ACTIVE'
	 				children = 'Active'
	 				store={store}
	 	>
	 	</FilterLink>
	 	{'      '}
	 	<FilterLink filter='SHOW_COMPLETED'
	 				children = 'Completed'
	 				store={store}
	 	>
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

const AddTodo = ({ store }) => {
	let input;

	return (
		<div>
			<input ref={h => input = h} />
			<button onClick={() => {
				store.dispatch({
					type: 'ADD_TODO',
					text: input.value,
					id: nextTodoId++
				})
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

class VisibleTodoList extends Component {
	componentDidMount() {
		const { store } = this.props;
		this.unsubscribe = store.subscribe(() =>
			this.forceUpdate());
	}

	componentWillUnmount() {
		this.unsubscribe();
	}

	render() {
		const props = this.props;
		const { store } = props;
		const state = store.getState();

		return (
			<TodoList
				todos={
					getVisibleTodos(
						state.todos,
						state.visibilityFilter
					)
				}
				onTodoClick={id =>
					store.dispatch({
						type: 'TOGGLE_TODO',
						id
					})
				}
			/>
		)
	}
}



let nextTodoId = 0;
const TodoApp = ({ store }) => (
	<div>			
		<AddTodo	 store={store}/>
		<VisibleTodoList store={store}/>
		<Footer store={store}/>
	</div>
);

ReactDOM.render(
	<TodoApp store= {createStore(todoApp)} />,
	document.getElementById('root')
);











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