/**
 * Depth-first traversal utility for flattening mind map tree
 * Used by table view to display nodes in hierarchical order
 */

import type { MindMapNode } from '@core/types/node';

/** Flattened node with depth and parent metadata */
export interface FlatNode {
  node: MindMapNode;
  depth: number;
  parentId: string | null;
  id: string;
}

/**
 * Flattens a tree structure into depth-first order with depth metadata
 * @param root - Root node to traverse
 * @param depthFilter - Optional depth to filter by (returns only nodes at this depth)
 * @returns Array of flattened nodes with depth and parent information
 */
export function flattenByDepth(
  root: MindMapNode,
  depthFilter?: number
): FlatNode[] {
  const result: FlatNode[] = [];

  function traverse(
    node: MindMapNode,
    depth: number,
    parentId: string | null
  ): void {
    // Add current node if no filter or matches filter depth
    if (depthFilter === undefined || depth === depthFilter) {
      result.push({
        node,
        depth,
        parentId,
        id: node.id,
      });
    }

    // Recursively traverse children
    if (node.children && node.children.length > 0) {
      for (const child of node.children) {
        traverse(child, depth + 1, node.id);
      }
    }
  }

  traverse(root, 0, null);
  return result;
}
