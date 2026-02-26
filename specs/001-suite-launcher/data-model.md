# Data Model: Suite Launcher and Deployment Restructure

**Branch**: `001-suite-launcher` | **Date**: 2026-02-22  
**Spec**: [spec.md](spec.md) | **Plan**: [plan.md](plan.md)

---

## Overview

This feature has no runtime data model (no database, no state, no API). The "model" for this feature is the **launcher content structure** and the **deployment file layout**. This document defines both with exact field names so implementation is unambiguous.

---

## Entity: Tool Entry (Launcher Content)

Each tool displayed on the launcher page is described by the following fields. This is a design-time entity embedded directly in the HTML — not a JavaScript data structure.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | yes | Display name of the tool |
| `description` | string | yes | One-line description of what the tool does |
| `href` | string | conditional | Relative URL path to the tool. Required for deployed tools, absent for placeholders. |
| `status` | enum | yes | `"available"` or `"coming-soon"` |

### Data Dictionary

| Field | Exact HTML Attribute/Element | Example Value |
|-------|------------------------------|---------------|
| `name` | `<h2>` or `<a>` text content | `"Memory Map Action Planner"` |
| `description` | `<p>` text content | `"Brainstorm a plan using memory map and create an action plan"` |
| `href` | `<a href="...">` attribute | `"./tools/memory-map/"` |
| `status` | CSS class on container element | `class="tool-card"` or `class="tool-card coming-soon"` |

### Tool Registry (Launcher Content)

| `name` | `description` | `href` | `status` |
|---------|---------------|---------|----------|
| Memory Map Action Planner | Brainstorm a plan using memory map and create an action plan | `./tools/memory-map/` | `available` |
| COER Form | Define Clarity Of End Result (COER) for each initiative | `./tools/coer/` | `available` |
| Strength of Belief | Increase COER confidence by dealing with obstacles | — | `coming-soon` |
| Prioritization / TMM | Rank initiatives using the Time Management Matrix | — | `coming-soon` |
| Impact Map | Reduce the impact of obstacles you cannot resolve | — | `coming-soon` |

> **Note**: Descriptions are indicative. Final copy to be refined during implementation. The table serves as the canonical reference for exactly which tools appear and in what order.

---

## Entity: Build Output File

The Vite build produces a deterministic `dist/` directory. Each entry point is a distinct file.

| Field | Type | Description |
|-------|------|-------------|
| `path` | string | Path relative to `dist/` root |
| `source` | enum | `"publicDir"` (copied as-is) or `"vite-build"` (processed by Vite) |
| `tool` | string | Which tool this file belongs to |
| `content-type` | string | MIME type served by GitHub Pages |

### Build Output Dictionary

| `path` | `source` | `tool` | `content-type` |
|--------|----------|--------|-----------------|
| `index.html` | `publicDir` | Launcher | `text/html` |
| `tools/coer/index.html` | `publicDir` | COER Form | `text/html` |
| `tools/memory-map/index.html` | `vite-build` | Memory Map | `text/html` |
| `tools/memory-map/assets/memory-map-[hash].js` | `vite-build` | Memory Map | `application/javascript` |
| `tools/memory-map/assets/memory-map-[hash].css` | `vite-build` | Memory Map | `text/css` |

> **Verification**: After `npm run build`, run `find dist -name 'index.html' | sort` and confirm exactly three paths.

---

## Entity: Vite Configuration (Modified Fields)

Changes to `vite.config.ts` with exact field names and values.

| Config Path | Current Value | New Value | Rationale |
|-------------|---------------|-----------|-----------|
| `base` | `'/memory-map-mind-elixir/'` | `command === 'serve' ? '/tools/memory-map/' : '/memory-map-mind-elixir/tools/memory-map/'` | Relocate app from root to `/tools/memory-map/` |
| `build.rollupOptions.input` | *(not set — defaults to `index.html`)* | `{ 'memory-map': resolve(__dirname, 'tools/memory-map/index.html') }` | Point Vite at relocated entry HTML |

> **Cross-ref**: See [research.md#R-001](research.md#r-001-vite-multi-page-build-with-relocated-entry-point) and [research.md#R-002](research.md#r-002-vite-base-path--dev-vs-production) for full rationale.

---

## Entity: URL Route

The deployed URL structure served by GitHub Pages.

| Field | Type | Description |
|-------|------|-------------|
| `route` | string | URL path relative to repo root |
| `resolves_to` | string | File in `dist/` that serves this route |
| `redirect` | string or null | If the route triggers a redirect, the target |

### URL Route Dictionary

| `route` | `resolves_to` | `redirect` |
|---------|---------------|------------|
| `/memory-map-mind-elixir/` | `dist/index.html` | — |
| `/memory-map-mind-elixir/tools/memory-map/` | `dist/tools/memory-map/index.html` | — |
| `/memory-map-mind-elixir/tools/memory-map` | — | `301 → /memory-map-mind-elixir/tools/memory-map/` |
| `/memory-map-mind-elixir/tools/coer/` | `dist/tools/coer/index.html` | — |
| `/memory-map-mind-elixir/tools/coer` | — | `301 → /memory-map-mind-elixir/tools/coer/` |
| `/memory-map-mind-elixir/tools/unknown/` | GitHub Pages 404 | — |

> **Cross-ref**: See [contracts/url-structure.md](contracts/url-structure.md) for the full routing contract and [research.md#R-004](research.md#r-004-github-pages-trailing-slash-behaviour) for redirect behaviour.

---

## State Transitions

N/A — the launcher is stateless. No user data is created, stored, or modified by this feature.

## Validation Rules

| Rule | Target | Criteria |
|------|--------|----------|
| Launcher loads offline | `dist/index.html` | No `<link>`, `<script>`, or `<img>` with external `src`/`href` |
| No cookies or tracking | `dist/index.html` | No `document.cookie`, no `<script>` tags with analytics |
| Build output complete | `dist/` | Exactly 3 `index.html` files at expected paths |
| COER unmodified | `dist/tools/coer/index.html` | Byte-identical to `public/tools/coer/index.html` |

---

## Cross-References

| Artifact | Relevant sections |
|----------|-------------------|
| [spec.md](spec.md) | FR-US1.1–US1.7 (launcher content), FR-US2.1–US2.3 (build output), SC-004 (dist structure) |
| [plan.md](plan.md) | AD-001 (entry relocation), AD-002 (base path), AD-003 (static launcher) |
| [research.md](research.md) | R-001 (multi-page), R-002 (base path), R-003 (publicDir), R-005 (migration) |
| [contracts/url-structure.md](contracts/url-structure.md) | Full routing contract |
