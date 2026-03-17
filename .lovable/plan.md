

# Implementation Plan: Lessons 6–10 in investingFundamentals.ts

## What Changes

**Single file modified:** `src/features/pathway/courses/investingFundamentals.ts`

**Lines 1268–1343** (placeholder L(8), L(9), L(10)) are replaced with five complete 22-step lessons:

| # | Title | Hook Stat | Case Study | BG Color |
|---|-------|-----------|------------|----------|
| 6 | Market Psychology: Fear and Greed | S&P 500: 27 bear markets, all recovered | GameStop Jan 2021 | #120a0a |
| 7 | Value Investing: Price vs. Intrinsic Value | Buffett 97% wealth after 65 | Buffett buying Coca-Cola 1988 | #0a0d12 |
| 8 | Fundamental Analysis: Reading the Numbers | Enron hid billions in debt | Enron fraud 2001 | #080b10 |
| 9 | Economic Moats: Competitive Advantages | Visa 70B+ transactions/year | Visa network 1970–present | #0a0f0a |
| 10 | Portfolio Management: Building Your Strategy | Yale Endowment 13.7% annual | Yale/Swensen strategy | #0a0a14 |

## Structure Per Lesson (22 steps + 5 challenge questions)

Each lesson uses the same helpers already imported. Phase structure:

1. **Hook** (2 steps): `hookOpener` + `stakesCard`
2. **Teach** (6 steps): `teachingSlide` + `microCheck` + `interactiveGraph` + `caseStudy` + `misconceptions` + `keyTermsCards`
3. **Practice** (8 steps): Unique interactive element order per lesson as specified in the plan
4. **Apply** (4 steps): scenario `q()` + `simulationFinale` + `summaryCards` + `whatsNext`
5. **Challenge**: 5 `cq()` questions

## Interactive Element Orders (Phase 3)

- **L6:** tapToReveal → mcq → scenario → fillInBlank → visualInteractive → trueFalse → dragSort → match
- **L7:** fillInBlank → visualInteractive → mcq → tapToReveal → dragSort → scenario → trueFalse → slider
- **L8:** mcq → dragSort → tapToReveal → fillInBlank → trueFalse → visualInteractive → scenario → match
- **L9:** visualInteractive → fillInBlank → trueFalse → mcq → scenario → dragSort → tapToReveal → slider
- **L10:** dragSort → mcq → fillInBlank → scenario → trueFalse → tapToReveal → visualInteractive → match

## Untouched

- Lessons 1–5 (lines 8–1266): unchanged
- Condensed lessons 11–50 (lines 1345–1406): unchanged
- All renderer, type, and helper files: unchanged

## Size Estimate

Each full lesson is ~200–250 lines of data. Total addition: ~1,100–1,250 lines replacing the 76 placeholder lines.

