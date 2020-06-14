import React from 'react';
import { mount } from 'enzyme';
import { observer, createStore } from '../Context';
import { act } from 'react-dom/test-utils';

describe("multiple store tests", () => {
    test('Changing store value should only trigger rerender of those components listeren to it', () => {
        jest.useFakeTimers();
        const mockRenderHello = jest.fn();
        const mockRenderFoo = jest.fn();

        class Hello extends React.Component {
            render() {
                mockRenderHello();
                return <div>Hello {this.props.name}</div>
            }
        }
        const helloStore = createStore({
            name: "Mourinho"
        });
        const HelloWrapper = observer(Hello, helloStore);

        class Foo extends React.Component {
            render() {
                mockRenderFoo();
                return <span>{this.props.foo}</span>
            }
        }
        const fooStore = createStore({
            foo: "foo"
        });
        const FooWrapper = observer(Foo, fooStore);

        const App = () => (<div><HelloWrapper /><FooWrapper /></div>);
        const app = mount(<App />);

        expect(app.html()).toBe('<div><div>Hello Mourinho</div><span>foo</span></div>');
        expect(mockRenderHello.mock.calls.length).toBe(1);
        expect(mockRenderFoo.mock.calls.length).toBe(1);

        act(() => {
            fooStore.foo = "bar";
        });
        jest.runAllTimers();
        expect(app.html()).toBe('<div><div>Hello Mourinho</div><span>bar</span></div>');
        expect(mockRenderHello.mock.calls.length).toBe(1);
        expect(mockRenderFoo.mock.calls.length).toBe(2);
    });
});