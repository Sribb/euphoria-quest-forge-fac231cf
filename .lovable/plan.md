

## Problem

The `ThreePhaseLessonViewer` routes lessons purely by `order_index` (1-25), ignoring `pathway`. All five pathways show the same Investing slides. The database has unique lesson titles per pathway, but no custom slide components exist for Personal Finance, Corporate Finance, Trading, or Alternative Assets.

## Plan

### 1. Create pathway-specific slide components (Lessons 1-10 for each of 4 pathways)

Each uses `BeginnerLessonTemplate` with 4-5 slides per lesson, including at least one interactive element (SliderSimulator, DragSortChallenge, or quiz). Total: **40 new files**.

**Personal Finance** (`src/features/learning/components/lessons/pf/`):
- `PF1FinancialStartingPoint.tsx` - Net worth calculator slider
- `PF2BudgetingWorks.tsx` - 50/30/20 budget drag-sort
- `PF3EmergencyFund.tsx` - Emergency fund months slider
- `PF4CreditScores.tsx` - Score factor drag-rank
- `PF5GoodVsBadDebt.tsx` - Interest rate slider comparison
- `PF6BankingAccounts.tsx` - APY compound slider
- `PF7PaycheckDeductions.tsx` - Tax bracket slider
- `PF8FinancialGoals.tsx` - Goal priority drag-sort
- `PF9LifestyleInflation.tsx` - Inflation impact slider
- `PF10Challenge.tsx` - Mixed quiz with all concepts

**Corporate Finance** (`src/features/learning/components/lessons/cf/`):
- `CF1WhatIsCorporateFinance.tsx` - Stakeholder drag-sort
- `CF2IncomeStatement.tsx` - Revenue/expense slider
- `CF3BalanceSheets.tsx` - Assets vs liabilities slider
- `CF4CashFlow.tsx` - Operating/investing/financing drag-sort
- `CF5FinancialRatios.tsx` - Ratio calculator slider
- `CF6RevenueRecognition.tsx` - Revenue timing drag-sort
- `CF7COGSMargins.tsx` - Margin calculator slider
- `CF8WorkingCapital.tsx` - Working capital slider
- `CF9SECFilings.tsx` - Filing types drag-sort
- `CF10Challenge.tsx` - Mixed quiz

**Trading** (`src/features/learning/components/lessons/tr/`):
- `TR1WhatIsTrading.tsx` - Trading vs investing drag-sort
- `TR2CandlestickBasics.tsx` - Chart annotation interactive
- `TR3SupportResistance.tsx` - Chart annotation (identify levels)
- `TR4TrendLines.tsx` - Chart annotation (draw trends)
- `TR5VolumeAnalysis.tsx` - Volume-price slider
- `TR6MovingAverages.tsx` - MA period slider
- `TR7OrderTypes.tsx` - Order type drag-sort
- `TR8RiskManagement.tsx` - Position size slider
- `TR9PaperTrading.tsx` - P&L simulator slider
- `TR10Challenge.tsx` - Mixed quiz

**Alternative Assets** (`src/features/learning/components/lessons/alt/`):
- `ALT1BeyondStocks.tsx` - Asset class drag-sort
- `ALT2RealEstate.tsx` - Rental yield slider
- `ALT3REITs.tsx` - REIT dividend slider
- `ALT4GoldMetals.tsx` - Gold allocation slider
- `ALT5Commodities.tsx` - Supply/demand drag-sort
- `ALT6Crypto.tsx` - Volatility comparison slider
- `ALT7NFTs.tsx` - Risk factor drag-sort
- `ALT8Collectibles.tsx` - Appreciation slider
- `ALT9ESG.tsx` - ESG score drag-sort
- `ALT10Challenge.tsx` - Mixed quiz

### 2. Update ThreePhaseLessonViewer routing

Refactor the giant if/else chain to use a pathway-aware lookup map:

```typescript
const LESSON_MAP: Record<string, Record<number, React.FC<{onComplete: () => void}>>> = {
  'investing': { 1: Lesson1Beginner, 2: Lesson2RiskRewardSlides, ... },
  'personal-finance': { 1: PF1FinancialStartingPoint, 2: PF2BudgetingWorks, ... },
  'corporate-finance': { 1: CF1WhatIsCorporateFinance, ... },
  'trading': { 1: TR1WhatIsTrading, ... },
  'alternative-assets': { 1: ALT1BeyondStocks, ... },
};
```

Then replace the 500-line if/else with:
```typescript
const SlideComponent = LESSON_MAP[lesson.pathway]?.[lesson.order_index];
if (SlideComponent) {
  return <SlideComponent onComplete={handleComplete} />;
}
// fallback to generic three-phase flow
```

### 3. Also increase lesson text size (from previous request)

Update `BeginnerLessonTemplate`:
- Title: `text-3xl md:text-4xl`
- Content wrapper: `text-lg leading-relaxed`
- Container: `max-w-3xl mx-auto`

### Summary

- **40 new lesson files** across 4 subdirectories
- **1 major refactor** of `ThreePhaseLessonViewer.tsx` (pathway-aware routing map)
- **1 minor edit** to `BeginnerLessonTemplate.tsx` (text sizing)

