import React from 'react';
import { todosStore, todoColorsStore } from '../stores/Stores';
import { observer } from '../stores/Context';
import log from '../utils/log';

const Todos = (props) => {
    log("[Todos].render");
    const todos = props ? props.todos : [];
    let colorCount = props.colors.length;
    return (<ul className="todos">
        {
            todos.map((todo, index) => <Todo key={todo.id} color={props.colors[index%colorCount]} {...todo} />)
        }
    </ul>);
}

const Todo = (props) => (<li style={{color: props.color}}>{props.name}</li>);



export default observer(Todos, [todosStore, todoColorsStore]);
