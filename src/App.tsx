import { useEffect, useRef, useState } from 'react';
import MindElixir from 'mind-elixir';
import 'mind-elixir/style.css';
import { AppStoreProvider, useAppStore } from '@state/store';
import { useUndoRedoShortcuts } from '@state/history';
import { PlanPanel } from '@ui/panels/plan-panel';
import { usePlanPanelHotkey, PlanPanelToggleButton } from '@ui/shortcuts/plan-panel';
import { NodePlanBadges } from '@ui/badges/node-plan-badges';
import { NodePlanTooltip } from '@ui/tooltips/node-plan-tooltip';
import { saveMapToFile, loadMapFromFile, resetMapToRoot } from '@ui/actions/map-actions';
import { exportToCSV, exportToHTML } from '@ui/actions/export-map';
import './App.css';

/**
 * Mind Map Component - Integrates mind-elixir with User Story 1 & 2 features
 */
function MindMapApp(): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const mindElixirRef = useRef<any>(null);
  const { setMindElixirInstance, setSelectedNodeId, getNode, selectedNodeId, undo, redo } = useAppStore();
  const [isInitialized, setIsInitialized] = useState(false);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number } | null>(null);
  const [badgePosition, setBadgePosition] = useState<{ top: number; left: number } | null>(null);

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

  // Register undo/redo keyboard shortcuts (Ctrl+Z/Y, Cmd+Z/Shift+Z)
  useUndoRedoShortcuts(undo, redo);

  // Save handler - directly accesses ref (not via closure)
  const handleSave = () => {
    const mind = mindElixirRef.current;
    if (!mind) {
      alert('❌ Save failed: Mind map not ready yet. Please wait.');
      return;
    }
    try {
      saveMapToFile(mind);
    } catch (error) {
      alert(`❌ Save failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  // Load handler - directly accesses ref
  const handleLoad = async () => {
    const mind = mindElixirRef.current;
    if (!mind) {
      alert('❌ Load failed: Mind map not ready yet. Please wait.');
      return;
    }
    try {
      await loadMapFromFile(mind);
    } catch (error) {
      // Don't show error for user cancellation
      if (error instanceof Error && (error.message.includes('cancelled') || error.message.includes('No file'))) {
        return;
      }
      alert(`❌ Load failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  // Reset handler - directly accesses ref
  const handleReset = () => {
    const mind = mindElixirRef.current;
    if (!mind) {
      alert('❌ Reset failed: Mind map not ready yet. Please wait.');
      return;
    }
    if (!confirm('⚠️ Reset map? This will remove all nodes except root.')) return;
    try {
      resetMapToRoot(mind);
    } catch (error) {
      alert(`❌ Reset failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  // Export to CSV handler
  const handleExportCSV = () => {
    const mind = mindElixirRef.current;
    if (!mind) {
      alert('❌ Export failed: Mind map not ready yet. Please wait.');
      return;
    }
    try {
      exportToCSV(mind);
    } catch (error) {
      alert(`❌ Export to CSV failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  // Export to HTML handler
  const handleExportHTML = () => {
    const mind = mindElixirRef.current;
    if (!mind) {
      alert('❌ Export failed: Mind map not ready yet. Please wait.');
      return;
    }
    try {
      exportToHTML(mind);
    } catch (error) {
      alert(`❌ Export to HTML failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  // Keyboard shortcuts for save (Ctrl+S), load (Ctrl+O), and export (Ctrl+E)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        // Access ref directly in event handler
        const mind = mindElixirRef.current;
        if (!mind) return;
        try {
          saveMapToFile(mind);
        } catch (error) {
          alert(`❌ Save failed: ${error instanceof Error ? error.message : String(error)}`);
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'o') {
        e.preventDefault();
        // Access ref directly in event handler
        const mind = mindElixirRef.current;
        if (!mind) return;
        loadMapFromFile(mind).catch((error) => {
          if (error instanceof Error && (error.message.includes('cancelled') || error.message.includes('No file'))) {
            return;
          }
          alert(`❌ Load failed: ${error instanceof Error ? error.message : String(error)}`);
        });
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        const mind = mindElixirRef.current;
        if (!mind) return;
        try {
          exportToCSV(mind);
          exportToHTML(mind);
        } catch (error) {
          alert(`❌ Export failed: ${error instanceof Error ? error.message : String(error)}`);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Initialize mind-elixir
  useEffect(() => {
    if (!containerRef.current || isInitialized) return;

    // Create initial map data structure compatible with mind-elixir
    const data = {
      nodeData: {
        id: 'root',
        topic: 'Memory Map Action Planner',
        root: true,
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
            topic: 'Save/Load',
            id: 'node-3',
            direction: 1 as 0 | 1,
            expanded: true,
            children: [
              {
                id: 'node-3-1',
                topic: 'Ctrl+S to save map as JSON',
              },
              {
                id: 'node-3-2',
                topic: 'Ctrl+O to load a saved map',
              },
            ],
          },
          {
            topic: 'Example with Plan Data',
            id: 'node-4',
            direction: 0 as 0 | 1,
            expanded: true,
            children: [
              {
                id: 'node-4-1',
                topic: 'Task with planning attributes',
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

    // Register mind-elixir instance with store - this is the single source of truth
    setMindElixirInstance(mind);

    // Listen for selection changes
    const handleSelection = (nodes: any) => {
      if (nodes && nodes.length > 0 && nodes[0].id) {
        setSelectedNodeId(nodes[0].id);
      }
    };

    (mind.bus as any).addListener('selectNodes', handleSelection);

    setIsInitialized(true);

    // Note: We don't clean up mindElixirRef here because the cleanup runs
    // when dependencies change (including isInitialized going true->false),
    // which would null the ref immediately after initialization.
    // The mind-elixir instance will be garbage collected when component unmounts.
  }, [isInitialized, setMindElixirInstance, setSelectedNodeId]);

  // Hover listeners for tooltip/badges
  useEffect(() => {
    if (!isInitialized || !containerRef.current) return;

    const handleEnter = (e: Event) => {
      const target = e.target as HTMLElement;
      const nodeId = target.dataset.nodeid?.replace('me', '');
      if (nodeId) {
        setHoveredNodeId(nodeId);
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
        <div className="toolbar-top-row">
            <h1>Memory Map Action Planner</h1>
            <p className="toolbar-tagline"><em>"From messy ideas to clear action — in minutes."</em></p>
          <div className="toolbar-actions">
            <button 
              className="toolbar-button" 
              onClick={handleSave} 
              title="Save map (Ctrl+S)"
            >
              💾 Save
            </button>
            <button 
              className="toolbar-button" 
              onClick={handleLoad} 
              title="Load map (Ctrl+O)"
            >
              📂 Load
            </button>
            <button 
              className="toolbar-button" 
              onClick={handleReset} 
              title="Reset map"
            >
              🔄 Reset
            </button>
            <button 
              className="toolbar-button" 
              onClick={handleExportCSV} 
              title="Export as CSV"
            >
              📊 CSV
            </button>
            <button 
              className="toolbar-button" 
              onClick={handleExportHTML} 
              title="Export as HTML table (Ctrl+E for both)"
            >
              📄 HTML
            </button>
            <PlanPanelToggleButton className="toolbar-button" />
          </div>
        </div>
        <div className="toolbar-bottom-row">
          <a 
            href="https://claudio.coach" 
            target="_blank" 
            rel="noopener noreferrer"
            className="toolbar-link"
          >
            Visit claudio.coach for more resources
          </a>
          <span className="toolbar-hint">
            Ctrl+S (save) • Ctrl+O (load) • Tab (child) • Enter (sibling) • Alt+↑/↓ (reorder) • Ctrl+P (plan)
          </span>
        </div>
      </div>
      <div className="mind-map-wrapper">
        <div 
          ref={containerRef} 
          id="mind-map" 
          className="mind-map-container"
        />
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
        <PlanPanel />
      </div>
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
