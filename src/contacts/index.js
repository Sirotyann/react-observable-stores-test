import React from 'react';
import { contactsReducer, historyReducer } from '../stores/Reducers';
import { observer } from '../stores/Context';
import service from '../services/index';
import log from '../utils/log';

const Contacts = (props) => {
    log("Contacts | render", props);
    const contacts = props ? props.contacts : [];
    return (<ul className="contacts">
        {
            contacts.map(it => {
                const history = props.callHistory.get(it.name);
                const called = history ? history.size : null;
                return <Contact called={called} key={it.id} {...it} />;
            })
        }
    </ul>)
};

const Contact = (props) => (<li>
    <span>{props.name}</span>
    {
        props.called ? <span style={{ marginLeft: 10 }}>x {props.called}</span> : ''
    }

    <button onClick={() => {
        service.removeContact(props.id)
    }} style={{ float: 'right' }}>
        X
    </button>

    <button onClick={() => {
        service.makeACall(props.name)
    }} style={{ float: 'right' }}>
        Call
    </button>
</li>);

export default observer(Contacts, [contactsReducer, historyReducer]);
