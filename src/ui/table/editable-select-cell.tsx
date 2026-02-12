import { useState, useRef, useEffect } from "react";
import "./editable-select-cell.css";

interface EditableSelectCellProps {
  value: string | null | undefined;
  options: string[];
  onSave: (value: string) => void;
  placeholder?: string;
}

export function EditableSelectCell({
  value,
  options,
  onSave,
  placeholder = "Select...",
}: EditableSelectCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const selectRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    if (isEditing && selectRef.current) {
      selectRef.current.focus();
    }
  }, [isEditing]);

  const handleClick = () => {
    setIsEditing(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    if (newValue) {
      onSave(newValue);
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLSelectElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      setIsEditing(false);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  const displayValue = value || placeholder;

  return (
    <td className="editable-select-cell" onClick={handleClick}>
      {isEditing ? (
        <select
          ref={selectRef}
          value={value || ""}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className="editable-select-cell__select"
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <span className="editable-select-cell__display">{displayValue}</span>
      )}
    </td>
  );
}

export default EditableSelectCell;
