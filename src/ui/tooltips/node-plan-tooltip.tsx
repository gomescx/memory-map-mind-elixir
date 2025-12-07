/**
 * Node plan tooltip - hover/selection tooltip summarizing plan fields
 * Shows detailed planning information when hovering over or selecting nodes
 */

import React from 'react';
import type { MindMapNode } from '@core/types/node';
import { hasNodePlanData } from '@core/node-adapter';
import './node-plan-tooltip.css';

export interface NodePlanTooltipProps {
  node: MindMapNode;
  show: boolean;
}

/**
 * Format hours for display (e.g., "5h" or "1.5h")
 */
function formatHours(hours: number): string {
  return hours % 1 === 0 ? `${hours}h` : `${hours.toFixed(1)}h`;
}

/**
 * Format days for display (e.g., "5d" or "1.5d")
 */
function formatDays(days: number): string {
  return days % 1 === 0 ? `${days}d` : `${days.toFixed(1)}d`;
}

/**
 * Format date for display
 */
function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
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

  const rows: React.ReactNode[] = [];

  // Status
  if (plan.status) {
    rows.push(
      <div key="status" className="tooltip-row">
        <span className="tooltip-label">Status:</span>
        <span className="tooltip-value">{plan.status}</span>
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
    rows.push(
      <div key="due" className="tooltip-row">
        <span className="tooltip-label">Due:</span>
        <span className="tooltip-value">{formatDate(plan.dueDate)}</span>
      </div>
    );
  }

  // Time tracking
  if (plan.investedTimeHours !== null || plan.elapsedTimeDays !== null) {
    rows.push(
      <div key="time" className="tooltip-row">
        <span className="tooltip-label">Time:</span>
        <span className="tooltip-value">
          {plan.elapsedTimeDays !== null && formatDays(plan.elapsedTimeDays)}
          {plan.investedTimeHours !== null &&
            plan.elapsedTimeDays !== null &&
            ' / '}
          {plan.investedTimeHours !== null && formatHours(plan.investedTimeHours)}
          {plan.elapsedTimeDays !== null && plan.investedTimeHours !== null
            ? ' (elapsed/invested)'
            : plan.elapsedTimeDays !== null
            ? ' elapsed'
            : ' invested'}
        </span>
      </div>
    );
  }

  // Assignee
  if (plan.assignee) {
    rows.push(
      <div key="assignee" className="tooltip-row">
        <span className="tooltip-label">Assignee:</span>
        <span className="tooltip-value">{plan.assignee}</span>
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
