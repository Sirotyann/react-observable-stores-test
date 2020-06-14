import React from 'react';
import { mount } from 'enzyme';
import { observer, createStore } from '../Context';
import { act } from 'react-dom/test-utils';

describe("store tests", () => {
    test('Should rerender while store change', () => {
        jest.useFakeTimers();
        const store = createStore({
            name: "Mourinho"
        });

        const mockfn = jest.fn();
        class Hello extends React.Component {
            render() {
                mockfn();
                return <div>Hello {this.props.name}</div>
            }
        }

        const HelloWrapper = observer(Hello, store);
        const App = () => (<div><HelloWrapper /></div>);
        const app = mount(<App />);

        expect(app.html()).toBe('<div><div>Hello Mourinho</div></div>');
        expect(mockfn.mock.calls.length).toBe(1);

        act(() => {
            store.name = "Guardiola";
        });
        jest.runAllTimers();
        expect(app.html()).toBe('<div><div>Hello Guardiola</div></div>');
        expect(mockfn.mock.calls.length).toBe(2);
    });
});