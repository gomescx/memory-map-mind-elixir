/**
 * Extended node types for planning attributes
 * Maintains backward compatibility with mind-elixir-core nodes
 */

/** Planning attributes stored under node.extended.plan */
export interface PlanAttributes {
  startDate: string | null;
  dueDate: string | null;
  investedTimeHours: number | null;
  elapsedTimeDays: number | null;
  assignee: string | null;
  status: PlanStatus | null;
}

/** Status enum for plan fields */
export type PlanStatus = 'Not Started' | 'In Progress' | 'Completed';

/** Extended fields on a node */
export interface Extended {
  plan?: PlanAttributes;
}

/** Mind-elixir-core node structure with extended attributes */
export interface MindMapNode {
  id: string;
  topic: string;
  children?: MindMapNode[];
  expanded?: boolean;
  style?: Record<string, any>;
  tags?: string[];
  extended?: Extended;
}

/** Top-level mind map structure */
export interface MindMap {
  id: string;
  title: string;
  version: string;
  root: MindMapNode;
}

/** Versioned file format with metadata */
export interface SavedMapEnvelope {
  version: string;
  data: MindMap;
}

/** Creates default plan attributes (all null) */
export function createDefaultPlanAttributes(): PlanAttributes {
  return {
    startDate: null,
    dueDate: null,
    investedTimeHours: null,
    elapsedTimeDays: null,
    assignee: null,
    status: null,
  };
}

/** Gets plan attributes from a node, creating defaults if missing */
export function getPlanAttributes(node: MindMapNode): PlanAttributes {
  if (!node.extended?.plan) {
    return createDefaultPlanAttributes();
  }
  return node.extended.plan;
}

/** Sets plan attributes on a node, creating extended structure if needed */
export function setPlanAttributes(
  node: MindMapNode,
  plan: Partial<PlanAttributes>
): MindMapNode {
  return {
    ...node,
    extended: {
      ...node.extended,
      plan: {
        ...getPlanAttributes(node),
        ...plan,
      },
    },
  };
}
