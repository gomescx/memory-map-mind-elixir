/**
 * Unit tests for node plan badges and status calculations
 * Tests badge rendering logic and overdue calculations
 */

import { describe, it, expect } from 'vitest';
import {
  getStatusFlags,
  getOverdueFlags,
  getAssigneeFlags,
  getTimeFlags,
  getAllPlanFlags,
  shouldShowWarning,
  formatHours,
  formatDays,
  formatDate,
} from '@utils/plan-status';
import type { PlanAttributes } from '@core/types/node';

describe('plan-status utilities', () => {
  describe('getStatusFlags', () => {
    it('returns no status for undefined plan', () => {
      const result = getStatusFlags(undefined);
      expect(result.hasStatus).toBe(false);
      expect(result.status).toBeNull();
      expect(result.isNotStarted).toBe(false);
      expect(result.isInProgress).toBe(false);
      expect(result.isCompleted).toBe(false);
    });

    it('returns no status for null status', () => {
      const plan: PlanAttributes = {
        startDate: null,
        dueDate: null,
        investedTimeHours: null,
        elapsedTimeDays: null,
        assignee: null,
        status: null,
      };
      const result = getStatusFlags(plan);
      expect(result.hasStatus).toBe(false);
    });

    it('returns correct flags for "Not Started"', () => {
      const plan: PlanAttributes = {
        startDate: null,
        dueDate: null,
        investedTimeHours: null,
        elapsedTimeDays: null,
        assignee: null,
        status: 'Not Started',
      };
      const result = getStatusFlags(plan);
      expect(result.hasStatus).toBe(true);
      expect(result.status).toBe('Not Started');
      expect(result.isNotStarted).toBe(true);
      expect(result.isInProgress).toBe(false);
      expect(result.isCompleted).toBe(false);
    });

    it('returns correct flags for "In Progress"', () => {
      const plan: PlanAttributes = {
        startDate: null,
        dueDate: null,
        investedTimeHours: null,
        elapsedTimeDays: null,
        assignee: null,
        status: 'In Progress',
      };
      const result = getStatusFlags(plan);
      expect(result.hasStatus).toBe(true);
      expect(result.status).toBe('In Progress');
      expect(result.isNotStarted).toBe(false);
      expect(result.isInProgress).toBe(true);
      expect(result.isCompleted).toBe(false);
    });

    it('returns correct flags for "Completed"', () => {
      const plan: PlanAttributes = {
        startDate: null,
        dueDate: null,
        investedTimeHours: null,
        elapsedTimeDays: null,
        assignee: null,
        status: 'Completed',
      };
      const result = getStatusFlags(plan);
      expect(result.hasStatus).toBe(true);
      expect(result.status).toBe('Completed');
      expect(result.isNotStarted).toBe(false);
      expect(result.isInProgress).toBe(false);
      expect(result.isCompleted).toBe(true);
    });
  });

  describe('getOverdueFlags', () => {
    it('returns not overdue for undefined plan', () => {
      const result = getOverdueFlags(undefined);
      expect(result.isOverdue).toBe(false);
      expect(result.dueDate).toBeNull();
      expect(result.daysOverdue).toBe(0);
    });

    it('returns not overdue for null due date', () => {
      const plan: PlanAttributes = {
        startDate: null,
        dueDate: null,
        investedTimeHours: null,
        elapsedTimeDays: null,
        assignee: null,
        status: null,
      };
      const result = getOverdueFlags(plan);
      expect(result.isOverdue).toBe(false);
    });

    it('returns overdue for past due date', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const plan: PlanAttributes = {
        startDate: null,
        dueDate: yesterday.toISOString().split('T')[0],
        investedTimeHours: null,
        elapsedTimeDays: null,
        assignee: null,
        status: 'In Progress',
      };
      const result = getOverdueFlags(plan);
      expect(result.isOverdue).toBe(true);
      expect(result.daysOverdue).toBeGreaterThan(0);
    });

    it('returns not overdue for future due date', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const plan: PlanAttributes = {
        startDate: null,
        dueDate: tomorrow.toISOString().split('T')[0],
        investedTimeHours: null,
        elapsedTimeDays: null,
        assignee: null,
        status: 'In Progress',
      };
      const result = getOverdueFlags(plan);
      expect(result.isOverdue).toBe(false);
    });

    it('returns not overdue for completed task even if past due', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const plan: PlanAttributes = {
        startDate: null,
        dueDate: yesterday.toISOString().split('T')[0],
        investedTimeHours: null,
        elapsedTimeDays: null,
        assignee: null,
        status: 'Completed',
      };
      const result = getOverdueFlags(plan);
      expect(result.isOverdue).toBe(false);
    });

    it('calculates days overdue correctly', () => {
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      const plan: PlanAttributes = {
        startDate: null,
        dueDate: threeDaysAgo.toISOString().split('T')[0],
        investedTimeHours: null,
        elapsedTimeDays: null,
        assignee: null,
        status: 'Not Started',
      };
      const result = getOverdueFlags(plan);
      expect(result.isOverdue).toBe(true);
      expect(result.daysOverdue).toBeGreaterThanOrEqual(3);
    });
  });

  describe('getAssigneeFlags', () => {
    it('returns no assignee for undefined plan', () => {
      const result = getAssigneeFlags(undefined);
      expect(result.hasAssignee).toBe(false);
      expect(result.assignee).toBeNull();
      expect(result.initials).toBe('');
    });

    it('returns no assignee for null assignee', () => {
      const plan: PlanAttributes = {
        startDate: null,
        dueDate: null,
        investedTimeHours: null,
        elapsedTimeDays: null,
        assignee: null,
        status: null,
      };
      const result = getAssigneeFlags(plan);
      expect(result.hasAssignee).toBe(false);
    });

    it('returns initials for single name', () => {
      const plan: PlanAttributes = {
        startDate: null,
        dueDate: null,
        investedTimeHours: null,
        elapsedTimeDays: null,
        assignee: 'Alice',
        status: null,
      };
      const result = getAssigneeFlags(plan);
      expect(result.hasAssignee).toBe(true);
      expect(result.assignee).toBe('Alice');
      expect(result.initials).toBe('A');
    });

    it('returns initials for full name', () => {
      const plan: PlanAttributes = {
        startDate: null,
        dueDate: null,
        investedTimeHours: null,
        elapsedTimeDays: null,
        assignee: 'John Doe',
        status: null,
      };
      const result = getAssigneeFlags(plan);
      expect(result.hasAssignee).toBe(true);
      expect(result.assignee).toBe('John Doe');
      expect(result.initials).toBe('JD');
    });

    it('returns max 2 initials for long names', () => {
      const plan: PlanAttributes = {
        startDate: null,
        dueDate: null,
        investedTimeHours: null,
        elapsedTimeDays: null,
        assignee: 'John Paul Smith',
        status: null,
      };
      const result = getAssigneeFlags(plan);
      expect(result.hasAssignee).toBe(true);
      expect(result.initials).toBe('JP');
    });

    it('handles empty string assignee', () => {
      const plan: PlanAttributes = {
        startDate: null,
        dueDate: null,
        investedTimeHours: null,
        elapsedTimeDays: null,
        assignee: '',
        status: null,
      };
      const result = getAssigneeFlags(plan);
      expect(result.hasAssignee).toBe(false);
    });
  });

  describe('getTimeFlags', () => {
    it('returns no time tracking for undefined plan', () => {
      const result = getTimeFlags(undefined);
      expect(result.hasTimeTracking).toBe(false);
      expect(result.investedTimeHours).toBeNull();
      expect(result.elapsedTimeDays).toBeNull();
      expect(result.hasInvestedTime).toBe(false);
      expect(result.hasElapsedTime).toBe(false);
    });

    it('returns no time tracking for null values', () => {
      const plan: PlanAttributes = {
        startDate: null,
        dueDate: null,
        investedTimeHours: null,
        elapsedTimeDays: null,
        assignee: null,
        status: null,
      };
      const result = getTimeFlags(plan);
      expect(result.hasTimeTracking).toBe(false);
    });

    it('returns time tracking for invested time only', () => {
      const plan: PlanAttributes = {
        startDate: null,
        dueDate: null,
        investedTimeHours: 5,
        elapsedTimeDays: null,
        assignee: null,
        status: null,
      };
      const result = getTimeFlags(plan);
      expect(result.hasTimeTracking).toBe(true);
      expect(result.hasInvestedTime).toBe(true);
      expect(result.hasElapsedTime).toBe(false);
      expect(result.investedTimeHours).toBe(5);
    });

    it('returns time tracking for elapsed time only', () => {
      const plan: PlanAttributes = {
        startDate: null,
        dueDate: null,
        investedTimeHours: null,
        elapsedTimeDays: 3,
        assignee: null,
        status: null,
      };
      const result = getTimeFlags(plan);
      expect(result.hasTimeTracking).toBe(true);
      expect(result.hasInvestedTime).toBe(false);
      expect(result.hasElapsedTime).toBe(true);
      expect(result.elapsedTimeDays).toBe(3);
    });

    it('returns time tracking for both times', () => {
      const plan: PlanAttributes = {
        startDate: null,
        dueDate: null,
        investedTimeHours: 8,
        elapsedTimeDays: 2,
        assignee: null,
        status: null,
      };
      const result = getTimeFlags(plan);
      expect(result.hasTimeTracking).toBe(true);
      expect(result.hasInvestedTime).toBe(true);
      expect(result.hasElapsedTime).toBe(true);
      expect(result.investedTimeHours).toBe(8);
      expect(result.elapsedTimeDays).toBe(2);
    });
  });

  describe('getAllPlanFlags', () => {
    it('returns all flags for comprehensive plan', () => {
      const plan: PlanAttributes = {
        startDate: '2025-01-01',
        dueDate: '2025-12-31',
        investedTimeHours: 10,
        elapsedTimeDays: 5,
        assignee: 'Alice Smith',
        status: 'In Progress',
      };
      const result = getAllPlanFlags(plan);
      expect(result.status.hasStatus).toBe(true);
      expect(result.status.isInProgress).toBe(true);
      expect(result.assignee.hasAssignee).toBe(true);
      expect(result.assignee.initials).toBe('AS');
      expect(result.time.hasTimeTracking).toBe(true);
    });
  });

  describe('shouldShowWarning', () => {
    it('returns false for undefined plan', () => {
      expect(shouldShowWarning(undefined)).toBe(false);
    });

    it('returns false for future due date', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const plan: PlanAttributes = {
        startDate: null,
        dueDate: tomorrow.toISOString().split('T')[0],
        investedTimeHours: null,
        elapsedTimeDays: null,
        assignee: null,
        status: 'In Progress',
      };
      expect(shouldShowWarning(plan)).toBe(false);
    });

    it('returns true for past due date', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const plan: PlanAttributes = {
        startDate: null,
        dueDate: yesterday.toISOString().split('T')[0],
        investedTimeHours: null,
        elapsedTimeDays: null,
        assignee: null,
        status: 'In Progress',
      };
      expect(shouldShowWarning(plan)).toBe(true);
    });

    it('returns false for completed task even if overdue', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const plan: PlanAttributes = {
        startDate: null,
        dueDate: yesterday.toISOString().split('T')[0],
        investedTimeHours: null,
        elapsedTimeDays: null,
        assignee: null,
        status: 'Completed',
      };
      expect(shouldShowWarning(plan)).toBe(false);
    });
  });

  describe('formatting functions', () => {
    describe('formatHours', () => {
      it('formats whole hours without decimal', () => {
        expect(formatHours(5)).toBe('5h');
        expect(formatHours(10)).toBe('10h');
      });

      it('formats fractional hours with decimal', () => {
        expect(formatHours(5.5)).toBe('5.5h');
        expect(formatHours(2.75)).toBe('2.8h'); // Rounded to 1 decimal
      });
    });

    describe('formatDays', () => {
      it('formats whole days without decimal', () => {
        expect(formatDays(3)).toBe('3d');
        expect(formatDays(7)).toBe('7d');
      });

      it('formats fractional days with decimal', () => {
        expect(formatDays(2.5)).toBe('2.5d');
        expect(formatDays(1.25)).toBe('1.3d'); // Rounded to 1 decimal
      });
    });

    describe('formatDate', () => {
      it('formats ISO date string', () => {
        const result = formatDate('2025-12-08');
        expect(result).toMatch(/Dec.*2025/);
      });

      it('handles different date formats', () => {
        const result1 = formatDate('2025-01-15');
        expect(result1).toMatch(/Jan.*15.*2025/);

        const result2 = formatDate('2025-06-30');
        expect(result2).toMatch(/Jun.*30.*2025/);
      });
    });
  });
});
