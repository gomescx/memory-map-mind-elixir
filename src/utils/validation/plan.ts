/**
 * Validation helpers for plan field values
 * Includes date, number, and enum validation with user-friendly messages
 */

import { PLAN_STATUS_OPTIONS } from '@core/constants';
import type { PlanStatus, PlanAttributes } from '@core/types/node';

/** Validation result with optional error message */
export interface ValidationResult {
  valid: boolean;
  error?: string;
  warning?: string;
}

/**
 * Validate ISO 8601 date string
 * @param dateStr Date string in ISO format (YYYY-MM-DD)
 * @returns Validation result
 */
export function validateDate(dateStr: string | null): ValidationResult {
  if (!dateStr) {
    return { valid: true };
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateStr)) {
    return {
      valid: false,
      error: 'Date must be in YYYY-MM-DD format',
    };
  }

  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    return {
      valid: false,
      error: 'Invalid date value',
    };
  }

  return { valid: true };
}

/**
 * Validate numeric field (non-negative)
 * @param value Number to validate
 * @param fieldName Name of field for error message
 * @returns Validation result
 */
export function validateNumber(
  value: number | null,
  fieldName: string = 'value'
): ValidationResult {
  if (value === null || value === undefined) {
    return { valid: true };
  }

  if (!Number.isFinite(value)) {
    return {
      valid: false,
      error: `${fieldName} must be a valid number`,
    };
  }

  if (value < 0) {
    return {
      valid: false,
      error: `${fieldName} must be non-negative`,
    };
  }

  return { valid: true };
}

/**
 * Validate status enum value
 * @param status Status value to validate
 * @returns Validation result
 */
export function validateStatus(status: string | null): ValidationResult {
  if (!status) {
    return { valid: true };
  }

  if (!PLAN_STATUS_OPTIONS.includes(status as PlanStatus)) {
    return {
      valid: false,
      error: `Status must be one of: ${PLAN_STATUS_OPTIONS.join(', ')}`,
    };
  }

  return { valid: true };
}

/**
 * Validate assignee string
 * @param assignee Assignee name to validate
 * @returns Validation result
 */
export function validateAssignee(assignee: string | null): ValidationResult {
  if (!assignee) {
    return { valid: true };
  }

  if (assignee.length > 100) {
    return {
      valid: false,
      error: 'Assignee name must be 100 characters or less',
    };
  }

  return { valid: true };
}

/**
 * Check if start date is after due date (non-blocking warning)
 * @param startDate Start date in ISO format
 * @param dueDate Due date in ISO format
 * @returns Validation result with optional warning
 */
export function checkDateOrdering(
  startDate: string | null,
  dueDate: string | null
): ValidationResult {
  if (!startDate || !dueDate) {
    return { valid: true };
  }

  const startTime = new Date(startDate).getTime();
  const dueTime = new Date(dueDate).getTime();

  if (startTime > dueTime) {
    return {
      valid: true,
      warning: 'Start date is after due date',
    };
  }

  return { valid: true };
}

/**
 * Validate entire plan attributes object
 * @param plan Plan attributes to validate
 * @returns Array of validation results for each field
 */
export function validatePlanAttributes(
  plan: Partial<PlanAttributes>
): Record<string, ValidationResult> {
  const results: Record<string, ValidationResult> = {};

  if (plan.startDate !== undefined) {
    results.startDate = validateDate(plan.startDate);
  }

  if (plan.dueDate !== undefined) {
    results.dueDate = validateDate(plan.dueDate);
  }

  if (plan.investedTimeHours !== undefined) {
    results.investedTimeHours = validateNumber(
      plan.investedTimeHours,
      'Invested time'
    );
  }

  if (plan.elapsedTimeHours !== undefined) {
    results.elapsedTimeHours = validateNumber(
      plan.elapsedTimeHours,
      'Elapsed time'
    );
  }

  if (plan.assignee !== undefined) {
    results.assignee = validateAssignee(plan.assignee);
  }

  if (plan.status !== undefined) {
    results.status = validateStatus(plan.status);
  }

  // Check date ordering if both dates are present
  if (plan.startDate && plan.dueDate) {
    const ordering = checkDateOrdering(plan.startDate, plan.dueDate);
    if (ordering.warning) {
      results.dateOrdering = ordering;
    }
  }

  return results;
}

/**
 * Check if any validation result is an error
 * @param results Validation results object
 * @returns True if any field has an error
 */
export function hasValidationErrors(
  results: Record<string, ValidationResult>
): boolean {
  return Object.values(results).some((r) => !r.valid);
}

/**
 * Get all error messages from validation results
 * @param results Validation results object
 * @returns Array of error messages
 */
export function getValidationErrors(
  results: Record<string, ValidationResult>
): string[] {
  return Object.entries(results)
    .filter(([, r]) => !r.valid && r.error)
    .map(([, r]) => r.error!);
}

/**
 * Get all warning messages from validation results
 * @param results Validation results object
 * @returns Array of warning messages
 */
export function getValidationWarnings(
  results: Record<string, ValidationResult>
): string[] {
  return Object.entries(results)
    .filter(([_, r]) => r.warning)
    .map(([_, r]) => r.warning!);
}
