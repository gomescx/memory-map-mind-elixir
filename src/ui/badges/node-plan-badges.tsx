/**
 * Node plan badges - inline/badge summary for nodes with plan data
 * Shows status, assignee, and warning indicators on the mind map
 */

import React from 'react';
import type { MindMapNode } from '@core/types/node';
import { hasNodePlanData } from '@core/node-adapter';
import { getAllPlanFlags } from '@utils/plan-status';
import './node-plan-badges.css';

export interface NodePlanBadgesProps {
  node: MindMapNode;
}

/**
 * Render badges for a node with plan data
 */
export const NodePlanBadges: React.FC<NodePlanBadgesProps> = ({ node }) => {
  if (!hasNodePlanData(node)) {
    return null;
  }

  const plan = node.extended?.plan;
  if (!plan) {
    return null;
  }

  const flags = getAllPlanFlags(plan);
  const badges: React.ReactNode[] = [];

  // Status badge
  if (flags.status.hasStatus) {
    const statusClass = `badge-status badge-status-${flags.status.status
      ?.toLowerCase()
      .replace(/\s+/g, '-')}`;
    badges.push(
      <span key="status" className={statusClass} title={`Status: ${flags.status.status}`}>
        {flags.status.isNotStarted && '⭕'}
        {flags.status.isInProgress && '⏳'}
        {flags.status.isCompleted && '✅'}
      </span>
    );
  }

  // Overdue warning
  if (flags.overdue.isOverdue) {
    const overdueMsg = `Overdue by ${flags.overdue.daysOverdue} day${
      flags.overdue.daysOverdue !== 1 ? 's' : ''
    }`;
    badges.push(
      <span key="overdue" className="badge-warning" title={overdueMsg}>
        ⚠️
      </span>
    );
  }

  // Assignee badge
  if (flags.assignee.hasAssignee) {
    badges.push(
      <span
        key="assignee"
        className="badge-assignee"
        title={`Assigned to: ${flags.assignee.assignee}`}
      >
        {flags.assignee.initials}
      </span>
    );
  }

  // Time tracking indicator
  if (flags.time.hasTimeTracking) {
    badges.push(
      <span key="time" className="badge-time" title="Time tracked">
        ⏱️
      </span>
    );
  }

  if (badges.length === 0) {
    return null;
  }

  return <div className="node-plan-badges">{badges}</div>;
};
