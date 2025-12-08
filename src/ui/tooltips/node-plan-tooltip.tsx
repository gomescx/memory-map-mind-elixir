/**
 * Node plan tooltip - hover/selection tooltip summarizing plan fields
 * Shows detailed planning information when hovering over or selecting nodes
 */

import React from 'react';
import type { MindMapNode } from '@core/types/node';
import { hasNodePlanData } from '@core/node-adapter';
import {
  getAllPlanFlags,
  formatDate,
  formatHours,
  formatDays,
} from '@utils/plan-status';
import './node-plan-tooltip.css';

export interface NodePlanTooltipProps {
  node: MindMapNode;
  show: boolean;
}

/**
 * Render tooltip with plan details
 */
export const NodePlanTooltip: React.FC<NodePlanTooltipProps> = ({ node, show }) => {
  if (!show || !hasNodePlanData(node)) {
    return null;
  }

  const plan = node.extended?.plan;
  if (!plan) {
    return null;
  }

  const flags = getAllPlanFlags(plan);
  const rows: React.ReactNode[] = [];

  // Status
  if (flags.status.hasStatus) {
    rows.push(
      <div key="status" className="tooltip-row">
        <span className="tooltip-label">Status:</span>
        <span className="tooltip-value">{flags.status.status}</span>
      </div>
    );
  }

  // Dates
  if (plan.startDate) {
    rows.push(
      <div key="start" className="tooltip-row">
        <span className="tooltip-label">Start:</span>
        <span className="tooltip-value">{formatDate(plan.startDate)}</span>
      </div>
    );
  }

  if (plan.dueDate) {
    const dueDateDisplay = formatDate(plan.dueDate);
    const overdueWarning = flags.overdue.isOverdue
      ? ` (⚠️ ${flags.overdue.daysOverdue}d overdue)`
      : '';
    rows.push(
      <div key="due" className="tooltip-row">
        <span className="tooltip-label">Due:</span>
        <span className="tooltip-value">
          {dueDateDisplay}
          {overdueWarning}
        </span>
      </div>
    );
  }

  // Time tracking
  if (flags.time.hasTimeTracking) {
    const timeDisplay: string[] = [];
    if (flags.time.hasElapsedTime && flags.time.elapsedTimeDays !== null) {
      timeDisplay.push(`${formatDays(flags.time.elapsedTimeDays)} elapsed`);
    }
    if (flags.time.hasInvestedTime && flags.time.investedTimeHours !== null) {
      timeDisplay.push(`${formatHours(flags.time.investedTimeHours)} invested`);
    }
    rows.push(
      <div key="time" className="tooltip-row">
        <span className="tooltip-label">Time:</span>
        <span className="tooltip-value">{timeDisplay.join(' / ')}</span>
      </div>
    );
  }

  // Assignee
  if (flags.assignee.hasAssignee) {
    rows.push(
      <div key="assignee" className="tooltip-row">
        <span className="tooltip-label">Assignee:</span>
        <span className="tooltip-value">{flags.assignee.assignee}</span>
      </div>
    );
  }

  if (rows.length === 0) {
    return null;
  }

  return (
    <div className="node-plan-tooltip">
      <div className="tooltip-header">Planning Details</div>
      <div className="tooltip-content">{rows}</div>
    </div>
  );
};
