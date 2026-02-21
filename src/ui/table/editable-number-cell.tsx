/**
 * Editable number cell component for inline editing in table
 * Supports Enter to save, Escape to cancel, blur to save
 * Double-click to enter edit mode
 * Validates numeric input and enforces optional min/max range
 */

import React, { useState, useRef, useEffect } from 'react';
import './editable-number-cell.css';

interface EditableNumberCellProps {
  value: number | null;
  onSave: (newValue: number | null) => void;
  min?: number;
  max?: number;
  placeholder?: string;
}

export const EditableNumberCell: React.FC<EditableNumberCellProps> = ({
  value,
  onSave,
  min = 0,
  max = 9999,
  placeholder = '--',
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value !== null ? String(value) : '');
  const [validationError, setValidationError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const validate = (raw: string): string | null => {
    const trimmed = raw.trim();
    if (trimmed === '') return null; // empty = clear, valid
    const parsed = parseFloat(trimmed);
    if (isNaN(parsed)) return 'Must be a number';
    if (parsed < min) return `Minimum value is ${min}`;
    if (parsed > max) return `Maximum value is ${max}`;
    return null;
  };

  const handleDoubleClick = () => {
    setEditValue(value !== null ? String(value) : '');
    setValidationError(null);
    setIsEditing(true);
  };

  const handleSave = () => {
    const trimmed = editValue.trim();
    const error = validate(trimmed);
    if (error) {
      // Revert to original value on invalid input
      setEditValue(value !== null ? String(value) : '');
      setValidationError(null);
      setIsEditing(false);
      return;
    }
    if (trimmed === '') {
      if (value !== null) onSave(null);
    } else {
      const parsed = parseFloat(trimmed);
      if (parsed !== value) {
        onSave(parsed);
      }
    }
    setValidationError(null);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value !== null ? String(value) : '');
    setValidationError(null);
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setEditValue(raw);
    setValidationError(validate(raw));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  };

  const displayValue = value !== null ? String(value) : placeholder;

  return (
    <td
      className={isEditing ? undefined : 'editable-number-cell-td'}
      onDoubleClick={!isEditing ? handleDoubleClick : undefined}
    >
      {isEditing ? (
        <>
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            value={editValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            className={`editable-number-input${validationError ? ' editable-number-input--error' : ''}`}
          />
          {validationError && (
            <span className="editable-number-error" role="alert">
              {validationError}
            </span>
          )}
        </>
      ) : (
        <span
          className="editable-number-cell"
          title="Double-click to edit"
        >
          {displayValue}
        </span>
      )}
    </td>
  );
};
