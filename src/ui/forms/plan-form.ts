/**
 * Plan form schema, validation messages, and form helpers
 * Provides structured validation for all planning attributes
 */

import type { PlanAttributes, PlanStatus } from '@core/types/node';
import { PLAN_STATUS_OPTIONS } from '@core/constants';
import {
  validateDate,
  validateNumber,
  validateStatus,
  checkDateOrdering,
  type ValidationResult,
} from '@utils/validation/plan';

/** Form field definition */
export interface FormField {
  name: keyof PlanAttributes;
  label: string;
  type: 'date' | 'number' | 'text' | 'select';
  placeholder?: string;
  options?: readonly string[];
  hint?: string;
}

/** Complete plan form schema */
export const PLAN_FORM_FIELDS: FormField[] = [
  {
    name: 'startDate',
    label: 'Start Date',
    type: 'date',
    hint: 'When work begins (YYYY-MM-DD)',
  },
  {
    name: 'dueDate',
    label: 'Due Date',
    type: 'date',
    hint: 'Expected completion date (YYYY-MM-DD)',
  },
  {
    name: 'investedTimeHours',
    label: 'Invested Time (hours)',
    type: 'number',
    placeholder: '0',
    hint: 'Effort invested to do the task ',
  },
  {
    name: 'elapsedTimeDays',
    label: 'Elapsed Time (days)',
    type: 'number',
    placeholder: '0',
    hint: 'Calendar days elapsed',
  },
  {
    name: 'assignee',
    label: 'Assignee',
    type: 'text',
    placeholder: 'Person responsible',
    hint: 'Name or identifier',
  },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    options: PLAN_STATUS_OPTIONS,
    hint: 'Current progress state',
  },
];

/** Form validation error messages */
export const VALIDATION_MESSAGES = {
  REQUIRED: 'This field is required',
  INVALID_DATE: 'Date must be in YYYY-MM-DD format',
  INVALID_NUMBER: 'Must be a non-negative number',
  INVALID_STATUS: `Status must be one of: ${PLAN_STATUS_OPTIONS.join(', ')}`,
  DATE_RANGE_WARNING: 'Start date is after due date',
};

/** Validate entire plan form */
export function validatePlanForm(
  plan: Partial<PlanAttributes>
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate individual fields
  if (plan.startDate !== undefined && plan.startDate !== null) {
    const result = validateDate(plan.startDate);
    if (!result.valid && result.error) {
      errors.push(`Start Date: ${result.error}`);
    }
  }

  if (plan.dueDate !== undefined && plan.dueDate !== null) {
    const result = validateDate(plan.dueDate);
    if (!result.valid && result.error) {
      errors.push(`Due Date: ${result.error}`);
    }
  }

  if (plan.investedTimeHours !== undefined && plan.investedTimeHours !== null) {
    const result = validateNumber(plan.investedTimeHours, 'Invested Time');
    if (!result.valid && result.error) {
      errors.push(result.error);
    }
  }

  if (plan.elapsedTimeDays !== undefined && plan.elapsedTimeDays !== null) {
    const result = validateNumber(plan.elapsedTimeDays, 'Elapsed Time');
    if (!result.valid && result.error) {
      errors.push(result.error);
    }
  }

  if (plan.status !== undefined && plan.status !== null) {
    const result = validateStatus(plan.status);
    if (!result.valid && result.error) {
      errors.push(result.error);
    }
  }

  // Check date range (warning only)
  if (plan.startDate && plan.dueDate) {
    const rangeResult = checkDateOrdering(plan.startDate, plan.dueDate);
    if (rangeResult.warning) {
      warnings.push(rangeResult.warning);
    }
  }

  if (errors.length > 0) {
    return {
      valid: false,
      error: errors.join('; '),
      warning: warnings.length > 0 ? warnings.join('; ') : undefined,
    };
  }

  return {
    valid: true,
    warning: warnings.length > 0 ? warnings.join('; ') : undefined,
  };
}

/**
 * Parse form input value to appropriate type
 * @param fieldName Field being parsed
 * @param value Raw input value
 * @returns Typed value or null
 */
export function parseFormValue(
  fieldName: keyof PlanAttributes,
  value: string | null
): PlanAttributes[keyof PlanAttributes] {
  if (value === null || value === '') {
    return null;
  }

  switch (fieldName) {
    case 'investedTimeHours':
    case 'elapsedTimeDays': {
      const num = parseFloat(value);
      return isNaN(num) ? null : num;
    }
    case 'status':
      return value as PlanStatus;
    case 'startDate':
    case 'dueDate':
    case 'assignee':
    default:
      return value;
  }
}

/**
 * Format plan attribute value for display in form input
 * @param value Plan attribute value
 * @returns String representation for input field
 */
export function formatFormValue(
  value: PlanAttributes[keyof PlanAttributes] | undefined
): string {
  if (value === null || value === undefined) {
    return '';
  }
  return String(value);
}
