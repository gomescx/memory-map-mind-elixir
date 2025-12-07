/**
 * Example integration demonstrating User Story 1 functionality
 * Shows how to use plan panel, badges, tooltips, and shortcuts together
 * 
 * This file serves as documentation and can be adapted to main App.tsx
 */

import React, { useState } from 'react';
import { AppStoreProvider } from '@state/store';
import { PlanPanel } from '@ui/panels/plan-panel';
import { usePlanPanelHotkey, PlanPanelToggleButton } from '@ui/shortcuts/plan-panel';
import { NodePlanBadges } from '@ui/badges/node-plan-badges';
import { NodePlanTooltip } from '@ui/tooltips/node-plan-tooltip';
import type { MindMapNode } from '@core/types/node';

/**
 * Example Node Display Component
 * Demonstrates how to render a node with badges and tooltips
 */
interface NodeDisplayProps {
  node: MindMapNode;
  isSelected: boolean;
  onSelect: () => void;
}

const NodeDisplay: React.FC<NodeDisplayProps> = ({ node, isSelected, onSelect }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className={`node-item ${isSelected ? 'selected' : ''}`}
      onClick={onSelect}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      style={{
        padding: '8px',
        margin: '4px',
        border: isSelected ? '2px solid #4a90e2' : '1px solid #ccc',
        borderRadius: '4px',
        cursor: 'pointer',
        position: 'relative',
      }}
    >
      <span>{node.topic}</span>
      <NodePlanBadges node={node} />
      {showTooltip && <NodePlanTooltip node={node} show={showTooltip} />}
    </div>
  );
};

/**
 * Example App Component with User Story 1 Features
 * 
 * Features demonstrated:
 * - Node selection
 * - Plan panel (side panel for editing)
 * - Keyboard shortcuts (Ctrl+P / Cmd+P)
 * - Plan badges on nodes
 * - Tooltips on hover
 */
export const US1ExampleApp: React.FC = () => {
  // Register plan panel hotkey
  usePlanPanelHotkey();

  // Example nodes with and without plan data
  const exampleNodes: MindMapNode[] = [
    {
      id: 'node-1',
      topic: 'Project Setup',
      extended: {
        plan: {
          startDate: '2025-12-01',
          dueDate: '2025-12-07',
          investedTimeHours: 10,
          elapsedTimeDays: 8,
          assignee: 'John Doe',
          status: 'In Progress',
        },
      },
    },
    {
      id: 'node-2',
      topic: 'Write Documentation',
      extended: {
        plan: {
          startDate: '2025-12-05',
          dueDate: '2025-12-10',
          investedTimeHours: 5,
          elapsedTimeDays: 2,
          assignee: 'Jane Smith',
          status: 'Not Started',
        },
      },
    },
    {
      id: 'node-3',
      topic: 'Testing',
      extended: {
        plan: {
          startDate: '2025-11-25',
          dueDate: '2025-11-30',
          investedTimeHours: 8,
          elapsedTimeDays: 10,
          assignee: 'Bob Wilson',
          status: 'Completed',
        },
      },
    },
    {
      id: 'node-4',
      topic: 'Node Without Planning Data',
    },
  ];

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
        <h1>User Story 1: Planning Attributes Demo</h1>
        
        <div style={{ marginBottom: '20px' }}>
          <h2>Instructions</h2>
          <ul>
            <li>Click on a node to select it</li>
            <li>Press <kbd>Ctrl+P</kbd> (or <kbd>Cmd+P</kbd> on Mac) to open the plan panel</li>
            <li>Or use the "Plan" button when a node is selected</li>
            <li>Hover over nodes to see tooltip with plan details</li>
            <li>Notice the badges showing status, assignee, and warnings</li>
          </ul>
          
          <PlanPanelToggleButton className="plan-button" />
        </div>

        <div>
          <h2>Example Nodes</h2>
          {exampleNodes.map((node) => (
            <NodeDisplay
              key={node.id}
              node={node}
              isSelected={selectedNodeId === node.id}
              onSelect={() => setSelectedNodeId(node.id)}
            />
          ))}
        </div>
      </div>

      <PlanPanel />
    </div>
  );
};

/**
 * Wrapper with Store Provider
 * This shows the complete integration including state management
 */
export const US1ExampleWithStore: React.FC = () => {
  return (
    <AppStoreProvider>
      <US1ExampleApp />
    </AppStoreProvider>
  );
};

export default US1ExampleWithStore;
