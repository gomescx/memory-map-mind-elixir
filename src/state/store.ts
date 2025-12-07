/**
 * Lightweight state store with selection, history hooks, and plan field setters
 * Manages application state for the mind map without heavy dependencies
 * Uses React Context + Hooks instead of external state management
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import type { MindMapNode, MindMap, PlanAttributes } from '@core/types/node';
import { setPlanAttributes } from '@core/types/node';

/**
 * History entry for undo/redo
 */
export interface HistoryEntry {
  map: MindMap;
  timestamp: number;
  description: string;
}

/**
 * Application state interface
 */
export interface AppState {
  // Current map
  currentMap: MindMap | null;

  // Selection
  selectedNodeId: string | null;

  // History
  history: HistoryEntry[];
  historyIndex: number;

  // UI state
  isPanelOpen: boolean;
}

/**
 * Store actions interface
 */
export interface StoreActions {
  setMap: (map: MindMap) => void;
  setSelectedNodeId: (id: string | null) => void;
  addToHistory: (map: MindMap, description: string) => void;
  undo: () => void;
  redo: () => void;
  updateNodePlan: (nodeId: string, plan: Partial<PlanAttributes>) => void;
  getNode: (nodeId: string) => MindMapNode | null;
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
  const [state, setState] = useState<AppState>({
    currentMap: null,
    selectedNodeId: null,
    history: [],
    historyIndex: -1,
    isPanelOpen: false,
  });

  const setMap = useCallback((map: MindMap) => {
    setState({
      currentMap: map,
      selectedNodeId: null,
      history: [],
      historyIndex: -1,
      isPanelOpen: false,
    });
  }, []);

  const setSelectedNodeId = useCallback((id: string | null) => {
    setState((prev) => ({ ...prev, selectedNodeId: id }));
  }, []);

  const addToHistory = useCallback((map: MindMap, description: string) => {
    setState((prev) => {
      const newHistory = prev.history.slice(0, prev.historyIndex + 1);
      newHistory.push({
        map: JSON.parse(JSON.stringify(map)),
        timestamp: Date.now(),
        description,
      });

      return {
        ...prev,
        history: newHistory,
        historyIndex: newHistory.length - 1,
        currentMap: map,
      };
    });
  }, []);

  const undo = useCallback(() => {
    setState((prev) => {
      if (prev.historyIndex <= 0) return prev;

      const newIndex = prev.historyIndex - 1;
      const entry = prev.history[newIndex];

      return {
        ...prev,
        currentMap: JSON.parse(JSON.stringify(entry.map)),
        historyIndex: newIndex,
      };
    });
  }, []);

  const redo = useCallback(() => {
    setState((prev) => {
      if (prev.historyIndex >= prev.history.length - 1) return prev;

      const newIndex = prev.historyIndex + 1;
      const entry = prev.history[newIndex];

      return {
        ...prev,
        currentMap: JSON.parse(JSON.stringify(entry.map)),
        historyIndex: newIndex,
      };
    });
  }, []);

  const getNode = useCallback(
    (nodeId: string): MindMapNode | null => {
      if (!state.currentMap) return null;

      const search = (node: MindMapNode): MindMapNode | null => {
        if (node.id === nodeId) return node;
        if (!node.children) return null;

        for (const child of node.children) {
          const found = search(child);
          if (found) return found;
        }
        return null;
      };

      return search(state.currentMap.root);
    },
    [state.currentMap]
  );

  const updateNodePlan = useCallback(
    (nodeId: string, plan: Partial<PlanAttributes>) => {
      setState((prev) => {
        if (!prev.currentMap) return prev;

        const updateNode = (node: MindMapNode): MindMapNode => {
          if (node.id === nodeId) {
            return setPlanAttributes(node, plan);
          }

          if (node.children && node.children.length > 0) {
            return {
              ...node,
              children: node.children.map(updateNode),
            };
          }

          return node;
        };

        return {
          ...prev,
          currentMap: {
            ...prev.currentMap,
            root: updateNode(prev.currentMap.root),
          },
        };
      });
    },
    []
  );

  const setIsPanelOpen = useCallback((open: boolean) => {
    setState((prev) => ({ ...prev, isPanelOpen: open }));
  }, []);

  const contextValue: AppStoreContext = {
    ...state,
    setMap,
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

/**
 * Hook to listen for state changes
 */
export const useMapState = () => {
  const store = useAppStore();
  return {
    map: store.currentMap,
    selectedNodeId: store.selectedNodeId,
  };
};

/**
 * Hook for history operations
 */
export const useHistory = () => {
  const store = useAppStore();
  return {
    canUndo: store.historyIndex > 0,
    canRedo: store.historyIndex < store.history.length - 1,
    undo: store.undo,
    redo: store.redo,
    addToHistory: store.addToHistory,
  };
};

/**
 * Hook for selection
 */
export const useSelection = () => {
  const store = useAppStore();
  return {
    selectedNodeId: store.selectedNodeId,
    setSelectedNodeId: store.setSelectedNodeId,
  };
};

/**
 * Hook for plan updates
 */
export const usePlanUpdates = () => {
  const store = useAppStore();
  return {
    updateNodePlan: store.updateNodePlan,
    getNode: store.getNode,
  };
};

/**
 * Hook for panel state
 */
export const usePanelState = () => {
  const store = useAppStore();
  return {
    isPanelOpen: store.isPanelOpen,
    setIsPanelOpen: store.setIsPanelOpen,
  };
};
