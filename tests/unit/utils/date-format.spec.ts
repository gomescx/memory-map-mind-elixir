/**
 * Unit tests for date-format utility
 * Tests: src/utils/date-format.ts
 */

import { describe, it, expect } from 'vitest';
import { formatDateDDMMMYYYY, parseDDMMMYYYY } from '@/utils/date-format';

describe('formatDateDDMMMYYYY', () => {
  // T068: Display dates in DD-MMM-YYYY format
  it('test_date_formatter_converts_iso_to_dd_mmm_yyyy: basic conversion', () => {
    expect(formatDateDDMMMYYYY('2026-02-26')).toBe('26-Feb-2026');
  });

  it('converts January correctly', () => {
    expect(formatDateDDMMMYYYY('2026-01-05')).toBe('05-Jan-2026');
  });

  it('converts March correctly', () => {
    expect(formatDateDDMMMYYYY('2026-03-15')).toBe('15-Mar-2026');
  });

  it('converts December correctly', () => {
    expect(formatDateDDMMMYYYY('2025-12-31')).toBe('31-Dec-2025');
  });

  it('returns null for null input', () => {
    expect(formatDateDDMMMYYYY(null)).toBeNull();
  });

  it('returns null for undefined input', () => {
    expect(formatDateDDMMMYYYY(undefined)).toBeNull();
  });

  it('returns null for empty string', () => {
    expect(formatDateDDMMMYYYY('')).toBeNull();
  });

  it('passes through non-ISO strings unchanged', () => {
    expect(formatDateDDMMMYYYY('not-a-date')).toBe('not-a-date');
  });

  it('handles all 12 months', () => {
    const expected = [
      ['2026-01-01', '01-Jan-2026'],
      ['2026-02-01', '01-Feb-2026'],
      ['2026-03-01', '01-Mar-2026'],
      ['2026-04-01', '01-Apr-2026'],
      ['2026-05-01', '01-May-2026'],
      ['2026-06-01', '01-Jun-2026'],
      ['2026-07-01', '01-Jul-2026'],
      ['2026-08-01', '01-Aug-2026'],
      ['2026-09-01', '01-Sep-2026'],
      ['2026-10-01', '01-Oct-2026'],
      ['2026-11-01', '01-Nov-2026'],
      ['2026-12-01', '01-Dec-2026'],
    ];
    for (const [iso, formatted] of expected) {
      expect(formatDateDDMMMYYYY(iso)).toBe(formatted);
    }
  });
});

describe('parseDDMMMYYYY', () => {
  it('parses DD-MMM-YYYY back to ISO', () => {
    expect(parseDDMMMYYYY('26-Feb-2026')).toBe('2026-02-26');
  });

  it('parses case-insensitively', () => {
    expect(parseDDMMMYYYY('15-mar-2026')).toBe('2026-03-15');
  });

  it('returns null for invalid format', () => {
    expect(parseDDMMMYYYY('not-a-date')).toBeNull();
  });

  it('returns null for unknown month', () => {
    expect(parseDDMMMYYYY('15-Xyz-2026')).toBeNull();
  });
});
