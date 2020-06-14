import React from 'react';

const _data = new Map();
const _observers = new Map();
let _viewIndex = 1;

const debounce = (func, wait = 0) => {
	let timeout = null;
	return function() {
		clearTimeout(timeout);
		const args = arguments;
		const later = () => {
			timeout = null;
			func.apply(this, args);
		};
		timeout = setTimeout(later, wait);
	};
};

class Reaction {
	constructor(stores, fn, id) {
		this.stores = stores.map((it) => (it.___clazz == 'StoreProxy' ? it.getTarget() : it));
		this.fn = fn;
		this.id = id;
	}

	act() {
		this.fn.apply(arguments);
	}
}

const registerObserver = (reaction) => {
	reaction.stores.forEach((it) => {
		if (!_observers.has(it)) {
			_observers.set(it, new Set());
		}
		_observers.get(it).add(reaction);
	});
};

const unRegisterObserver = (reaction) => {
	reaction.stores.forEach((it) => {
		if (_observers.has(it)) {
			_observers.get(it).delete(reaction);
		}
	});
};

const observer = (WrappedComponent, stores) => {
	if (WrappedComponent._isObserver) {
		console.warn('cannot observe twice.');
		return null;
	}

	const isArray = stores instanceof Array;
	WrappedComponent._isObserver = true;
	WrappedComponent.___id = `component_${_viewIndex}`;
	_viewIndex += 1;

	class ObserverComponent extends React.PureComponent {
		constructor(props) {
			super(props);
			this.___id = `observer_${WrappedComponent.___id}`;
			this.state = mergeStores();
			this.reaction = new Reaction(
				isArray ? stores : [stores],
				this.refreshState,
				this.___id
			);
		}

		refreshState = () => {
			if (this._mounted) {
				this.setState(mergeStores());
			}
		};

		componentDidMount() {
			this._mounted = true;
			registerObserver(this.reaction);
		}

		render() {
			return <WrappedComponent {...{ ...this.props, ...this.state }} />;
		}

		componentWillUnmount() {
			this._mounted = false;
			unRegisterObserver(this.reaction);
		}
	}

	const mergeStores = () => {
		const _stores = isArray ? stores : [stores];
		return Object.assign.apply(null, [
			{},
			..._stores.map((store) => {
				return _data.get(store.___id);
			}),
		]);
	};

	return ObserverComponent;
};

const notifyObservers = (store) => {
	const observers = _observers.get(store);
	if (observers && observers.size) {
		observers.forEach((it) => {
			it.act();
		});
	}
};

const updateStore = (store) => {
	_data.set(store.___id, store);
	notifyObservers(store);
};

const debounceUpdateStore = debounce(updateStore);

let storeIndex = 1;
class Store {
	constructor() {
		this.___id = Symbol(`Store_${storeIndex}`);
		storeIndex += 1;
		updateStore(this);
		this.___clazz = 'Store';
	}

	_notifyChange() {
		debounceUpdateStore(this);
	}

	apply(data) {
		Object.getOwnPropertyNames(data).forEach((key) => {
			const item = data[key];
			if (typeof item !== 'function') {
				this[key] = item;
			}
		});
	}
}

const createStore = (props) => {
	const store = new Store();
	Object.getOwnPropertyNames(props).forEach((key) => {
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
			if (!(value instanceof Function) && !key.startsWith('___')) {
				target._notifyChange();
			}
			return result;
		},
	});
	proxy.getTarget = () => store;
	proxy.___clazz = 'StoreProxy';
	return proxy;
};

const createReducer = (defaultData, _dispatch) => {
	const data = createStore(defaultData);
	data.dispatch = (action) => {
		// eslint-disable-next-line no-console
		console.log(`%c -- Reducer dispatch action ${action.type.toString()}`, 'color: #999999');
		const newData = _dispatch(action, data);
		data.apply(newData);
	};
	return data;
};

export { observer, createStore, createReducer };
