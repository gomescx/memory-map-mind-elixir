/**
 * Tree flattening service
 * Converts hierarchical mind map to flat ExportRow array with parent path traceability
 * Preserves stable node IDs and maintains depth information
 */

import type { MindMapNode } from '@core/types/node';

/**
 * Represents a single row in the flattened export
 * Includes all planning attributes and parent path for traceability
 */
export interface ExportRow {
  id: string;
  depth: number;
  title: string;
  startDate: string | null;
  dueDate: string | null;
  investedTimeHours: number | null;
  elapsedTimeDays: number | null;
  assignee: string | null;
  status: string | null;
  parentPath: string; // breadcrumbs of ancestor topics, e.g., "Project > Phase 1 > Task A"
}

/**
 * Flattens a tree of nodes into a linear array of ExportRows
 * Maintains stable IDs and tracks parent path for each node
 *
 * @param root - The root node of the mind map
 * @returns Array of ExportRow objects in depth-first order
 */
export function flattenTree(root: MindMapNode): ExportRow[] {
  const rows: ExportRow[] = [];

  function traverse(node: MindMapNode, depth: number, parentPath: string): void {
    // Add current node to rows
    const plan = node.extended?.plan;
    const currentPath = depth === 0 ? node.topic : `${parentPath} > ${node.topic}`;

    rows.push({
      id: node.id,
      depth,
      title: node.topic,
      startDate: plan?.startDate ?? null,
      dueDate: plan?.dueDate ?? null,
      investedTimeHours: plan?.investedTimeHours ?? null,
      elapsedTimeDays: plan?.elapsedTimeDays ?? null,
      assignee: plan?.assignee ?? null,
      status: plan?.status ?? null,
      parentPath: depth === 0 ? '' : parentPath,
    });

    // Recursively process children
    if (node.children && node.children.length > 0) {
      for (const child of node.children) {
        traverse(child, depth + 1, currentPath);
      }
    }
  }

  traverse(root, 0, '');
  return rows;
}

/**
 * Validates that node IDs are stable and unique across multiple flattens
 * Useful for testing and regression checks
 *
 * @param rows1 - First export rows
 * @param rows2 - Second export rows from same map
 * @returns true if all IDs match in same order
 */
export function validateStableIds(rows1: ExportRow[], rows2: ExportRow[]): boolean {
  if (rows1.length !== rows2.length) {
    return false;
  }

  for (let i = 0; i < rows1.length; i++) {
    if (rows1[i].id !== rows2[i].id) {
      return false;
    }
  }

  return true;
}
