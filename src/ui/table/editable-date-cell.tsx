import { useState, useRef, useEffect } from "react";
import { formatDateDDMMMYYYY } from "@/utils/date-format";
import "./editable-date-cell.css";

interface EditableDateCellProps {
  value: string | null | undefined;
  onSave: (value: string | null) => void;
  placeholder?: string;
  /** If provided, the selected date must not be earlier than this ISO date */
  startDate?: string | null;
}

export function EditableDateCell({
  value,
  onSave,
  placeholder = "--",
  startDate,
}: EditableDateCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleClick = () => {
    setValidationError(null);
    setIsEditing(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    if (newValue === '') {
      setValidationError(null);
      onSave(null);
      setIsEditing(false);
      return;
    }

    // Validate: due date must not be before startDate
    if (startDate && newValue < startDate) {
      setValidationError("Due Date cannot be before Start Date");
      return; // keep editing open; do not save
    }

    setValidationError(null);
    if (newValue !== value) {
      onSave(newValue);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      setValidationError(null);
      setIsEditing(false);
    }
  };

  const handleBlur = () => {
    setValidationError(null);
    setIsEditing(false);
  };

  const displayValue = formatDateDDMMMYYYY(value) ?? placeholder;

  return (
    <td className="editable-date-cell" onClick={!isEditing ? handleClick : undefined}>
      {isEditing ? (
        <>
          <input
            ref={inputRef}
            type="date"
            value={value || ""}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            className="editable-date-cell__input"
          />
          {validationError && (
            <span className="editable-date-cell__error" role="alert">
              {validationError}
            </span>
          )}
        </>
      ) : (
        <span className="editable-date-cell__display">{displayValue}</span>
      )}
    </td>
  );
}

export default EditableDateCell;
