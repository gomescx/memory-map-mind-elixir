# Quickstart: Suite Launcher and Deployment Restructure

**Branch**: `001-suite-launcher` | **Spec**: [spec.md](spec.md) | **Plan**: [plan.md](plan.md)

---

## Prerequisites

- Node.js 18+ (matches deploy workflow)
- `npm ci` (dependencies already installed)

---

## Development

```bash
# Start dev server — serves launcher + Memory Map + COER
npm run dev
```

| URL | What loads |
|-----|------------|
| `http://localhost:5173/` | Launcher page |
| `http://localhost:5173/tools/memory-map/` | Memory Map app (hot reload) |
| `http://localhost:5173/tools/coer/` | COER form (static) |

---

## Build & Verify

```bash
# Build for production
npm run build

# Verify the dist/ structure (should show exactly 3 index.html files)
find dist -name 'index.html' | sort
# Expected:
#   dist/index.html
#   dist/tools/coer/index.html
#   dist/tools/memory-map/index.html

# Preview production build locally
npx vite preview
```

| URL | What loads |
|-----|------------|
| `http://localhost:4173/memory-map-mind-elixir/` | Launcher |
| `http://localhost:4173/memory-map-mind-elixir/tools/memory-map/` | Memory Map |
| `http://localhost:4173/memory-map-mind-elixir/tools/coer/` | COER form |

---

## Verification Checklist (Manual)

After build:

- [ ] `dist/index.html` contains "Effectiveness Toolkit"
- [ ] `dist/tools/memory-map/index.html` contains `<div id="root">`
- [ ] `dist/tools/coer/index.html` matches `public/tools/coer/index.html` (unchanged)
- [ ] `dist/tools/memory-map/assets/` has `.js` and `.css` files

After preview:

- [ ] Launcher page loads at root URL
- [ ] "Memory Map Action Planner" link navigates correctly
- [ ] "COER Form" link navigates correctly
- [ ] Memory Map app is fully functional (create node, add plan, export)
- [ ] COER form fields are interactive
- [ ] Three "coming soon" placeholders are visible, not clickable

---

## Key Files

| File | Role |
|------|------|
| `public/index.html` | Launcher page (static, created by this feature) |
| `tools/memory-map/index.html` | Vite entry for Memory Map (moved from root `index.html`) |
| `public/tools/coer/index.html` | COER form (pre-existing, unchanged) |
| `vite.config.ts` | Build config (modified: `base` + `rollupOptions.input`) |

---

## Cross-References

| Artifact | Relevant sections |
|----------|-------------------|
| [plan.md](plan.md) | Architecture decisions AD-001 through AD-004 |
| [data-model.md](data-model.md) | Build output dictionary, Vite config changes |
| [contracts/url-structure.md](contracts/url-structure.md) | Complete route table and verification |
