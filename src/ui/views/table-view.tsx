/**
 * Table view component for displaying mind map nodes in tabular format
 * Synchronized with mindmap view for bidirectional editing
 */

import React, { useEffect, useState } from 'react';
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
import { EditableSelectCell } from '@ui/table/editable-select-cell';
import { EditableDateCell } from '@ui/table/editable-date-cell';
import { EditableNumberCell } from '@ui/table/editable-number-cell';
import './table-view.css';

const STATUS_OPTIONS = ['Not Started', 'In Progress', 'Completed'];

interface SortableRowProps {
  flatNode: FlatNode;
  index: number;
  onUpdateNodeTopic: (nodeId: string, topic: string) => void;
  onUpdateAssignee: (nodeId: string, assignee: string) => void;
  onUpdateStatus: (nodeId: string, status: string) => void;
  onUpdateStartDate: (nodeId: string, startDate: string | null) => void;
  onUpdateDueDate: (nodeId: string, dueDate: string | null) => void;
  onUpdateInvestedTime: (nodeId: string, hours: number | null) => void;
  onUpdateElapsedTime: (nodeId: string, days: number | null) => void;
}

function SortableRow({ 
  flatNode, 
  index, 
  onUpdateNodeTopic,
  onUpdateAssignee,
  onUpdateStatus,
  onUpdateStartDate,
  onUpdateDueDate,
  onUpdateInvestedTime,
  onUpdateElapsedTime,
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
  const titleIndent = flatNode.depth * 20;

  return (
    <tr ref={setNodeRef} style={style} className={isDragging ? 'dragging' : ''}>
      <td>
        <span {...attributes} {...listeners} className="drag-handle">
          ⋮⋮
        </span>
      </td>
      <td>{index + 1}</td>
      <td>
        <div style={{ paddingLeft: `${titleIndent}px` }}>
          <EditableTextCell
            value={flatNode.node.topic}
            onSave={(newValue) => onUpdateNodeTopic(flatNode.id, newValue)}
            maxLength={200}
          />
        </div>
      </td>
      <EditableDateCell
        value={plan.startDate}
        onSave={(newValue) => onUpdateStartDate(flatNode.id, newValue)}
        placeholder="--"
      />
      <EditableDateCell
        value={plan.dueDate}
        onSave={(newValue) => onUpdateDueDate(flatNode.id, newValue)}
        placeholder="--"
      />
      <EditableNumberCell
        value={plan.investedTimeHours}
        onSave={(newValue) => onUpdateInvestedTime(flatNode.id, newValue)}
        step={0.5}
        placeholder="--"
      />
      <EditableNumberCell
        value={plan.elapsedTimeDays}
        onSave={(newValue) => onUpdateElapsedTime(flatNode.id, newValue)}
        step={1}
        placeholder="--"
      />
      <td>
        <EditableTextCell
          value={plan.assignee}
          onSave={(newValue) => onUpdateAssignee(flatNode.id, newValue)}
          maxLength={100}
        />
      </td>
      <EditableSelectCell
        value={plan.status}
        options={STATUS_OPTIONS}
        onSave={(newValue) => onUpdateStatus(flatNode.id, newValue)}
        placeholder="--"
      />
    </tr>
  );
}

export const TableView: React.FC = () => {
  const { getMindElixirInstance, depthFilter, updateNodeSequence, updateNodePlan } = useAppStore();
  const [items, setItems] = useState<FlatNode[]>([]);
  const [refreshTick, setRefreshTick] = useState(0);

  const forceRefresh = () => setRefreshTick((t) => t + 1);

  // Get flattened nodes in depth-first order; re-runs whenever data changes
  useEffect(() => {
    const meInstance = getMindElixirInstance();
    if (!meInstance) return;

    const data = meInstance.getData();
    if (!data || !data.nodeData) return;

    const rootData: MindMapNode = data.nodeData;
    const flattened = flattenByDepth(rootData, depthFilter);
    setItems(flattened);
  }, [getMindElixirInstance, depthFilter, refreshTick]);

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
        const node = items[oldIndex];
        const targetNode = items[newIndex];

        // Prevent reparenting: the drop target must share the same parent.
        if (node.parentId !== targetNode.parentId) {
          alert(
            'Reparenting is not supported in Table View.\n\n' +
            'To move a node under a different parent, please use the Mindmap View instead.'
          );
          return;
        }

        // Update local state for immediate visual feedback
        const newItems = arrayMove(items, oldIndex, newIndex);
        setItems(newItems);

        // Translate flat-list newIndex to the index within the parent's children array.
        // Count how many nodes that share the same parentId appear before newIndex
        // in the reordered flat list (excluding the dragged node itself, which is now at newIndex).
        if (node.parentId !== null) {
          const siblingIndex = newItems
            .slice(0, newIndex)
            .filter((item) => item.parentId === node.parentId).length;
          updateNodeSequence(node.id, node.parentId, siblingIndex);
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
      forceRefresh();
    }
  };

  const handleUpdateStartDate = (nodeId: string, newStartDate: string | null) => {
    updateNodePlan(nodeId, { startDate: newStartDate });
    forceRefresh();
  };

  const handleUpdateInvestedTime = (nodeId: string, hours: number | null) => {
    updateNodePlan(nodeId, { investedTimeHours: hours });
    forceRefresh();
  };

  const handleUpdateElapsedTime = (nodeId: string, days: number | null) => {
    updateNodePlan(nodeId, { elapsedTimeDays: days });
    forceRefresh();
  };

  const handleUpdateAssignee = (nodeId: string, newAssignee: string) => {
    updateNodePlan(nodeId, { assignee: newAssignee || null });
    forceRefresh();
  };

  const handleUpdateStatus = (nodeId: string, newStatus: string) => {
    updateNodePlan(nodeId, { status: newStatus as 'Not Started' | 'In Progress' | 'Completed' });
    forceRefresh();
  };

  const handleUpdateDueDate = (nodeId: string, newDueDate: string | null) => {
    updateNodePlan(nodeId, { dueDate: newDueDate });
    forceRefresh();
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
              <th>#</th>
              <th>Title</th>
              <th>Start Date</th>
              <th>Due Date</th>
              <th>Invested Time (h)</th>
              <th>Elapsed Time (d)</th>
              <th>Assignee</th>
              <th>Status</th>
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
                  onUpdateNodeTopic={handleUpdateNodeTopic}
                  onUpdateStartDate={handleUpdateStartDate}
                  onUpdateDueDate={handleUpdateDueDate}
                  onUpdateInvestedTime={handleUpdateInvestedTime}
                  onUpdateElapsedTime={handleUpdateElapsedTime}
                  onUpdateAssignee={handleUpdateAssignee}
                  onUpdateStatus={handleUpdateStatus}
                />
              ))}
            </SortableContext>
          </tbody>
        </table>
      </DndContext>
    </div>
  );
};
