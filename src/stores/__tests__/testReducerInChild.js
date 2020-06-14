import React from 'react';
import { mount } from 'enzyme';
import { observer, createReducer } from '../Context';
import { act } from 'react-dom/test-utils';

describe("reducer in children component tests", () => {
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
                default:
                    return state;
            }
        });

        const mockChildRender = jest.fn();
        const mockParentRender = jest.fn();
       
        class Child extends React.Component {
            render() {
                mockChildRender();
                return <div>I have {this.props.num} {this.props.candy}.</div>
            }
        }
        const ChildWrapper = observer(Child, numReducer);
        class Parent extends React.PureComponent {
            render() {
                mockParentRender()
                return <div><div>How many chocolates?</div><ChildWrapper candy={'chocolates'}/></div>
            }
        }

        
        const App = () => (<div><Parent /></div>);
        const app = mount(<App />);

        expect(app.html()).toBe('<div><div><div>How many chocolates?</div><div>I have 0 chocolates.</div></div></div>');
        expect(mockChildRender.mock.calls.length).toBe(1);
        expect(mockParentRender.mock.calls.length).toBe(1);

        act(() => {
            numReducer.dispatch({ type: ActionTypes.ADD, payload: 2 });
        });
        jest.runAllTimers();

        expect(numReducer.num).toBe(2);
        expect(app.html()).toBe('<div><div><div>How many chocolates?</div><div>I have 2 chocolates.</div></div></div>');
        expect(mockChildRender.mock.calls.length).toBe(2);
        expect(mockParentRender.mock.calls.length).toBe(1);
    });
    
});