import { generate_random_tree } from '../tree';

describe("Test create a tree", () => {
    test("create a 10 tree", () => {
        const tree = generate_random_tree(10);
        expect(tree.count()).toBe(10);
    });
});