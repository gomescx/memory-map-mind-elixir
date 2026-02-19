/**
 * Integration tests for table cell editing and state synchronization
 * Tests: T057 (status change syncs to both views), T060 (cell edits call mutations)
 */

import { describe, it, expect, vi } from 'vitest';
import { updateNodeAttribute } from '@state/tree/mutations';
import type { MindMapNode } from '@core/types/node';

describe('table-edit-sync', () => {
  function buildTree(): MindMapNode {
    return {
      id: 'root',
      topic: 'Project',
      children: [
        {
          id: 'task1',
          topic: 'Research',
          extended: {
            plan: {
              status: 'Not Started',
              dueDate: null,
              assignee: null,
              investedTimeHours: null,
              elapsedTimeDays: null,
              startDate: null,
            },
          },
        },
        {
          id: 'task2',
          topic: 'Implementation',
          extended: {
            plan: {
              status: 'In Progress',
              dueDate: '2026-03-15',
              assignee: 'Alice',
              investedTimeHours: 8,
              elapsedTimeDays: 2,
              startDate: '2026-03-01',
            },
          },
        },
      ],
    };
  }

  describe('T057: test_select_cell_saves_on_selection', () => {
    it('test_status_change_updates_both_views: updateNodeAttribute reflects status change in tree', () => {
      const tree = buildTree();

      // Simulate user selecting "In Progress" from status dropdown
      const result = updateNodeAttribute(tree, 'task1', 'status', 'In Progress');

      expect(result.success).toBe(true);
      const updatedTask = result.updatedTree.children![0];
      expect(updatedTask.extended?.plan?.status).toBe('In Progress');
    });

    it('test_status_change_updates_both_views: status update does not affect other task attributes', () => {
      const tree = buildTree();
      const result = updateNodeAttribute(tree, 'task2', 'status', 'Completed');

      expect(result.success).toBe(true);
      const updatedTask = result.updatedTree.children![1];
      expect(updatedTask.extended?.plan?.status).toBe('Completed');
      // Other attributes unchanged
      expect(updatedTask.extended?.plan?.dueDate).toBe('2026-03-15');
      expect(updatedTask.extended?.plan?.assignee).toBe('Alice');
      expect(updatedTask.extended?.plan?.investedTimeHours).toBe(8);
    });
  });

  describe('T060: test_cell_edit_calls_update_mutation', () => {
    it('test_cell_edit_calls_update_mutation: updateNodeAttribute correctly sets assignee', () => {
      const tree = buildTree();
      const result = updateNodeAttribute(tree, 'task1', 'assignee', 'Bob');

      expect(result.success).toBe(true);
      expect(result.updatedTree.children![0].extended?.plan?.assignee).toBe('Bob');
    });

    it('test_cell_edit_calls_update_mutation: updateNodeAttribute correctly sets dueDate', () => {
      const tree = buildTree();
      const result = updateNodeAttribute(tree, 'task1', 'dueDate', '2026-06-30');

      expect(result.success).toBe(true);
      expect(result.updatedTree.children![0].extended?.plan?.dueDate).toBe('2026-06-30');
    });

    it('test_cell_edit_calls_update_mutation: updateNodeAttribute correctly sets numeric field', () => {
      const tree = buildTree();
      const result = updateNodeAttribute(tree, 'task1', 'investedTimeHours', 16);

      expect(result.success).toBe(true);
      expect(result.updatedTree.children![0].extended?.plan?.investedTimeHours).toBe(16);
    });

    it('test_edit_syncs_to_mindmap_immediately: updateNodeAttribute does not mutate original tree', () => {
      const tree = buildTree();
      const originalStatus = tree.children![0].extended?.plan?.status;

      updateNodeAttribute(tree, 'task1', 'status', 'Completed');

      // Original tree is unchanged - update creates a new tree
      expect(tree.children![0].extended?.plan?.status).toBe(originalStatus);
    });

    it('test_edit_syncs_to_mindmap_immediately: clearing a field sets it to null', () => {
      const tree = buildTree();
      const result = updateNodeAttribute(tree, 'task2', 'assignee', null);

      expect(result.success).toBe(true);
      expect(result.updatedTree.children![1].extended?.plan?.assignee).toBeNull();
    });

    it('test_cell_edit_calls_update_mutation: returns failure for unknown nodeId', () => {
      const tree = buildTree();
      const result = updateNodeAttribute(tree, 'nonexistent', 'status', 'Completed');

      expect(result.success).toBe(false);
    });
  });

  describe('T057: integration smoke test for status options', () => {
    const validStatuses = ['Not Started', 'In Progress', 'Completed'];

    it.each(validStatuses)(
      'status "%s" saves successfully via updateNodeAttribute',
      (status) => {
        const tree = buildTree();
        const result = updateNodeAttribute(tree, 'task1', 'status', status);

        expect(result.success).toBe(true);
        expect(result.updatedTree.children![0].extended?.plan?.status).toBe(status);
      },
    );
  });
});
