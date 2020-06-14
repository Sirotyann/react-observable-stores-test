import React from 'react';
import { mount } from 'enzyme';
import { observer, createReducer } from '../Context';
import { act } from 'react-dom/test-utils';

describe("multiple reducer tests", () => {
    test('Reducer changing should only trigger rerender of those components listeren to it', () => {
        jest.useFakeTimers();
        const mockRenderHello = jest.fn();
        const mockRenderFoo = jest.fn();

        const SWITCH_ACTION = Symbol('SWITCH_ACTION');

        class Hello extends React.Component {
            render() {
                mockRenderHello();
                return <div>Hello {this.props.name}</div>;
            }
        }
        const helloReducer = createReducer({
            name: "Mourinho"
        }, () => {});
        const HelloWrapper = observer(Hello, helloReducer);

        class Foo extends React.Component {
            render() {
                mockRenderFoo();
                return <span>{this.props.foo}</span>;
            }
        }
        const fooReducer = createReducer({
            foo: "foo"
        }, (action, state) => {
            return (action.type === SWITCH_ACTION) ? { ...state, ...{ foo: action.payload } } : state;
        });
        const FooWrapper = observer(Foo, fooReducer);

        const App = () => (<div><HelloWrapper /><FooWrapper /></div>);
        const app = mount(<App />);

        expect(app.html()).toBe('<div><div>Hello Mourinho</div><span>foo</span></div>');
        expect(mockRenderHello.mock.calls.length).toBe(1);
        expect(mockRenderFoo.mock.calls.length).toBe(1);

        act(() => {
            fooReducer.dispatch({ type: SWITCH_ACTION, payload: 'bar' });
        });
        jest.runAllTimers();
        expect(app.html()).toBe('<div><div>Hello Mourinho</div><span>bar</span></div>');
        expect(mockRenderHello.mock.calls.length).toBe(1);
        expect(mockRenderFoo.mock.calls.length).toBe(2);
    });
});