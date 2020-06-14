import { List, Map } from 'immutable';
import { createReducer } from './Context';
import log from '../utils/log';
import { generate_random_tree } from '../utils/tree';

const ActionTypes = {
	LOAD_CONTACTS: Symbol(),
	REMOVE_CONTACT: Symbol(),
	MAKE_CALL: Symbol(),
};

const HistoryActionTypes = {
	MAKE_CALL: Symbol(),
};

const contactsReducer = createReducer(
	{
		contacts: new List(),
	},
	(action, state) => {
		log('contactsReducer | dispatch', action);
		let data;
		switch (action.type) {
			case ActionTypes.LOAD_CONTACTS:
				data = { ...state, ...{ contacts: List(action.payload) } };
				return data;
			case ActionTypes.REMOVE_CONTACT:
				const index = state.contacts.findIndex((it) => it.id === action.payload);
				data = { ...state, ...{ contacts: state.contacts.delete(index) } };
				return data;
			default:
				return state;
		}
	}
);

const historyReducer = createReducer(
	{
		callHistory: new Map(),
	},
	(action, state) => {
		log('historyReducer | dispatch', action);
		let data;
		switch (action.type) {
			case HistoryActionTypes.MAKE_CALL:
				const name = action.payload;
				let histories = state.callHistory.get(name);
				if (!histories) {
					histories = new List();
				}
				histories = histories.unshift(new Date());
				const newHistory = state.callHistory.set(name, histories);
				data = { ...state, ...{ callHistory: newHistory } };
				return data;
			default:
				return state;
		}
	}
);

const TreeActions = {
	REFRESH: Symbol('REFRESH'),
	UPDATE_NODE: Symbol('UPDATE_NODE'),
};
const treeReducer = createReducer(
	{
		tree: generate_random_tree(1024),
	},
	(action, state) => {
		log('treeReducer | dispatch', action, state);
		switch (action.type) {
			case TreeActions.REFRESH:
				return { ...state, ...{ tree: generate_random_tree(action.payload) } };
			case TreeActions.UPDATE_NODE:
				console.log('update node', action);

			default:
				return state;
		}
	}
);

export {
	contactsReducer,
	ActionTypes,
	historyReducer,
	HistoryActionTypes,
	treeReducer,
	TreeActions,
};
