/**
 * Editable number cell component for inline editing in table
 * Supports Enter to save, Escape to cancel, blur to save
 * Double-click to enter edit mode
 */

import React, { useState, useRef, useEffect } from 'react';
import './editable-number-cell.css';

interface EditableNumberCellProps {
  value: number | null;
  onSave: (newValue: number | null) => void;
  min?: number;
  step?: number;
  placeholder?: string;
}

export const EditableNumberCell: React.FC<EditableNumberCellProps> = ({
  value,
  onSave,
  min = 0,
  step = 0.5,
  placeholder = '--',
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value !== null ? String(value) : '');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    setEditValue(value !== null ? String(value) : '');
    setIsEditing(true);
  };

  const handleSave = () => {
    const trimmed = editValue.trim();
    if (trimmed === '') {
      if (value !== null) onSave(null);
    } else {
      const parsed = parseFloat(trimmed);
      if (!isNaN(parsed) && parsed !== value) {
        onSave(parsed);
      }
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value !== null ? String(value) : '');
    setIsEditing(false);
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
    <td className={isEditing ? undefined : 'editable-number-cell-td'} onDoubleClick={!isEditing ? handleDoubleClick : undefined}>
      {isEditing ? (
        <input
          ref={inputRef}
          type="number"
          value={editValue}
          min={min}
          step={step}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          className="editable-number-input"
        />
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
