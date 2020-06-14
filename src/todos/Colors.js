import React from 'react';
import { todoColorsStore } from '../stores/Stores';
import { observer } from '../stores/Context';
import log from '../utils/log';

const Colors = (props) => {
    log("[TodoColors].render", props);
    return (<ul style={{ display: 'flex', padding: 10 }}>
        {
            props.colors.map(color => <Color key={color} color={color} />)
        }
    </ul>);
}

const Color = (props) => (<li style={{ backgroundColor: props.color, width: 24, height: 24 }}></li>);

export default observer(Colors, todoColorsStore);
