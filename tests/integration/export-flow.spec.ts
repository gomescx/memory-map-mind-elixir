/**
 * Integration tests for export flow
 * Tests end-to-end export workflow with multi-level maps and stable ID verification
 */

import { describe, it, expect, beforeEach } from 'vitest';
import type { MindMapNode, MindMap } from '@core/types/node';
import { flattenTree, validateStableIds } from '@services/export/flatten';
import { generateCSV } from '@services/export/csv';
import { generateHTMLTable } from '@services/export/html-table';
import { exportToCSV, exportToHTML } from '@ui/actions/export-map';

describe('export flow integration', () => {
  let testMap: MindMap;

  beforeEach(() => {
    // Create a complex multi-level test map
    testMap = {
      id: 'test-map-001',
      title: 'Integration Test Map',
      version: '1.0.0',
      root: {
        id: 'root-node-001',
        topic: 'Strategic Initiative 2025',
        children: [
          {
            id: 'q1-001',
            topic: 'Q1 Planning',
            extended: {
              plan: {
                startDate: '2025-01-01',
                dueDate: '2025-03-31',
                investedTimeHours: 120,
                elapsedTimeDays: 45,
                assignee: 'Project Manager',
                status: 'In Progress',
              },
            },
            children: [
              {
                id: 'q1-task-001',
                topic: 'Set objectives',
                extended: {
                  plan: {
                    startDate: '2025-01-01',
                    dueDate: '2025-01-10',
                    investedTimeHours: 20,
                    elapsedTimeDays: 10,
                    assignee: 'Alice',
                    status: 'Completed',
                  },
                },
              },
              {
                id: 'q1-task-002',
                topic: 'Allocate resources',
                extended: {
                  plan: {
                    startDate: '2025-01-05',
                    dueDate: '2025-01-20',
                    investedTimeHours: 30,
                    elapsedTimeDays: 15,
                    assignee: 'Bob',
                    status: 'In Progress',
                  },
                },
              },
              {
                id: 'q1-task-003',
                topic: 'Finalize budget',
                extended: {
                  plan: {
                    startDate: '2025-01-15',
                    dueDate: '2025-02-15',
                    investedTimeHours: 25,
                    elapsedTimeDays: null,
                    assignee: 'Charlie',
                    status: 'Not Started',
                  },
                },
              },
            ],
          },
          {
            id: 'q2-001',
            topic: 'Q2 Execution',
            extended: {
              plan: {
                startDate: '2025-04-01',
                dueDate: '2025-06-30',
                investedTimeHours: 200,
                elapsedTimeDays: null,
                assignee: null,
                status: 'Not Started',
              },
            },
            children: [
              {
                id: 'q2-workstream-001',
                topic: 'Development Workstream',
                extended: {
                  plan: {
                    startDate: '2025-04-01',
                    dueDate: '2025-05-31',
                    investedTimeHours: 120,
                    elapsedTimeDays: null,
                    assignee: 'Dev Lead',
                    status: 'Not Started',
                  },
                },
                children: [
                  {
                    id: 'q2-dev-task-001',
                    topic: 'Architecture design',
                    extended: {
                      plan: {
                        startDate: null,
                        dueDate: null,
                        investedTimeHours: null,
                        elapsedTimeDays: null,
                        assignee: null,
                        status: null,
                      },
                    },
                  },
                  {
                    id: 'q2-dev-task-002',
                    topic: 'Core implementation',
                    extended: {
                      plan: {
                        startDate: null,
                        dueDate: '2025-05-15',
                        investedTimeHours: 80,
                        elapsedTimeDays: null,
                        assignee: 'Dev Team',
                        status: null,
                      },
                    },
                  },
                ],
              },
              {
                id: 'q2-workstream-002',
                topic: 'Testing & QA',
                extended: {
                  plan: {
                    startDate: '2025-05-01',
                    dueDate: '2025-06-15',
                    investedTimeHours: 60,
                    elapsedTimeDays: null,
                    assignee: 'QA Lead',
                    status: 'Not Started',
                  },
                },
              },
            ],
          },
        ],
      },
    };
  });

  describe('CSV export flow', () => {
    it('exports all nodes with correct count', () => {
      const rows = flattenTree(testMap.root);
      expect(rows.length).toBe(10); // 1 root + 2 quarters + 3 q1 tasks + 2 q2 workstreams + 2 q2 dev tasks
    });

    it('maintains stable IDs across multiple exports', () => {
      const rows1 = flattenTree(testMap.root);
      const rows2 = flattenTree(testMap.root);

      expect(validateStableIds(rows1, rows2)).toBe(true);
    });

    it('generates CSV with all rows present', () => {
      const rows = flattenTree(testMap.root);
      const csv = generateCSV(rows);

      // Verify all node titles appear in CSV
      expect(csv).toContain('Strategic Initiative 2025');
      expect(csv).toContain('Q1 Planning');
      expect(csv).toContain('Q2 Execution');
      expect(csv).toContain('Set objectives');
      expect(csv).toContain('Core implementation');
    });

    it('exports handles deeply nested nodes', () => {
      const rows = flattenTree(testMap.root);

      // Find the deepest node
      const deepest = rows.find((r) => r.title === 'Core implementation');
      expect(deepest?.depth).toBe(3);
      expect(deepest?.parentPath).toContain('Q2 Execution');
      expect(deepest?.parentPath).toContain('Development Workstream');
    });

    it('preserves all planning attributes in export', () => {
      const rows = flattenTree(testMap.root);

      const q1 = rows.find((r) => r.title === 'Q1 Planning');
      expect(q1).toMatchObject({
        startDate: '2025-01-01',
        dueDate: '2025-03-31',
        investedTimeHours: 120,
        elapsedTimeDays: 45,
        assignee: 'Project Manager',
        status: 'In Progress',
      });
    });

    it('handles mixed null and populated fields', () => {
      const rows = flattenTree(testMap.root);

      // Task with all nulls
      const noData = rows.find((r) => r.title === 'Architecture design');
      expect(noData?.startDate).toBeNull();
      expect(noData?.dueDate).toBeNull();
      expect(noData?.investedTimeHours).toBeNull();

      // Task with partial data
      const partialData = rows.find((r) => r.title === 'Core implementation');
      expect(partialData?.startDate).toBeNull();
      expect(partialData?.dueDate).toBe('2025-05-15');
      expect(partialData?.investedTimeHours).toBe(80);
    });
  });

  describe('HTML export flow', () => {
    it('generates valid HTML with all nodes', () => {
      const rows = flattenTree(testMap.root);
      const html = generateHTMLTable(rows, testMap.title);

      expect(html).toContain('<!DOCTYPE html>');
      expect(html).toContain('<title>');
      expect(html).toContain(testMap.title);
      expect(html).toContain('</title>');

      // All nodes should be present
      expect(html).toContain('Strategic Initiative 2025');
      expect(html).toContain('Q1 Planning');
      expect(html).toContain('Q2 Execution');
    });

    it('creates CSS styled table', () => {
      const rows = flattenTree(testMap.root);
      const html = generateHTMLTable(rows);

      // Verify styles are present
      expect(html).toContain('<style>');
      expect(html).toContain('</style>');
      expect(html).toContain('border-collapse');
      expect(html).toContain('background-color');
    });

    it('renders table headers and body', () => {
      const rows = flattenTree(testMap.root);
      const html = generateHTMLTable(rows);

      expect(html).toContain('<thead>');
      expect(html).toContain('</thead>');
      expect(html).toContain('<tbody>');
      expect(html).toContain('</tbody>');
    });

    it('applies depth-based indentation', () => {
      const rows = flattenTree(testMap.root);
      const html = generateHTMLTable(rows);

      // Find rows with different depths and verify indentation
      const root = rows.find((r) => r.title === 'Strategic Initiative 2025');
      const q1 = rows.find((r) => r.title === 'Q1 Planning');
      const task = rows.find((r) => r.title === 'Set objectives');

      expect(root?.depth).toBe(0);
      expect(q1?.depth).toBe(1);
      expect(task?.depth).toBe(2);

      // Verify HTML contains appropriate indentation
      expect(html).toContain('padding-left: 0px');
      expect(html).toContain('padding-left: 20px');
      expect(html).toContain('padding-left: 40px');
    });
  });

  describe('action functions integration', () => {
    it('exportToCSV successfully calls underlying services', () => {
      const root = testMap.root;

      // This should not throw
      expect(() => {
        exportToCSV(root);
      }).not.toThrow();
    });

    it('exportToHTML successfully calls underlying services', () => {
      const root = testMap.root;

      // This should not throw
      expect(() => {
        exportToHTML(root);
      }).not.toThrow();
    });
  });

  describe('stable ID verification', () => {
    it('validates identical ID order across multiple flattens', () => {
      const flatten1 = flattenTree(testMap.root);
      const flatten2 = flattenTree(testMap.root);
      const flatten3 = flattenTree(testMap.root);

      expect(validateStableIds(flatten1, flatten2)).toBe(true);
      expect(validateStableIds(flatten2, flatten3)).toBe(true);
    });

    it('detects ID mismatch when validation fails', () => {
      const flatten1 = flattenTree(testMap.root);
      const flatten2 = flatten1.map((row, idx) => ({
        ...row,
        id: idx === 0 ? 'different-id' : row.id,
      }));

      expect(validateStableIds(flatten1, flatten2)).toBe(false);
    });

    it('detects different row counts', () => {
      const flatten1 = flattenTree(testMap.root);
      const flatten2 = flattenTree(testMap.root).slice(0, -1);

      expect(validateStableIds(flatten1, flatten2)).toBe(false);
    });
  });
});
