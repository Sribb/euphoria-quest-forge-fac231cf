

## Daily P&L Card

A new premium floating card component for the Dashboard that displays today's profit/loss with dynamic visual effects.

### What You'll See

A dedicated card placed prominently on the Dashboard (between the SeasonalBanner and QuickOverviewGrid) showing:

- **"TODAY"** label
- **Dollar P&L** (e.g., +$143.28)
- **Percentage change** (e.g., +1.42%)
- Green gradient background + pulsing glow when positive
- Red gradient background + pulsing glow when negative
- Smooth entry animation

### How It Works

The card calculates daily P&L by comparing the current portfolio value against the previous day's closing value from `transaction_logs`. If no prior-day data exists, it compares against the initial $10,000 starting balance.

### Technical Details

**New file:** `src/features/dashboard/components/DailyPnLCard.tsx`
- Uses `usePortfolioValue` hook for current total value
- Queries `transaction_logs` for yesterday's closing portfolio snapshot (or falls back to comparing against starting balance)
- Conditional styling: green gradient (`from-emerald-500/10 to-green-500/5`) with green glow when positive, red gradient (`from-red-500/10 to-rose-500/5`) with red glow when negative
- Pulsing glow animation via `framer-motion` (`animate` with repeating opacity)
- Entry animation: fade-up with scale

**Edited file:** `src/pages/Dashboard.tsx`
- Import and render `DailyPnLCard` as a new `motion.div` block after SeasonalBanner and before QuickOverviewGrid

