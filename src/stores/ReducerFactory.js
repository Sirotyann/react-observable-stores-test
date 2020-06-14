import createStore from './StoreFactory';
import log from '../utils/log';

const createReducer = (defaultData, _dispatch) => {
    const data = createStore(defaultData).getTarget();
    data.dispatch = action => {
        // eslint-disable-next-line no-console
        log(` -- Reducer dispatch action ${action.type.toString()}`);
        const newData = _dispatch(action, data);
        data.apply(newData);
    };
    return data;
};

export default createReducer;
