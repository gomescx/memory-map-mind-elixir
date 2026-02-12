/**
 * Unit tests for editable text cell component
 * Tests: src/ui/table/editable-text-cell.tsx
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EditableTextCell } from '@ui/table/editable-text-cell';

describe('EditableTextCell', () => {
  const mockOnSave = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders cell with current value', () => {
    render(<EditableTextCell value="Research" onSave={mockOnSave} />);
    expect(screen.getByText('Research')).toBeTruthy();
  });

  it('becomes editable on double-click', () => {
    render(<EditableTextCell value="Research" onSave={mockOnSave} />);
    
    const cell = screen.getByText('Research');
    fireEvent.doubleClick(cell);

    // Should now have an input
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('Research');
  });

  it('saves new value on Enter key', () => {
    render(<EditableTextCell value="Research" onSave={mockOnSave} />);
    
    const cell = screen.getByText('Research');
    fireEvent.doubleClick(cell);

    const input = screen.getByRole('textbox') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'User Research' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(mockOnSave).toHaveBeenCalledWith('User Research');
  });

  it('saves new value on blur', () => {
    render(<EditableTextCell value="Research" onSave={mockOnSave} />);
    
    const cell = screen.getByText('Research');
    fireEvent.doubleClick(cell);

    const input = screen.getByRole('textbox') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'User Research' } });
    fireEvent.blur(input);

    expect(mockOnSave).toHaveBeenCalledWith('User Research');
  });

  it('cancels edit on Escape key', () => {
    render(<EditableTextCell value="Research" onSave={mockOnSave} />);
    
    const cell = screen.getByText('Research');
    fireEvent.doubleClick(cell);

    const input = screen.getByRole('textbox') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'Changed' } });
    fireEvent.keyDown(input, { key: 'Escape', code: 'Escape' });

    expect(mockOnSave).not.toHaveBeenCalled();
    // Should show original value
    expect(screen.getByText('Research')).toBeTruthy();
  });

  it('enforces max length validation', () => {
    render(<EditableTextCell value="Short" onSave={mockOnSave} maxLength={10} />);
    
    const cell = screen.getByText('Short');
    fireEvent.doubleClick(cell);

    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.maxLength).toBe(10);
  });

  it('trims whitespace before saving', () => {
    render(<EditableTextCell value="Research" onSave={mockOnSave} />);
    
    const cell = screen.getByText('Research');
    fireEvent.doubleClick(cell);

    const input = screen.getByRole('textbox') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '  User Research  ' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(mockOnSave).toHaveBeenCalledWith('User Research');
  });
});
