const DefaultChildrenKey = 'children' as const;
type DefaultChildrenKey = typeof DefaultChildrenKey;
type TypeWithChildren<T, K extends string> = T & {
  /**
   * Field containing child nodes.
   * @default 'children'
   */
  childrenKey?: K;
};

export type DfsNode<T, K extends string = DefaultChildrenKey> = {
  /**
   * Child nodes.
   */
  [P in K]?: T[];
};

export interface TraverseOpts<T> {
  /**
   * Callback to execute after the node children have been resolved.
   */
  onResolved?: (node: T) => void;
  /**
   * Callback to execute when the node is first visited, but before resolving
   * its children.
   */
  onVisit?: (node: T) => void;
}

export interface DfsSortOpts {
  /**
   * Node order used to build the sorted result.
   * @default 'parents-first'
   */
  sortOrder?: 'parents-first' | 'children-first';
}

/**
 * Traverses a tree data structure using a depth-first search algorithm.
 * @param root - root node of the tree
 * @param options - traverse options
 */
export function dfsTraverse<
  T extends DfsNode<T, K>,
  K extends string = DefaultChildrenKey,
>(
  root: T,
  {
    childrenKey = DefaultChildrenKey as K,
    onResolved,
    onVisit,
  }: TypeWithChildren<TraverseOpts<T>, K> = {}
) {
  const visited = new Set<T>();

  const traverse = (node: T) => {
    if (visited.has(node)) {
      return;
    }

    visited.add(node);
    onVisit?.(node);

    const children = node[childrenKey];

    if (children) {
      children.forEach(traverse);
    }

    onResolved?.(node);
  };

  traverse(root);
}

/**
 * Sort a tree data structure using a depth-first search algorithm.
 *
 * @param tree - root node of the tree
 * @param options - sort options
 */
export function dfsSort<
  T extends DfsNode<T, K>,
  K extends string = DefaultChildrenKey,
>(
  tree: T,
  {
    childrenKey = DefaultChildrenKey as K,
    sortOrder = 'parents-first',
  }: TypeWithChildren<DfsSortOpts, K> = {}
) {
  const resolved: T[] = [];

  const collect: keyof TraverseOpts<T> =
    sortOrder === 'parents-first' ? 'onVisit' : 'onResolved';

  dfsTraverse(tree, {
    [collect]: (n: T) => resolved.push(n),
    childrenKey,
  });

  return resolved;
}
