import React from 'react';
import { mount } from 'enzyme';
import { observer, createReducer } from '../Context';
import { act } from 'react-dom/test-utils';

describe("reducer tests", () => {
    test('Should rerender while reducer change', () => {
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

        const mockfn = jest.fn();
        class Hello extends React.Component {
            render() {
                mockfn();
                return <div>Hello {this.props.num}</div>
            }
        }

        const HelloWrapper = observer(Hello, numReducer);
        const App = () => (<div><HelloWrapper /></div>);
        const app = mount(<App />);

        expect(app.html()).toBe('<div><div>Hello 0</div></div>');
        expect(mockfn.mock.calls.length).toBe(1);

        act(() => {
            numReducer.dispatch({ type: ActionTypes.ADD, payload: 2 });
        });
        
        jest.runAllTimers();
        expect(numReducer.num).toBe(2);
        expect(app.html()).toBe('<div><div>Hello 2</div></div>');
        expect(mockfn.mock.calls.length).toBe(2);

        act(() => {
            numReducer.dispatch({ type: ActionTypes.SUB, payload: 1 });
        });
        jest.runAllTimers();
        expect(app.html()).toBe('<div><div>Hello 1</div></div>');
        expect(mockfn.mock.calls.length).toBe(3);
    });
    
});