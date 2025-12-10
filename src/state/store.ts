/**
 * Lightweight state store - mind-elixir is the SINGLE SOURCE OF TRUTH for map data
 * 
 * This store only manages:
 * - Selection state (which node is selected)
 * - UI state (panel open/closed)
 * - History snapshots (for undo/redo)
 * - Reference to the mind-elixir instance
 * 
 * All node data is queried directly from mind-elixir to avoid sync issues.
 */

import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import type { MindMapNode, PlanAttributes } from '@core/types/node';

/**
 * History entry for undo/redo (snapshots only, not live data)
 */
export interface HistoryEntry {
  snapshot: string; // JSON serialized snapshot from mind-elixir
  timestamp: number;
  description: string;
}

/**
 * Application state interface - NO currentMap duplication
 */
export interface AppState {
  // Selection only
  selectedNodeId: string | null;

  // History (snapshots for undo/redo, not live data)
  history: HistoryEntry[];
  historyIndex: number;

  // UI state
  isPanelOpen: boolean;
}

/**
 * Store actions interface
 */
export interface StoreActions {
  // Mind-elixir instance management
  setMindElixirInstance: (instance: any) => void;
  getMindElixirInstance: () => any | null;

  // Selection
  setSelectedNodeId: (id: string | null) => void;

  // History
  addToHistory: (description: string) => void;
  undo: () => void;
  redo: () => void;

  // Node operations - query/update mind-elixir directly
  getNode: (nodeId: string) => MindMapNode | null;
  updateNodePlan: (nodeId: string, plan: Partial<PlanAttributes>) => void;

  // UI
  setIsPanelOpen: (open: boolean) => void;
}

/**
 * Combined state and actions context
 */
export interface AppStoreContext extends AppState, StoreActions {}

/**
 * Create the context
 */
export const AppStoreContext = createContext<AppStoreContext | null>(null);

/**
 * Provider component
 */
export const AppStoreProvider = ({
  children,
}: {
  children: React.ReactNode;
}): React.ReactNode => {
  // Reference to mind-elixir instance - THE source of truth for map data
  const meInstanceRef = useRef<any>(null);

  const [state, setState] = useState<AppState>({
    selectedNodeId: null,
    history: [],
    historyIndex: -1,
    isPanelOpen: false,
  });

  const setMindElixirInstance = useCallback((instance: any) => {
    meInstanceRef.current = instance;
  }, []);

  const getMindElixirInstance = useCallback(() => {
    return meInstanceRef.current;
  }, []);

  const setSelectedNodeId = useCallback((id: string | null) => {
    setState((prev) => ({ ...prev, selectedNodeId: id }));
  }, []);

  const addToHistory = useCallback((description: string) => {
    const me = meInstanceRef.current;
    if (!me) return;

    setState((prev) => {
      const newHistory = prev.history.slice(0, prev.historyIndex + 1);
      newHistory.push({
        snapshot: JSON.stringify(me.getData()),
        timestamp: Date.now(),
        description,
      });

      return {
        ...prev,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    });
  }, []);

  const undo = useCallback(() => {
    const me = meInstanceRef.current;
    if (!me) return;

    setState((prev) => {
      if (prev.historyIndex <= 0) return prev;

      const newIndex = prev.historyIndex - 1;
      const entry = prev.history[newIndex];

      // Restore to mind-elixir directly
      me.refresh(JSON.parse(entry.snapshot));

      return {
        ...prev,
        historyIndex: newIndex,
      };
    });
  }, []);

  const redo = useCallback(() => {
    const me = meInstanceRef.current;
    if (!me) return;

    setState((prev) => {
      if (prev.historyIndex >= prev.history.length - 1) return prev;

      const newIndex = prev.historyIndex + 1;
      const entry = prev.history[newIndex];

      // Restore to mind-elixir directly
      me.refresh(JSON.parse(entry.snapshot));

      return {
        ...prev,
        historyIndex: newIndex,
      };
    });
  }, []);

  /**
   * Query node directly from mind-elixir - always fresh, never stale
   */
  const getNode = useCallback((nodeId: string): MindMapNode | null => {
    const me = meInstanceRef.current;
    if (!me) return null;

    const data = me.getData();
    if (!data || !data.nodeData) return null;

    const search = (node: any): MindMapNode | null => {
      if (node.id === nodeId) return node as MindMapNode;
      if (!node.children) return null;

      for (const child of node.children) {
        const found = search(child);
        if (found) return found;
      }
      return null;
    };

    return search(data.nodeData);
  }, []);

  /**
   * Update node plan attributes directly in mind-elixir
   */
  const updateNodePlan = useCallback(
    (nodeId: string, plan: Partial<PlanAttributes>) => {
      const me = meInstanceRef.current;
      if (!me) return;

      // Find the node element to get the nodeObj reference
      const nodeEl = me.findEle?.(nodeId);
      if (!nodeEl) {
        console.warn(`updateNodePlan: Node ${nodeId} not found in mind-elixir`);
        return;
      }

      const nodeObj = nodeEl.nodeObj;
      if (!nodeObj) {
        console.warn(`updateNodePlan: nodeObj not found for ${nodeId}`);
        return;
      }

      // Initialize extended.plan if needed
      if (!nodeObj.extended) {
        nodeObj.extended = {};
      }
      if (!nodeObj.extended.plan) {
        nodeObj.extended.plan = {
          startDate: null,
          dueDate: null,
          investedTimeHours: null,
          elapsedTimeDays: null,
          assignee: null,
          status: null,
        };
      }

      // Merge plan attributes
      Object.assign(nodeObj.extended.plan, plan);

      // Trigger visual update if needed (reshapeNode updates the DOM)
      // Note: reshapeNode may not exist in all versions, so we check first
      if (typeof me.reshapeNode === 'function') {
        me.reshapeNode(nodeEl, nodeObj);
      }
    },
    []
  );

  const setIsPanelOpen = useCallback((open: boolean) => {
    setState((prev) => ({ ...prev, isPanelOpen: open }));
  }, []);

  const contextValue: AppStoreContext = {
    ...state,
    setMindElixirInstance,
    getMindElixirInstance,
    setSelectedNodeId,
    addToHistory,
    undo,
    redo,
    updateNodePlan,
    getNode,
    setIsPanelOpen,
  };

  return React.createElement(AppStoreContext.Provider, {
    value: contextValue,
    children,
  });
};

/**
 * Hook to use the app store
 */
export const useAppStore = (): AppStoreContext => {
  const context = useContext(AppStoreContext);
  if (!context) {
    throw new Error(
      'useAppStore must be used within AppStoreProvider component'
    );
  }
  return context;
};
