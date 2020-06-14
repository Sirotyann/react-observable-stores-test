import React from 'react';
import './App.css';
import { context } from './stores/Context';
import Todos from './todos';
import TodoRange from './todos/Colors';
import Contacts from './contacts';
import CallHistory from './contacts/CallHistory';
import service from './services';
import log from './utils/log';
import Tree from './tree';

const TAB_STORE = Symbol('store tab');
const TAB_REDUCER = Symbol('reducer tab');
const TAB_TREE = Symbol('tree tab');

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = { tab: TAB_STORE };
		service.retrieveTodos();
	}

	switchTab = (tab) => {
		if (this.state.tab !== tab) {
			this.setState({ tab });
		}
	};

	render() {
		console.log('[App] render');
		return (
			<div className="App">
				<ul className="tabs">
					<li
						className={this.state.tab === TAB_STORE ? 'active' : ''}
						onClick={() => {
							this.switchTab(TAB_STORE);
						}}
					>
						Store
					</li>
					<li
						className={this.state.tab === TAB_REDUCER ? 'active' : ''}
						onClick={() => {
							this.switchTab(TAB_REDUCER);
						}}
					>
						Reducer
					</li>
					<li
						className={this.state.tab === TAB_TREE ? 'active' : ''}
						onClick={() => {
							this.switchTab(TAB_TREE);
						}}
					>
						Tree
					</li>
				</ul>
				<div className="content">
					{this.state.tab === TAB_STORE ? <TodoPanel /> : null}
					{this.state.tab === TAB_REDUCER ? <ContactsPanel /> : null}
					{this.state.tab === TAB_TREE ? <Tree /> : null}
				</div>
			</div>
		);
	}
}

const TodoPanel = () => {
	log('[TodoPanel].render');
	return (
		<div>
			<button
				onClick={() => {
					service.addTodo();
				}}
			>
				Add Random Todo
			</button>
			<button
				onClick={() => {
					service.randomColors();
				}}
			>
				Refresh Colors
			</button>
			<div>
				<Todos />
				<TodoRange />
			</div>
		</div>
	);
};

// const ContactsPanel = () => (<div>
//   <button onClick={() => {
//     console.profile("ContactsPanel");
//     service.loadContacts();
//     console.profileEnd();
//   }}>
//     Load Contacts
//   </button>
//   <div>
//     <Contacts />
//     <CallHistory />
//   </div>
// </div>);

class ContactsPanel extends React.Component {
	render() {
    console.log("[ContactsPanel] render");
		return (
			<div>
				<button
					onClick={() => {
						console.profile('ContactsPanel');
						service.loadContacts();
						console.profileEnd();
					}}
				>
					Load Contacts
				</button>
				<div>
					<Contacts />
					<CallHistory />
				</div>
			</div>
		);
	}
}

// export default context(App);
export default App;
