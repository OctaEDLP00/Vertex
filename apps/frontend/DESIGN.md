# Vertex Design System & UX Manifesto

This document defines the visual identity, design tokens, and user experience (UX) principles for Vertex. Any generated component or page (by humans or AI) must strictly adhere to these guidelines.

## 1. Design Principles

- **Radical Minimalism:** Eliminate unnecessary borders, noisy backgrounds, and heavy decorations. Prioritize clean white space (gap, padding) to separate distinct layout sections.
- **Visual Performance:** The interface must feel instantaneous. Avoid complex animations or heavy transitions that degrade perceived loading speeds.
- **Content-First Approach:** Source code, file trees, and Git logs are the true protagonists. The surrounding UI must remain subtle, flat, and supportive.

## 2. Design Tokens (Tailwind CSS)

### Color Palette (Strict Dark Mode)

- **Canvas Base (Background):** `#0d1117` (The absolute root background of the application)
- **Surface (Containers/Cards):** `#161b22` (Table headers, collapsible panels, modals, dropdowns)
- **Border:** `#30363d` (Thin, subtle, flat dividers)
- **Text Primary:** `#e6edf3` (Headings, primary text, source code text)
- **Text Secondary:** `#7d8590` (Metadata, relative timestamps, secondary descriptions)
- **Accent Blue:** `#2f81f7` (Hyperlinks, active tab states, primary action buttons)

### Typography & Border Radius

- **UI Text:** Modern sans-serif (Inter, System UI) with strict typographic hierarchy.
- **Code Text:** Flat monospace for commit hashes, file paths, and terminal outputs.
- **Corner Radius:** `rounded-md` (Subtle, professional rounding) for containers, inputs, and buttons. Do not use pill-shaped or overly rounded borders on main layouts.

## 3. Core Component Guidelines

### File Explorer Table

- Elastic layout utilizing `table-fixed` for structural reliability.
- Text cells must cleanly handle long strings using ellipsis clipping via `truncate`.
- Rows must feature subtle high-contrast hover states (`hover:bg-[#161b22]`) and shift text links instantly to `Accent Blue`.

### Authentication Forms (Auth)

- Perfectly centered single-card layout without heavy drop shadows.
- Input fields must use the canvas base background (`#0d1117`), a subtle border, and a flat focus ring that shifts strictly to the `Accent Blue` color token.
