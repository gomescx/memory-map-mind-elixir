/**
 * Unit tests for date-calculations utility
 * Tests: src/utils/date-calculations.ts
 */

import { describe, it, expect } from 'vitest';
import {
  countBusinessDays,
  countCalendarDays,
  addBusinessDays,
  subtractBusinessDays,
  addCalendarDays,
  subtractCalendarDays,
  isWeekend,
  deriveElapsedDays,
  deriveDueDate,
  deriveStartDate,
} from '@/utils/date-calculations';

describe('countBusinessDays', () => {
  // Spec example: 01-Jan-2026 (Thu) to 09-Jan-2026 (Fri) = 6 business days
  it('counts business days (spec example)', () => {
    expect(countBusinessDays('2026-01-01', '2026-01-09')).toBe(6);
  });

  it('returns 0 when start equals due', () => {
    expect(countBusinessDays('2026-01-05', '2026-01-05')).toBe(0);
  });

  it('returns 0 when start is after due', () => {
    expect(countBusinessDays('2026-01-09', '2026-01-01')).toBe(0);
  });

  it('counts single weekday', () => {
    // Jan 5 (Mon) to Jan 6 (Tue) → 1 business day
    expect(countBusinessDays('2026-01-05', '2026-01-06')).toBe(1);
  });

  it('skips weekends', () => {
    // Jan 2 (Fri) to Jan 5 (Mon) → 1 business day (Mon only)
    expect(countBusinessDays('2026-01-02', '2026-01-05')).toBe(1);
  });
});

describe('countCalendarDays', () => {
  // Spec example: 8 calendar days
  it('counts calendar days (spec example)', () => {
    expect(countCalendarDays('2026-01-01', '2026-01-09')).toBe(8);
  });

  it('returns 0 for same date', () => {
    expect(countCalendarDays('2026-01-05', '2026-01-05')).toBe(0);
  });

  it('counts across a month boundary', () => {
    expect(countCalendarDays('2026-01-28', '2026-02-04')).toBe(7);
  });
});

describe('addBusinessDays', () => {
  // Spec: given Start Date = 05-Jan-2026 (Mon) and elapsed = 10
  // Expected due date = 10 business days after Jan 5
  // Jan 6, 7, 8, 9, 12, 13, 14, 15, 16, 19 = Jan 19
  it('adds 10 business days to a Monday (spec scenario)', () => {
    expect(addBusinessDays('2026-01-05', 10)).toBe('2026-01-19');
  });

  it('skips weekends when adding days', () => {
    // Jan 2 (Fri) + 1 = Jan 5 (Mon, skips Sat/Sun)
    expect(addBusinessDays('2026-01-02', 1)).toBe('2026-01-05');
  });

  it('adds 0 days returns same date', () => {
    expect(addBusinessDays('2026-01-05', 0)).toBe('2026-01-05');
  });
});

describe('subtractBusinessDays', () => {
  // Spec: given Due Date = 31-Jan-2026 (Sat) and elapsed = 5
  // Subtract 5 business days before Jan 31 (Sat):
  // Jan 30 (Fri,1), Jan 29 (Thu,2), Jan 28 (Wed,3), Jan 27 (Tue,4), Jan 26 (Mon,5)
  // → start = Jan 26
  it('subtracts 5 business days from a Saturday (spec scenario)', () => {
    expect(subtractBusinessDays('2026-01-31', 5)).toBe('2026-01-26');
  });

  it('subtracts 0 days returns same date', () => {
    expect(subtractBusinessDays('2026-01-05', 0)).toBe('2026-01-05');
  });
});

describe('addCalendarDays', () => {
  it('adds calendar days', () => {
    expect(addCalendarDays('2026-01-01', 8)).toBe('2026-01-09');
  });

  it('crosses month boundary', () => {
    expect(addCalendarDays('2026-01-28', 7)).toBe('2026-02-04');
  });
});

describe('subtractCalendarDays', () => {
  it('subtracts calendar days', () => {
    expect(subtractCalendarDays('2026-01-09', 8)).toBe('2026-01-01');
  });
});

describe('isWeekend', () => {
  it('returns true for Saturday', () => {
    expect(isWeekend('2026-01-03')).toBe(true); // Jan 3 2026 = Saturday
  });

  it('returns true for Sunday', () => {
    expect(isWeekend('2026-01-04')).toBe(true); // Jan 4 2026 = Sunday
  });

  it('returns false for Monday', () => {
    expect(isWeekend('2026-01-05')).toBe(false); // Jan 5 2026 = Monday
  });

  it('returns false for Friday', () => {
    expect(isWeekend('2026-01-02')).toBe(false); // Jan 2 2026 = Friday
  });
});

describe('deriveElapsedDays', () => {
  it('test_elapsed_business_days_calculated_when_both_dates_set', () => {
    expect(deriveElapsedDays('2026-01-01', '2026-01-09', true)).toBe(6);
  });

  it('test_elapsed_calendar_days_when_weekends_unchecked', () => {
    expect(deriveElapsedDays('2026-01-01', '2026-01-09', false)).toBe(8);
  });

  it('returns null when startDate is missing', () => {
    expect(deriveElapsedDays(null, '2026-01-09', true)).toBeNull();
  });

  it('returns null when dueDate is missing', () => {
    expect(deriveElapsedDays('2026-01-01', null, true)).toBeNull();
  });
});

describe('deriveDueDate', () => {
  it('test_due_date_calculated_from_start_plus_elapsed (business days)', () => {
    expect(deriveDueDate('2026-01-05', 10, true)).toBe('2026-01-19');
  });

  it('calculates due date with calendar days', () => {
    expect(deriveDueDate('2026-01-01', 8, false)).toBe('2026-01-09');
  });

  it('returns null when startDate is missing', () => {
    expect(deriveDueDate(null, 10, true)).toBeNull();
  });

  it('returns null when elapsedDays is missing', () => {
    expect(deriveDueDate('2026-01-05', null, true)).toBeNull();
  });
});

describe('deriveStartDate', () => {
  it('test_start_date_calculated_from_due_minus_elapsed (business days)', () => {
    expect(deriveStartDate('2026-01-31', 5, true)).toBe('2026-01-26');
  });

  it('calculates start date with calendar days', () => {
    expect(deriveStartDate('2026-01-09', 8, false)).toBe('2026-01-01');
  });

  it('returns null when dueDate is missing', () => {
    expect(deriveStartDate(null, 5, true)).toBeNull();
  });

  it('returns null when elapsedDays is missing', () => {
    expect(deriveStartDate('2026-01-31', null, true)).toBeNull();
  });
});
