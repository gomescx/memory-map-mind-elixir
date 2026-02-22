# Feature Specification: Suite Launcher and Deployment Restructure

**Feature Branch**: `001-suite-launcher`  
**Created**: 2026-02-22  
**Status**: Draft  
**Input**: User description: "Create a minimal suite launcher page and restructure the repository deployment so that all Effectiveness Toolkit tools are accessible from a single GitHub Pages deployment."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Discover and Navigate to a Toolkit Tool (Priority: P1)

A coach or executive visits the suite's root URL and is greeted by the Effectiveness Toolkit launcher page. They can read a brief description of the toolkit, see all available tools with their names and a one-line description, and click a link to go directly to the tool they need.

**Why this priority**: This is the primary entry point to the suite. Without it, the root URL serves nothing meaningful. All other deployment restructuring work only has value when navigation from the launcher works.

**Independent Test**: Can be fully tested by opening the deployed root URL (`/`), verifying the launcher page loads, and confirming each tool link navigates to the correct destination.

**Acceptance Scenarios**:

1. **Given** the user opens the suite root URL in a browser, **When** the page finishes loading, **Then** the page title displays "Effectiveness Toolkit" and at least two tool links are visible
2. **Given** the launcher page is loaded, **When** the user clicks the "Memory Map Action Planner" link, **Then** the browser navigates to `/tools/memory-map/` and the Memory Map app loads
3. **Given** the launcher page is loaded, **When** the user clicks the "COER Form" link, **Then** the browser navigates to `/tools/coer/` and the COER form loads
4. **Given** the launcher page has been loaded once, **When** the user is offline and revisits the launcher URL, **Then** the page still renders from browser cache without any network error

---

### User Story 2 - Access Memory Map at Its New URL (Priority: P2)

A coach bookmarks or directly navigates to `/tools/memory-map/` and the Memory Map app loads and functions exactly as before — all features intact, visual appearance unchanged. The app is fully functional as a standalone tool regardless of whether the user visited the launcher first.

**Why this priority**: The Memory Map app must continue to work after being relocated from the root. Any breakage here renders the existing tool unusable.

**Independent Test**: Can be fully tested by navigating directly to `/tools/memory-map/` (bypassing the launcher) and verifying the full Memory Map workflow (create node, add plan data, export CSV) completes successfully.

**Acceptance Scenarios**:

1. **Given** the user navigates directly to `/tools/memory-map/`, **When** the page loads, **Then** the Memory Map app renders identically to the previous root URL experience
2. **Given** the Memory Map app is open at `/tools/memory-map/`, **When** the user creates a node and saves, **Then** all existing functionality (plan panel, export, depth filter) operates without error
3. **Given** the user has navigated within the Memory Map app, **When** they press the browser back button, **Then** navigation behaves correctly without 404 errors

---

### User Story 3 - Access COER Form at Its Designated URL (Priority: P3)

A coach navigates to `/tools/coer/` and the COER standalone HTML form loads and functions completely, with no dependency on the Memory Map app or the launcher. The form is served without any build processing — it is the same HTML file deployed as-is.

**Why this priority**: COER tool is currently not served by GitHub Pages at all. This story makes it discoverable and accessible for the first time.

**Independent Test**: Can be fully tested by navigating directly to `/tools/coer/` (bypassing the launcher) and verifying the COER form loads, fields are interactive, and the form can be submitted/used.

**Acceptance Scenarios**:

1. **Given** the user navigates directly to `/tools/coer/`, **When** the page loads, **Then** the COER form renders correctly with all fields and controls visible
2. **Given** the COER form is loaded, **When** the user interacts with any form field, **Then** the form responds correctly without JavaScript errors
3. **Given** the COER HTML file has been placed in the correct public directory, **When** the Vite build runs, **Then** the file appears at `dist/tools/coer/index.html` without any content transformation

---

### User Story 4 - Future Tools Visible as Placeholders (Priority: P4)

A coach visiting the launcher sees that three future tools (Strength of Belief, Prioritization/TMM, Impact Map) are acknowledged on the page, even though they are not yet available. The placeholders give context for the toolkit's direction without being clickable dead-end links.

**Why this priority**: Communicates the complete suite vision to stakeholders; reinforces that the launcher can scale. Lower priority because the core navigation (US1–US3) delivers the immediate value.

**Independent Test**: Can be fully tested by inspecting the launcher page for three non-link placeholder entries representing the future tools.

**Acceptance Scenarios**:

1. **Given** the launcher page is loaded, **When** the user views the tool list, **Then** three future tools (Strength of Belief, Prioritization/TMM, Impact Map) are displayed as "coming soon" entries without active hyperlinks
2. **Given** a future tool placeholder is present, **When** the user attempts to click it, **Then** no navigation occurs and no error is thrown

---

### Edge Cases

- What happens when a user navigates to `/tools/memory-map` without a trailing slash? The deployed redirect behaviour must not result in a 404.
- What happens when a user navigates to an undefined path (e.g., `/tools/unknown/`)? GitHub Pages serves its default 404 page; this is acceptable behaviour for MVP.
- What happens if the Vite build base path is incorrect? Assets at `/tools/memory-map/` will 404. The base path configuration must be verified against the deployed URL structure.
- What happens if `public/index.html` exists while Vite also generates an `index.html` for the app? Vite would overwrite it. The configuration must ensure the launcher is placed at root and the app at `/tools/memory-map/`.

## Requirements *(mandatory)*

### Functional Requirements

#### FR-US1: Launcher Page

- **FR-US1.1**: The deployment MUST serve a static HTML page at the suite root URL (`/`) that displays the name "Effectiveness Toolkit" and a brief description of the suite's purpose
- **FR-US1.2**: The launcher page MUST display a navigable link to the Memory Map Action Planner at `/tools/memory-map/`
- **FR-US1.3**: The launcher page MUST display a navigable link to the COER Form at `/tools/coer/`
- **FR-US1.4**: The launcher page MUST display non-navigable placeholder entries for three future tools: Strength of Belief, Prioritization/TMM, and Impact Map, each labelled "Coming Soon" or equivalent
- **FR-US1.5**: The launcher page MUST function without any network requests after initial load (no external fonts, CDN scripts, analytics, or tracking)
- **FR-US1.6**: The launcher page MUST NOT set any cookies, send telemetry, or load third-party scripts
- **FR-US1.7**: The launcher page MUST be a static HTML file placed in `public/index.html` so that Vite copies it to `dist/index.html` without processing

#### FR-US2: Memory Map Relocation

- **FR-US2.1**: The Vite build MUST output all Memory Map app assets into `dist/tools/memory-map/` (not the root `dist/` directory)
- **FR-US2.2**: The Memory Map app MUST be fully functional when accessed at `/tools/memory-map/` — all existing features (mind-elixir canvas, plan panel, export, shortcuts) MUST work without modification
- **FR-US2.3**: The base path used for all Memory Map asset references MUST be `/memory-map-mind-elixir/tools/memory-map/` (reflecting the GitHub Pages repository sub-path)

#### FR-US3: COER Form Deployment

- **FR-US3.1**: The standalone COER HTML file MUST be placed at `public/tools/coer/index.html` so Vite copies it to `dist/tools/coer/index.html` without modification
- **FR-US3.2**: The COER form MUST be accessible at `/tools/coer/` after deployment
- **FR-US3.3**: No build tooling or processing MUST be applied to the COER HTML file — it is deployed as-is

#### FR-000: Deployment & Infrastructure

- **FR-000.1**: The existing GitHub Actions deployment workflow MUST continue to deploy the `dist/` directory to GitHub Pages without changes to the workflow file
- **FR-000.2**: Each tool (Memory Map, COER) MUST be independently accessible by direct URL without passing through the launcher
- **FR-000.3**: The launcher's existence or absence MUST NOT affect the ability of any tool to load and function

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user can reach any deployed tool in two clicks or fewer starting from the suite root URL
- **SC-002**: The Memory Map app at `/tools/memory-map/` is feature-identical to its previous root URL deployment — zero regression in manually verified workflows (create node, add plan, export CSV)
- **SC-003**: The COER form at `/tools/coer/` is accessible and fully interactive immediately after deployment — this is its first publicly accessible deployment
- **SC-004**: The `dist/` directory produced by the Vite build contains exactly three top-level entry points: `dist/index.html` (launcher), `dist/tools/coer/index.html` (COER), and `dist/tools/memory-map/index.html` (Memory Map app)
- **SC-005**: The launcher page scores 100% on a manual offline check: loaded once, then accessible without network (standard browser cache behaviour)
- **SC-006**: The GitHub Actions deployment pipeline completes successfully with zero workflow file changes

## Assumptions

- The GitHub Pages repository sub-path is `/memory-map-mind-elixir/` — this is the existing deployed base URL and must be preserved in the Memory Map's base path configuration
- Vite's `publicDir` mechanism (copying `public/` to `dist/`) is sufficient to place both the launcher and the COER tool in the correct output locations without a multi-page app configuration for those files
- The Memory Map app currently uses `base: '/memory-map-mind-elixir/'` in `vite.config.ts`; this must be updated to `base: '/memory-map-mind-elixir/tools/memory-map/'`
- The COER HTML file already exists at `public/tools/coer/index.html` (moved as part of the constitution v1.3.0 follow-up) and requires no further changes to its content
- No shared CSS framework, design system, or component library is introduced; the launcher's visual design is achieved with minimal inline or embedded CSS
- Browser-level caching is sufficient for the offline-after-first-load requirement; no service worker or PWA manifest is needed for MVP
- The three future tool placeholders do not require linked pages, routing configuration, or placeholder HTML files — a styled "coming soon" list item is sufficient
