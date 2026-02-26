/**
 * View toggle segmented control component
 * Switches between mindmap and action plan (table) views
 */

import React from 'react';
import { useAppStore } from '@state/store';
import './view-toggle.css';

export const ViewToggle: React.FC = () => {
  const { currentView, setCurrentView } = useAppStore();

  return (
    <div className="view-toggle-tabs" role="tablist" aria-label="Switch view">
      <button
        role="tab"
        aria-selected={currentView === 'mindmap'}
        className={`view-toggle-tab${currentView === 'mindmap' ? ' view-toggle-tab--active' : ''}`}
        onClick={() => setCurrentView('mindmap')}
      >
        🗺️ Mindmap View
      </button>
      <button
        role="tab"
        aria-selected={currentView === 'table'}
        className={`view-toggle-tab${currentView === 'table' ? ' view-toggle-tab--active' : ''}`}
        onClick={() => setCurrentView('table')}
      >
        📊 Action Plan View
      </button>
    </div>
  );
};
