/**
 * Editable text cell component for inline editing in table
 * Supports Enter to save, Escape to cancel, blur to save
 */

import React, { useState, useRef, useEffect } from 'react';
import './editable-text-cell.css';

interface EditableTextCellProps {
  value: string | null;
  onSave: (newValue: string) => void;
  maxLength?: number;
  placeholder?: string;
}

export const EditableTextCell: React.FC<EditableTextCellProps> = ({
  value,
  onSave,
  maxLength = 200,
  placeholder = '--',
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value || '');
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when entering edit mode
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    setEditValue(value || '');
    setIsEditing(true);
  };

  const handleSave = () => {
    const trimmedValue = editValue.trim();
    if (trimmedValue !== value) {
      onSave(trimmedValue);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value || '');
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

  const handleBlur = () => {
    handleSave();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value);
  };

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={editValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        maxLength={maxLength}
        className="editable-text-input"
      />
    );
  }

  return (
    <span
      className="editable-text-cell"
      onDoubleClick={handleDoubleClick}
      title="Double-click to edit"
    >
      {value || placeholder}
    </span>
  );
};
