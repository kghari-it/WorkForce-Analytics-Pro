# Design Guidelines: Rubber Farm Productivity Tracker

## Design Approach
**Selected Approach:** Design System - Material Design with productivity tool aesthetics (inspired by Linear, Notion)

**Rationale:** This is a utility-focused data entry and tracking application where efficiency, clarity, and mobile usability are paramount. Material Design provides excellent form patterns and data display components while maintaining accessibility.

## Core Design Elements

### A. Typography
- **Primary Font:** Inter or Roboto via Google Fonts CDN
- **Hierarchy:**
  - Page titles: text-2xl font-semibold (24px)
  - Section headers: text-lg font-medium (18px)
  - Body/labels: text-base font-normal (16px)
  - Table headers: text-sm font-medium uppercase tracking-wide (14px)
  - Helper text: text-sm text-gray-600 (14px)

### B. Layout System
**Spacing Primitives:** Use Tailwind units of 2, 4, 6, 8, and 12
- Component padding: p-4 to p-6
- Section spacing: gap-6 to gap-8
- Form field spacing: space-y-4
- Container max-width: max-w-4xl for forms, max-w-6xl for dashboard

**Grid Structure:**
- Daily Entry: Single column on mobile, maintain single column on desktop for clarity
- Dashboard: Responsive table with horizontal scroll on mobile
- Settings panel: Single column form layout

### C. Component Library

**Navigation/Header:**
- Fixed top bar with app title "Rubber Farm Tracker"
- Tab navigation for Daily Entry / Dashboard / Settings
- Tabs should be full-width on mobile, inline on desktop
- Active tab indicator with bottom border (h-1)

**Daily Entry Form:**
- Date picker at top with "Today" quick-select button
- Three worker cards in vertical stack (gap-4)
- Each card contains:
  - Worker name (editable icon next to name)
  - Worked checkbox with clear label
  - Sheets tapped number input (min="0" step="1")
  - Computed salary display (read-only, visually distinct)
- Daily total banner above Save button (sticky on mobile)
- Save button: Full-width on mobile, fixed-width on desktop (min-w-32)
- Warning toast for validation (non-blocking, dismissible)

**Dashboard View:**
- Date range filter controls at top (from/to date pickers, Apply button)
- Stats cards showing grand totals (3-column grid on tablet+, single column on mobile)
- Data table with sticky header:
  - Columns: Date, Worker, Days Worked, Total Salary, Total Sheets
  - Alternating row backgrounds for readability
  - Per-worker subtotal rows (visually distinct with font-medium)
- Export/Import CSV buttons group at bottom

**Settings Panel:**
- Simple form with worker name inputs
- Each worker name field with label and text input
- Save Settings button at bottom
- Reset to defaults link (text-sm text-blue-600)

**Form Controls:**
- Checkboxes: Size w-5 h-5 with rounded corners
- Number inputs: Border, rounded, p-2, with increment/decrement buttons visible
- Text inputs: Border, rounded, p-2, focus ring
- Buttons: Rounded, p-2 px-4, medium font-weight
- Primary action: Solid background
- Secondary action: Outlined variant

**Data Display:**
- Tables: Clean borders, padding p-3, zebra striping
- Stat cards: Border, rounded-lg, p-4
- Salary amounts: Monospace font (font-mono) for alignment
- Success states: Subtle success indicators (not distracting)

### D. Animations
**Minimal animation strategy:**
- Form validation warnings: Simple fade-in (duration-200)
- Tab transitions: None (instant switch)
- Save confirmation: Brief fade-in toast (duration-300)
- NO scroll animations, NO hover transitions beyond standard button states

## Mobile-First Considerations
- Touch-friendly targets: Minimum 44px height for all interactive elements
- Generous spacing between form fields (space-y-6 on mobile)
- Sticky Save button on mobile Daily Entry view
- Horizontal scroll for dashboard table with fixed first column
- Large, clear labels for checkboxes and inputs
- Date pickers should use native mobile inputs for better UX

## Accessibility
- All form inputs with associated labels (for/id pairs)
- Checkbox states clearly indicated with both checkmark and border
- Focus indicators on all interactive elements (ring-2 ring-offset-2)
- Sufficient contrast ratios (WCAG AA minimum)
- Keyboard navigation support for all actions
- ARIA labels for icon buttons and controls

## Images
**No hero images required.** This is a data-entry utility application where immediate access to functionality is prioritized over marketing visuals.