/**
 * HTML table export generator
 * Converts flattened export rows to Word-friendly HTML table format
 * Can be opened in MS Word, Google Docs, or any application supporting HTML tables
 */

import type { ExportRow } from './flatten';

/**
 * Escapes HTML special characters to prevent injection/rendering issues
 */
function escapeHTML(text: string | null | undefined): string {
  if (text === null || text === undefined) {
    return '';
  }

  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };

  return String(text).replace(/[&<>"']/g, (char) => map[char]);
}

/**
 * Formats a cell value for display in the table
 * Shows 'N/A' for null values for better readability
 */
function formatCellValue(value: string | number | null | undefined): string {
  if (value === null || value === undefined) {
    return 'N/A';
  }

  return escapeHTML(String(value));
}

/**
 * Creates an HTML table row from an ExportRow
 * Applies subtle indentation styling based on depth for visual hierarchy
 */
function createTableRow(row: ExportRow): string {
  const indentStyle = `padding-left: ${row.depth * 20}px;`;

  const cells = [
    `<td>${escapeHTML(row.id)}</td>`,
    `<td>${row.depth}</td>`,
    `<td style="${indentStyle}">${escapeHTML(row.title)}</td>`,
    `<td>${formatCellValue(row.startDate)}</td>`,
    `<td>${formatCellValue(row.dueDate)}</td>`,
    `<td>${formatCellValue(row.investedTimeHours)}</td>`,
    `<td>${formatCellValue(row.elapsedTimeDays)}</td>`,
    `<td>${formatCellValue(row.assignee)}</td>`,
    `<td>${formatCellValue(row.status)}</td>`,
    `<td>${escapeHTML(row.parentPath)}</td>`,
  ];

  return `<tr>\n    ${cells.join('\n    ')}\n  </tr>`;
}

/**
 * Generates a complete HTML document with a formatted table
 * Includes CSS for better presentation and Word compatibility
 *
 * @param rows - Array of ExportRow objects
 * @param title - Optional title for the document and table
 * @returns Complete HTML string
 */
export function generateHTMLTable(rows: ExportRow[], title: string = 'Action Plan'): string {
  const headerCells = [
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

  const headerRow = `<tr>\n    ${headerCells
    .map((cell) => `<th>${escapeHTML(cell)}</th>`)
    .join('\n    ')}\n  </tr>`;

  const dataRows = rows.map(createTableRow).join('\n');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHTML(title)}</title>
  <style>
    body {
      font-family: Calibri, Arial, sans-serif;
      margin: 20px;
      color: #333;
    }
    h1 {
      margin-top: 0;
      color: #2c3e50;
      font-size: 24px;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      margin-top: 20px;
      border: 1px solid #ddd;
    }
    th {
      background-color: #34495e;
      color: white;
      padding: 12px;
      text-align: left;
      font-weight: bold;
      border: 1px solid #ddd;
    }
    td {
      padding: 10px 12px;
      border: 1px solid #ddd;
    }
    tr:nth-child(even) {
      background-color: #f8f9fa;
    }
    tr:hover {
      background-color: #f0f0f0;
    }
    .footer {
      margin-top: 30px;
      font-size: 12px;
      color: #7f8c8d;
      border-top: 1px solid #ddd;
      padding-top: 15px;
    }
  </style>
</head>
<body>
  <h1>${escapeHTML(title)}</h1>
  <table>
    <thead>
      ${headerRow}
    </thead>
    <tbody>
      ${dataRows}
    </tbody>
  </table>
  <div class="footer">
    <p>Generated from Memory Map Action Planner</p>
  </div>
</body>
</html>`;

  return html;
}

/**
 * Creates a downloadable Blob from HTML table data
 *
 * @param html - HTML content string
 * @returns Blob with HTML MIME type
 */
export function createHTMLBlob(html: string): Blob {
  return new Blob([html], { type: 'text/html;charset=utf-8' });
}
