import { List } from 'immutable';
import { todosStore, todoColorsStore } from '../stores/Stores';
import { contactsReducer, ActionTypes, historyReducer, HistoryActionTypes } from '../stores/Reducers';
import log from '../utils/log';

const retrieveTodos = () => {
    todosStore.todos = List([
        { id: 1, name: "Breakfirst" },
        { id: 2, name: "Meeting" },
    ])
}

const addTodo = () => {
    const now = new Date();
    todosStore.todos = [...todosStore.todos, { id: now.getTime(), name: `A todo created at ${now.getHours()}:${now.getSeconds()}` }];
}

const _randomColor = () => `rgb(${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)})`;
const randomColors = () => {
    todoColorsStore.colors = Array.from({ length: 10 }).map(() => {
        return _randomColor();
    });
}

const defaultContacts = [
    { id: 1, name: "Cheng", num: "567890" },
    { id: 2, name: "Kiran", num: "234567" },
    { id: 3, name: "Giovanni", num: "98765" },
]
const loadContacts = () => {
    log("service | loadContacts", defaultContacts);
    contactsReducer.dispatch({ type: ActionTypes.LOAD_CONTACTS, payload: defaultContacts });
}

const removeContact = (id) => {
    log("service | removeContact", id);
    contactsReducer.dispatch({ type: ActionTypes.REMOVE_CONTACT, payload: id });
}

const makeACall = (id) => {
    log("service | makeACall", id);
    historyReducer.dispatch({ type: HistoryActionTypes.MAKE_CALL, payload: id });
}

export default { retrieveTodos, addTodo, randomColors, loadContacts, removeContact, makeACall };