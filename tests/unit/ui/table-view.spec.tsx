/**
 * Unit tests for table view component
 * Tests: src/ui/views/table-view.tsx
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { TableView } from '@ui/views/table-view';
import type { MindMapNode } from '@core/types/node';

// Mock store
const mockStore = {
  getMindElixirInstance: vi.fn(),
  selectedNodeId: null,
  setSelectedNodeId: vi.fn(),
  depthFilter: undefined,
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

    mockStore.getMindElixirInstance.mockReturnValue({ getData: () => mockData });

    render(<TableView />);

    // Check column headers exist
    expect(screen.getByText('Sequence')).toBeTruthy();
    expect(screen.getByText('Name')).toBeTruthy();
    expect(screen.getByText('Status')).toBeTruthy();
    expect(screen.getByText('Priority')).toBeTruthy();
    expect(screen.getByText('Due Date')).toBeTruthy();
    expect(screen.getByText('Assignee')).toBeTruthy();
    expect(screen.getByText('Est. Hours')).toBeTruthy();
    expect(screen.getByText('Inv. Hours')).toBeTruthy();
    expect(screen.getByText('Depth')).toBeTruthy();
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

    mockStore.getMindElixirInstance.mockReturnValue({ getData: () => mockData });

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

    mockStore.getMindElixirInstance.mockReturnValue({ getData: () => mockData });

    render(<TableView />);

    expect(screen.getByText('Important Task')).toBeTruthy();
    expect(screen.getByText('Completed')).toBeTruthy();
    expect(screen.getByText('2026-03-20')).toBeTruthy();
    expect(screen.getByText('Alice')).toBeTruthy();
    expect(screen.getByText('10')).toBeTruthy();
  });

  it('displays "--" for empty attribute values', () => {
    const mockData: MindMapNode = {
      id: 'root',
      topic: 'Root',
      children: [{ id: 'task1', topic: 'Task without attributes' }],
    };

    mockStore.getMindElixirInstance.mockReturnValue({ getData: () => mockData });

    render(<TableView />);

    // Count "--" placeholders for empty fields
    const emptyMarkers = screen.getAllByText('--');
    expect(emptyMarkers.length).toBeGreaterThan(0);
  });
});
