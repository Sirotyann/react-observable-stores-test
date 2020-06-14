import { StateManagement } from './Context';

const _data = new Map();

const updateStore = store => {
    _data.set(store._id, store);
};

let updateState = () => {
    if (StateManagement.update) {
        updateState = () => StateManagement.update(new Map(_data));
        updateState();
    }
};
let index = 1;
class Store {
    constructor() {
        this._id = Symbol(`Store_${index}`);
        index += 1;
        updateStore(this);
    }

    _notifyChange() {
        updateStore(this);
        updateState();
    }

    apply(data) {
        Object.getOwnPropertyNames(data).forEach(key => {
            const item = data[key];
            if (typeof item !== 'function') {
                this[key] = item;
            }
        });
        this._notifyChange();
    }
}

const createStore = props => {
    const store = new Store();
    Object.getOwnPropertyNames(props).forEach(key => {
        if (!store[key]) {
            store[key] = props[key];
        }
    });

    const proxy = new Proxy(store, {
        get(target, key, receiver) {
            return Reflect.get(target, key, receiver);
        },
        set(target, key, value, receiver) {
            const result = Reflect.set(target, key, value, receiver);
            target._notifyChange();
            return result;
        },
    });
    proxy.getTarget = () => store;
    return proxy;
};

export default createStore;
