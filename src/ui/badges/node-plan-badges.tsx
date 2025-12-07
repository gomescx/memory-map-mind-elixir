/**
 * Node plan badges - inline/badge summary for nodes with plan data
 * Shows status, assignee, and warning indicators on the mind map
 */

import React from 'react';
import type { MindMapNode } from '@core/types/node';
import { hasNodePlanData } from '@core/node-adapter';
import './node-plan-badges.css';

export interface NodePlanBadgesProps {
  node: MindMapNode;
}

/**
 * Check if a task is overdue
 */
function isOverdue(dueDate: string | null): boolean {
  if (!dueDate) return false;
  const due = new Date(dueDate);
  const now = new Date();
  now.setHours(0, 0, 0, 0); // Compare dates only
  return due < now;
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

  const badges: React.ReactNode[] = [];

  // Status badge
  if (plan.status) {
    const statusClass = `badge-status badge-status-${plan.status
      .toLowerCase()
      .replace(/\s+/g, '-')}`;
    badges.push(
      <span key="status" className={statusClass} title={`Status: ${plan.status}`}>
        {plan.status === 'Not Started' && '⭕'}
        {plan.status === 'In Progress' && '⏳'}
        {plan.status === 'Completed' && '✅'}
      </span>
    );
  }

  // Overdue warning
  if (isOverdue(plan.dueDate) && plan.status !== 'Completed') {
    badges.push(
      <span key="overdue" className="badge-warning" title="Overdue!">
        ⚠️
      </span>
    );
  }

  // Assignee badge
  if (plan.assignee) {
    const initials = plan.assignee
      .split(' ')
      .map((n) => n[0]?.toUpperCase())
      .join('')
      .slice(0, 2);
    badges.push(
      <span key="assignee" className="badge-assignee" title={`Assigned to: ${plan.assignee}`}>
        {initials || '👤'}
      </span>
    );
  }

  // Time tracking indicator
  if (plan.investedTimeHours !== null || plan.elapsedTimeDays !== null) {
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
