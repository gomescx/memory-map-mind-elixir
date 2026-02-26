/**
 * Date calculation utilities for elapsed time and bidirectional date derivation.
 * All dates use ISO 8601 format (YYYY-MM-DD).
 *
 * Business day convention:
 *   Elapsed Time between startDate and dueDate counts weekdays in the half-open
 *   interval (startDate, dueDate] — i.e., exclusive of start, inclusive of due.
 *   This means: if startDate = Jan 1 (Thu) and dueDate = Jan 9 (Fri),
 *   business days = Jan 2 (Fri), Jan 5 (Mon), Jan 6 (Tue), Jan 7 (Wed),
 *                   Jan 8 (Thu), Jan 9 (Fri) = 6. ✓
 */

function parseISO(isoDate: string): Date {
  // Append T00:00:00 to force local-midnight interpretation
  return new Date(`${isoDate}T00:00:00`);
}

function toISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Count business days (Mon–Fri) in the half-open interval (startDate, dueDate].
 * Returns 0 when startDate >= dueDate.
 */
export function countBusinessDays(startISO: string, dueISO: string): number {
  const start = parseISO(startISO);
  const due = parseISO(dueISO);
  if (start >= due) return 0;

  let count = 0;
  const cursor = new Date(start);
  cursor.setDate(cursor.getDate() + 1); // exclusive of start

  while (cursor <= due) {
    const day = cursor.getDay();
    if (day !== 0 && day !== 6) count++;
    cursor.setDate(cursor.getDate() + 1);
  }
  return count;
}

/**
 * Count calendar days between two ISO dates (absolute difference).
 */
export function countCalendarDays(startISO: string, dueISO: string): number {
  const start = parseISO(startISO);
  const due = parseISO(dueISO);
  const diff = Math.abs(due.getTime() - start.getTime());
  return Math.round(diff / (1000 * 60 * 60 * 24));
}

/**
 * Add N business days to startDate.
 * Returns the ISO date of the Nth business day after startDate.
 *
 * @example addBusinessDays('2026-01-05', 10) → '2026-01-19'
 */
export function addBusinessDays(startISO: string, days: number): string {
  const date = parseISO(startISO);
  let remaining = days;
  while (remaining > 0) {
    date.setDate(date.getDate() + 1);
    const d = date.getDay();
    if (d !== 0 && d !== 6) remaining--;
  }
  return toISO(date);
}

/**
 * Add N calendar days to startDate.
 */
export function addCalendarDays(startISO: string, days: number): string {
  const date = parseISO(startISO);
  date.setDate(date.getDate() + days);
  return toISO(date);
}

/**
 * Subtract N business days from dueDate.
 * Returns the ISO date N business days before dueDate.
 */
export function subtractBusinessDays(dueISO: string, days: number): string {
  const date = parseISO(dueISO);
  let remaining = days;
  while (remaining > 0) {
    date.setDate(date.getDate() - 1);
    const d = date.getDay();
    if (d !== 0 && d !== 6) remaining--;
  }
  return toISO(date);
}

/**
 * Subtract N calendar days from dueDate.
 */
export function subtractCalendarDays(dueISO: string, days: number): string {
  const date = parseISO(dueISO);
  date.setDate(date.getDate() - days);
  return toISO(date);
}

/**
 * Returns true if the ISO date falls on a Saturday or Sunday.
 */
export function isWeekend(isoDate: string): boolean {
  const day = parseISO(isoDate).getDay();
  return day === 0 || day === 6;
}

/**
 * Derive elapsed time from start + due dates.
 * Returns null if either date is missing.
 */
export function deriveElapsedDays(
  startISO: string | null | undefined,
  dueISO: string | null | undefined,
  excludeWeekends: boolean,
): number | null {
  if (!startISO || !dueISO) return null;
  return excludeWeekends
    ? countBusinessDays(startISO, dueISO)
    : countCalendarDays(startISO, dueISO);
}

/**
 * Derive due date from start date + elapsed days.
 * Returns null if either argument is missing.
 */
export function deriveDueDate(
  startISO: string | null | undefined,
  elapsedDays: number | null | undefined,
  excludeWeekends: boolean,
): string | null {
  if (!startISO || elapsedDays == null) return null;
  return excludeWeekends
    ? addBusinessDays(startISO, elapsedDays)
    : addCalendarDays(startISO, elapsedDays);
}

/**
 * Derive start date from due date + elapsed days.
 * Returns null if either argument is missing.
 */
export function deriveStartDate(
  dueISO: string | null | undefined,
  elapsedDays: number | null | undefined,
  excludeWeekends: boolean,
): string | null {
  if (!dueISO || elapsedDays == null) return null;
  return excludeWeekends
    ? subtractBusinessDays(dueISO, elapsedDays)
    : subtractCalendarDays(dueISO, elapsedDays);
}
