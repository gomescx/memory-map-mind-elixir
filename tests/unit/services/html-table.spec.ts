/**
 * Unit tests for HTML table export generator
 * Tests: src/services/export/html-table.ts
 */

import { describe, it, expect } from 'vitest';
import { generateHTMLTable } from '@services/export/html-table';
import type { ExportRow } from '@services/export/flatten';

const sampleRows: ExportRow[] = [
  {
    id: 'root',
    depth: 0,
    title: 'Root Topic',
    startDate: '2025-01-01',
    dueDate: '2025-12-31',
    investedTimeHours: 10,
    elapsedTimeDays: 5,
    assignee: 'Alice',
    status: 'In Progress',
    parentPath: '',
  },
  {
    id: 'child1',
    depth: 1,
    title: 'Child Task',
    startDate: null,
    dueDate: null,
    investedTimeHours: null,
    elapsedTimeDays: null,
    assignee: null,
    status: 'Not Started',
    parentPath: 'Root Topic',
  },
];

describe('generateHTMLTable – column filter UI', () => {
  it('includes a Filter Columns button', () => {
    const html = generateHTMLTable(sampleRows);
    expect(html).toContain('Filter Columns');
  });

  it('renders a checkbox for each column header', () => {
    const html = generateHTMLTable(sampleRows);
    const columns = ['ID', 'Depth', 'Title', 'Start Date', 'Due Date', 'Invested Time', 'Elapsed Time', 'Assignee', 'Status', 'Parent Path'];
    columns.forEach(col => {
      expect(html).toContain(`data-col-name="${col}"`);
    });
  });

  it('all column checkboxes are checked by default', () => {
    const html = generateHTMLTable(sampleRows);
    const totalCheckboxes = (html.match(/class="col-toggle"/g) ?? []).length;
    // One checkbox per column (10 columns)
    expect(totalCheckboxes).toBe(10);
    // All checkboxes must carry the `checked` attribute
    const checkedCheckboxes = (html.match(/class="col-toggle"[^>]*\bchecked\b/g) ?? []).length;
    expect(checkedCheckboxes).toBe(10);
  });

  it('includes the hidden-columns-section element', () => {
    const html = generateHTMLTable(sampleRows);
    expect(html).toContain('id="hidden-columns-section"');
    expect(html).toContain('id="hidden-columns-list"');
  });

  it('includes the toggleFilterPanel JavaScript function', () => {
    const html = generateHTMLTable(sampleRows);
    expect(html).toContain('function toggleFilterPanel()');
  });

  it('includes the updateColumnVisibility JavaScript function', () => {
    const html = generateHTMLTable(sampleRows);
    expect(html).toContain('function updateColumnVisibility()');
  });

  it('adds data-col attributes to header cells', () => {
    const html = generateHTMLTable(sampleRows);
    for (let i = 0; i < 10; i++) {
      expect(html).toContain(`<th data-col="${i}">`);
    }
  });

  it('adds data-col attributes to data cells', () => {
    const html = generateHTMLTable(sampleRows);
    for (let i = 0; i < 10; i++) {
      expect(html).toContain(`<td data-col="${i}">`);
    }
  });

  it('hidden-columns-section starts hidden', () => {
    const html = generateHTMLTable(sampleRows);
    expect(html).toContain('id="hidden-columns-section" class="hidden-columns-note" style="display:none;"');
  });

  it('column-filter-panel starts hidden', () => {
    const html = generateHTMLTable(sampleRows);
    expect(html).toContain('id="column-filter-panel" style="display:none;"');
  });
});
