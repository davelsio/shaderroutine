type TreeNode<T extends string> = {
  dependencies?: T[];
};

/**
 * Resolve a sorted list of node dependencies in a tree data structure.
 * @param tree tree object data structure
 * @param nodesToLoad nodes to load from the tree
 */
export function resolveNodeDependencies<
  NodeName extends string,
  Node extends TreeNode<NodeName>,
>(tree: Record<NodeName, Node>, nodesToLoad: NodeName[]): NodeName[] {
  const visited = new Set<NodeName>();
  const resolved: NodeName[] = [];

  function depthFirstSearch(nodeName: NodeName) {
    if (visited.has(nodeName)) return;

    visited.add(nodeName);

    const node = tree[nodeName];
    if (node?.dependencies) {
      node.dependencies.forEach((dep) => depthFirstSearch(dep));
    }

    resolved.push(nodeName);
  }

  nodesToLoad.forEach(depthFirstSearch);

  return resolved;
}
