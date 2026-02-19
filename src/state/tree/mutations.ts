/**
 * Pure tree mutation utilities for node sequence management
 * Functions are immutable - they return new tree structures without modifying inputs
 */

import type { MindMapNode } from '@core/types/node';

/** Result returned by mutation operations */
export interface MoveResult {
  /** Whether the operation succeeded */
  success: boolean;
  /** Updated tree (clone of original if operation failed) */
  updatedTree: MindMapNode;
}

/**
 * Moves a node to a new position within its parent's children array.
 * Immutable operation: returns a new tree without modifying the original.
 *
 * @param tree - Root node of the mind map tree
 * @param nodeId - ID of the node to move
 * @param parentId - ID of the parent whose children contain the node
 * @param newIndex - Target 0-based index within parent's children
 * @returns MoveResult with success flag and updated (or unchanged) tree
 */
export function moveNodeToPosition(
  tree: MindMapNode,
  nodeId: string,
  parentId: string,
  newIndex: number,
): MoveResult {
  let found = false;

  function cloneAndMove(node: MindMapNode): MindMapNode {
    if (node.id === parentId && node.children) {
      const currentIndex = node.children.findIndex((n) => n.id === nodeId);
      if (currentIndex === -1) {
        return node; // nodeId not in this parent's children
      }

      found = true;
      const newChildren = [...node.children];
      const [moved] = newChildren.splice(currentIndex, 1);
      const clampedIndex = Math.max(0, Math.min(newIndex, newChildren.length));
      newChildren.splice(clampedIndex, 0, moved);

      return { ...node, children: newChildren };
    }

    if (!node.children) return node;

    const updatedChildren = node.children.map(cloneAndMove);
    const childrenChanged = updatedChildren.some(
      (child, i) => child !== node.children![i],
    );

    return childrenChanged ? { ...node, children: updatedChildren } : node;
  }

  const updatedTree = cloneAndMove(tree);

  return {
    success: found,
    updatedTree: found ? updatedTree : deepClone(tree),
  };
}

/** Shallow-immutable deep clone for the failure path */
function deepClone(node: MindMapNode): MindMapNode {
  return {
    ...node,
    children: node.children ? node.children.map(deepClone) : undefined,
  };
}
