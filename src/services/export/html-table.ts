/**
 * HTML table export generator
 * Converts flattened export rows to Word-friendly HTML table format
 * Can be opened in MS Word, Google Docs, or any application supporting HTML tables
 */

import type { ExportRow } from './flatten';
import { formatDateDDMMMYYYY } from '@/utils/date-format';

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
 * Shows empty string for null values
 */
function formatCellValue(value: string | number | null | undefined, isDate: boolean = false): string {
  if (value === null || value === undefined) {
    return '';
  }

  if (isDate && typeof value === 'string') {
    return escapeHTML(formatDateDDMMMYYYY(value) ?? value);
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
    `<td data-col="0">${escapeHTML(row.id)}</td>`,
    `<td data-col="1">${row.depth}</td>`,
    `<td data-col="2" style="${indentStyle}">${escapeHTML(row.title)}</td>`,
    `<td data-col="3">${formatCellValue(row.startDate, true)}</td>`,
    `<td data-col="4">${formatCellValue(row.dueDate, true)}</td>`,
    `<td data-col="5">${formatCellValue(row.investedTimeHours)}</td>`,
    `<td data-col="6">${formatCellValue(row.elapsedTimeDays)}</td>`,
    `<td data-col="7">${formatCellValue(row.assignee)}</td>`,
    `<td data-col="8">${formatCellValue(row.status)}</td>`,
    `<td data-col="9">${escapeHTML(row.parentPath)}</td>`,
  ];

  return `<tr>\n    ${cells.join('\n    ')}\n  </tr>`;
}

/**
 * Calculates summary statistics from export rows
 */
function calculateTotals(rows: ExportRow[]): {
  depthCounts: string;
  minStartDate: string;
  maxDueDate: string;
  totalInvestedTime: number;
  totalElapsedTime: number;
  uniqueAssignees: number;
  statusCounts: string;
} {
  // Count nodes per depth level
  const depthMap = new Map<number, number>();
  rows.forEach(row => {
    depthMap.set(row.depth, (depthMap.get(row.depth) || 0) + 1);
  });
  const depthCounts = Array.from(depthMap.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([depth, count]) => `${depth}:${count}`)
    .join(', ');

  // Find min start date (not blank)
  const startDates = rows
    .map(r => r.startDate)
    .filter((d): d is string => d !== null && d !== undefined && d !== '');
  const minStartDate = startDates.length > 0 
    ? startDates.sort()[0] 
    : '';

  // Find max due date (not blank)
  const dueDates = rows
    .map(r => r.dueDate)
    .filter((d): d is string => d !== null && d !== undefined && d !== '');
  const maxDueDate = dueDates.length > 0 
    ? dueDates.sort().reverse()[0] 
    : '';

  // Sum invested time
  const totalInvestedTime = rows.reduce((sum, row) => {
    return sum + (row.investedTimeHours || 0);
  }, 0);

  // Sum elapsed time
  const totalElapsedTime = rows.reduce((sum, row) => {
    return sum + (row.elapsedTimeDays || 0);
  }, 0);

  // Count unique assignees (not blank)
  const assignees = new Set(
    rows
      .map(r => r.assignee)
      .filter((a): a is string => a !== null && a !== undefined && a !== '')
  );
  const uniqueAssignees = assignees.size;

  // Count status by type
  const statusMap = new Map<string, number>();
  rows.forEach(row => {
    if (row.status) {
      statusMap.set(row.status, (statusMap.get(row.status) || 0) + 1);
    }
  });
  const statusCounts = Array.from(statusMap.entries())
    .map(([status, count]) => `${status}: ${count}`)
    .join(', ');

  return {
    depthCounts,
    minStartDate,
    maxDueDate,
    totalInvestedTime,
    totalElapsedTime,
    uniqueAssignees,
    statusCounts,
  };
}

/**
 * Creates a totals row for the HTML table
 */
function createTotalsRow(rows: ExportRow[]): string {
  const totals = calculateTotals(rows);

  const cells = [
    `<td data-col="0"><strong>TOTALS</strong></td>`,
    `<td data-col="1"><strong>${escapeHTML(totals.depthCounts)}</strong></td>`,
    `<td data-col="2"><strong>Nodes per level: ${escapeHTML(totals.depthCounts)}</strong></td>`,
    `<td data-col="3"><strong>${escapeHTML(formatDateDDMMMYYYY(totals.minStartDate) ?? '')}</strong></td>`,
    `<td data-col="4"><strong>${escapeHTML(formatDateDDMMMYYYY(totals.maxDueDate) ?? '')}</strong></td>`,
    `<td data-col="5"><strong>${totals.totalInvestedTime}</strong></td>`,
    `<td data-col="6"><strong>${totals.totalElapsedTime}</strong></td>`,
    `<td data-col="7"><strong>${totals.uniqueAssignees}</strong></td>`,
    `<td data-col="8"><strong>${escapeHTML(totals.statusCounts)}</strong></td>`,
    `<td data-col="9"></td>`,
  ];

  return `<tr style="background-color: #e8f4f8; font-weight: bold;">\n    ${cells.join('\n    ')}\n  </tr>`;
}

/**
 * Generates a complete HTML document with a formatted table
 * Includes CSS for better presentation and Word compatibility
 * Includes an interactive "Filter Columns" panel that allows users to
 * show/hide individual columns; hidden columns are listed below the table.
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
    'Invested Time',
    'Elapsed Time',
    'Assignee',
    'Status',
    'Parent Path',
  ];

  const headerRow = `<tr>\n    ${headerCells
    .map((cell, index) => `<th data-col="${index}">${escapeHTML(cell)}</th>`)
    .join('\n    ')}\n  </tr>`;

  const dataRows = rows.map(createTableRow).join('\n');
  const totalsRow = createTotalsRow(rows);

  const filterCheckboxes = headerCells
    .map(
      (name, index) =>
        `<label class="filter-label"><input type="checkbox" class="col-toggle" data-col-index="${index}" data-col-name="${escapeHTML(name)}" checked onchange="updateColumnVisibility()"> ${escapeHTML(name)}</label>`
    )
    .join('\n        ');

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
    .filter-controls {
      margin-bottom: 10px;
    }
    .filter-btn {
      background-color: #34495e;
      color: white;
      border: none;
      padding: 8px 14px;
      cursor: pointer;
      border-radius: 4px;
      font-size: 14px;
    }
    .filter-btn:hover {
      background-color: #2c3e50;
    }
    .filter-panel {
      margin-top: 10px;
      padding: 12px 16px;
      background-color: #f8f9fa;
      border: 1px solid #ddd;
      border-radius: 4px;
      display: inline-block;
    }
    .filter-hint {
      margin: 0 0 8px 0;
      font-size: 13px;
      color: #555;
    }
    .filter-checkboxes {
      display: flex;
      flex-wrap: wrap;
      gap: 8px 20px;
    }
    .filter-label {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 14px;
      cursor: pointer;
      white-space: nowrap;
    }
    .hidden-columns-note {
      margin-top: 16px;
      padding: 10px 14px;
      background-color: #fff8e1;
      border-left: 4px solid #f39c12;
      font-size: 13px;
      color: #555;
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
  <div class="filter-controls">
    <button class="filter-btn" onclick="toggleFilterPanel()" title="Select which columns to show or hide in the table">🔧 Filter Columns</button>
    <div id="column-filter-panel" style="display:none;" class="filter-panel">
      <p class="filter-hint">Check to show a column; uncheck to hide it.</p>
      <div class="filter-checkboxes">
        ${filterCheckboxes}
      </div>
    </div>
  </div>
  <table>
    <thead>
      ${headerRow}
    </thead>
    <tbody>
      ${dataRows}
      ${totalsRow}
    </tbody>
  </table>
  <div id="hidden-columns-section" class="hidden-columns-note" style="display:none;">
    <strong>Hidden columns:</strong> <span id="hidden-columns-list"></span>
  </div>
  <div class="footer">
    <p>Generated from Memory Map Action Planner</p>
  </div>
  <script>
    function toggleFilterPanel() {
      var panel = document.getElementById('column-filter-panel');
      panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    }

    function updateColumnVisibility() {
      var checkboxes = document.querySelectorAll('.col-toggle');
      var hiddenColumns = [];

      checkboxes.forEach(function(checkbox) {
        var colIndex = checkbox.getAttribute('data-col-index');
        var colName = checkbox.getAttribute('data-col-name');
        var visible = checkbox.checked;

        document.querySelectorAll('[data-col="' + colIndex + '"]').forEach(function(cell) {
          cell.style.display = visible ? '' : 'none';
        });

        if (!visible) {
          hiddenColumns.push(colName);
        }
      });

      var hiddenSection = document.getElementById('hidden-columns-section');
      var hiddenList = document.getElementById('hidden-columns-list');

      if (hiddenColumns.length > 0) {
        hiddenSection.style.display = 'block';
        hiddenList.textContent = hiddenColumns.join(', ');
      } else {
        hiddenSection.style.display = 'none';
      }
    }
  </script>
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
