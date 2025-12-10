/**
 * Export action for mind map
 * Exports flattened mind map to CSV and HTML table formats
 * Generates downloadable files with stable IDs and parent path traceability
 */

import { flattenTree } from '../../services/export/flatten';
import { generateCSV, createCSVBlob } from '../../services/export/csv';
import { generateHTMLTable, createHTMLBlob } from '../../services/export/html-table';
import { downloadBlob } from '../../services/storage/file-io';
import type { MindMapNode } from '../../core/types/node';

/**
 * Export options for controlling which formats to export
 */
export interface ExportOptions {
  csv?: boolean;
  html?: boolean;
}

/**
 * Exports the mind map to CSV format
 * Includes all nodes in flat structure with parent path traceability
 *
 * @param mindElixir - The mind-elixir instance
 * @param fileName - Optional custom filename (without extension)
 */
export function exportToCSV(mindElixir: any, fileName?: string): void {
  try {
    // Get current data directly from mind-elixir
    const data = mindElixir.getData();
    if (!data || !data.nodeData) {
      throw new Error('No map data available');
    }

    const root = data.nodeData as MindMapNode;

    // Flatten the tree to exportable rows
    const rows = flattenTree(root);

    // Generate CSV content
    const csv = generateCSV(rows);

    // Create downloadable blob
    const blob = createCSVBlob(csv);

    // Generate filename with timestamp
    const rootLabel = root.topic || 'action-plan';
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const defaultFileName = `${rootLabel.replace(/[^a-zA-Z0-9-_]/g, '_')}-action-plan-${day}-${month}-${year}.csv`;
    const finalFileName = fileName ? `${fileName}.csv` : defaultFileName;

    downloadBlob(blob, finalFileName);
  } catch (error) {
    console.error('Error in exportToCSV:', error);
    throw new Error(
      `Failed to export to CSV: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Exports the mind map to HTML table format
 * Creates a Word-friendly HTML document with formatted table
 *
 * @param mindElixir - The mind-elixir instance
 * @param fileName - Optional custom filename (without extension)
 */
export function exportToHTML(mindElixir: any, fileName?: string): void {
  try {
    // Get current data directly from mind-elixir
    const data = mindElixir.getData();
    if (!data || !data.nodeData) {
      throw new Error('No map data available');
    }

    const root = data.nodeData as MindMapNode;

    // Flatten the tree to exportable rows
    const rows = flattenTree(root);

    // Generate HTML content
    const title = root.topic || 'Action Plan';
    const html = generateHTMLTable(rows, title);

    // Create downloadable blob
    const blob = createHTMLBlob(html);

    // Generate filename with timestamp
    const rootLabel = root.topic || 'action-plan';
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const defaultFileName = `${rootLabel.replace(/[^a-zA-Z0-9-_]/g, '_')}-action-plan-${day}-${month}-${year}.html`;
    const finalFileName = fileName ? `${fileName}.html` : defaultFileName;

    downloadBlob(blob, finalFileName);
  } catch (error) {
    console.error('Error in exportToHTML:', error);
    throw new Error(
      `Failed to export to HTML: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Exports the mind map to both CSV and HTML formats
 * Convenience function to export both formats in sequence
 *
 * @param mindElixir - The mind-elixir instance
 * @param options - Export options (which formats to export)
 */
export function exportMap(mindElixir: any, options: ExportOptions = { csv: true, html: true }): void {
  try {
    if (options.csv) {
      exportToCSV(mindElixir);
    }

    if (options.html) {
      exportToHTML(mindElixir);
    }
  } catch (error) {
    console.error('Error in exportMap:', error);
    throw error;
  }
}
