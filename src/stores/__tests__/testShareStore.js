import React from 'react';
import { mount } from 'enzyme';
import {  observer, createStore } from '../Context';
import { act } from 'react-dom/test-utils';

describe("store tests", () => {
    test('All components listen to the store should rerender while this store change', () => {
        jest.useFakeTimers();
        const store = createStore({
            name: "Mourinho"
        });

        const mockHelloRender = jest.fn();
        class Hello extends React.Component {
            render() {
                mockHelloRender();
                return <div>Hello {this.props.name}</div>
            }
        }

        const mockBonjourRender = jest.fn();
        class Bonjour extends React.Component {
            render() {
                mockBonjourRender();
                return <div>Bonjour {this.props.name}</div>
            }
        }

        const HelloWrapper = observer(Hello, store);
        const BonjourWrapper = observer(Bonjour, store);
        const App = () => (<div><HelloWrapper /><BonjourWrapper /></div>);
        const app = mount(<App />);

        expect(app.html()).toBe('<div><div>Hello Mourinho</div><div>Bonjour Mourinho</div></div>');
        expect(mockHelloRender.mock.calls.length).toBe(1);
        expect(mockBonjourRender.mock.calls.length).toBe(1);

        act(() => {
            store.name = "Guardiola";
        });
        jest.runAllTimers();
        
        expect(app.html()).toBe('<div><div>Hello Guardiola</div><div>Bonjour Guardiola</div></div>');
        expect(mockHelloRender.mock.calls.length).toBe(2);
        expect(mockBonjourRender.mock.calls.length).toBe(2);
    });
});