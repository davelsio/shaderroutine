export type DfsNode<T> = {
  dependencies?: T[];
};

/**
 * Traverses a tree data structure using a depth-first search algorithm.
 * @param node root node of the tree
 * @param visited set of visited nodes
 * @param cb callback function to be executed on each node
 */
export function dfsTraverse<T extends DfsNode<T>>(
  tree: T,
  cb: (node: T) => void
) {
  const visited = new Set<T>();

  const traverse = (node: T) => {
    if (visited.has(node)) {
      return;
    }

    visited.add(node);

    if (node.dependencies) {
      node.dependencies.forEach((dep) => dfsTraverse(dep, cb));
    }

    cb(node);
  };

  traverse(tree);
}

/**
 * Sort a tree data structure using a depth-first search algorithm.
 * @param tree root node of the tree
 * @returns sorted array of nodes
 */
export function dfsSort<T extends DfsNode<T>>(tree: T) {
  const resolved: T[] = [];
  dfsTraverse(tree, (n) => resolved.push(n));
  return resolved;
}
