# Research: Suite Launcher and Deployment Restructure

**Branch**: `001-suite-launcher` | **Date**: 2026-02-22  
**Spec**: [spec.md](spec.md) | **Plan**: [plan.md](plan.md)

---

## R-001: Vite Multi-Page Build with Relocated Entry Point

**Unknown**: How to move the Memory Map entry HTML from project root to `tools/memory-map/index.html` so Vite outputs the built app at `dist/tools/memory-map/` instead of `dist/`.

**Decision**: Use Vite's `build.rollupOptions.input` to specify a non-root entry point.

**Rationale**: Vite mirrors the input path structure in the output. An entry at `tools/memory-map/index.html` produces `dist/tools/memory-map/index.html` plus its asset chunks. This is Vite's standard multi-page pattern documented at [vitejs.dev/guide/build#multi-page-app](https://vitejs.dev/guide/build#multi-page-app). No plugins or post-build scripts needed.

**Configuration**:
```ts
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        'memory-map': resolve(__dirname, 'tools/memory-map/index.html'),
      },
    },
  },
});
```

**Key behaviour verified**:
- Absolute paths in the HTML (`/src/main.tsx`) resolve from project root regardless of HTML file location
- `publicDir` files still copy to `dist/` root (independent of entry point location)
- No conflict between `public/index.html` (launcher) and Vite-built `dist/tools/memory-map/index.html`

**Alternatives considered**:
- **Separate `outDir`** (`dist/tools/memory-map`): Breaks `publicDir` copy behaviour — `public/` would land inside `dist/tools/memory-map/` instead of `dist/` root. Would require post-build copy scripts.
- **Post-build script**: Adds complexity; fragile if Vite output names change. Violates Simplicity principle.
- **Vite `publicDir: false` + manual copy**: Over-engineering for this use case.

---

## R-002: Vite `base` Path — Dev vs. Production

**Unknown**: The Memory Map needs `base: '/memory-map-mind-elixir/tools/memory-map/'` for GitHub Pages, but this would require visiting `localhost:5173/memory-map-mind-elixir/tools/memory-map/` during development.

**Decision**: Use Vite's functional config to set `base` conditionally.

**Rationale**: Vite's `defineConfig` accepts a function that receives `{ mode, command }`. Use `command === 'serve'` (dev) vs. `command === 'build'` (prod) to return different base paths.

**Configuration**:
```ts
export default defineConfig(({ command }) => ({
  base: command === 'serve'
    ? '/tools/memory-map/'
    : '/memory-map-mind-elixir/tools/memory-map/',
}));
```

**Dev server behaviour**:
- Visit `http://localhost:5173/tools/memory-map/` to reach the Memory Map
- Visit `http://localhost:5173/` to reach the launcher (served from `public/index.html`)
- Visit `http://localhost:5173/tools/coer/` to reach the COER form (served from `public/tools/coer/`)

**Alternatives considered**:
- **Single base path** (`/memory-map-mind-elixir/tools/memory-map/`): Works in prod but dev experience is poor (long URL, requires repo name prefix locally).
- **Relative base** (`./`): Unreliable with client-side routing and nested paths.

---

## R-003: `publicDir` Interaction with Multi-Page Entry

**Unknown**: Does Vite still copy `public/` contents to `dist/` root when the entry point is not at project root?

**Decision**: Yes — `publicDir` copy behaviour is independent of entry point location.

**Rationale**: Vite's `publicDir` is a separate mechanism from the build entry. It copies the entire `public/` folder to the root of `outDir` during build, regardless of `rollupOptions.input` configuration. Verified in Vite source and documentation.

**Expected `dist/` output**:
```
dist/
├── index.html                    ← public/index.html (launcher)
├── tools/
│   ├── coer/
│   │   └── index.html            ← public/tools/coer/ (COER, as-is)
│   └── memory-map/
│       ├── index.html            ← Vite-built (Memory Map app)
│       └── assets/               ← Vite-built JS/CSS chunks
```

This matches SC-004: three top-level entry points.

---

## R-004: GitHub Pages Trailing Slash Behaviour

**Unknown**: What happens when a user visits `/tools/memory-map` (no trailing slash)?

**Decision**: GitHub Pages automatically serves `index.html` from directories and handles trailing-slash redirects. No custom handling needed.

**Rationale**: When GitHub Pages encounters a path like `/tools/memory-map` that corresponds to a directory containing `index.html`, it serves a 301 redirect to `/tools/memory-map/`. This is built-in behaviour. No `.htaccess`, `_redirects`, or custom 404 page is required.

**Edge case**: Paths that don't match any directory (e.g., `/tools/unknown/`) return GitHub Pages' default 404. The spec explicitly accepts this for MVP.

**Alternatives considered**:
- **Custom 404.html**: Could redirect unknown paths to the launcher. Over-engineering for MVP — acceptable to defer.
- **SPA-style routing** (404.html redirect hack): Not needed; each tool is at a known static path.

---

## R-005: Root `index.html` Migration Strategy

**Unknown**: The current root `index.html` is the Vite entry point for the Memory Map. Moving it changes a foundational file. What's the migration path?

**Decision**: Move `index.html` → `tools/memory-map/index.html` and create `public/index.html` (launcher) in a single atomic commit.

**Rationale**: This is the minimal change. The moved file retains its exact content (the `<script type="module" src="/src/main.tsx">` tag works because Vite resolves absolute paths from project root). No changes to the script path or any React component code needed.

**Steps**:
1. `mkdir -p tools/memory-map`
2. `git mv index.html tools/memory-map/index.html`
3. Create `public/index.html` (launcher)
4. Update `vite.config.ts` with new `rollupOptions.input` and `base`
5. Run `npm run build` and verify `dist/` structure matches SC-004

**Risk**: If any developer tooling or CI assumes root `index.html`, it will break. Mitigated by: the only consumer is Vite (configured via `rollupOptions.input`) and the deploy workflow (uploads `dist/`, doesn't reference source `index.html`).
