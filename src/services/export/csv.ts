/**
 * CSV export generator
 * Converts flattened export rows to RFC 4180 compliant CSV format
 * Suitable for opening in Excel, Google Sheets, and other spreadsheet applications
 */

import type { ExportRow } from './flatten';

/**
 * Escapes a CSV field value according to RFC 4180
 * Wraps fields in quotes and escapes internal quotes
 */
function escapeCSVField(value: string | null | undefined): string {
  if (value === null || value === undefined) {
    return '';
  }

  const stringValue = String(value);
  // If field contains comma, quote, or newline, wrap in quotes and escape quotes
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

/**
 * Converts an ExportRow to a CSV line
 * Maintains consistent column ordering: ID, Depth, Title, Start Date, Due Date,
 * Invested Time (hours), Elapsed Time (days), Assignee, Status, Parent Path
 */
function rowToCSVLine(row: ExportRow): string {
  const fields = [
    row.id,
    row.depth.toString(),
    row.title,
    row.startDate ?? '',
    row.dueDate ?? '',
    row.investedTimeHours?.toString() ?? '',
    row.elapsedTimeDays?.toString() ?? '',
    row.assignee ?? '',
    row.status ?? '',
    row.parentPath,
  ];

  return fields.map(escapeCSVField).join(',');
}

/**
 * Generates a complete CSV document from flattened export rows
 * Includes header row with column names
 *
 * @param rows - Array of ExportRow objects
 * @returns CSV string with CRLF line endings (RFC 4180)
 */
export function generateCSV(rows: ExportRow[]): string {
  const headers = [
    'ID',
    'Depth',
    'Title',
    'Start Date',
    'Due Date',
    'Invested Time (hours)',
    'Elapsed Time (days)',
    'Assignee',
    'Status',
    'Parent Path',
  ];

  const headerLine = headers.map(escapeCSVField).join(',');
  const dataLines = rows.map(rowToCSVLine);

  return [headerLine, ...dataLines].join('\r\n');
}

/**
 * Creates a downloadable Blob from CSV data
 * Ensures UTF-8 BOM for proper encoding in Excel
 *
 * @param csv - CSV content string
 * @returns Blob with CSV MIME type and UTF-8 encoding
 */
export function createCSVBlob(csv: string): Blob {
  // Add UTF-8 BOM for proper Excel encoding
  const bom = new Uint8Array([0xef, 0xbb, 0xbf]);
  const encoder = new TextEncoder();
  const encoded = encoder.encode(csv);
  return new Blob([bom, encoded], { type: 'text/csv;charset=utf-8' });
}
