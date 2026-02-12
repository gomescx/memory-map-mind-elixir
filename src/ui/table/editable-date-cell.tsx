import { useState, useRef, useEffect } from "react";
import "./editable-date-cell.css";

interface EditableDateCellProps {
  value: string | null | undefined;
  onSave: (value: string | null) => void;
  placeholder?: string;
}

export function EditableDateCell({
  value,
  onSave,
  placeholder = "--",
}: EditableDateCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleClick = () => {
    setIsEditing(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (newValue === '') {
      onSave(null);
    } else if (newValue !== value) {
      onSave(newValue);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
    <td className="editable-date-cell" onClick={handleClick}>
      {isEditing ? (
        <input
          ref={inputRef}
          type="date"
          value={value || ""}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className="editable-date-cell__input"
        />
      ) : (
        <span className="editable-date-cell__display">{displayValue}</span>
      )}
    </td>
  );
}

export default EditableDateCell;
