/**
 * Plan status utilities - derive status flags from plan data
 * Simple helper functions for status, overdue, assignee checks
 */

import type { PlanAttributes, PlanStatus } from '@core/types/node';

/**
 * Status flag derived from plan data
 */
export interface StatusFlags {
  hasStatus: boolean;
  status: PlanStatus | null;
  isNotStarted: boolean;
  isInProgress: boolean;
  isCompleted: boolean;
}

/**
 * Overdue flag derived from due date
 */
export interface OverdueFlags {
  isOverdue: boolean;
  dueDate: string | null;
  daysOverdue: number;
}

/**
 * Assignee flag derived from plan data
 */
export interface AssigneeFlags {
  hasAssignee: boolean;
  assignee: string | null;
  initials: string;
}

/**
 * Time tracking flags
 */
export interface TimeFlags {
  hasTimeTracking: boolean;
  investedTimeHours: number | null;
  elapsedTimeDays: number | null;
  hasInvestedTime: boolean;
  hasElapsedTime: boolean;
}

/**
 * Derive status flags from plan data
 */
export function getStatusFlags(plan: PlanAttributes | undefined | null): StatusFlags {
  if (!plan || !plan.status) {
    return {
      hasStatus: false,
      status: null,
      isNotStarted: false,
      isInProgress: false,
      isCompleted: false,
    };
  }

  return {
    hasStatus: true,
    status: plan.status,
    isNotStarted: plan.status === 'Not Started',
    isInProgress: plan.status === 'In Progress',
    isCompleted: plan.status === 'Completed',
  };
}

/**
 * Derive overdue flags from due date
 * A task is overdue if dueDate < today and status != 'Completed'
 */
export function getOverdueFlags(plan: PlanAttributes | undefined | null): OverdueFlags {
  if (!plan || !plan.dueDate) {
    return {
      isOverdue: false,
      dueDate: null,
      daysOverdue: 0,
    };
  }

  const due = new Date(plan.dueDate);
  const now = new Date();
  now.setHours(0, 0, 0, 0); // Compare dates only
  due.setHours(0, 0, 0, 0);

  const isOverdue = due < now && plan.status !== 'Completed';
  const daysOverdue = isOverdue
    ? Math.floor((now.getTime() - due.getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return {
    isOverdue,
    dueDate: plan.dueDate,
    daysOverdue,
  };
}

/**
 * Derive assignee flags from plan data
 */
export function getAssigneeFlags(plan: PlanAttributes | undefined | null): AssigneeFlags {
  if (!plan || !plan.assignee) {
    return {
      hasAssignee: false,
      assignee: null,
      initials: '',
    };
  }

  const initials = plan.assignee
    .split(' ')
    .map((n) => n[0]?.toUpperCase())
    .filter(Boolean)
    .join('')
    .slice(0, 2);

  return {
    hasAssignee: true,
    assignee: plan.assignee,
    initials: initials || '👤',
  };
}

/**
 * Derive time tracking flags from plan data
 */
export function getTimeFlags(plan: PlanAttributes | undefined | null): TimeFlags {
  if (!plan) {
    return {
      hasTimeTracking: false,
      investedTimeHours: null,
      elapsedTimeDays: null,
      hasInvestedTime: false,
      hasElapsedTime: false,
    };
  }

  const hasInvestedTime = plan.investedTimeHours !== null;
  const hasElapsedTime = plan.elapsedTimeDays !== null;
  const hasTimeTracking = hasInvestedTime || hasElapsedTime;

  return {
    hasTimeTracking,
    investedTimeHours: plan.investedTimeHours,
    elapsedTimeDays: plan.elapsedTimeDays,
    hasInvestedTime,
    hasElapsedTime,
  };
}

/**
 * Get all flags for a plan in one call
 */
export interface AllPlanFlags {
  status: StatusFlags;
  overdue: OverdueFlags;
  assignee: AssigneeFlags;
  time: TimeFlags;
}

export function getAllPlanFlags(plan: PlanAttributes | undefined | null): AllPlanFlags {
  return {
    status: getStatusFlags(plan),
    overdue: getOverdueFlags(plan),
    assignee: getAssigneeFlags(plan),
    time: getTimeFlags(plan),
  };
}

/**
 * Check if a task should show warning (overdue and not completed)
 */
export function shouldShowWarning(plan: PlanAttributes | undefined | null): boolean {
  const overdue = getOverdueFlags(plan);
  return overdue.isOverdue;
}

/**
 * Format hours for display (e.g., "5h" or "1.5h")
 */
export function formatHours(hours: number): string {
  return hours % 1 === 0 ? `${hours}h` : `${hours.toFixed(1)}h`;
}

/**
 * Format days for display (e.g., "5d" or "1.5d")
 */
export function formatDays(days: number): string {
  return days % 1 === 0 ? `${days}d` : `${days.toFixed(1)}d`;
}

/**
 * Format date for display
 */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
