/**
 * Contract regression tests for export functionality
 * Validates CSV and HTML table exports conform to export-openapi.yaml specification
 * Tests against sample payloads to ensure stable behavior
 */

import { describe, it, expect } from 'vitest';
import type { MindMapNode } from '@core/types/node';
import { flattenTree } from '@services/export/flatten';
import { generateCSV, createCSVBlob } from '@services/export/csv';
import { generateHTMLTable, createHTMLBlob } from '@services/export/html-table';

describe('export-openapi contracts', () => {
  /**
   * Sample multi-level mind map for testing
   * Mimics real-world structure with planning attributes
   */
  function createSampleMap(): MindMapNode {
    return {
      id: 'root-001',
      topic: 'Q1 2025 Initiative',
      children: [
        {
          id: 'phase1-001',
          topic: 'Phase 1: Discovery',
          extended: {
            plan: {
              startDate: '2025-01-01',
              dueDate: '2025-02-28',
              investedTimeHours: 80,
              elapsedTimeDays: 20,
              assignee: 'Alice',
              status: 'In Progress',
            },
          },
          children: [
            {
              id: 'task1-001',
              topic: 'Research market trends',
              extended: {
                plan: {
                  startDate: '2025-01-01',
                  dueDate: '2025-01-15',
                  investedTimeHours: 16,
                  elapsedTimeDays: 8,
                  assignee: 'Alice',
                  status: 'Completed',
                },
              },
            },
            {
              id: 'task1-002',
              topic: 'Stakeholder interviews',
              extended: {
                plan: {
                  startDate: '2025-01-05',
                  dueDate: '2025-02-28',
                  investedTimeHours: 24,
                  elapsedTimeDays: null,
                  assignee: 'Bob',
                  status: 'In Progress',
                },
              },
            },
          ],
        },
        {
          id: 'phase2-001',
          topic: 'Phase 2: Planning',
          extended: {
            plan: {
              startDate: '2025-03-01',
              dueDate: '2025-04-30',
              investedTimeHours: 40,
              elapsedTimeDays: null,
              assignee: null,
              status: 'Not Started',
            },
          },
          children: [
            {
              id: 'task2-001',
              topic: 'Define requirements',
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
          ],
        },
      ],
    };
  }

  describe('CSV export contract', () => {
    it('generates valid CSV with expected headers', () => {
      const map = createSampleMap();
      const rows = flattenTree(map);
      const csv = generateCSV(rows);

      // Verify header row contains all expected columns
      const lines = csv.split('\r\n');
      const header = lines[0];

      expect(header).toContain('ID');
      expect(header).toContain('Depth');
      expect(header).toContain('Title');
      expect(header).toContain('Start Date');
      expect(header).toContain('Due Date');
      expect(header).toContain('Invested Time (hours)');
      expect(header).toContain('Elapsed Time (days)');
      expect(header).toContain('Assignee');
      expect(header).toContain('Status');
      expect(header).toContain('Parent Path');
    });

    it('flattens all nodes to CSV rows', () => {
      const map = createSampleMap();
      const rows = flattenTree(map);
      const csv = generateCSV(rows);

      const lines = csv.split('\r\n');
      // 1 header + 6 data rows (root + 2 phases + 3 tasks)
      expect(lines.length).toBe(7);
      expect(rows.length).toBe(6);
    });

    it('preserves stable node IDs across exports', () => {
      const map = createSampleMap();

      const rows1 = flattenTree(map);
      const rows2 = flattenTree(map);

      expect(rows1.map((r) => r.id)).toEqual(rows2.map((r) => r.id));
    });

    it('escapes special characters in CSV fields', () => {
      const mapWithSpecialChars: MindMapNode = {
        id: 'root-special',
        topic: 'Project "Alpha", Phase 1',
        children: [
          {
            id: 'task-special',
            topic: 'Task with "quotes" and, commas',
            extended: {
              plan: {
                startDate: null,
                dueDate: null,
                investedTimeHours: null,
                elapsedTimeDays: null,
                assignee: 'John "Johnny" Doe',
                status: 'In Progress',
              },
            },
          },
        ],
      };

      const rows = flattenTree(mapWithSpecialChars);
      const csv = generateCSV(rows);

      // Verify CSV is parseable
      expect(csv).toContain('"Project ""Alpha"", Phase 1"');
      expect(csv).toContain('"John ""Johnny"" Doe"');
    });

    it('handles null values gracefully', () => {
      const map = createSampleMap();
      const rows = flattenTree(map);
      const csv = generateCSV(rows);

      // Find the row with null values
      const nullRow = rows.find((r) => r.title === 'Define requirements');
      expect(nullRow).toBeDefined();

      // Null values should appear as empty fields
      const csvContent = generateCSV([nullRow!]);
      expect(csvContent).not.toContain('null');
      expect(csvContent).not.toContain('undefined');
    });

    it('creates valid Blob for download', () => {
      const map = createSampleMap();
      const rows = flattenTree(map);
      const csv = generateCSV(rows);
      const blob = createCSVBlob(csv);

      expect(blob).toBeInstanceOf(Blob);
      expect(blob.type).toBe('text/csv;charset=utf-8');
      expect(blob.size).toBeGreaterThan(0);
    });
  });

  describe('HTML table export contract', () => {
    it('generates valid HTML with expected table structure', () => {
      const map = createSampleMap();
      const rows = flattenTree(map);
      const html = generateHTMLTable(rows, map.topic);

      expect(html).toContain('<!DOCTYPE html>');
      expect(html).toContain('<table>');
      expect(html).toContain('</table>');
      expect(html).toContain('<thead>');
      expect(html).toContain('<tbody>');
    });

    it('includes all expected table headers', () => {
      const map = createSampleMap();
      const rows = flattenTree(map);
      const html = generateHTMLTable(rows);

      expect(html).toContain('ID');
      expect(html).toContain('Depth');
      expect(html).toContain('Title');
      expect(html).toContain('Start Date');
      expect(html).toContain('Due Date');
      expect(html).toContain('Invested Time (hours)');
      expect(html).toContain('Elapsed Time (days)');
      expect(html).toContain('Assignee');
      expect(html).toContain('Status');
      expect(html).toContain('Parent Path');
    });

    it('renders all rows in table body', () => {
      const map = createSampleMap();
      const rows = flattenTree(map);
      const html = generateHTMLTable(rows);

      // Each row should appear in the HTML
      for (const row of rows) {
        expect(html).toContain(row.id);
        expect(html).toContain(row.title);
      }
    });

    it('applies indentation styling based on depth', () => {
      const mapWithDepth: MindMapNode = {
        id: 'root',
        topic: 'Root',
        children: [
          {
            id: 'child1',
            topic: 'Child',
            children: [
              {
                id: 'grandchild',
                topic: 'Grandchild',
              },
            ],
          },
        ],
      };

      const rows = flattenTree(mapWithDepth);
      const html = generateHTMLTable(rows);

      // Verify indentation styling
      expect(html).toContain('padding-left: 0px'); // Root at depth 0
      expect(html).toContain('padding-left: 20px'); // Depth 1
      expect(html).toContain('padding-left: 40px'); // Depth 2
    });

    it('escapes HTML special characters', () => {
      const mapWithHTML: MindMapNode = {
        id: 'root-html',
        topic: 'Project <Script>Alert(1)</Script>',
        children: [
          {
            id: 'task-html',
            topic: 'Task with & ampersand',
            extended: {
              plan: {
                startDate: null,
                dueDate: null,
                investedTimeHours: null,
                elapsedTimeDays: null,
                assignee: '<img src=x>',
                status: 'In Progress',
              },
            },
          },
        ],
      };

      const rows = flattenTree(mapWithHTML);
      const html = generateHTMLTable(rows);

      // Verify entities are escaped
      expect(html).toContain('&lt;');
      expect(html).toContain('&gt;');
      expect(html).toContain('&amp;');
      // Ensure script tags are not present
      expect(html).not.toContain('<script>');
    });

    it('creates valid Blob for download', () => {
      const map = createSampleMap();
      const rows = flattenTree(map);
      const html = generateHTMLTable(rows);
      const blob = createHTMLBlob(html);

      expect(blob).toBeInstanceOf(Blob);
      expect(blob.type).toBe('text/html;charset=utf-8');
      expect(blob.size).toBeGreaterThan(0);
    });
  });

  describe('flatten tree contract', () => {
    it('preserves depth information correctly', () => {
      const map = createSampleMap();
      const rows = flattenTree(map);

      // Find rows by title and verify depth
      const root = rows.find((r) => r.title === 'Q1 2025 Initiative');
      const phase1 = rows.find((r) => r.title === 'Phase 1: Discovery');
      const task1 = rows.find((r) => r.title === 'Research market trends');

      expect(root?.depth).toBe(0);
      expect(phase1?.depth).toBe(1);
      expect(task1?.depth).toBe(2);
    });

    it('builds parent path correctly', () => {
      const map = createSampleMap();
      const rows = flattenTree(map);

      const task = rows.find((r) => r.title === 'Research market trends');
      expect(task?.parentPath).toBe('Q1 2025 Initiative > Phase 1: Discovery');

      const phase = rows.find((r) => r.title === 'Phase 1: Discovery');
      expect(phase?.parentPath).toBe('Q1 2025 Initiative');

      const root = rows.find((r) => r.title === 'Q1 2025 Initiative');
      expect(root?.parentPath).toBe('');
    });

    it('preserves all plan attributes in flatten', () => {
      const map = createSampleMap();
      const rows = flattenTree(map);

      const phase = rows.find((r) => r.title === 'Phase 1: Discovery');
      expect(phase).toMatchObject({
        startDate: '2025-01-01',
        dueDate: '2025-02-28',
        investedTimeHours: 80,
        elapsedTimeDays: 20,
        assignee: 'Alice',
        status: 'In Progress',
      });
    });
  });
});
