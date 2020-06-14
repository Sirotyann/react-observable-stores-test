import { List } from 'immutable';
import { createStore } from './Context';

const todosStore = createStore({
	todos: new List(),
});

const todoColorsStore = createStore({
	colors: [],
});

export { todosStore, todoColorsStore };
