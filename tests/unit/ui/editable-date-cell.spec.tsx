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

  it('renders cell with formatted date in DD-MMM-YYYY format', () => {
    render(<EditableDateCell value="2024-03-15" onSave={mockOnSave} />);
    expect(screen.getByText('15-Mar-2024')).toBeTruthy();
  });

  it('shows date input on click', () => {
    render(<EditableDateCell value="2024-03-15" onSave={mockOnSave} />);
    
    const cell = screen.getByText('15-Mar-2024');
    fireEvent.click(cell);

    // Native date input uses ISO value internally
    const input = screen.getByDisplayValue('2024-03-15') as HTMLInputElement;
    expect(input).toBeTruthy();
    expect(input.type).toBe('date');
  });

  it('saves new date when value changes', () => {
    render(<EditableDateCell value="2024-03-15" onSave={mockOnSave} />);
    
    const cell = screen.getByText('15-Mar-2024');
    fireEvent.click(cell);

    const input = screen.getByDisplayValue('2024-03-15') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '2024-04-20' } });

    expect(mockOnSave).toHaveBeenCalledWith('2024-04-20');
  });

  it('closes input after date selection', () => {
    const { rerender } = render(<EditableDateCell value="2024-03-15" onSave={mockOnSave} />);
    
    const cell = screen.getByText('15-Mar-2024');
    fireEvent.click(cell);

    const input = screen.getByDisplayValue('2024-03-15') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '2024-04-20' } });

    // Simulate parent component updating the prop (controlled component pattern)
    rerender(<EditableDateCell value="2024-04-20" onSave={mockOnSave} />);

    // Should revert to display mode showing new value in DD-MMM-YYYY
    expect(screen.getByText('20-Apr-2024')).toBeTruthy();
    expect(screen.queryByDisplayValue('2024-04-20')).toBeNull(); // Input should be closed
  });

  it('cancels on Escape key', () => {
    render(<EditableDateCell value="2024-03-15" onSave={mockOnSave} />);
    
    const cell = screen.getByText('15-Mar-2024');
    fireEvent.click(cell);

    const input = screen.getByDisplayValue('2024-03-15') as HTMLInputElement;
    fireEvent.keyDown(input, { key: 'Escape', code: 'Escape' });

    expect(mockOnSave).not.toHaveBeenCalled();
    // Should show original DD-MMM-YYYY value
    expect(screen.getByText('15-Mar-2024')).toBeTruthy();
  });

  it('displays placeholder when value is null', () => {
    render(<EditableDateCell value={null} onSave={mockOnSave} placeholder="No date" />);
    expect(screen.getByText('No date')).toBeTruthy();
  });

  it('accepts empty date as null', () => {
    render(<EditableDateCell value="2024-03-15" onSave={mockOnSave} />);
    
    const cell = screen.getByText('15-Mar-2024');
    fireEvent.click(cell);

    const input = screen.getByDisplayValue('2024-03-15') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '' } });

    expect(mockOnSave).toHaveBeenCalledWith(null);
  });

  // T068: Display dates in DD-MMM-YYYY format
  it('test_date_cell_displays_dd_mmm_yyyy_format: shows DD-MMM-YYYY for ISO input', () => {
    render(<EditableDateCell value="2026-02-26" onSave={mockOnSave} />);
    expect(screen.getByText('26-Feb-2026')).toBeTruthy();
    expect(screen.queryByText('2026-02-26')).toBeNull();
  });

  it('test_date_cell_displays_dd_mmm_yyyy_format: different months format correctly', () => {
    render(<EditableDateCell value="2026-03-15" onSave={mockOnSave} />);
    expect(screen.getByText('15-Mar-2026')).toBeTruthy();
  });

  it('test_date_cell_reverts_to_dd_mmm_yyyy_after_picker_closes', () => {
    const { rerender } = render(<EditableDateCell value="2026-03-15" onSave={mockOnSave} />);
    const cell = screen.getByText('15-Mar-2026');
    fireEvent.click(cell);
    // Input is ISO format
    expect(screen.getByDisplayValue('2026-03-15')).toBeTruthy();
    // Blur to close
    fireEvent.blur(screen.getByDisplayValue('2026-03-15'));
    rerender(<EditableDateCell value="2026-03-15" onSave={mockOnSave} />);
    // Display reverts to DD-MMM-YYYY
    expect(screen.getByText('15-Mar-2026')).toBeTruthy();
  });

  // T066: Validate Due Date cannot be earlier than Start Date
  it('test_due_date_rejects_date_before_start_date: does not call onSave', () => {
    render(
      <EditableDateCell value={null} onSave={mockOnSave} startDate="2026-02-15" />
    );
    fireEvent.click(screen.getByText('--'));
    const inputEl = document.querySelector('input[type="date"]') as HTMLInputElement;
    fireEvent.change(inputEl, { target: { value: '2026-02-10' } });
    expect(mockOnSave).not.toHaveBeenCalled();
  });

  it('test_due_date_shows_validation_error_message: error text appears for earlier date', () => {
    render(
      <EditableDateCell value={null} onSave={mockOnSave} startDate="2026-02-15" />
    );
    fireEvent.click(screen.getByText('--'));
    const inputEl = document.querySelector('input[type="date"]') as HTMLInputElement;
    fireEvent.change(inputEl, { target: { value: '2026-02-10' } });
    expect(screen.getByRole('alert').textContent).toBe('Due Date cannot be before Start Date');
  });

  it('test_valid_due_date_saves_without_error: valid date saves successfully', () => {
    render(
      <EditableDateCell value={null} onSave={mockOnSave} startDate="2026-02-15" />
    );
    fireEvent.click(screen.getByText('--'));
    const inputEl = document.querySelector('input[type="date"]') as HTMLInputElement;
    fireEvent.change(inputEl, { target: { value: '2026-02-20' } });
    expect(mockOnSave).toHaveBeenCalledWith('2026-02-20');
    expect(screen.queryByRole('alert')).toBeNull();
  });

  // T065: Weekend validation when excludeWeekends is active
  it('test_weekend_date_rejected_when_checkbox_checked: Saturday produces error', () => {
    render(
      <EditableDateCell value={null} onSave={mockOnSave} validateNoWeekends={true} />
    );
    fireEvent.click(screen.getByText('--'));
    const inputEl = document.querySelector('input[type="date"]') as HTMLInputElement;
    // 2026-01-03 is a Saturday
    fireEvent.change(inputEl, { target: { value: '2026-01-03' } });
    expect(mockOnSave).not.toHaveBeenCalled();
    expect(screen.getByRole('alert').textContent).toBe('Start Date cannot be a weekend');
  });

  it('weekend validation allows weekday when validateNoWeekends is true', () => {
    render(
      <EditableDateCell value={null} onSave={mockOnSave} validateNoWeekends={true} />
    );
    fireEvent.click(screen.getByText('--'));
    const inputEl = document.querySelector('input[type="date"]') as HTMLInputElement;
    // 2026-01-05 is a Monday
    fireEvent.change(inputEl, { target: { value: '2026-01-05' } });
    expect(mockOnSave).toHaveBeenCalledWith('2026-01-05');
  });

  it('weekend validation is skipped when validateNoWeekends is false', () => {
    render(
      <EditableDateCell value={null} onSave={mockOnSave} validateNoWeekends={false} />
    );
    fireEvent.click(screen.getByText('--'));
    const inputEl = document.querySelector('input[type="date"]') as HTMLInputElement;
    // Saturday – should save without error when validateNoWeekends=false
    fireEvent.change(inputEl, { target: { value: '2026-01-03' } });
    expect(mockOnSave).toHaveBeenCalledWith('2026-01-03');
  });
});
