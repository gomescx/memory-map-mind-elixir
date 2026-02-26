/**
 * Unit tests for table view component
 * Tests: src/ui/views/table-view.tsx
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TableView } from '@ui/views/table-view';
import type { MindMapNode } from '@core/types/node';

// Mock store
const mockStore = {
  getMindElixirInstance: vi.fn(),
  selectedNodeId: null,
  setSelectedNodeId: vi.fn(),
  depthFilter: undefined as number | undefined,
  setDepthFilter: vi.fn(),
  getNode: vi.fn(),
  updateNodePlan: vi.fn(),
  isPanelOpen: false,
  setIsPanelOpen: vi.fn(),
  history: [],
  historyIndex: -1,
  addToHistory: vi.fn(),
  undo: vi.fn(),
  redo: vi.fn(),
  setMindElixirInstance: vi.fn(),
};

// Mock context
vi.mock('@state/store', () => ({
  useAppStore: () => mockStore,
}));

describe('TableView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders table with correct columns', () => {
    const mockData: MindMapNode = {
      id: 'root',
      topic: 'Root',
      children: [
        {
          id: 'a',
          topic: 'Task A',
          extended: {
            plan: {
              status: 'In Progress',
              dueDate: '2026-03-15',
              assignee: 'John',
              investedTimeHours: 5,
              elapsedTimeDays: 2,
              startDate: '2026-03-01',
            },
          },
        },
      ],
    };

    mockStore.getMindElixirInstance.mockReturnValue({ getData: () => ({ nodeData: mockData }) });

    render(<TableView />);

    // Check column headers exist
    expect(screen.getByText('Sequence')).toBeTruthy();
    expect(screen.getByText('Title')).toBeTruthy();
    expect(screen.getByText('Status')).toBeTruthy();
    expect(screen.getByText('Due Date')).toBeTruthy();
    expect(screen.getByText('Assignee')).toBeTruthy();
    expect(screen.getByText('Invested Time')).toBeTruthy();
    expect(screen.getByText('Elapsed Time')).toBeTruthy();
    expect(screen.getByText('Depth')).toBeTruthy();
  });

  it('test_table_does_not_render_priority_column: priority column is absent', () => {
    const mockData: MindMapNode = {
      id: 'root',
      topic: 'Root',
      children: [{ id: 'a', topic: 'Task A' }],
    };
    mockStore.getMindElixirInstance.mockReturnValue({ getData: () => ({ nodeData: mockData }) });
    render(<TableView />);

    expect(screen.queryByText('Priority')).toBeNull();
  });

  it('test_table_columns_match_spec_order: columns do not include Priority', () => {
    const mockData: MindMapNode = {
      id: 'root',
      topic: 'Root',
      children: [{ id: 'a', topic: 'Task A' }],
    };
    mockStore.getMindElixirInstance.mockReturnValue({ getData: () => ({ nodeData: mockData }) });
    render(<TableView />);

    const headers = screen.getAllByRole('columnheader').map((h) => h.textContent);
    expect(headers).not.toContain('Priority');
    expect(headers).toContain('Sequence');
    expect(headers).toContain('Status');
  });

  it('test_table_column_headers_match_html_export: column names use same terminology as export', () => {
    const mockData: MindMapNode = {
      id: 'root',
      topic: 'Root',
      children: [{ id: 'a', topic: 'Task A' }],
    };
    mockStore.getMindElixirInstance.mockReturnValue({ getData: () => ({ nodeData: mockData }) });
    render(<TableView />);

    // These names appear in both the table view and the HTML export
    expect(screen.getByText('Invested Time')).toBeTruthy();
    expect(screen.getByText('Elapsed Time')).toBeTruthy();
  });

  it('test_table_column_order_is_correct: AS-008.1 column order is respected', () => {
    const mockData: MindMapNode = {
      id: 'root',
      topic: 'Root',
      children: [{ id: 'a', topic: 'Task A' }],
    };
    mockStore.getMindElixirInstance.mockReturnValue({ getData: () => ({ nodeData: mockData }) });
    render(<TableView />);

    const headers = screen.getAllByRole('columnheader').map((h) => h.textContent?.trim());
    const titleIdx = headers.indexOf('Title');
    const startDateIdx = headers.indexOf('Start Date');
    const dueDateIdx = headers.indexOf('Due Date');
    const investedIdx = headers.indexOf('Invested Time');
    const elapsedIdx = headers.indexOf('Elapsed Time');
    const assigneeIdx = headers.indexOf('Assignee');
    const statusIdx = headers.indexOf('Status');
    const depthIdx = headers.indexOf('Depth');

    // AS-008.1: Sequence, Title, Start Date, Due Date, Invested Time, Elapsed Time, Assignee, Status, Depth
    expect(titleIdx).toBeLessThan(startDateIdx);
    expect(startDateIdx).toBeLessThan(dueDateIdx);
    expect(dueDateIdx).toBeLessThan(investedIdx);
    expect(investedIdx).toBeLessThan(elapsedIdx);
    expect(elapsedIdx).toBeLessThan(assigneeIdx);
    expect(assigneeIdx).toBeLessThan(statusIdx);
    expect(statusIdx).toBeLessThan(depthIdx);
    expect(headers).not.toContain('Priority');
    expect(headers).not.toContain('Est. Hours');
    expect(headers).not.toContain('Inv. Hours');
  });

  it('displays all nodes in depth-first order', () => {
    const mockData: MindMapNode = {
      id: 'root',
      topic: 'Root',
      children: [
        {
          id: 'a',
          topic: 'A',
          children: [{ id: 'a1', topic: 'A1' }],
        },
        { id: 'b', topic: 'B' },
      ],
    };

    mockStore.getMindElixirInstance.mockReturnValue({ getData: () => ({ nodeData: mockData }) });

    render(<TableView />);

    const rows = screen.getAllByRole('row');
    // Header + 4 data rows (root, a, a1, b)
    expect(rows).toHaveLength(5);
  });

  it('displays node data in correct columns', () => {
    const mockData: MindMapNode = {
      id: 'root',
      topic: 'Root',
      children: [
        {
          id: 'task1',
          topic: 'Important Task',
          extended: {
            plan: {
              status: 'Completed',
              dueDate: '2026-03-20',
              assignee: 'Alice',
              investedTimeHours: 10,
              elapsedTimeDays: 5,
              startDate: '2026-03-01',
            },
          },
        },
      ],
    };

    mockStore.getMindElixirInstance.mockReturnValue({ getData: () => ({ nodeData: mockData }) });

    render(<TableView />);

    expect(screen.getByText('Important Task')).toBeTruthy();
    expect(screen.getByText('Completed')).toBeTruthy();
    expect(screen.getByText('20-Mar-2026')).toBeTruthy();
    expect(screen.getByText('Alice')).toBeTruthy();
    expect(screen.getByText('10')).toBeTruthy();
  });

  it('displays "--" for empty attribute values', () => {
    const mockData: MindMapNode = {
      id: 'root',
      topic: 'Root',
      children: [{ id: 'task1', topic: 'Task without attributes' }],
    };

    mockStore.getMindElixirInstance.mockReturnValue({ getData: () => ({ nodeData: mockData }) });

    render(<TableView />);

    // Count "--" placeholders for empty fields
    const emptyMarkers = screen.getAllByText('--');
    expect(emptyMarkers.length).toBeGreaterThan(0);
  });

  it('test_table_shows_empty_state_when_no_nodes: shows message when map has only root node', () => {
    const mockData: MindMapNode = {
      id: 'root',
      topic: 'Root',
      // No children
    };

    mockStore.getMindElixirInstance.mockReturnValue({ getData: () => ({ nodeData: mockData }) });

    render(<TableView />);

    expect(screen.getByText('No nodes to display. Add nodes in mindmap view.')).toBeTruthy();
  });

  it('test_table_shows_no_results_for_empty_filter: shows message when depth filter returns no nodes', () => {
    const mockData: MindMapNode = {
      id: 'root',
      topic: 'Root',
      children: [
        { id: 'a', topic: 'Depth 1 node' },
      ],
    };

    // Set depth filter to 3 (no nodes at depth 3)
    mockStore.depthFilter = 3;
    mockStore.getMindElixirInstance.mockReturnValue({ getData: () => ({ nodeData: mockData }) });

    render(<TableView />);

    expect(screen.getByText('No nodes at this depth level.')).toBeTruthy();

    // Reset
    mockStore.depthFilter = undefined;
  });
});
