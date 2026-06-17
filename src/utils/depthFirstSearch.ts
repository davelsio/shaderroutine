const DefaultKey = 'children' as const;
type DefaultKey = typeof DefaultKey;

export type DfsNode<T, K extends string = 'children'> = {
  /**
   * Child nodes connected via edges.
   */
  [P in K]?: T[];
};

/**
 * Traverses a tree data structure using a depth-first search algorithm.
 * @param root - root node of the tree
 * @param onVisit - function to execute on visiting each node
 * @param childKey - field containing child nodes
 */
export function dfsTraverse<
  T extends DfsNode<T, K>,
  K extends string = DefaultKey,
>(root: T, onVisit: (node: T) => void, childKey: K = 'children' as K) {
  const visited = new Set<T>();

  const traverse = (node: T) => {
    if (visited.has(node)) {
      return;
    }

    visited.add(node);

    const children = node[childKey];

    if (children) {
      children.forEach(traverse);
    }

    onVisit(node);
  };

  traverse(root);
}

/**
 * Sort a tree data structure using a depth-first search algorithm.
 * @param tree - root node of the tree
 * @param childKey - field containing child nodes
 */
export function dfsSort<T extends DfsNode<T, K>, K extends string = DefaultKey>(
  tree: T,
  childKey: K = DefaultKey as K
) {
  const resolved: T[] = [];
  dfsTraverse(tree, (n) => resolved.push(n), childKey);
  return resolved;
}
