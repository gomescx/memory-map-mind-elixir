/**
 * Table view component for displaying mind map nodes in tabular format
 * Synchronized with mindmap view for bidirectional editing
 */

import React, { useMemo } from 'react';
import { useAppStore } from '@state/store';
import { flattenByDepth, type FlatNode } from '@/utils/tree/depth-traversal';
import { getNodePlanAttributes } from '@core/node-adapter';
import type { MindMapNode } from '@core/types/node';
import './table-view.css';

export const TableView: React.FC = () => {
  const { getMindElixirInstance, depthFilter } = useAppStore();

  // Get flattened nodes in depth-first order
  const flatNodes = useMemo(() => {
    const meInstance = getMindElixirInstance();
    if (!meInstance) return [];

    const rootData: MindMapNode = meInstance.getData();
    return flattenByDepth(rootData, depthFilter);
  }, [getMindElixirInstance, depthFilter]);

  // Format cell value (show "--" for null/undefined)
  const formatCell = (value: string | number | null | undefined): string => {
    if (value === null || value === undefined || value === '') return '--';
    return String(value);
  };

  return (
    <div className="table-view">
      <table className="mind-map-table">
        <thead>
          <tr>
            <th>Sequence</th>
            <th>Name</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Due Date</th>
            <th>Assignee</th>
            <th>Est. Hours</th>
            <th>Inv. Hours</th>
            <th>Depth</th>
          </tr>
        </thead>
        <tbody>
          {flatNodes.map((flatNode: FlatNode, index: number) => {
            const plan = getNodePlanAttributes(flatNode.node);
            return (
              <tr key={flatNode.id}>
                <td>{index + 1}</td>
                <td>{flatNode.node.topic}</td>
                <td>{formatCell(plan.status)}</td>
                <td>{formatCell(null)}</td> {/* Priority not in current data model */}
                <td>{formatCell(plan.dueDate)}</td>
                <td>{formatCell(plan.assignee)}</td>
                <td>{formatCell(plan.elapsedTimeDays)}</td>
                <td>{formatCell(plan.investedTimeHours)}</td>
                <td>{flatNode.depth}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
