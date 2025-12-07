/**
 * Unit tests for node adapter and plan form validation
 * Tests: node-adapter.ts, plan-form.ts
 */

import { describe, it, expect } from 'vitest';
import {
  getNodePlanAttributes,
  setNodePlanAttributes,
  hasNodePlanData,
  clearNodePlanAttributes,
} from '@core/node-adapter';
import {
  validatePlanForm,
  parseFormValue,
  formatFormValue,
  PLAN_FORM_FIELDS,
} from '@ui/forms/plan-form';
import type { MindMapNode, PlanAttributes } from '@core/types/node';

describe('node-adapter', () => {
  describe('getNodePlanAttributes', () => {
    it('returns default attributes for node without extended.plan', () => {
      const node: MindMapNode = { id: '1', topic: 'Test' };
      const plan = getNodePlanAttributes(node);

      expect(plan).toEqual({
        startDate: null,
        dueDate: null,
        investedTimeHours: null,
        elapsedTimeDays: null,
        assignee: null,
        status: null,
      });
    });

    it('returns existing plan attributes', () => {
      const node: MindMapNode = {
        id: '1',
        topic: 'Test',
        extended: {
          plan: {
            startDate: '2025-01-01',
            dueDate: '2025-12-31',
            investedTimeHours: 10,
            elapsedTimeHours: 5,
            assignee: 'John Doe',
            status: 'In Progress',
          },
        },
      };

      const plan = getNodePlanAttributes(node);
      expect(plan.startDate).toBe('2025-01-01');
      expect(plan.status).toBe('In Progress');
      expect(plan.assignee).toBe('John Doe');
    });

    it('fills missing fields with defaults', () => {
      const node: MindMapNode = {
        id: '1',
        topic: 'Test',
        extended: {
          plan: {
            startDate: '2025-01-01',
            dueDate: null,
            investedTimeHours: null,
            elapsedTimeHours: null,
            assignee: null,
            status: null,
          },
        },
      };

      const plan = getNodePlanAttributes(node);
      expect(plan.startDate).toBe('2025-01-01');
      expect(plan.dueDate).toBeNull();
      expect(plan.status).toBeNull();
    });
  });

  describe('setNodePlanAttributes', () => {
    it('creates extended namespace if missing', () => {
      const node: MindMapNode = { id: '1', topic: 'Test' };
      setNodePlanAttributes(node, { status: 'In Progress' });

      expect(node.extended).toBeDefined();
      expect(node.extended?.plan).toBeDefined();
      expect(node.extended?.plan?.status).toBe('In Progress');
    });

    it('merges partial attributes with existing ones', () => {
      const node: MindMapNode = {
        id: '1',
        topic: 'Test',
        extended: {
          plan: {
            startDate: '2025-01-01',
            dueDate: null,
            investedTimeHours: null,
            elapsedTimeHours: null,
            assignee: 'John',
            status: null,
          },
        },
      };

      setNodePlanAttributes(node, { status: 'Completed', dueDate: '2025-12-31' });

      expect(node.extended?.plan?.startDate).toBe('2025-01-01');
      expect(node.extended?.plan?.dueDate).toBe('2025-12-31');
      expect(node.extended?.plan?.assignee).toBe('John');
      expect(node.extended?.plan?.status).toBe('Completed');
    });

    it('overwrites existing values', () => {
      const node: MindMapNode = {
        id: '1',
        topic: 'Test',
        extended: {
          plan: {
            startDate: '2025-01-01',
            dueDate: null,
            investedTimeHours: null,
            elapsedTimeHours: null,
            assignee: 'John',
            status: 'In Progress',
          },
        },
      };

      setNodePlanAttributes(node, { assignee: 'Jane', status: 'Completed' });

      expect(node.extended?.plan?.assignee).toBe('Jane');
      expect(node.extended?.plan?.status).toBe('Completed');
    });
  });

  describe('hasNodePlanData', () => {
    it('returns false for node without extended.plan', () => {
      const node: MindMapNode = { id: '1', topic: 'Test' };
      expect(hasNodePlanData(node)).toBe(false);
    });

    it('returns false for node with all null plan fields', () => {
      const node: MindMapNode = {
        id: '1',
        topic: 'Test',
        extended: {
          plan: {
            startDate: null,
            dueDate: null,
            investedTimeHours: null,
            elapsedTimeDays: null,
            assignee: null,
            status: null,
          },
        },
      };
      expect(hasNodePlanData(node)).toBe(false);
    });

    it('returns true if any plan field is non-null', () => {
      const testCases = [
        { startDate: '2025-01-01' },
        { dueDate: '2025-12-31' },
        { investedTimeHours: 10 },
        { elapsedTimeDays: 5 },
        { assignee: 'John' },
        { status: 'In Progress' as const },
      ];

      testCases.forEach((partialPlan) => {
        const node: MindMapNode = {
          id: '1',
          topic: 'Test',
          extended: {
            plan: {
              startDate: null,
              dueDate: null,
              investedTimeHours: null,
              elapsedTimeHours: null,
              assignee: null,
              status: null,
              ...partialPlan,
            },
          },
        };
        expect(hasNodePlanData(node)).toBe(true);
      });
    });
  });

  describe('clearNodePlanAttributes', () => {
    it('resets all plan attributes to null', () => {
      const node: MindMapNode = {
        id: '1',
        topic: 'Test',
        extended: {
          plan: {
            startDate: '2025-01-01',
            dueDate: '2025-12-31',
            investedTimeHours: 10,
            elapsedTimeDays: 5,
            assignee: 'John',
            status: 'Completed',
          },
        },
      };

      clearNodePlanAttributes(node);

      expect(node.extended?.plan).toEqual({
        startDate: null,
        dueDate: null,
        investedTimeHours: null,
        elapsedTimeDays: null,
        assignee: null,
        status: null,
      });
    });

    it('does nothing if node has no extended.plan', () => {
      const node: MindMapNode = { id: '1', topic: 'Test' };
      clearNodePlanAttributes(node);
      expect(node.extended).toBeUndefined();
    });
  });
});

describe('plan-form', () => {
  describe('PLAN_FORM_FIELDS', () => {
    it('defines all six plan attributes', () => {
      expect(PLAN_FORM_FIELDS).toHaveLength(6);
      const fieldNames = PLAN_FORM_FIELDS.map((f) => f.name);
      expect(fieldNames).toContain('startDate');
      expect(fieldNames).toContain('dueDate');
      expect(fieldNames).toContain('investedTimeHours');
      expect(fieldNames).toContain('elapsedTimeDays');
      expect(fieldNames).toContain('assignee');
      expect(fieldNames).toContain('status');
    });

    it('defines correct field types', () => {
      const typeMap = new Map(PLAN_FORM_FIELDS.map((f) => [f.name, f.type]));
      expect(typeMap.get('startDate')).toBe('date');
      expect(typeMap.get('dueDate')).toBe('date');
      expect(typeMap.get('investedTimeHours')).toBe('number');
      expect(typeMap.get('elapsedTimeDays')).toBe('number');
      expect(typeMap.get('assignee')).toBe('text');
      expect(typeMap.get('status')).toBe('select');
    });
  });

  describe('validatePlanForm', () => {
    it('accepts valid plan with all fields populated', () => {
      const plan: PlanAttributes = {
        startDate: '2025-01-01',
        dueDate: '2025-12-31',
        investedTimeHours: 10,
        elapsedTimeHours: 5,
        assignee: 'John Doe',
        status: 'In Progress',
      };

      const result = validatePlanForm(plan);
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('accepts plan with all null fields', () => {
      const plan: PlanAttributes = {
        startDate: null,
        dueDate: null,
        investedTimeHours: null,
        elapsedTimeHours: null,
        assignee: null,
        status: null,
      };

      const result = validatePlanForm(plan);
      expect(result.valid).toBe(true);
    });

    it('rejects invalid date format', () => {
      const plan: Partial<PlanAttributes> = {
        startDate: '01/01/2025',
      };

      const result = validatePlanForm(plan);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('YYYY-MM-DD');
    });

    it('rejects negative numbers', () => {
      const plan: Partial<PlanAttributes> = {
        investedTimeHours: -5,
      };

      const result = validatePlanForm(plan);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('non-negative');
    });

    it('warns when start date is after due date', () => {
      const plan: Partial<PlanAttributes> = {
        startDate: '2025-12-31',
        dueDate: '2025-01-01',
      };

      const result = validatePlanForm(plan);
      expect(result.valid).toBe(true); // Non-blocking
      expect(result.warning).toBeDefined();
      expect(result.warning).toContain('after due date');
    });

    it('rejects invalid status', () => {
      const plan: Partial<PlanAttributes> = {
        status: 'Invalid Status' as any,
      };

      const result = validatePlanForm(plan);
      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('parseFormValue', () => {
    it('parses empty string to null', () => {
      expect(parseFormValue('startDate', '')).toBeNull();
      expect(parseFormValue('investedTimeHours', '')).toBeNull();
      expect(parseFormValue('assignee', '')).toBeNull();
    });

    it('parses null to null', () => {
      expect(parseFormValue('startDate', null)).toBeNull();
    });

    it('parses number strings to numbers', () => {
      expect(parseFormValue('investedTimeHours', '10')).toBe(10);
      expect(parseFormValue('elapsedTimeDays', '5.5')).toBe(5.5);
    });

    it('parses invalid number to null', () => {
      expect(parseFormValue('investedTimeHours', 'abc')).toBeNull();
    });

    it('keeps date strings as strings', () => {
      expect(parseFormValue('startDate', '2025-01-01')).toBe('2025-01-01');
    });

    it('keeps assignee strings as strings', () => {
      expect(parseFormValue('assignee', 'John Doe')).toBe('John Doe');
    });

    it('parses status strings correctly', () => {
      expect(parseFormValue('status', 'In Progress')).toBe('In Progress');
    });
  });

  describe('formatFormValue', () => {
    it('formats null as empty string', () => {
      expect(formatFormValue(null)).toBe('');
    });

    it('formats undefined as empty string', () => {
      expect(formatFormValue(undefined)).toBe('');
    });

    it('formats numbers as strings', () => {
      expect(formatFormValue(10)).toBe('10');
      expect(formatFormValue(5.5)).toBe('5.5');
    });

    it('formats dates as strings', () => {
      expect(formatFormValue('2025-01-01')).toBe('2025-01-01');
    });

    it('formats text as strings', () => {
      expect(formatFormValue('John Doe')).toBe('John Doe');
    });
  });
});
