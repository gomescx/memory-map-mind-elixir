/**
 * Unit tests for depth-first traversal utility
 * Tests: src/utils/tree/depth-traversal.ts
 */

import { describe, it, expect } from 'vitest';
import { flattenByDepth, type FlatNode } from '@/utils/tree/depth-traversal';
import type { MindMapNode } from '@core/types/node';

describe('depth-traversal', () => {
  describe('flattenByDepth', () => {
    it('flattens tree in depth-first order', () => {
      const root: MindMapNode = {
        id: 'root',
        topic: 'Root',
        children: [
          {
            id: 'a',
            topic: 'A',
            children: [
              { id: 'a1', topic: 'A1' },
              { id: 'a2', topic: 'A2' },
            ],
          },
          { id: 'b', topic: 'B' },
        ],
      };

      const result = flattenByDepth(root);

      expect(result).toHaveLength(5);
      expect(result.map((n) => n.id)).toEqual([
        'root',
        'a',
        'a1',
        'a2',
        'b',
      ]);
    });

    it('includes correct depth for each node', () => {
      const root: MindMapNode = {
        id: 'root',
        topic: 'Root',
        children: [
          {
            id: 'a',
            topic: 'A',
            children: [{ id: 'a1', topic: 'A1' }],
          },
        ],
      };

      const result = flattenByDepth(root);

      expect(result[0].depth).toBe(0); // root
      expect(result[1].depth).toBe(1); // a
      expect(result[2].depth).toBe(2); // a1
    });

    it('filters by depth when depthFilter is provided', () => {
      const root: MindMapNode = {
        id: 'root',
        topic: 'Root',
        children: [
          {
            id: 'a',
            topic: 'A',
            children: [
              { id: 'a1', topic: 'A1' },
              { id: 'a2', topic: 'A2' },
            ],
          },
          { id: 'b', topic: 'B' },
        ],
      };

      const result = flattenByDepth(root, 2);

      expect(result).toHaveLength(2);
      expect(result.map((n) => n.id)).toEqual(['a1', 'a2']);
      expect(result.every((n) => n.depth === 2)).toBe(true);
    });

    it('returns empty array when no nodes match depth filter', () => {
      const root: MindMapNode = {
        id: 'root',
        topic: 'Root',
        children: [{ id: 'a', topic: 'A' }],
      };

      const result = flattenByDepth(root, 5);

      expect(result).toEqual([]);
    });

    it('maintains parent-child relationship metadata', () => {
      const root: MindMapNode = {
        id: 'root',
        topic: 'Root',
        children: [
          {
            id: 'a',
            topic: 'A',
            children: [{ id: 'a1', topic: 'A1' }],
          },
        ],
      };

      const result = flattenByDepth(root);

      expect(result[0].parentId).toBeNull(); // root has no parent
      expect(result[1].parentId).toBe('root');
      expect(result[2].parentId).toBe('a');
    });

    it('preserves depth-first order when filtering', () => {
      const root: MindMapNode = {
        id: 'root',
        topic: 'Root',
        children: [
          {
            id: 'a',
            topic: 'A',
            children: [
              { id: 'a1', topic: 'A1' },
              { id: 'a2', topic: 'A2' },
            ],
          },
          {
            id: 'b',
            topic: 'B',
            children: [{ id: 'b1', topic: 'B1' }],
          },
        ],
      };

      const result = flattenByDepth(root, 2);

      // Maintains depth-first: a1, a2 come before b1
      expect(result.map((n) => n.id)).toEqual(['a1', 'a2', 'b1']);
    });

    it('handles nodes without children', () => {
      const root: MindMapNode = {
        id: 'root',
        topic: 'Root',
      };

      const result = flattenByDepth(root);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('root');
      expect(result[0].depth).toBe(0);
    });
  });
});
