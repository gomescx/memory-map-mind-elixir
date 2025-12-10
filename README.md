# Memory Map Action Planner

> *"From messy ideas to clear action — in minutes."*

An offline-first visual planning tool that transforms mind maps into structured, actionable plans. Built to support the Personal Efficiency Program (PEP) methodology, this application combines the creative freedom of mind mapping with essential planning attributes like time tracking, task sequencing, and export capabilities.

[![Built with React](https://img.shields.io/badge/React-18.2-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF.svg)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](#)

## ✨ Features

### 🎨 Visual Mind Mapping
- Interactive mind map interface powered by [mind-elixir](https://github.com/ssshooter/mind-elixir-core)
- Intuitive node creation with Tab (child) and Enter (sibling)
- Drag-and-drop node repositioning
- Expandable/collapsible tree structure

### 📋 Planning Attributes
Each node supports comprehensive planning data:
- **Start Date** & **Due Date** - Timeline tracking
- **Invested Time** (hours) - Actual effort spent
- **Elapsed Time** (days) - Calendar time from start to finish
- **Assignee** - Who's responsible
- **Status** - Not Started, In Progress, or Completed

### 💾 Offline-First Architecture
- Works completely offline after initial page load
- Browser-based file operations (no server required)
- Save/Load maps as JSON files with versioning
- Reset map to fresh state

### 📤 Export Capabilities
- **CSV Export** - Flattened tree structure with parent path traceability
- **HTML Table Export** - Word-friendly formatted tables with summary statistics
- Stable node IDs for tracking across exports

### ⌨️ Keyboard Shortcuts
- `Ctrl+Z` / `Cmd+Z` - Undo
- `Ctrl+Y` / `Cmd+Shift+Z` - Redo
- `Ctrl+P` / `Cmd+P` - Toggle plan panel
- Plus all [mind-elixir shortcuts](https://github.com/ssshooter/mind-elixir-core#shortcuts)

### 🎯 Visual Indicators
- **Badges** - Quick visual status at-a-glance (✅ ⏳ ⭕ ⚠️)
- **Tooltips** - Hover to see full planning details
- **Side Panel** - Edit planning attributes with validation

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Modern web browser (Chrome, Firefox, Safari, or Edge)

### Installation

```bash
# Clone the repository
git clone https://github.com/gomescx/memory-map-mind-elixir.git
cd memory-map-mind-elixir

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` to see the application running.

### Building for Production

```bash
# Build optimized production bundle
npm run build

# Preview production build
npm run preview
```

The build output will be in the `dist/` directory. Deploy these static files to any web host (GitHub Pages, Netlify, Vercel, etc.).

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage

# Run end-to-end tests
npm run test:e2e

# Debug e2e tests
npm run test:e2e:debug
```

## 📁 Project Structure

```
memory-map-mind-elixir/
├── src/
│   ├── core/           # Type definitions and core utilities
│   ├── services/       # Business logic (export, storage)
│   ├── state/          # State management and history
│   ├── ui/             # React components and UI logic
│   │   ├── actions/    # User action handlers
│   │   ├── badges/     # Visual indicators
│   │   ├── panels/     # Side panels
│   │   └── tooltips/   # Hover tooltips
│   └── utils/          # Validation and helpers
├── tests/
│   ├── unit/           # Component and service tests
│   ├── integration/    # Feature integration tests
│   └── contract/       # Export format validation
├── docs/               # Implementation documentation
└── specs/              # Feature specifications
```

## 🛠️ Technology Stack

### Core
- **React 18.2** - UI framework
- **TypeScript 5.3** - Type safety
- **Vite 5.0** - Build tool and dev server

### Libraries
- **mind-elixir 5.3** - Mind mapping engine

### Testing
- **Vitest** - Unit and integration testing
- **Playwright** - End-to-end testing
- **jsdom** - DOM testing environment

### Code Quality
- **ESLint** - Linting with TypeScript rules
- **TypeScript Strict Mode** - Maximum type safety

## 💡 Usage Examples

### Basic Workflow

1. **Create your mind map** - Start typing your central topic, press Tab to add children, Enter for siblings
2. **Add planning details** - Click a node and press `Ctrl+P` to open the plan panel
3. **Fill in attributes** - Set dates, time estimates, assignees, and status
4. **Visual feedback** - See badges appear on nodes with planning data
5. **Save your work** - Click "Save Map" to download a JSON file
6. **Export plans** - Generate CSV or HTML reports for sharing

### Loading Saved Maps

1. Click "Load Map" button
2. Select your previously saved `.json` file
3. Your mind map restores with all planning data intact

### Exporting to CSV

The CSV export includes:
- Hierarchical structure with depth indicators
- Parent path for traceability (e.g., "Project > Phase 1 > Task A")
- All planning attributes in columns
- Compatible with Excel, Google Sheets, and project management tools

### Exporting to HTML

The HTML export creates:
- Formatted table with visual hierarchy (indentation)
- Summary statistics (node counts, time totals)
- Word-compatible styling for easy document integration

## 🎯 Use Cases

### Executive Coaching (PEP)
Coaches guide executives through visual brainstorming sessions, capturing ideas as a mind map, then converting it into a structured action plan with clear timelines and responsibilities.

### Project Planning
Transform high-level project ideas into detailed task breakdowns with time estimates and dependencies, all while maintaining the visual overview.

### Personal Productivity
Organize personal goals, break them into actionable steps, track progress, and export plans for reference or sharing with accountability partners.

### Team Workshops
Facilitate collaborative ideation sessions, capture outputs visually, and generate exportable action items with clear ownership.

## 🔐 Privacy & Data

- **100% Client-Side** - No data is sent to any server
- **Local Storage** - All data stays in your browser or local files
- **No Tracking** - No analytics, cookies, or telemetry
- **No Account Required** - No sign-up, no personal information collected

## 🤝 Contributing

Contributions are welcome! This project follows standard open-source practices:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript strict mode conventions
- Write tests for new features
- Update documentation as needed
- Run `npm run lint` before committing

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [mind-elixir](https://github.com/ssshooter/mind-elixir-core) by ssshooter - The excellent mind mapping engine that powers this application
- Personal Efficiency Program (PEP) methodology for inspiring the planning features
- The open-source community for the amazing tools and libraries

## 📚 Documentation

For detailed information about implementation and architecture:
- [Implementation Summaries](docs/) - Phase-by-phase development documentation
- [Specifications](specs/001-plan-memory-map/) - Feature specifications and contracts

## 🐛 Known Issues

- Test files contain some TypeScript type mismatches (doesn't affect production)
- Drag-drop file loading is implemented but not wired up to UI

## 🗺️ Roadmap

Future enhancements under consideration:
- Auto-save to browser localStorage
- Drag-and-drop file loading UI
- Additional export formats (Markdown, PDF)
- Color coding for status visualization
- Gantt chart view of timeline
- Collaboration features

## 📧 Contact

Project Maintainer: [@gomescx](https://github.com/gomescx)

Project Link: [https://github.com/gomescx/memory-map-mind-elixir](https://github.com/gomescx/memory-map-mind-elixir)

---

**Made with ❤️ for visual thinkers and action-oriented planners**
