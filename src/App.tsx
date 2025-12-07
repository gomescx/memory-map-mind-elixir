import { useEffect, useRef, useState } from 'react';
import MindElixir from 'mind-elixir';
import 'mind-elixir/style.css';
import { AppStoreProvider, useAppStore } from '@state/store';
import { PlanPanel } from '@ui/panels/plan-panel';
import { usePlanPanelHotkey, PlanPanelToggleButton } from '@ui/shortcuts/plan-panel';
import { NodePlanBadges } from '@ui/badges/node-plan-badges';
import { NodePlanTooltip } from '@ui/tooltips/node-plan-tooltip';
import type { MindMapNode } from '@core/types/node';
import './App.css';

/**
 * Mind Map Component - Integrates mind-elixir with User Story 1 features
 */
function MindMapApp(): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const mindElixirRef = useRef<any>(null);
  const { setMap, setSelectedNodeId, getNode, selectedNodeId } = useAppStore();
  const [isInitialized, setIsInitialized] = useState(false);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number } | null>(
    null
  );
  const [badgePosition, setBadgePosition] = useState<{ top: number; left: number } | null>(
    null
  );

  // Helper to find DOM element for a node id
  const getNodeElement = (id: string): HTMLElement | null => {
    if (!containerRef.current) return null;
    return containerRef.current.querySelector(`[data-nodeid="me${id}"]`) as HTMLElement | null;
  };

  // Update overlay positions relative to the mind map wrapper
  const updateOverlayPositions = (id: string) => {
    const el = getNodeElement(id);
    const wrapper = containerRef.current;
    if (!el || !wrapper) {
      setTooltipPosition(null);
      setBadgePosition(null);
      return;
    }

    const rect = el.getBoundingClientRect();
    const wrapperRect = wrapper.getBoundingClientRect();

    setTooltipPosition({
      top: rect.bottom - wrapperRect.top + 8,
      left: rect.left - wrapperRect.left,
    });

    setBadgePosition({
      top: rect.top - wrapperRect.top - 12,
      left: rect.right - wrapperRect.left - 40,
    });
  };

  // Register plan panel hotkey
  usePlanPanelHotkey();

  // Initialize mind-elixir
  useEffect(() => {
    if (!containerRef.current || isInitialized) return;

    // Create initial map data structure compatible with mind-elixir
    const data = {
      nodeData: {
        id: 'root',
        topic: 'Memory Map Action Planner',
        children: [
          {
            topic: 'Getting Started',
            id: 'node-1',
            direction: 0 as 0 | 1,
            expanded: true,
            children: [
              {
                id: 'node-1-1',
                topic: 'Press Tab to add a child node',
              },
              {
                id: 'node-1-2',
                topic: 'Press Enter to add a sibling',
              },
            ],
          },
          {
            topic: 'Planning Features',
            id: 'node-2',
            direction: 1 as 0 | 1,
            expanded: true,
            children: [
              {
                id: 'node-2-1',
                topic: 'Select a node and press Ctrl+P (Cmd+P)',
              },
              {
                id: 'node-2-2',
                topic: 'Edit planning attributes in side panel',
              },
            ],
          },
          {
            topic: 'Sample Task',
            id: 'node-3',
            direction: 1 as 0 | 1,
            expanded: true,
            children: [
              {
                id: 'node-3-1',
                topic: 'This has planning attributes',
                extended: {
                  plan: {
                    startDate: '2025-12-01',
                    dueDate: '2025-12-15',
                    investedTimeHours: 10,
                    elapsedTimeDays: 5,
                    assignee: 'Demo User',
                    status: 'In Progress' as const,
                  },
                },
              },
            ],
          },
        ],
      },
    };

    // Initialize MindElixir with proper options
    const options = {
      el: containerRef.current,
      direction: MindElixir.SIDE,
      draggable: true,
      contextMenu: true,
      toolBar: true,
      nodeMenu: true,
      keypress: true,
      locale: 'en' as const,
      overflowHidden: false,
    };

    const mind = new MindElixir(options);
    mind.init(data);
    mindElixirRef.current = mind;

    // Sync to store
    const rootNode: MindMapNode = {
      id: data.nodeData.id,
      topic: data.nodeData.topic,
      children: data.nodeData.children as any as MindMapNode[],
    };

    setMap({
      id: 'main-map',
      title: 'Memory Map Action Planner',
      version: '1.0.0',
      root: rootNode,
    });

    // Listen for selection changes
    const handleSelection = (nodes: any) => {
      // mind-elixir fires 'selectNodes' with an array of selected nodes
      if (nodes && nodes.length > 0 && nodes[0].id) {
        setSelectedNodeId(nodes[0].id);
      }
    };

    // Add event listeners (using any to work around mind-elixir typing)
    // Note: mind-elixir uses 'selectNodes' event (plural)
    (mind.bus as any).addListener('selectNodes', handleSelection);

    setIsInitialized(true);

    return () => {
      // Cleanup
      if (mindElixirRef.current) {
        mindElixirRef.current = null;
      }
    };
  }, [isInitialized, setMap, setSelectedNodeId]);

  // Hover listeners for tooltip/badges
  useEffect(() => {
    if (!isInitialized || !containerRef.current) return;

    const handleEnter = (e: Event) => {
      const target = e.currentTarget as HTMLElement | null;
      const nodeId = target?.dataset.nodeid?.replace('me', '') || null;
      if (nodeId) {
        setHoveredNodeId(nodeId);
        updateOverlayPositions(nodeId);
      }
    };

    const handleLeave = () => {
      setHoveredNodeId(null);
    };

    const nodeEls = containerRef.current.querySelectorAll('[data-nodeid]');
    nodeEls.forEach((el) => {
      el.addEventListener('mouseenter', handleEnter);
      el.addEventListener('mouseleave', handleLeave);
    });

    return () => {
      nodeEls.forEach((el) => {
        el.removeEventListener('mouseenter', handleEnter);
        el.removeEventListener('mouseleave', handleLeave);
      });
    };
  }, [isInitialized]);

  // Keep overlays in sync with selection/hover
  useEffect(() => {
    const id = hoveredNodeId ?? selectedNodeId;
    if (id) {
      updateOverlayPositions(id);
    } else {
      setTooltipPosition(null);
      setBadgePosition(null);
    }
  }, [hoveredNodeId, selectedNodeId]);

  return (
    <div className="app-container">
      <div className="toolbar">
        <h1>Memory Map Action Planner</h1>
        <div className="toolbar-actions">
          <PlanPanelToggleButton className="toolbar-button" />
          <span className="toolbar-hint">
            Tab (child) • Enter (sibling) • Ctrl+P (plan) • Delete (remove)
          </span>
        </div>
      </div>
      <div className="mind-map-wrapper">
        <div ref={containerRef} id="mind-map" className="mind-map-container" />
        {/* Badge overlay (hover takes priority, otherwise selection) */}
        {badgePosition && (hoveredNodeId ?? selectedNodeId) && (
          <div
            className="plan-badge-overlay"
            style={{ top: badgePosition.top, left: badgePosition.left }}
          >
            {(() => {
              const targetId = hoveredNodeId ?? selectedNodeId;
              const node = targetId ? getNode(targetId) : null;
              return node ? <NodePlanBadges node={node} /> : null;
            })()}
          </div>
        )}

        {/* Tooltip overlay (hover only - disappears when mouse leaves) */}
        {tooltipPosition && hoveredNodeId && (
          <div
            className="plan-tooltip-overlay"
            style={{ top: tooltipPosition.top, left: tooltipPosition.left }}
          >
            {(() => {
              const node = hoveredNodeId ? getNode(hoveredNodeId) : null;
              return node ? <NodePlanTooltip node={node} show /> : null;
            })()}
          </div>
        )}
      </div>
      <PlanPanel />
    </div>
  );
}

/**
 * Main App with Store Provider
 */
export function App(): JSX.Element {
  return (
    <AppStoreProvider>
      <MindMapApp />
    </AppStoreProvider>
  );
}

export default App;
