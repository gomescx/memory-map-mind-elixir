/**
 * Unit tests for view toggle component
 * Tests: src/ui/controls/view-toggle.tsx
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ViewToggle } from '@ui/controls/view-toggle';

// Mock store
const mockStore = {
  currentView: 'mindmap',
  setCurrentView: vi.fn(),
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

describe('ViewToggle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockStore.currentView = 'mindmap';
  });

  it('renders toggle button with Mindmap View label when in table view', () => {
    mockStore.currentView = 'table';
    render(<ViewToggle />);
    expect(screen.getByText(/Mindmap View/i)).toBeTruthy();
  });

  it('renders toggle button with Table View label when in mindmap view', () => {
    mockStore.currentView = 'mindmap';
    render(<ViewToggle />);
    expect(screen.getByText(/Table View/i)).toBeTruthy();
  });

  it('calls setCurrentView when toggle button is clicked', () => {
    mockStore.currentView = 'mindmap';
    render(<ViewToggle />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockStore.setCurrentView).toHaveBeenCalledWith('table');
  });

  it('switches from table to mindmap view when clicked', () => {
    mockStore.currentView = 'table';
    render(<ViewToggle />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockStore.setCurrentView).toHaveBeenCalledWith('mindmap');
  });

  it('persists view state when toggling back and forth', () => {
    const { rerender } = render(<ViewToggle />);
    
    // Initially in mindmap view
    expect(screen.getByText(/Table View/i)).toBeTruthy();
    
    // Click to switch to table
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(mockStore.setCurrentView).toHaveBeenCalledWith('table');
    
    // Update mock state and rerender
    mockStore.currentView = 'table';
    rerender(<ViewToggle />);
    
    // Button should now show "Mindmap View"
    expect(screen.getByText(/Mindmap View/i)).toBeTruthy();
  });
});
