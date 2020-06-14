import React from 'react';
import { mount } from 'enzyme';
import { observer, createReducer } from '../Context';
import { act } from 'react-dom/test-utils';

describe("share reducer test", () => {
    test('All components listen to the reducer should rerender while this reducer change', () => {
        jest.useFakeTimers();
        const ActionTypes = {
            'ADD': Symbol('ADD_'),
            'SUB': Symbol('SUB_')
        }

        const numReducer = createReducer({
            num: 0
        }, (action, state) => {
            switch (action.type) {
                case ActionTypes.ADD:
                    return { ...state, ...{ num: state.num + action.payload } };
                case ActionTypes.SUB:
                    return { ...state, ...{ num: state.num - action.payload } };
                default:
                    return state;
            }
        });

        const mockHelloRender = jest.fn();
        class Hello extends React.Component {
            render() {
                mockHelloRender();
                return <div>Hello {this.props.num}</div>
            }
        }

        const mockBonjourRender = jest.fn();
        class Bonjour extends React.Component {
            render() {
                mockBonjourRender();
                return <div>Bonjour {this.props.num}</div>
            }
        }

        const HelloWrapper = observer(Hello, numReducer);
        const BonjourWrapper = observer(Bonjour, numReducer);
        const App = () => (<div><HelloWrapper /><BonjourWrapper /></div>);
        const app = mount(<App />);

        expect(app.html()).toBe('<div><div>Hello 0</div><div>Bonjour 0</div></div>');
        expect(mockHelloRender.mock.calls.length).toBe(1);
        expect(mockBonjourRender.mock.calls.length).toBe(1);

        act(() => {
            numReducer.dispatch({ type: ActionTypes.ADD, payload: 2 });
        });
        jest.runAllTimers();
        expect(app.html()).toBe('<div><div>Hello 2</div><div>Bonjour 2</div></div>');
        expect(mockHelloRender.mock.calls.length).toBe(2);
        expect(mockBonjourRender.mock.calls.length).toBe(2);

        act(() => {
            numReducer.dispatch({ type: ActionTypes.SUB, payload: 1 });
        });
        jest.runAllTimers();
        expect(app.html()).toBe('<div><div>Hello 1</div><div>Bonjour 1</div></div>');
        expect(mockHelloRender.mock.calls.length).toBe(3);
        expect(mockBonjourRender.mock.calls.length).toBe(3);
    });

});