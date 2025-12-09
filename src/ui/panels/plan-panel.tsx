/**
 * Planning attribute side panel component
 * Provides inputs for editing all six planning fields for the selected node
 */

import React, { useState, useEffect } from 'react';
import type { PlanAttributes } from '@core/types/node';
import { useAppStore } from '@state/store';
import { getNodePlanAttributes } from '@core/node-adapter';
import {
  PLAN_FORM_FIELDS,
  validatePlanForm,
  parseFormValue,
  formatFormValue,
} from '@ui/forms/plan-form';
import './plan-panel.css';

export const PlanPanel: React.FC = () => {
  const { isPanelOpen, selectedNodeId, getNode, updateNodePlan, setIsPanelOpen } =
    useAppStore();
  const [formData, setFormData] = useState<Partial<PlanAttributes>>({});
  const [validationError, setValidationError] = useState<string | null>(null);
  const [validationWarning, setValidationWarning] = useState<string | null>(null);

  // Load plan data when selection changes
  useEffect(() => {
    if (!selectedNodeId) {
      setFormData({});
      return;
    }

    const node = getNode(selectedNodeId);
    if (node) {
      const plan = getNodePlanAttributes(node);
      // Default status to 'Not Started' if not set
      setFormData({
        ...plan,
        status: plan.status || 'Not Started',
      });
    }
  }, [selectedNodeId, getNode]);

  // Handle field change
  const handleFieldChange = (fieldName: keyof PlanAttributes, rawValue: string | null) => {
    const parsedValue = parseFormValue(fieldName, rawValue);
    const updatedData = { ...formData, [fieldName]: parsedValue };
    setFormData(updatedData);

    // Validate on change
    const validation = validatePlanForm(updatedData);
    setValidationError(validation.valid ? null : validation.error || null);
    setValidationWarning(validation.warning || null);
  };

  // Handle save
  const handleSave = () => {
    if (!selectedNodeId) return;

    const validation = validatePlanForm(formData);
    if (!validation.valid) {
      setValidationError(validation.error || 'Validation failed');
      return;
    }

    // Update node plan via store
    updateNodePlan(selectedNodeId, formData);
    setValidationError(null);
    setValidationWarning(validation.warning || null);
  };

  // Handle clear
  const handleClear = () => {
    setFormData({
      startDate: null,
      dueDate: null,
      investedTimeHours: null,
      elapsedTimeDays: null,
      assignee: null,
      status: 'Not Started',
    });
    setValidationError(null);
    setValidationWarning(null);
  };

  // Handle close
  const handleClose = () => {
    setIsPanelOpen(false);
  };

  if (!isPanelOpen) {
    return null;
  }

  const selectedNode = selectedNodeId ? getNode(selectedNodeId) : null;

  return (
    <div className="plan-panel">
      <div className="plan-panel-header">
        <h3>Planning Attributes</h3>
        <button className="close-button" onClick={handleClose} aria-label="Close panel">
          ✕
        </button>
      </div>

      {!selectedNode && (
        <div className="plan-panel-empty">
          <p>Select a node to edit its planning attributes</p>
        </div>
      )}

      {selectedNode && (
        <div className="plan-panel-content">
          <div className="selected-node-info">
            <strong>Node:</strong> {selectedNode.topic}
          </div>

          <form className="plan-form" onSubmit={(e) => e.preventDefault()}>
            {PLAN_FORM_FIELDS.map((field) => (
              <div key={field.name} className="form-field">
                <label htmlFor={field.name}>{field.label}</label>

                {field.type === 'select' && field.options ? (
                  <select
                    id={field.name}
                    value={formatFormValue(formData[field.name]) || 'Not Started'}
                    onChange={(e) =>
                      handleFieldChange(field.name, e.target.value || null)
                    }
                  >
                    {field.options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : field.type === 'date' ? (
                  <input
                    id={field.name}
                    type="date"
                    value={formatFormValue(formData[field.name])}
                    onChange={(e) =>
                      handleFieldChange(field.name, e.target.value || null)
                    }
                  />
                ) : field.type === 'number' ? (
                  <input
                    id={field.name}
                    type="number"
                    min="0"
                    step="0.5"
                    placeholder={field.placeholder}
                    value={formatFormValue(formData[field.name])}
                    onChange={(e) =>
                      handleFieldChange(field.name, e.target.value || null)
                    }
                  />
                ) : (
                  <input
                    id={field.name}
                    type="text"
                    placeholder={field.placeholder}
                    value={formatFormValue(formData[field.name])}
                    onChange={(e) =>
                      handleFieldChange(field.name, e.target.value || null)
                    }
                  />
                )}
              </div>
            ))}

            {validationError && (
              <div className="validation-error" role="alert">
                {validationError}
              </div>
            )}

            {validationWarning && (
              <div className="validation-warning" role="alert">
                ⚠️ {validationWarning}
              </div>
            )}

            <div className="form-actions">
              <button type="button" className="btn-primary" onClick={handleSave}>
                Save
              </button>
              <button type="button" className="btn-secondary" onClick={handleClear}>
                Clear
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
