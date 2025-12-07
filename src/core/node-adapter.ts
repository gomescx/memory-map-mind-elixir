/**
 * Mind-elixir node adapter for reading/writing extended.plan attributes
 * Ensures backward compatibility with core mind-elixir nodes
 */

import type { MindMapNode, PlanAttributes } from './types/node';
import { createDefaultPlanAttributes } from './types/node';

/**
 * Get plan attributes from a node (creates default if missing)
 * @param node Mind map node
 * @returns Plan attributes with all fields populated (null or values)
 */
export function getNodePlanAttributes(node: MindMapNode): PlanAttributes {
  if (!node.extended?.plan) {
    return createDefaultPlanAttributes();
  }
  // Return existing attributes, filling in any missing fields with defaults
  const defaults = createDefaultPlanAttributes();
  return { ...defaults, ...node.extended.plan };
}

/**
 * Set plan attributes on a node (creates extended namespace if missing)
 * @param node Mind map node to update
 * @param plan Partial or full plan attributes
 * @returns Updated node (mutates in place for simplicity)
 */
export function setNodePlanAttributes(
  node: MindMapNode,
  plan: Partial<PlanAttributes>
): MindMapNode {
  if (!node.extended) {
    node.extended = {};
  }
  if (!node.extended.plan) {
    node.extended.plan = createDefaultPlanAttributes();
  }
  
  // Merge provided attributes with existing ones
  node.extended.plan = {
    ...node.extended.plan,
    ...plan,
  };
  
  return node;
}

/**
 * Check if a node has any non-null plan attributes
 * @param node Mind map node
 * @returns True if node has at least one populated plan field
 */
export function hasNodePlanData(node: MindMapNode): boolean {
  if (!node.extended?.plan) {
    return false;
  }
  
  const plan = node.extended.plan;
  return (
    plan.startDate !== null ||
    plan.dueDate !== null ||
    plan.investedTimeHours !== null ||
    plan.elapsedTimeDays !== null ||
    plan.assignee !== null ||
    plan.status !== null
  );
}

/**
 * Clear all plan attributes from a node
 * @param node Mind map node
 * @returns Updated node (mutates in place)
 */
export function clearNodePlanAttributes(node: MindMapNode): MindMapNode {
  if (node.extended?.plan) {
    node.extended.plan = createDefaultPlanAttributes();
  }
  return node;
}
