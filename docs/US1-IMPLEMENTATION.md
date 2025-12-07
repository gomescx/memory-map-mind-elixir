# User Story 1 Implementation: Planning Attributes

## Overview

User Story 1 extends mind-elixir nodes with six optional planning attributes, providing an editable UI while keeping core mind map interactions intact.

## Implemented Components

### Core Adapters (`src/core/node-adapter.ts`)

Functions to read/write plan attributes on nodes:
- `getNodePlanAttributes(node)` - Get plan data with defaults
- `setNodePlanAttributes(node, plan)` - Set/update plan data
- `hasNodePlanData(node)` - Check if node has any plan data
- `clearNodePlanAttributes(node)` - Reset all plan attributes

### Plan Form Schema (`src/ui/forms/plan-form.ts`)

Form definition and validation:
- `PLAN_FORM_FIELDS` - Array of field definitions with types and labels
- `validatePlanForm(plan)` - Validate entire form with error/warning messages
- `parseFormValue(fieldName, value)` - Parse form input to correct type
- `formatFormValue(value)` - Format value for display in form

### Planning Panel (`src/ui/panels/plan-panel.tsx`)

Side panel component for editing planning attributes:
- Opens on the right side of the screen
- Shows all six planning fields (dates, times, assignee, status)
- Real-time validation with error/warning display
- Save and Clear actions
- Closes with X button or ESC key

### Keyboard Shortcuts (`src/ui/shortcuts/plan-panel.tsx`)

Hotkey handling for plan panel:
- **Ctrl+P** (Windows/Linux) or **Cmd+P** (Mac) - Toggle plan panel
- **ESC** - Close plan panel
- `usePlanPanelHotkey()` - React hook to register shortcuts
- `PlanPanelToggleButton` - Manual button to open panel

### Visual Indicators

**Badges** (`src/ui/badges/node-plan-badges.tsx`):
- Status icons: ⭕ Not Started, ⏳ In Progress, ✅ Completed
- ⚠️ Overdue warning (red badge)
- Assignee initials (blue badge)
- ⏱️ Time tracking indicator

**Tooltip** (`src/ui/tooltips/node-plan-tooltip.tsx`):
- Shows on hover or selection
- Displays all populated planning fields
- Formatted dates and time values
- Clean, readable layout

## Six Planning Attributes

1. **Start Date** (ISO 8601: YYYY-MM-DD)
2. **Due Date** (ISO 8601: YYYY-MM-DD)
3. **Invested Time** (hours, non-negative number)
4. **Elapsed Time** (hours, non-negative number)
5. **Assignee** (text, free-form)
6. **Status** (enum: "Not Started" | "In Progress" | "Completed")

All fields are optional (nullable).

## Data Model

```typescript
interface PlanAttributes {
  startDate: string | null;
  dueDate: string | null;
  investedTimeHours: number | null;
  elapsedTimeHours: number | null;
  assignee: string | null;
  status: "Not Started" | "In Progress" | "Completed" | null;
}

interface MindMapNode {
  id: string;
  topic: string;
  children?: MindMapNode[];
  extended?: {
    plan?: PlanAttributes;
  };
}
```

## Validation Rules

- **Dates**: Must be ISO 8601 format (YYYY-MM-DD)
- **Numbers**: Must be non-negative
- **Status**: Must be one of the three enum values
- **Date Range Warning**: If start date > due date, show warning (non-blocking)
- All fields are optional - empty/null values are valid

## Usage Example

```tsx
import { AppStoreProvider } from '@state/store';
import { PlanPanel } from '@ui/panels/plan-panel';
import { usePlanPanelHotkey } from '@ui/shortcuts/plan-panel';
import { NodePlanBadges } from '@ui/badges/node-plan-badges';
import { NodePlanTooltip } from '@ui/tooltips/node-plan-tooltip';

function MyApp() {
  // Register keyboard shortcuts
  usePlanPanelHotkey();
  
  return (
    <AppStoreProvider>
      <div>
        {/* Your mind map UI with nodes */}
        <NodeComponent node={node}>
          <NodePlanBadges node={node} />
          <NodePlanTooltip node={node} show={isHovered} />
        </NodeComponent>
        
        {/* Plan panel (opens on selection + Ctrl+P) */}
        <PlanPanel />
      </div>
    </AppStoreProvider>
  );
}
```

## Testing

Run unit tests:
```bash
npm run test
```

Test coverage includes:
- Node adapter functions (get/set/has/clear)
- Plan form validation (dates, numbers, status, warnings)
- Form value parsing and formatting

## Integration with Mind-Elixir

The implementation:
- ✅ Preserves core mind-elixir keyboard shortcuts
- ✅ Uses `extended.plan` namespace for backward compatibility
- ✅ Does not interfere with node rendering or layout
- ✅ Hotkeys use capture phase to avoid conflicts

## Files Created

```
src/core/
  node-adapter.ts                    # Node plan read/write helpers

src/ui/
  forms/
    plan-form.ts                     # Form schema and validation
  panels/
    plan-panel.tsx                   # Side panel component
    plan-panel.css                   # Panel styles
  shortcuts/
    plan-panel.tsx                   # Keyboard shortcut hooks
  badges/
    node-plan-badges.tsx             # Status/assignee badges
    node-plan-badges.css             # Badge styles
  tooltips/
    node-plan-tooltip.tsx            # Hover tooltip
    node-plan-tooltip.css            # Tooltip styles

tests/unit/core/
  node-plan.spec.ts                  # Unit tests

src/examples/
  us1-integration-example.tsx        # Complete integration demo
```

## Next Steps

With User Story 1 complete, the foundation is ready for:
- **User Story 2**: Save/load JSON files with planning data
- **User Story 3**: Export to CSV and HTML table
- **User Story 4**: Validate keyboard shortcuts don't regress
- **User Story 5**: Enhanced visual indicators (polish)
- **User Story 6**: Auto-save to localStorage

## Status

✅ **User Story 1 Complete**
- All 8 tasks (T012-T019) implemented
- Unit tests passing (31/31)
- TypeScript compilation successful
- Ready for integration with mind-elixir core
