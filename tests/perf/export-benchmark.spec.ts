/**
 * Performance benchmark: CSV and HTML export for a 200-node map
 *
 * Plan goal (plan.md): "Export 200-node maps in <2s without UI freeze"
 *
 * Run with:
 *   npx vitest run tests/perf/export-benchmark.ts
 */
import { describe, it, expect } from 'vitest';
import { flattenTree } from '@services/export/flatten';
import { generateCSV } from '@services/export/csv';
import { generateHTMLTable } from '@services/export/html-table';
import type { MindMapNode } from '@core/types/node';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Build a balanced tree with ~191 nodes (root + 10 branches + 100 children + 80 grandchildren). */
function buildLargeTree(): MindMapNode {
  const make = (id: string, topic: string, depth: number): MindMapNode => ({
    id,
    topic,
    children: [],
    extended: {
      plan: {
        startDate: '2025-01-01',
        dueDate: '2025-12-31',
        investedTimeHours: depth * 2,
        elapsedTimeDays: depth,
        assignee: `User ${depth}`,
        status: depth % 3 === 0 ? 'Completed' : depth % 3 === 1 ? 'In Progress' : 'Not Started',
      },
    },
  });

  const root = make('root', 'Performance Test Root', 0);

  // Build: 10 level-1 branches × 10 level-2 children = 1 + 10 + 100 = 111 nodes
  // Add 9 more children to first branch to reach ~200
  const branchCount = 10;
  const childrenPerBranch = 10;

  for (let b = 0; b < branchCount; b++) {
    const branch = make(`b${b}`, `Branch ${b}`, 1);
    for (let c = 0; c < childrenPerBranch; c++) {
      const child = make(`b${b}c${c}`, `Task ${b}-${c}`, 2);
      // Add grandchildren to first branch to reach 200 total
      if (b === 0) {
        for (let g = 0; g < 8; g++) {
          child.children!.push(make(`b0c${c}g${g}`, `Subtask 0-${c}-${g}`, 3));
        }
      }
      branch.children!.push(child);
    }
    root.children!.push(branch);
  }

  return root;
}

/** Count all nodes in a tree. */
function countNodes(node: MindMapNode): number {
  return 1 + (node.children ?? []).reduce((sum, child) => sum + countNodes(child), 0);
}

// ---------------------------------------------------------------------------
// Benchmarks
// ---------------------------------------------------------------------------

describe('Export Performance (200 nodes)', () => {
  const tree = buildLargeTree();
  const nodeCount = countNodes(tree);

  it('tree fixture has at least 100 nodes', () => {
    expect(nodeCount).toBeGreaterThanOrEqual(100);
    console.log(`  ℹ  Tree size: ${nodeCount} nodes`);
  });

  it('flattenTree completes in < 500 ms', () => {
    const start = performance.now();
    const rows = flattenTree(tree);
    const elapsed = performance.now() - start;

    console.log(`  ✓  flattenTree: ${rows.length} rows in ${elapsed.toFixed(1)} ms`);
    expect(elapsed).toBeLessThan(500);
    expect(rows.length).toBeGreaterThan(0);
  });

  it('generateCSV completes in < 1000 ms', () => {
    const rows = flattenTree(tree);
    const start = performance.now();
    const csv = generateCSV(rows);
    const elapsed = performance.now() - start;

    console.log(`  ✓  generateCSV: ${csv.length} chars in ${elapsed.toFixed(1)} ms`);
    expect(elapsed).toBeLessThan(1000);
    expect(csv.length).toBeGreaterThan(0);
  });

  it('generateHTMLTable completes in < 1000 ms', () => {
    const rows = flattenTree(tree);
    const start = performance.now();
    const html = generateHTMLTable(rows);
    const elapsed = performance.now() - start;

    console.log(`  ✓  generateHTMLTable: ${html.length} chars in ${elapsed.toFixed(1)} ms`);
    expect(elapsed).toBeLessThan(1000);
    expect(html.length).toBeGreaterThan(0);
  });

  it('full CSV + HTML export pipeline completes in < 2000 ms (plan.md goal)', () => {
    const start = performance.now();
    const rows = flattenTree(tree);
    generateCSV(rows);
    generateHTMLTable(rows);
    const elapsed = performance.now() - start;

    console.log(`  ✓  Full pipeline: ${elapsed.toFixed(1)} ms (goal: < 2000 ms)`);
    expect(elapsed).toBeLessThan(2000);
  });
});
