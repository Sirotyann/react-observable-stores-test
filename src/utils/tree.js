
const generate_random_tree = (nodes_count) => (random_bin_tree(nodes_count));

let node_index = 0;

class Node {
    constructor(label, color) {
        this.id = node_index;
        node_index++;
        this.label = label;
        this.color = color;
        this.children = [];
    }

    count() {
        let result = 1;
        for (let child of this.children) {
            result += child.count();
        }
        return result;
    }
}

const random_int = (max) => Math.round(Math.random() * max);

const random_color = () => `rgb(${random_int(255)}, ${random_int(255)}, ${random_int(255)})`;

const char_base = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const char_base_length = char_base.length;

const random_string = () => {
    const random_length = random_int(8) + 2;
    const str = [];
    for (let i = 0; i < random_length; i++) {
        str.push(char_base[random_int(char_base_length - 1)]);
    }
    return str.join('');
};

const random_node = () => new Node(random_string(), random_color());

const random_bin_tree = (max) => {
    console.log(`[random_tree] max=${max}`);
    if (max === 0) return null;
    const root = new Node('Root', random_color());
    if (max === 1) return root;

    let count = 1;
    let last_level = [root];
    let level_nodes = []
    const fill_nodes = (parent) => {
        const n = random_node();
        parent.children.push(n);
        level_nodes.push(n);
        count++;
    }
    while (count < max) {
        for (let node of last_level) {
            fill_nodes(node);
            if (count >= max) {
                return root;
            } else {
                fill_nodes(node);
            }
        }
        last_level = level_nodes;
        level_nodes = [];
    }
    return root;
}

export { generate_random_tree, Node };