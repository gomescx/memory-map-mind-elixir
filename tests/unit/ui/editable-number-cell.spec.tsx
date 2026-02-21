/**
 * Unit tests for editable number cell component
 * Tests: src/ui/table/editable-number-cell.tsx
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EditableNumberCell } from '@ui/table/editable-number-cell';

describe('EditableNumberCell', () => {
  const mockOnSave = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders cell with current value in display mode', () => {
    render(<EditableNumberCell value={42} onSave={mockOnSave} />);
    expect(screen.getByText('42')).toBeTruthy();
  });

  it('renders placeholder when value is null', () => {
    render(<EditableNumberCell value={null} onSave={mockOnSave} placeholder="--" />);
    expect(screen.getByText('--')).toBeTruthy();
  });

  it('test_number_cell_validates_numeric_input: enters edit mode on double-click', () => {
    render(<EditableNumberCell value={10} onSave={mockOnSave} />);
    const cell = screen.getByText('10');
    fireEvent.dblClick(cell.closest('td')!);
    const input = screen.getByDisplayValue('10') as HTMLInputElement;
    expect(input.type).toBe('text');
  });

  it('test_number_cell_validates_numeric_input: saves valid numeric input on Enter', () => {
    render(<EditableNumberCell value={10} onSave={mockOnSave} />);
    const cell = screen.getByText('10');
    fireEvent.dblClick(cell.closest('td')!);

    const input = screen.getByDisplayValue('10') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '40' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(mockOnSave).toHaveBeenCalledWith(40);
  });

  it('test_number_cell_rejects_invalid_input: shows error for non-numeric text', () => {
    render(<EditableNumberCell value={10} onSave={mockOnSave} />);
    const cell = screen.getByText('10');
    fireEvent.dblClick(cell.closest('td')!);

    const input = screen.getByDisplayValue('10') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'abc' } });

    // Validation error should appear
    expect(screen.getByRole('alert')).toBeTruthy();
    expect(screen.getByText('Must be a number')).toBeTruthy();
  });

  it('test_number_cell_rejects_invalid_input: reverts to original value on blur after invalid input', () => {
    render(<EditableNumberCell value={10} onSave={mockOnSave} />);
    const cell = screen.getByText('10');
    fireEvent.dblClick(cell.closest('td')!);

    const input = screen.getByDisplayValue('10') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'abc' } });
    fireEvent.blur(input);

    // Cell should revert to original value and not call onSave
    expect(mockOnSave).not.toHaveBeenCalled();
    expect(screen.getByText('10')).toBeTruthy();
  });

  it('test_number_cell_enforces_range: rejects value below minimum', () => {
    render(<EditableNumberCell value={5} onSave={mockOnSave} min={0} max={100} />);
    const cell = screen.getByText('5');
    fireEvent.dblClick(cell.closest('td')!);

    const input = screen.getByDisplayValue('5') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '-1' } });

    expect(screen.getByRole('alert')).toBeTruthy();
    expect(screen.getByText('Minimum value is 0')).toBeTruthy();
  });

  it('test_number_cell_enforces_range: rejects value above maximum', () => {
    render(<EditableNumberCell value={5} onSave={mockOnSave} min={0} max={100} />);
    const cell = screen.getByText('5');
    fireEvent.dblClick(cell.closest('td')!);

    const input = screen.getByDisplayValue('5') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '10000' } });

    expect(screen.getByRole('alert')).toBeTruthy();
    expect(screen.getByText('Maximum value is 100')).toBeTruthy();
  });

  it('test_number_cell_enforces_range: accepts value within range 0-9999', () => {
    render(<EditableNumberCell value={5} onSave={mockOnSave} />);
    const cell = screen.getByText('5');
    fireEvent.dblClick(cell.closest('td')!);

    const input = screen.getByDisplayValue('5') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '9999' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(mockOnSave).toHaveBeenCalledWith(9999);
  });

  it('cancels edit on Escape, restores original value', () => {
    render(<EditableNumberCell value={10} onSave={mockOnSave} />);
    const cell = screen.getByText('10');
    fireEvent.dblClick(cell.closest('td')!);

    const input = screen.getByDisplayValue('10') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '99' } });
    fireEvent.keyDown(input, { key: 'Escape', code: 'Escape' });

    expect(mockOnSave).not.toHaveBeenCalled();
    expect(screen.getByText('10')).toBeTruthy();
  });

  it('saves null when cleared input is blurred', () => {
    render(<EditableNumberCell value={10} onSave={mockOnSave} />);
    const cell = screen.getByText('10');
    fireEvent.dblClick(cell.closest('td')!);

    const input = screen.getByDisplayValue('10') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '' } });
    fireEvent.blur(input);

    expect(mockOnSave).toHaveBeenCalledWith(null);
  });
});
