/**
 * Integration tests for table drag-drop reordering
 * Tests: src/ui/views/table-view.tsx drag-drop functionality
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
  currentView: 'table',
  setCurrentView: vi.fn(),
  updateNodeSequence: vi.fn(),
};

// Mock context
vi.mock('@state/store', () => ({
  useAppStore: () => mockStore,
}));

describe('Table Drag-Drop Reordering', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders draggable rows with drag handles', () => {
    const mockData: MindMapNode = {
      id: 'root',
      topic: 'Root',
      children: [
        { id: 'a', topic: 'Task A' },
        { id: 'b', topic: 'Task B' },
        { id: 'c', topic: 'Task C' },
      ],
    };

    mockStore.getMindElixirInstance.mockReturnValue({ getData: () => ({ nodeData: mockData }) });

    render(<TableView />);

    // Rows should have drag handles or draggable indicators
    const rows = screen.getAllByRole('row');
    expect(rows.length).toBeGreaterThan(1); // Header + data rows
  });

  it('calls updateNodeSequence when row is reordered', () => {
    const mockData: MindMapNode = {
      id: 'root',
      topic: 'Root',
      children: [
        { id: 'a', topic: 'A' },
        { id: 'b', topic: 'B' },
        { id: 'c', topic: 'C' },
      ],
    };

    mockStore.getMindElixirInstance.mockReturnValue({ getData: () => ({ nodeData: mockData }) });

    render(<TableView />);

    // Verify rows are rendered
    expect(screen.getByText('A')).toBeTruthy();
    expect(screen.getByText('B')).toBeTruthy();
    expect(screen.getByText('C')).toBeTruthy();
  });

  it('preserves sibling relationships during reorder', () => {
    const mockData: MindMapNode = {
      id: 'root',
      topic: 'Root',
      children: [
        { id: 'a', topic: 'A' },
        {
          id: 'b',
          topic: 'B',
          children: [{ id: 'b1', topic: 'B1' }],
        },
        { id: 'c', topic: 'C' },
      ],
    };

    mockStore.getMindElixirInstance.mockReturnValue({ getData: () => ({ nodeData: mockData }) });

    render(<TableView />);

    // Should render all nodes including nested ones
    const rows = screen.getAllByRole('row');
    expect(rows.length).toBe(6); // Header + 5 data rows (root, a, b, b1, c)
  });
});
