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

  it('renders both tabs regardless of current view', () => {
    render(<ViewToggle />);
    expect(screen.getByText(/Mindmap View/i)).toBeTruthy();
    expect(screen.getByText(/Action Plan View/i)).toBeTruthy();
  });

  it('marks Mindmap View tab as active when in mindmap view', () => {
    mockStore.currentView = 'mindmap';
    render(<ViewToggle />);
    const mindmapBtn = screen.getByText(/Mindmap View/i).closest('button');
    expect(mindmapBtn?.getAttribute('aria-pressed')).toBe('true');
  });

  it('marks Action Plan View tab as active when in table view', () => {
    mockStore.currentView = 'table';
    render(<ViewToggle />);
    const actionPlanBtn = screen.getByText(/Action Plan View/i).closest('button');
    expect(actionPlanBtn?.getAttribute('aria-pressed')).toBe('true');
  });

  it('calls setCurrentView with "table" when Action Plan View tab is clicked', () => {
    mockStore.currentView = 'mindmap';
    render(<ViewToggle />);

    const actionPlanBtn = screen.getByText(/Action Plan View/i).closest('button')!;
    fireEvent.click(actionPlanBtn);

    expect(mockStore.setCurrentView).toHaveBeenCalledWith('table');
  });

  it('calls setCurrentView with "mindmap" when Mindmap View tab is clicked from table view', () => {
    mockStore.currentView = 'table';
    render(<ViewToggle />);

    const mindmapBtn = screen.getByText(/Mindmap View/i).closest('button')!;
    fireEvent.click(mindmapBtn);

    expect(mockStore.setCurrentView).toHaveBeenCalledWith('mindmap');
  });

  it('persists view state when toggling back and forth', () => {
    const { rerender } = render(<ViewToggle />);

    // Initially in mindmap view — mindmap tab active
    const mindmapBtn = () => screen.getByText(/Mindmap View/i).closest('button')!;
    const actionPlanBtn = () => screen.getByText(/Action Plan View/i).closest('button')!;
    expect(mindmapBtn().getAttribute('aria-pressed')).toBe('true');
    expect(actionPlanBtn().getAttribute('aria-pressed')).toBe('false');

    // Click to switch to table view
    fireEvent.click(actionPlanBtn());
    expect(mockStore.setCurrentView).toHaveBeenCalledWith('table');

    // Update mock state and rerender
    mockStore.currentView = 'table';
    rerender(<ViewToggle />);

    // Action Plan tab should now be active
    expect(actionPlanBtn().getAttribute('aria-pressed')).toBe('true');
    expect(mindmapBtn().getAttribute('aria-pressed')).toBe('false');
  });
});
