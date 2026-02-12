/**
 * Table view component for displaying mind map nodes in tabular format
 * Synchronized with mindmap view for bidirectional editing
 */

import React, { useMemo, useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useAppStore } from '@state/store';
import { flattenByDepth, type FlatNode } from '@/utils/tree/depth-traversal';
import { getNodePlanAttributes } from '@core/node-adapter';
import type { MindMapNode } from '@core/types/node';
import { EditableTextCell } from '@ui/table/editable-text-cell';
import './table-view.css';

interface SortableRowProps {
  flatNode: FlatNode;
  index: number;
  formatCell: (value: string | number | null | undefined) => string;
  onUpdateNodeTopic: (nodeId: string, topic: string) => void;
  onUpdateAssignee: (nodeId: string, assignee: string) => void;
}

function SortableRow({ 
  flatNode, 
  index, 
  formatCell,
  onUpdateNodeTopic,
  onUpdateAssignee,
}: SortableRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: flatNode.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const plan = getNodePlanAttributes(flatNode.node);

  return (
    <tr ref={setNodeRef} style={style} className={isDragging ? 'dragging' : ''}>
      <td>
        <span {...attributes} {...listeners} className="drag-handle">
          ⋮⋮
        </span>
      </td>
      <td>{index + 1}</td>
      <td>
        <EditableTextCell
          value={flatNode.node.topic}
          onSave={(newValue) => onUpdateNodeTopic(flatNode.id, newValue)}
          maxLength={200}
        />
      </td>
      <td>{formatCell(plan.status)}</td>
      <td>{formatCell(null)}</td>
      <td>{formatCell(plan.dueDate)}</td>
      <td>
        <EditableTextCell
          value={plan.assignee}
          onSave={(newValue) => onUpdateAssignee(flatNode.id, newValue)}
          maxLength={100}
        />
      </td>
      <td>{formatCell(plan.elapsedTimeDays)}</td>
      <td>{formatCell(plan.investedTimeHours)}</td>
      <td>{flatNode.depth}</td>
    </tr>
  );
}

export const TableView: React.FC = () => {
  const { getMindElixirInstance, depthFilter, updateNodeSequence, updateNodePlan } = useAppStore();
  const [items, setItems] = useState<FlatNode[]>([]);

  // Get flattened nodes in depth-first order
  const flatNodes = useMemo(() => {
    const meInstance = getMindElixirInstance();
    if (!meInstance) return [];

    const rootData: MindMapNode = meInstance.getData();
    const flattened = flattenByDepth(rootData, depthFilter);
    setItems(flattened);
    return flattened;
  }, [getMindElixirInstance, depthFilter]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        // Update local state for immediate visual feedback
        const newItems = arrayMove(items, oldIndex, newIndex);
        setItems(newItems);

        // Update mind-elixir data model
        const node = items[oldIndex];
        if (node.parentId) {
          updateNodeSequence(node.id, node.parentId, newIndex);
        }
      }
    }
  };

  const handleUpdateNodeTopic = (nodeId: string, newTopic: string) => {
    const meInstance = getMindElixirInstance();
    if (!meInstance) return;

    const data = meInstance.getData();
    const findAndUpdateNode = (node: any): boolean => {
      if (node.id === nodeId) {
        node.topic = newTopic;
        return true;
      }
      if (node.children) {
        for (const child of node.children) {
          if (findAndUpdateNode(child)) return true;
        }
      }
      return false;
    };

    if (data?.nodeData && findAndUpdateNode(data.nodeData)) {
      meInstance.refresh(data);
    }
  };

  const handleUpdateAssignee = (nodeId: string, newAssignee: string) => {
    updateNodePlan(nodeId, { assignee: newAssignee || null });
  };

  // Format cell value (show "--" for null/undefined)
  const formatCell = (value: string | number | null | undefined): string => {
    if (value === null || value === undefined || value === '') return '--';
    return String(value);
  };

  return (
    <div className="table-view">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <table className="mind-map-table">
          <thead>
            <tr>
              <th style={{ width: '40px' }}>⋮</th>
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
            <SortableContext
              items={items.map((item) => item.id)}
              strategy={verticalListSortingStrategy}
            >
              {items.map((flatNode: FlatNode, index: number) => (
                <SortableRow
                  key={flatNode.id}
                  flatNode={flatNode}
                  index={index}
                  formatCell={formatCell}
                  onUpdateNodeTopic={handleUpdateNodeTopic}
                  onUpdateAssignee={handleUpdateAssignee}
                />
              ))}
            </SortableContext>
          </tbody>
        </table>
      </DndContext>
    </div>
  );
};
