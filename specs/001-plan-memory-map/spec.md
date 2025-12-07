# Feature Specification: Memory Map Action Planner MVP

**Feature Branch**: `001-memory-map-action-planner-mvp`  
**Created**: 2025-12-07  
**Status**: Draft  
**Input**: Business_statement.md - Transform Memory Mapping ideation into structured, actionable plans

## Constitutional Validation ✓

This specification has been validated against `.specify/memory/constitution.md`:

- ✅ **Offline-First**: No server component, all processing in browser
- ✅ **Single-Session, Single-User**: No multi-user collaboration features
- ✅ **Privacy by Default**: No external API calls or telemetry
- ✅ **Respect Upstream**: Preserves mind-elixir-core interaction patterns
- ✅ **Simplicity Over Completeness**: Maintainable by one developer + Copilot

## User Scenarios & Testing

### User Story 1 - Create Visual Mind Map with Planning Attributes (Priority: P1)

As a PEP coach conducting a coaching session, I need to help my client brainstorm ideas visually and add planning attributes to each node, so that we can capture both the creative thinking and the practical execution details in one place.

**Why this priority**: This is the core value proposition - extending mind mapping with planning capabilities. Without this, the tool is just another mind mapper.

**Independent Test**: Can be fully tested by creating a new mind map, adding nodes with keyboard shortcuts, and editing node attributes (dates, time estimates, assignee) through a side panel or modal. Delivers a functional visual planning tool.

**Acceptance Scenarios**:

1. **Given** the application is loaded, **When** I click the canvas, **Then** I can create a central topic node
2. **Given** a node is selected, **When** I press Tab, **Then** I can add a child node
3. **Given** a node is selected, **When** I press Enter, **Then** I can add a sibling node after the current node
4. **Given** a node is selected, **When** I click an "Edit Details" button or press a designated hotkey, **Then** a side panel or modal appears showing:
   - Start Date (date picker or null)
   - Due Date (date picker or null)
   - Invested Time (numeric input in hours or null)
   - Elapsed Time (numeric input in days or null)
   - Assignee (text field or null)
   - Status (dropdown: "Not Started", "In Progress", "Completed", or null)
5. **Given** the details panel is open, **When** I modify any attribute and save, **Then** the node retains those attributes and displays them (e.g., icon badge, tooltip, or inline indicator)
6. **Given** a node has planning attributes, **When** I hover over or select it, **Then** I can see a summary of its attributes without opening the full editor

---

### User Story 2 - Save and Load Mind Maps as Offline Files (Priority: P1)

As a coach or executive, I need to save my mind map to a file on my computer and load it later, so that I can work offline, maintain multiple projects, and control my own data without any cloud dependency.

**Why this priority**: Offline-First is a constitutional principle. Without file-based persistence, users cannot trust the tool or use it in secure environments.

**Independent Test**: Can be fully tested by creating a map with several nodes and attributes, saving it as a JSON file, closing the browser, reopening the app, and loading the same file to verify all data is preserved.

**Acceptance Scenarios**:

1. **Given** I have created or modified a mind map, **When** I click "Save" or use a keyboard shortcut (e.g., Ctrl+S), **Then** the browser prompts me to download a JSON file with a sensible default name (e.g., "memory-map-2025-12-07.json")
2. **Given** I have a saved mind map file, **When** I click "Load" or drag-and-drop the file onto the canvas, **Then** the map loads completely with all nodes, structure, and planning attributes intact
3. **Given** the loaded map includes nodes with dates, times, assignees, and status, **When** I inspect those nodes, **Then** all attributes are present and editable
4. **Given** I attempt to load a file that is not a valid mind map format, **When** the system reads the file, **Then** I receive a clear error message (e.g., "Invalid file format") without crashing

---

### User Story 3 - Export Mind Map to Tabular Action Plan (Priority: P1)

As a coach or executive, I need to export the mind map into a linear, tabular format (CSV and MS-WORD), so that I can share a clean action plan with stakeholders, import it into external tools, or print it for review.

**Why this priority**: This is the bridge between "creative thinking and disciplined execution" (core value proposition). Without export, the planning attributes are locked in the visual format.

**Independent Test**: Can be fully tested by creating a multi-level mind map with planning attributes, clicking "Export", and verifying the output CSV/MS-WORD contains all nodes in a flat, actionable format with columns for all attributes.

**Acceptance Scenarios**:

1. **Given** I have created a mind map with nodes at multiple levels, **When** I click "Export to CSV", **Then** the browser downloads a CSV file containing columns: Node ID, Depth/Level, Title, Start Date, Due Date, Invested Time, Elapsed Time, Assignee, Status, Parent Path
2. **Given** the exported CSV, **When** I open it in Excel or Google Sheets, **Then** each row represents one node with all attributes clearly visible, and parent-child relationships are traceable via "Parent Path" or similar
3. **Given** I have created a mind map with nodes at multiple levels, **When** I click "Export to MS-WORD Table", **Then** I can view or print a clean, formatted MS-WORD table with the same columns as CSV
4. **Given** nodes without planning attributes (null values), **When** I export, **Then** those cells are empty or display "N/A" without breaking the export format
5. **Given** I export the same map multiple times, **When** I compare exports, **Then** node IDs remain stable (no random regeneration) to support version tracking

---

### User Story 4 - Preserve Mind-Elixir Keyboard Shortcuts and Interaction Model (Priority: P2)

As a user familiar with mind-mapping tools like FreeMind or XMind, I expect standard keyboard shortcuts (Enter, Tab, Delete, arrow keys, Ctrl+Z/Y) to work intuitively, so that I can work efficiently without relearning basic interactions.

**Why this priority**: Constitutional principle "Respect Upstream". If core interactions are broken, adoption fails. This is a "table stakes" feature but slightly lower priority than core planning capabilities.

**Independent Test**: Can be fully tested by performing a series of standard mind-mapping operations (add child, add sibling, delete, undo, redo, navigate) using only keyboard shortcuts, with no mouse, and verifying all operations succeed.

**Acceptance Scenarios**:

1. **Given** a node is selected, **When** I press Enter, **Then** a child node is created and selected for editing
2. **Given** a node is selected, **When** I press Tab, **Then** a sibling node is created
3. **Given** a node is selected, **When** I press Delete or Backspace, **Then** the node (and its children, with confirmation) is removed
4. **Given** a node is selected, **When** I press arrow keys (Up/Down/Left/Right), **Then** focus moves to the appropriate adjacent node in the tree
5. **Given** I have made changes, **When** I press Ctrl+Z (Cmd+Z on Mac), **Then** the last action is undone
6. **Given** I have undone an action, **When** I press Ctrl+Y (Cmd+Shift+Z on Mac), **Then** the action is redone
7. **Given** default mind-elixir layout (automatic tree positioning), **When** I add or remove nodes, **Then** the layout adjusts automatically without manual positioning

---

### User Story 5 - Visual Indicators for Planning Status (Priority: P2)

As a user reviewing my action plan visually, I want to see at-a-glance indicators (badges, icons, or color coding) showing which nodes have due dates, are overdue, are completed, or have assignees, so that I can quickly assess progress without opening each node's details.

**Why this priority**: Enhances usability and aligns with "visual planning" focus, but not essential for MVP export functionality. Can iterate based on user feedback.

**Independent Test**: Can be fully tested by creating nodes with various statuses and due dates, then visually inspecting the map to verify that completed tasks show a checkmark, overdue tasks show a warning icon, and assigned tasks show an assignee badge.

**Acceptance Scenarios**:

1. **Given** a node has Status = "Completed", **When** I view the map, **Then** the node displays a checkmark icon or green indicator
2. **Given** a node has a Due Date in the past and Status ≠ "Completed", **When** I view the map, **Then** the node displays a red or amber warning indicator
3. **Given** a node has an Assignee, **When** I view the map, **Then** the node displays an avatar icon or assignee initials
4. **Given** a node has Invested Time or Elapsed Time, **When** I hover over it, **Then** a tooltip shows the time estimates
5. **Given** a node has no planning attributes, **When** I view the map, **Then** it displays as a standard mind-elixir node without extra indicators

---

### User Story 6 - Optional LocalStorage Auto-Save for Convenience (Priority: P3)

As a user working on a map during a coaching session, I want the system to optionally auto-save my progress to browser localStorage, so that if I accidentally close the tab or browser crashes, I can recover my work.

**Why this priority**: Nice-to-have convenience feature that does not compromise constitutional principles (user still controls explicit save/load). Lower priority than core MVP features.

**Independent Test**: Can be fully tested by enabling auto-save, creating a map, closing the tab without explicit save, reopening the app, and verifying that the "Recover Last Session" option appears and restores the map.

**Acceptance Scenarios**:

1. **Given** I have enabled auto-save in settings, **When** I make changes to the map, **Then** the system saves to localStorage every N seconds (e.g., 30s)
2. **Given** I close the browser without explicit save, **When** I reopen the app, **Then** a banner or modal prompts: "Recover last session?"
3. **Given** I click "Recover", **When** the app loads, **Then** my last working state is restored with all nodes and attributes
4. **Given** I click "Start Fresh", **When** the app loads, **Then** localStorage is cleared and I see a blank canvas
5. **Given** I explicitly save to a file and close the browser, **When** I reopen the app, **Then** localStorage recovery does not override my explicit file-based workflow

---

### Edge Cases

- **What happens when a user tries to load a mind map file from an older version with a different schema?**  
  → System should detect version mismatch, attempt to migrate gracefully (add missing fields as null), and log a warning. If migration fails, show a clear error message.

- **What happens when a user exports a very large mind map (500+ nodes) to CSV/MS-WORD?**  
  → System should handle export without freezing the UI (consider async processing or progress indicator). CSV should remain valid. MS-WORD should paginate or use a scrollable table.

- **What happens when a user sets a Start Date that is after the Due Date?**  
  → System should either prevent this with validation (warning message) or allow it but flag it visually in the export (e.g., "Invalid date range").

- **What happens when a user drags and drops a non-JSON file onto the canvas?**  
  → System should detect the invalid file type and display a user-friendly error without crashing: "Please load a valid .json mind map file."

- **What happens when the browser does not support localStorage (e.g., private browsing)?**  
  → Auto-save feature should gracefully disable with a notification: "Auto-save unavailable in this browser mode. Please save manually."

- **What happens when a user's browser blocks file downloads (security policy)?**  
  → System should detect the failure and display an error message: "Unable to save file. Please check your browser's download settings."

## Requirements

### Functional Requirements

- **FR-001**: System MUST extend mind-elixir-core's node data model with six optional, backwards-compatible attributes: Start Date (ISO 8601 or null), Due Date (ISO 8601 or null), Invested Time (numeric hours or null), Elapsed Time (numeric hours or null), Assignee (string or null), Status (enum or null)

- **FR-002**: System MUST provide a UI component (side panel, modal, or inline editor) to view and edit the six planning attributes for any selected node without cluttering the core map view

- **FR-003**: System MUST preserve mind-elixir-core's default keyboard shortcuts (Enter for child, Tab for sibling, Delete, arrow navigation, Ctrl+Z/Y undo/redo) and automatic layout algorithm

- **FR-004**: System MUST support Save operation: serialize the entire mind map (structure + attributes) to a JSON file and trigger browser download

- **FR-005**: System MUST support Load operation: parse a JSON file (via file picker or drag-and-drop) and reconstruct the mind map with all nodes, structure, and planning attributes intact

- **FR-006**: System MUST support Export to CSV: flatten the tree structure into a table with columns [Node ID, Depth, Title, Start Date, Due Date, Invested Time, Elapsed Time, Assignee, Status, Parent Path] and trigger browser download

- **FR-007**: System MUST support Export to MS-WORD: generate a formatted MS-WORD table with the same columns as CSV, viewable in browser or printable

- **FR-008**: System MUST display visual indicators (icons, badges, or color coding) on nodes with planning attributes (e.g., checkmark for "Completed", warning for overdue, assignee badge)

- **FR-009**: System MUST validate file format on load and display a clear error message if the file is invalid or corrupted, without crashing

- **FR-010**: System MUST maintain stable node IDs across save/load/export cycles to support external tracking and version control

- **FR-011**: System MUST NOT make network requests during normal operation (no external APIs, no telemetry) except for opt-in future enhancements explicitly approved

- **FR-012**: System MUST function entirely within the browser with no backend services, login, or cloud storage required (Offline-First principle)

- **FR-013**: System SHOULD optionally auto-save the working map to browser localStorage (if available and enabled) and offer a "Recover Last Session" prompt on reload

- **FR-014**: System SHOULD provide basic date validation (e.g., warn if Start Date > Due Date) but allow users to override

- **FR-015**: System SHOULD handle large maps (100+ nodes) gracefully without UI freezing during export operations

### Key Entities

- **Mind Map**: The root container representing a single planning session; consists of one central topic node and a tree of child nodes

- **Node**: A single element in the mind map tree; contains:
  - **Core attributes** (from mind-elixir-core): id, topic/title, parent reference, children array, position, style
  - **Extended attributes** (Memory Map additions): startDate, dueDate, investedTime, elapsedTime, assignee, status

- **Planning Attributes**: The six optional fields added to each node to support action planning (dates, time estimates, ownership, status)

- **Export Format**: Flattened representation of the tree structure as a table (CSV or MS-WORD) suitable for external consumption or printing

- **Saved File**: JSON representation of the Mind Map persisted to the user's file system; includes version metadata for future schema migrations

## Success Criteria

### Measurable Outcomes

- **SC-001**: A PEP coach can create a mind map with 20+ nodes, add planning attributes to at least 10 nodes, and export to CSV/MS-WORD in under 5 minutes

- **SC-002**: Users can save and reload a mind map file with 50+ nodes and all planning attributes preserved with 100% fidelity (no data loss)

- **SC-003**: The application loads and functions without any network requests during a typical session (verifiable via browser DevTools Network tab)

- **SC-004**: Users familiar with mind-elixir or FreeMind can perform basic operations (add child, add sibling, delete, navigate) using keyboard shortcuts on first use without training

- **SC-005**: 90% of exported CSV files can be opened in Excel or Google Sheets without formatting issues or data corruption

- **SC-006**: Visual status indicators (completed, overdue, assigned) are visible and understandable to users without requiring documentation (validated via user testing with 3+ coaches)

- **SC-007**: The application remains responsive (no UI freeze > 2 seconds) when exporting a mind map with up to 200 nodes

- **SC-008**: Zero server-side dependencies or third-party API calls in the MVP release (auditable via code review and network monitoring)

---

## Out of Scope (Constitutional Boundaries)

The following are **explicitly excluded** from the MVP per `.specify/memory/constitution.md`:

- Multi-user collaboration, real-time synchronization, or conflict resolution
- User accounts, authentication, or cloud-based storage
- Backend services or server-side processing
- Advanced scheduling logic (critical path analysis, automatic date propagation)
- Integrations with external tools (Jira, Trello, Microsoft Project, calendar systems)
- Mobile native apps (web-only for MVP)
- Advanced export formats beyond CSV/MS-WORD (PDF, Excel XLSX are optional if low-complexity)

---

## Dependencies & Constraints

- **Upstream Dependency**: `mind-elixir-core` (https://github.com/ssshooter/mind-elixir-core) - must monitor for breaking changes and maintain fork compatibility
- **Browser Compatibility**: Modern browsers (Chrome, Firefox, Safari, Edge) with ES6+ support, File API, and localStorage
- **Solo Developer Constraint**: All architectural decisions must be maintainable by one senior developer with GitHub Copilot assistance
- **No Build Complexity**: Minimal tooling (e.g., simple bundler if necessary, no complex monorepo or custom build pipeline)

---

## Next Steps

1. **Constitutional Gate**: ✅ Passed (validated against all five core principles)
2. **Speckit Plan**: Generate implementation plan (`/speckit.plan`) with phased approach respecting solo-developer + Copilot model
3. **Design Review**: Confirm UI/UX approach for attribute editor (side panel vs. modal) with stakeholder (coach) feedback
4. **Prototype**: Build proof-of-concept for node attribute extension and CSV export to validate technical feasibility
5. **User Testing**: Conduct usability session with 2-3 PEP coaches using prioritized user stories (P1 features first)

---

**Approved by**: [Awaiting Human Software Engineer review]  
**Speckit Agent**: Validated against constitution.md v1.0.0  
**Estimated Effort**: [To be determined in implementation plan phase]
