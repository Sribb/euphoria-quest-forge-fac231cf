

## Rebuild Landing Page — fey.com Cinematic Editorial Style

This is a complete rebuild of `Landing.tsx` and its supporting components to match the dark-luxury, editorial aesthetic of fey.com. The current SaaS-style landing page (cards, gradients, bold fonts, colorful icons) will be replaced with a minimal, cinematic design on pure `#000000`.

### What Changes

**1. New CSS — Wipe Animation System** (`src/index.css`)
- Add the `@property --mask-position` registration and `wipeAnimation` keyframes
- Add `.wipe-section` and `.wipe-section.visible` classes
- No changes to existing dark theme variables — the landing page will use inline/hardcoded `#000` styles to be independent of the app's design system

**2. Complete Rewrite of `src/pages/Landing.tsx`**
Replace the entire file (~443 lines) with a single self-contained component containing all 8 sections + nav + footer. Key differences from current:

- **Nav**: Fixed, `rgba(0,0,0,0.8)` + blur. Left: "Euphoria" wordmark + purple dot. Center: `Today · How It Works · Pricing · Updates · FAQ` at 13px, muted. Right: tiny white pill "Try Euphoria". Fades in on load.
- **Hero**: Left-aligned. Purple eyebrow "Euphoria". H1 at 72px, `font-weight: 300`: "Make better / investors." One line of muted body text. Below: 3-column dark screenshot grid with labels (Interactive lessons, Live leaderboards, Market simulations) using placeholder dark mockup divs.
- **Section 2**: "From overwhelming / to effortless." Left-aligned 56px/300. Horizontal icon dock (8 circular dark buttons). Right-side feature descriptions.
- **Section 3**: Center-aligned. Purple eyebrow "LEARN BY DOING". 72px headline "Markets in / real time." Unsplash portrait with grayscale filter. Muted copy.
- **Section 4**: "Complex markets, / simplified." Left-aligned 56px/300. Large dark monitor mockup frame. Progress bar with `#6166DC` fill.
- **Section 5**: Two-column. Left: ⌘K keyboard shortcut display. Right: Weekly digest mini-card.
- **Section 6**: "Knowledge you / can trust." News-feed list of 5 lesson titles with metadata. Filter pill tabs.
- **Section 7 — Pricing**: Clean table/list (not cards). Three rows: Basic (Free), Pro Student ($9.99/mo, highlighted with purple left border), Schools (Custom).
- **Section 8 — FAQ**: Left-aligned "Common questions" at 48px/300. Accordion with `+`/`−` toggle, `max-height` animation.
- **Footer CTA**: Center 64px/300 "Ready to start / investing?" Text-only CTA link.
- **Footer**: 4-column grid with `border-top`, muted links at 13px.

**3. IntersectionObserver Hook**
- A `useEffect` in Landing that observes all `.wipe-section` elements and adds `.visible` class at `threshold: 0.1`

**4. Remove Old Components**
- `FeatureShowcase.tsx` and `PricingSection.tsx` will no longer be imported (can be kept as files but unused)

**5. Font Update** (`tailwind.config.ts`)
- Change font-family from `Nunito` to `Inter` for the landing page aesthetic. Add Inter via Google Fonts link in `index.html`.

### Design Rules Enforced
- Pure `#000` background throughout — no gradients on bg
- All text white or `rgba(255,255,255,0.45)`
- `#6166DC` accent used ~6 times total (eyebrows + one pricing highlight)
- `font-weight: 300` on all display headings
- `padding: 128px 0` on every section
- No cards, no shadows, no glassmorphism — whitespace-only separation
- Max-width `1100px` centered

### Files Modified
| File | Action |
|------|--------|
| `src/pages/Landing.tsx` | Full rewrite |
| `src/index.css` | Add wipe animation CSS |
| `index.html` | Add Inter font link |
| `tailwind.config.ts` | Update font-family to Inter |

### Technical Notes
- The 3-column screenshot grid in the hero will use styled dark placeholder divs (mock UI) since actual screenshots aren't available
- Unsplash image in section 3 will use a real URL with CSS `filter: grayscale(0.3) brightness(0.8)`
- Navigation routing (`/auth`, `/legal`, etc.) preserved from current implementation
- The `useAuth` redirect logic stays intact

