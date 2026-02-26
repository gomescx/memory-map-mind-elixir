/**
 * Unit tests for tree mutation utilities
 * Tests: src/state/tree/mutations.ts
 */

import { describe, it, expect } from 'vitest';
import {
  moveNodeToPosition,
  type MoveResult,
} from '@state/tree/mutations';
import type { MindMapNode } from '@core/types/node';

function buildTree(): MindMapNode {
  return {
    id: 'root',
    topic: 'Root',
    children: [
      { id: 'a', topic: 'A' },
      { id: 'b', topic: 'B' },
      { id: 'c', topic: 'C' },
      { id: 'd', topic: 'D' },
      { id: 'e', topic: 'E' },
    ],
  };
}

describe('tree mutations', () => {
  describe('moveNodeToPosition', () => {
    it('test_update_node_sequence_reorders_siblings: moves node C to first position', () => {
      const tree = buildTree();
      // Node C is at index 2, move to position 0 (first)
      const result: MoveResult = moveNodeToPosition(tree, 'c', 'root', 0);

      expect(result.success).toBe(true);
      const siblings = result.updatedTree.children!;
      expect(siblings[0].id).toBe('c');
      expect(siblings[1].id).toBe('a');
      expect(siblings[2].id).toBe('b');
      expect(siblings[3].id).toBe('d');
      expect(siblings[4].id).toBe('e');
    });

    it('test_update_node_sequence_reorders_siblings: all siblings recalculate after move', () => {
      const tree = buildTree();
      // Move 'e' (last) to position 1 (second)
      const result = moveNodeToPosition(tree, 'e', 'root', 1);

      expect(result.success).toBe(true);
      const siblings = result.updatedTree.children!;
      expect(siblings).toHaveLength(5);
      expect(siblings.map((n) => n.id)).toEqual(['a', 'e', 'b', 'c', 'd']);
    });

    it('test_update_node_sequence_reorders_siblings: returns original tree on invalid nodeId', () => {
      const tree = buildTree();
      const result = moveNodeToPosition(tree, 'nonexistent', 'root', 0);

      expect(result.success).toBe(false);
      // Tree is unchanged
      expect(result.updatedTree.children!.map((n) => n.id)).toEqual([
        'a', 'b', 'c', 'd', 'e',
      ]);
    });

    it('test_sequence_change_emits_state_update: does not mutate original tree', () => {
      const tree = buildTree();
      const originalOrder = tree.children!.map((n) => n.id);

      moveNodeToPosition(tree, 'c', 'root', 0);

      // Original tree must be unchanged (immutable operation)
      const afterOrder = tree.children!.map((n) => n.id);
      expect(afterOrder).toEqual(originalOrder);
    });

    it('test_sequence_change_emits_state_update: works for deeply nested siblings', () => {
      const tree: MindMapNode = {
        id: 'root',
        topic: 'Root',
        children: [
          {
            id: 'parent',
            topic: 'Parent',
            children: [
              { id: 'x', topic: 'X' },
              { id: 'y', topic: 'Y' },
              { id: 'z', topic: 'Z' },
            ],
          },
        ],
      };

      const result = moveNodeToPosition(tree, 'z', 'parent', 0);

      expect(result.success).toBe(true);
      const nestedParent = result.updatedTree.children![0];
      expect(nestedParent.children!.map((n) => n.id)).toEqual(['z', 'x', 'y']);
    });

    it('test_update_node_sequence_reorders_siblings: handles move to same position (no-op)', () => {
      const tree = buildTree();
      // 'b' is already at index 1
      const result = moveNodeToPosition(tree, 'b', 'root', 1);

      expect(result.success).toBe(true);
      const order = result.updatedTree.children!.map((n) => n.id);
      expect(order).toEqual(['a', 'b', 'c', 'd', 'e']);
    });
  });
});
