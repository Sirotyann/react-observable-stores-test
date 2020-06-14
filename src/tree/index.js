import React from 'react';
import { treeReducer, TreeActions } from '../stores/Reducers';
import { observer } from '../stores/Context';
// import { generate_random_tree } from '../utils/tree';
// const _tree = generate_random_tree(1024);

const Tree = (props) => {
    // console.log('[Tree] render', props);
    return <div id="tree" style={{ width: '100%' }}>
        <h1>TREE <button onClick={() => {
            treeReducer.dispatch({ type: TreeActions.REFRESH, payload: 1024 });
        }}> Refresh </button></h1>
        <Leaf node={props.tree} first={true} />
    </div>;
}

const Leaf = ({ node, first }) => {
    // console.log("[Leaf] render ", node);
    return (
        <div className="leaf" style={{ backgroundColor: node.color, flex: 1, maxWidth: first ? '100%' : '50%' }}>
            <label style={{ height: '30px', lineHeight: '30px' }}>{node.label}</label>
            <div style={{ display: 'flex' }}>
                {
                    node.children.map(it => (<Leaf node={it} first={false} key={it.id} />))
                }
            </div>
        </div>
    )
}

export default observer(Tree, treeReducer);