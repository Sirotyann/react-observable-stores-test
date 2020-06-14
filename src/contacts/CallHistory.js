import React from 'react';
import { List } from 'immutable';
import { historyReducer } from '../stores/Reducers';
import { observer } from '../stores/Context';
import log from '../utils/log';

const formatDate = (date) => `${fillZero(date.getDate())}/${fillZero(date.getMonth() + 1)} ${fillZero(date.getHours())}:${fillZero(date.getSeconds())}`;
const fillZero = (num) => `${num < 10 ? '0' : ''}${num}`;

const Histories = (props) => {
    log("History | render", props);
    const calls = props ? List(props.callHistory).reduce((acc, it) => {
        const name = it[0];
        const times = it[1];
        let result = [];
        times.forEach(time => {
            result.push({ name, time: time })
        });
        let newList = acc.concat(result);
        return newList;
    }, []).sort((a, b) => (b.time.getTime() - a.time.getTime())) : [];

    return (<ul className="histories">
        {
            calls.map(it => <History key={`${it.name}@${it.time.getTime()}`} {...it} />)
        }
    </ul>);
};

const History = (props) => (<li>{props.name} at {formatDate(props.time)}</li>);

export default observer(Histories, historyReducer);
