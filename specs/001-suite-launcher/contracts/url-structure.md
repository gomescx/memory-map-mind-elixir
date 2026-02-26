# URL Structure Contract: Suite Launcher and Deployment Restructure

**Branch**: `001-suite-launcher` | **Date**: 2026-02-22  
**Spec**: [spec.md](../spec.md) | **Plan**: [plan.md](../plan.md) | **Data Model**: [data-model.md](../data-model.md)

---

## Overview

This contract defines the URL-to-file mapping for the Effectiveness Toolkit deployed on GitHub Pages. The repository is `gomescx/memory-map-mind-elixir`, producing a base URL of `https://gomescx.github.io/memory-map-mind-elixir/`.

All paths below are relative to this base.

---

## Route Table

| Route | Method | Response | Source File | Status |
|-------|--------|----------|-------------|--------|
| `/` | GET | Launcher HTML page | `dist/index.html` | Implemented by this feature |
| `/tools/memory-map/` | GET | Memory Map React app | `dist/tools/memory-map/index.html` | Relocated by this feature |
| `/tools/memory-map/assets/*` | GET | JS/CSS bundles | `dist/tools/memory-map/assets/` | Vite-generated |
| `/tools/coer/` | GET | COER standalone form | `dist/tools/coer/index.html` | Already exists in `public/` |
| `/tools/<future-tool>/` | GET | Reserved for future tools | — | Not yet implemented |

## Redirect Behaviour (GitHub Pages Built-In)

| Request Path | Response |
|-------------|----------|
| `/tools/memory-map` (no trailing slash) | `301 → /tools/memory-map/` |
| `/tools/coer` (no trailing slash) | `301 → /tools/coer/` |
| `/tools/unknown/` | GitHub Pages default 404 |
| Any non-matching path | GitHub Pages default 404 |

> No custom redirect configuration is needed. GitHub Pages handles directory-to-`index.html` resolution and trailing-slash redirects automatically.

---

## Asset Path Resolution

### Memory Map App

All asset references in the Memory Map are resolved using the Vite `base` path.

| Context | `base` Value | Example Resolved Path |
|---------|-------------|----------------------|
| Production (GitHub Pages) | `/memory-map-mind-elixir/tools/memory-map/` | `/memory-map-mind-elixir/tools/memory-map/assets/memory-map-abc123.js` |
| Development (Vite dev server) | `/tools/memory-map/` | `/tools/memory-map/assets/memory-map-abc123.js` |

### Launcher Page

The launcher uses relative `href` values for tool links:

| Link Target | `href` Value | Resolves To (Production) |
|------------|--------------|--------------------------|
| Memory Map | `./tools/memory-map/` | `/memory-map-mind-elixir/tools/memory-map/` |
| COER Form | `./tools/coer/` | `/memory-map-mind-elixir/tools/coer/` |

> **Why relative paths**: The launcher is at `dist/index.html` (the root). Relative `./tools/...` paths work in both dev and prod without needing the repo name prefix.

### COER Form

The COER form is a standalone HTML file with no external asset references. All CSS and JS are inline. No `base` path configuration applies.

---

## Dev Server Routes

When running `npm run dev` (Vite dev server on `localhost:5173`):

| URL | Serves |
|-----|--------|
| `http://localhost:5173/` | `public/index.html` (launcher) |
| `http://localhost:5173/tools/memory-map/` | `tools/memory-map/index.html` (Memory Map, hot-reloaded) |
| `http://localhost:5173/tools/coer/` | `public/tools/coer/index.html` (COER, static) |

---

## Verification Checklist

After `npm run build`, verify:

1. `dist/index.html` exists and contains "Effectiveness Toolkit"
2. `dist/tools/memory-map/index.html` exists and contains `<div id="root">`
3. `dist/tools/coer/index.html` exists and is byte-identical to `public/tools/coer/index.html`
4. `dist/tools/memory-map/assets/` contains at least one `.js` and one `.css` file
5. No `index.html` exists at `dist/tools/memory-map/` that was sourced from `public/` (would indicate a publicDir conflict)

After `npx vite preview`:

6. `http://localhost:4173/memory-map-mind-elixir/` shows the launcher
7. Clicking "Memory Map Action Planner" navigates to `/memory-map-mind-elixir/tools/memory-map/`
8. Clicking "COER Form" navigates to `/memory-map-mind-elixir/tools/coer/`
9. Memory Map app loads and is fully functional at its new URL

---

## Cross-References

| Artifact | Relevant sections |
|----------|-------------------|
| [spec.md](../spec.md) | FR-US2.3 (base path), FR-000.2 (independent access), Edge Cases (trailing slash) |
| [plan.md](../plan.md) | AD-002 (conditional base), AD-004 (no custom redirects) |
| [research.md](../research.md) | R-002 (base path dev/prod), R-004 (trailing slash behaviour) |
| [data-model.md](../data-model.md) | URL Route Dictionary, Build Output Dictionary |
