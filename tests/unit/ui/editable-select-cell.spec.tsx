/**
 * Unit tests for editable select cell component
 * Tests: src/ui/table/editable-select-cell.tsx
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EditableSelectCell } from '@ui/table/editable-select-cell';

describe('EditableSelectCell', () => {
  const mockOnSave = vi.fn();
  const options = ['Not Started', 'In Progress', 'Completed', 'Blocked', 'Deferred'];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders cell with current value', () => {
    render(<EditableSelectCell value="Not Started" options={options} onSave={mockOnSave} />);
    expect(screen.getByText('Not Started')).toBeTruthy();
  });

  it('shows dropdown on click', () => {
    render(<EditableSelectCell value="Not Started" options={options} onSave={mockOnSave} />);
    
    const cell = screen.getByText('Not Started');
    fireEvent.click(cell);

    // Should show select dropdown
    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select).toBeTruthy();
  });

  it('saves new value when selection changes', () => {
    render(<EditableSelectCell value="Not Started" options={options} onSave={mockOnSave} />);
    
    const cell = screen.getByText('Not Started');
    fireEvent.click(cell);

    const select = screen.getByRole('combobox') as HTMLSelectElement;
    fireEvent.change(select, { target: { value: 'In Progress' } });

    expect(mockOnSave).toHaveBeenCalledWith('In Progress');
  });

  it('closes dropdown after selection', () => {
    const { rerender } = render(<EditableSelectCell value="Not Started" options={options} onSave={mockOnSave} />);
    
    const cell = screen.getByText('Not Started');
    fireEvent.click(cell);

    const select = screen.getByRole('combobox') as HTMLSelectElement;
    fireEvent.change(select, { target: { value: 'Completed' } });

    // Simulate parent component updating the prop (controlled component pattern)
    rerender(<EditableSelectCell value="Completed" options={options} onSave={mockOnSave} />);

    // Should revert to display mode showing new value
    expect(screen.getByText('Completed')).toBeTruthy();
    expect(screen.queryByRole('combobox')).toBeNull(); // Select should be closed
  });

  it('cancels on Escape key', () => {
    render(<EditableSelectCell value="Not Started" options={options} onSave={mockOnSave} />);
    
    const cell = screen.getByText('Not Started');
    fireEvent.click(cell);

    const select = screen.getByRole('combobox') as HTMLSelectElement;
    fireEvent.keyDown(select, { key: 'Escape', code: 'Escape' });

    expect(mockOnSave).not.toHaveBeenCalled();
    // Should show original value
    expect(screen.getByText('Not Started')).toBeTruthy();
  });

  it('displays placeholder when value is null', () => {
    render(<EditableSelectCell value={null} options={options} onSave={mockOnSave} placeholder="--" />);
    expect(screen.getByText('--')).toBeTruthy();
  });
});
