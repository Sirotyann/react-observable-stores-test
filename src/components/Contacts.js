import React from 'react';
import { contactsReducer } from '../stores/Reducers';
import { observer } from '../stores/Context';
import service from '../services/index';

const Contacts = (props) => {
    console.log("Contacts | render", props);
    const contacts = props ? props.contacts : [];
    return (<ul className="contacts">
        {
            contacts.map(it => <Contact key={it.id} {...it} />)
        }
    </ul>)
};

const Contact = (props) => (<li>{props.name}<button onClick={() => {
    service.removeContact(props.id)
}} style={{ float: 'right' }}>X</button></li>);

export default observer(Contacts, contactsReducer);
