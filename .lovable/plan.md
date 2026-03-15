

# Landing Page Redesign — Professional Studio Quality

This is a comprehensive visual overhaul across 9 sections plus global styling. The goal is to eliminate the "AI-generated" look by introducing typographic personality (Syne + DM Sans), restraining purple usage, adding texture, and replacing generic layouts (2x2 grids, pill badges, uniform cards) with deliberate, editorial design choices.

---

## Files to modify

| File | Changes |
|------|---------|
| `index.html` | Replace Nunito font import with Syne (700) + DM Sans (400, 500) |
| `tailwind.config.ts` | Update `fontFamily.sans` to `"DM Sans"`, add `fontFamily.heading` as `"Syne"` |
| `src/index.css` | Update dark theme vars (background → `240 10% 3.5%` / #09090D, card → `240 10% 7%` / #111116, border → subtle white), add grain overlay pseudo-element on body, remove `font-weight: 900` from body, set `--radius: 0.75rem` (12px) |
| `src/pages/Landing.tsx` | Full rewrite of hero, how-it-works, testimonials, FAQ, CTA, and footer sections per specs below |
| `src/features/landing/components/FeatureShowcase.tsx` | Left-align header, restyle tab states (left-border instead of purple bg), mute icon colors on inactive tabs |
| `src/features/landing/components/PricingSection.tsx` | Restyle stats bar into single card with vertical dividers, no icons; restyle pull quote with highlighted "34% higher" |

---

## Section-by-section plan

### Global
- **Fonts**: Syne Bold 700 for all headlines, DM Sans 400/500 for body. Remove Nunito entirely.
- **Background**: `#09090D` (dark blue-black, not pure black). Card surfaces `#111116`.
- **Borders**: `rgba(255,255,255,0.07)` consistently.
- **Grain**: CSS `::after` pseudo-element on `body` with an SVG noise filter at 3% opacity.
- **Border radius**: 12px on all cards. 8px on buttons.
- **Purple restraint**: Only on CTAs and section labels. No purple section backgrounds, no gradient text on headlines.

### 1. Navbar
- Transparent by default, `rgba(9,9,13,0.8)` + `backdrop-blur(12px)` on scroll (already partially exists — refine colors).
- "Sign up free" button: solid `#7C3AED`, `rounded-lg` (8px), no gradient.
- "Log in": ghost style, muted color.

### 2. Hero
- Remove pill badge → uppercase spaced text `"INVESTING SIMULATOR FOR STUDENTS"` in `#7C3AED`, 11px, `tracking-[0.15em]`.
- Remove typewriter animation. Static two-line headline: Line 1 white, Line 2 solid `#7C3AED` (no gradient).
- Font: `font-heading` (Syne Bold), `text-7xl`.
- Subheadline: DM Sans 400, `#71717A`, `max-w-[560px]`.
- Buttons: Primary solid `#7C3AED` `rounded-lg`, secondary outline with `border-white/15` `rounded-lg`.
- Social proof: text-only with `·` separators, no icons, `#52525B`.
- Mockup: keep browser frame video, add radial glow behind (not on), heavier `shadow-2xl`, `rounded-xl`, remove extra border/ring.

### 3. Features (FeatureShowcase)
- Left-align section label + headline.
- Tab selected state: `border-l-2 border-[#7C3AED]` + `bg-[rgba(124,58,237,0.06)]` + white text. No purple bg on icon.
- Unselected: no bg, no border, `#71717A` text and icon.
- Preview panel: `#111116` bg, subtle border, muted traffic light dots (8px), thin progress bar.

### 4. How It Works — Full redesign
- Remove 2x2 card grid with circle icon badges entirely.
- Replace with horizontal timeline: 4 steps in a row connected by a `1px rgba(255,255,255,0.08)` line.
- Each step: large ghosted number (`text-7xl`, `rgba(124,58,237,0.2)`) behind content, title + description floating over it. No cards, no icons in circles.
- Mobile: vertical stack with thin left border.

### 5. Stats (inside PricingSection)
- Replace 4 equal icon columns with single dark card (`#111116`) containing 4 stats separated by `1px rgba(255,255,255,0.07)` vertical dividers. Numbers only, no icons.
- Pull quote below: "34% higher" in `#7C3AED`, rest white, source in `#52525B`.

### 6. Testimonials
- Static masonry-style grid (no marquee/carousel).
- Variable card heights (don't force equal). `#111116` bg, subtle border, 12px radius.
- Stars amber, quote `#D4D4D8`, name white, role muted.

### 7. FAQ
- No card/box per item. Bottom border `rgba(255,255,255,0.08)` only.
- Question: DM Sans 500 16px white. Chevron rotates. Answer: muted 15px.
- Hover: `bg-white/[0.02]`. Max-width 680px centered.

### 8. Final CTA
- No purple background. Centered text, subtle radial glow behind headline only.
- Syne Bold 56px headline, muted subtext, same primary CTA button style.

### 9. Footer
- Top border `rgba(255,255,255,0.07)`, `#09090D` bg.
- All text `#52525B`, hover `#F4F4F6`. No purple anywhere.

---

## Implementation approach

This will be split into 3-4 implementation steps to keep changes manageable:

1. **Global system**: `index.html` fonts, `tailwind.config.ts`, `src/index.css` (colors, grain, radius, font-weight)
2. **Landing.tsx**: Hero, How It Works, Testimonials, FAQ, CTA, Footer — all inline in this file
3. **FeatureShowcase.tsx**: Left-align headers, restyle tabs
4. **PricingSection.tsx**: Stats card redesign, pull quote

