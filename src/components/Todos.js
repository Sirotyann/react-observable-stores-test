import React from 'react';
import { todosStore } from '../stores/Stores';
import { observer } from '../stores/Context';

const Todos = (props) => {
    console.log("[Todos].render");
    const todos = props ? props.todos : [];
    return (<ul className="todos">
        {
            todos.map((todo) => <Todo key={todo.id} {...todo} />)
        }
    </ul>);
}

const Todo = (props) => (<li>{props.name}</li>);

export default observer(Todos, todosStore);
