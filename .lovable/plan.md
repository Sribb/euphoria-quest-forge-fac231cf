

# Multiple Learning Pathways + Dashboard Refresh

## Overview

Two major changes: (1) Transform the Learn tab from a single "Investor's Saga" into a **Pathway Selector** with multiple learning tracks (Investing, Corporate Finance, Personal Finance, etc.), and (2) Modernize the Dashboard with a cleaner, more dynamic layout.

---

## Part 1: Multiple Learning Pathways

### Current State
- All 50 lessons live in a single linear pathway called "The Investor's Saga"
- Lessons table has no `category` or `pathway` column
- The `LearningPathway` component renders all lessons in one zigzag scroll

### What Changes

**Database Migration:**
- Add a `pathway` column to the `lessons` table (text, nullable, default `'investing'`)
- Update existing lessons with pathway assignments:
  - **Investing** (default): Lessons 1-12, 15, 16, 17, 20, 22, 24, 25, 33, 34, 35, etc. (core investing topics)
  - **Personal Finance**: Lessons 11, 28, 29, 44, 45, 46, 48 (retirement, estate, tax, budgeting)
  - **Corporate Finance**: Lessons 8, 30, 31, 32, 33 (financial statements, annual reports, valuation, earnings)
  - **Trading & Technical Analysis**: Lessons 13, 14, 21, 23, 25, 36, 42 (chart patterns, indicators, margin, momentum, algo)
  - **Alternative Assets**: Lessons 19, 22, 27, 39, 40, 41 (crypto, REITs, international, alternatives, ESG, commodities)

**New Component: `PathwaySelector`**
- A grid of visually distinct pathway cards the user sees first when entering the Learn tab
- Each card shows: icon, pathway name, description, lesson count, user progress (completed/total)
- Clicking a card navigates into that pathway's lesson list (existing `LearningPathway` component, filtered)

**Modified `Learn.tsx` Flow:**
- New state: `selectedPathway` (null = show selector, string = show filtered lessons)
- When no pathway selected: render `PathwaySelector`
- When pathway selected: render `LearningPathway` with filtered lessons + a back button
- When lesson selected: render `ThreePhaseLessonViewer` (unchanged)

**Modified `LearningPathway` Component:**
- Accept a `pathwayTitle` prop to customize the header (instead of always "The Investor's Saga")
- Accept a `pathwayIcon` and `pathwayColor` for visual theming per pathway

---

## Part 2: Dashboard Cleanup

### Current Issues
- Dense, card-heavy layout feels static
- Multiple competing sections (XPOrb, SeasonalBanner, QuickOverviewGrid, AIInsights, EconomicCalendar, Headlines) create visual clutter

### What Changes

**`DashboardHeader` Redesign:**
- Merge the XP orb and realtime indicator into the header row for a streamlined top bar
- Cleaner greeting with subtle animation (no pulsing underline bar)

**`QuickOverviewGrid` Modernization:**
- Use a sleek bento-grid style with subtle glassmorphism
- Larger Portfolio card spanning 2 columns on desktop as the hero element
- Cleaner typography, more whitespace, subtle hover micro-interactions (scale + shadow)
- Remove heavy gradients in favor of clean borders and light background tints

**`AIInsightsPanel` Simplification:**
- Horizontal scrollable insight cards instead of a stacked vertical list inside a bordered card
- Each insight is a compact pill/card with icon + short text
- Removes the heavy wrapping Card container

**Economic Section:**
- Collapse EconomicCalendar and LiveHeadlines into a single tabbed component to reduce vertical scroll
- Cleaner card styling with less visual noise

**`Dashboard.tsx` Layout:**
- Remove separate XPOrb and RealtimeIndicator rows (merged into header)
- Tighter spacing, fewer nested containers
- Smooth staggered fade-in animations using framer-motion for a polished feel

---

## Technical Details

### New Files
- `src/features/learning/components/PathwaySelector.tsx` - Grid of pathway cards

### Modified Files
- `supabase/migrations/` - Add `pathway` column + update lesson rows
- `src/pages/Learn.tsx` - Add pathway selection state and routing
- `src/features/learning/components/LearningPathway.tsx` - Accept pathway-specific props, update header
- `src/pages/Dashboard.tsx` - Restructured layout, merge XP/indicator into header
- `src/features/dashboard/components/DashboardHeader.tsx` - Integrate XPOrb + RealtimeIndicator inline
- `src/features/dashboard/components/QuickOverviewGrid.tsx` - Bento-grid redesign with glassmorphism
- `src/features/dashboard/components/AIInsightsPanel.tsx` - Horizontal scroll cards
- New combined economic widget or tabbed wrapper for EconomicCalendar + Headlines

### Pathway Data Structure
Each pathway card defined in the `PathwaySelector` component with:
- `id` (matches the `pathway` column value)
- `title`, `description`, `icon` (Lucide icon), `color` (gradient)
- Lesson count and progress computed from filtered query results

