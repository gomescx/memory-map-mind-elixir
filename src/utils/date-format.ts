/**
 * Date formatting utilities for display in table view
 * Converts ISO 8601 dates (YYYY-MM-DD) to human-readable DD-MMM-YYYY format
 */

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

/**
 * Converts an ISO date string (YYYY-MM-DD) to DD-MMM-YYYY display format.
 * Returns null if the input is falsy or not a valid ISO date.
 *
 * @example formatDateDDMMMYYYY('2026-02-26') // '26-Feb-2026'
 */
export function formatDateDDMMMYYYY(isoDate: string | null | undefined): string | null {
  if (!isoDate) return null;
  const match = isoDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return isoDate; // pass through non-ISO values unchanged
  const [, year, month, day] = match;
  const monthIndex = parseInt(month, 10) - 1;
  if (monthIndex < 0 || monthIndex > 11) return isoDate;
  return `${day}-${MONTHS[monthIndex]}-${year}`;
}

/**
 * Converts a DD-MMM-YYYY string back to ISO format (YYYY-MM-DD).
 * Returns null if the input cannot be parsed.
 *
 * @example parseDDMMMYYYY('26-Feb-2026') // '2026-02-26'
 */
export function parseDDMMMYYYY(formatted: string): string | null {
  const match = formatted.match(/^(\d{2})-([A-Za-z]{3})-(\d{4})$/);
  if (!match) return null;
  const [, day, monthStr, year] = match;
  const monthIndex = MONTHS.findIndex((m) => m.toLowerCase() === monthStr.toLowerCase());
  if (monthIndex === -1) return null;
  return `${year}-${String(monthIndex + 1).padStart(2, '0')}-${day}`;
}
