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
    <div className="view-toggle-tabs" role="group" aria-label="Switch view">
      <button
        aria-pressed={currentView === 'mindmap'}
        className={`view-toggle-tab${currentView === 'mindmap' ? ' view-toggle-tab--active' : ''}`}
        onClick={() => setCurrentView('mindmap')}
      >
        🗺️ Mindmap View
      </button>
      <button
        aria-pressed={currentView === 'table'}
        className={`view-toggle-tab${currentView === 'table' ? ' view-toggle-tab--active' : ''}`}
        onClick={() => setCurrentView('table')}
      >
        📊 Action Plan View
      </button>
    </div>
  );
};
