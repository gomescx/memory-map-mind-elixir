/**
 * Unit tests for editable date cell component
 * Tests: src/ui/table/editable-date-cell.tsx
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EditableDateCell } from '@ui/table/editable-date-cell';

describe('EditableDateCell', () => {
  const mockOnSave = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders cell with formatted date', () => {
    render(<EditableDateCell value="2024-03-15" onSave={mockOnSave} />);
    expect(screen.getByText('2024-03-15')).toBeTruthy();
  });

  it('shows date input on click', () => {
    render(<EditableDateCell value="2024-03-15" onSave={mockOnSave} />);
    
    const cell = screen.getByText('2024-03-15');
    fireEvent.click(cell);

    // Should show date input
    const input = screen.getByDisplayValue('2024-03-15') as HTMLInputElement;
    expect(input).toBeTruthy();
    expect(input.type).toBe('date');
  });

  it('saves new date when value changes', () => {
    render(<EditableDateCell value="2024-03-15" onSave={mockOnSave} />);
    
    const cell = screen.getByText('2024-03-15');
    fireEvent.click(cell);

    const input = screen.getByDisplayValue('2024-03-15') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '2024-04-20' } });

    expect(mockOnSave).toHaveBeenCalledWith('2024-04-20');
  });

  it('closes input after date selection', () => {
    const { rerender } = render(<EditableDateCell value="2024-03-15" onSave={mockOnSave} />);
    
    const cell = screen.getByText('2024-03-15');
    fireEvent.click(cell);

    const input = screen.getByDisplayValue('2024-03-15') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '2024-04-20' } });

    // Simulate parent component updating the prop (controlled component pattern)
    rerender(<EditableDateCell value="2024-04-20" onSave={mockOnSave} />);

    // Should revert to display mode showing new value
    expect(screen.getByText('2024-04-20')).toBeTruthy();
    expect(screen.queryByDisplayValue('2024-04-20')).toBeNull(); // Input should be closed
  });

  it('cancels on Escape key', () => {
    render(<EditableDateCell value="2024-03-15" onSave={mockOnSave} />);
    
    const cell = screen.getByText('2024-03-15');
    fireEvent.click(cell);

    const input = screen.getByDisplayValue('2024-03-15') as HTMLInputElement;
    fireEvent.keyDown(input, { key: 'Escape', code: 'Escape' });

    expect(mockOnSave).not.toHaveBeenCalled();
    // Should show original value
    expect(screen.getByText('2024-03-15')).toBeTruthy();
  });

  it('displays placeholder when value is null', () => {
    render(<EditableDateCell value={null} onSave={mockOnSave} placeholder="No date" />);
    expect(screen.getByText('No date')).toBeTruthy();
  });

  it('accepts empty date as null', () => {
    render(<EditableDateCell value="2024-03-15" onSave={mockOnSave} />);
    
    const cell = screen.getByText('2024-03-15');
    fireEvent.click(cell);

    const input = screen.getByDisplayValue('2024-03-15') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '' } });

    expect(mockOnSave).toHaveBeenCalledWith(null);
  });
});
