type Node<T> = {
  dependencies?: T[];
};

/**
 * Resolve a sorted list of node dependencies from a tree data structure.
 * @param tree tree object data structure
 */
export function resolveNodeDependencies<T extends Node<T>>(tree: T): T[] {
  const visited = new Set<T>();
  const resolved: T[] = [];

  function depthFirstSearch(node: T) {
    if (visited.has(node)) return;

    visited.add(node);

    if (node.dependencies) {
      node.dependencies.forEach((dep) => depthFirstSearch(dep));
    }

    resolved.push(node);
  }

  depthFirstSearch(tree);

  return resolved;
}
