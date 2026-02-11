/**
 * Unit tests for depth filter component
 * Tests: src/ui/controls/depth-filter.tsx
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DepthFilter } from '@ui/controls/depth-filter';

// Mock store
const mockStore = {
  depthFilter: undefined,
  setDepthFilter: vi.fn(),
  currentView: 'table',
  setCurrentView: vi.fn(),
  getMindElixirInstance: vi.fn(),
  selectedNodeId: null,
  setSelectedNodeId: vi.fn(),
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

describe('DepthFilter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockStore.depthFilter = undefined;
  });

  it('renders dropdown with all depth options', () => {
    render(<DepthFilter />);
    
    const select = screen.getByRole('combobox');
    expect(select).toBeTruthy();
    
    // Check options
    const options = screen.getAllByRole('option');
    expect(options.length).toBeGreaterThanOrEqual(5); // All, 1, 2, 3, 4
  });

  it('shows "All" as selected when no filter is set', () => {
    mockStore.depthFilter = undefined;
    render(<DepthFilter />);
    
    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select.value).toBe('all');
  });

  it('calls setDepthFilter with undefined when "All" is selected', () => {
    render(<DepthFilter />);
    
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'all' } });

    expect(mockStore.setDepthFilter).toHaveBeenCalledWith(undefined);
  });

  it('calls setDepthFilter with depth number when depth is selected', () => {
    render(<DepthFilter />);
    
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: '2' } });

    expect(mockStore.setDepthFilter).toHaveBeenCalledWith(2);
  });

  it('displays current depth filter value', () => {
    mockStore.depthFilter = 2 as any;
    render(<DepthFilter />);
    
    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select.value).toBe('2');
  });

  it('updates when depth filter changes', () => {
    const { rerender } = render(<DepthFilter />);
    
    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select.value).toBe('all');
    
    // Update mock state
    mockStore.depthFilter = 3 as any;
    rerender(<DepthFilter />);
    
    expect(select.value).toBe('3');
  });
});
