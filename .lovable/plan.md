

## Redesign Auth Page with Animated Login UI

### Overview
Rebuild the Auth page (`src/pages/Auth.tsx`) to incorporate the animated login card design from the reference component, while preserving all existing authentication logic (email/password, Google, Apple OAuth, student/educator role selection, educator info flow).

### Visual Design (Neon Noir Finance aesthetic)
- **Background**: `#09090D` blue-black with canvas particle animation (rising particles in violet `#7C3AED` at low opacity instead of white)
- **Accent lines**: Subtle animated grid lines using CSS `@keyframes drawX/drawY` in violet at very low opacity
- **Vignette**: Radial gradient overlay for depth
- **Card**: Fade-up animation (`card-animate` class), `bg-card/90` with `backdrop-blur-sm`, border-zinc-800 styling
- **No purple backgrounds or gradient text on headlines** per the studio quality system rules

### What Changes

**`src/pages/Auth.tsx`** - Full visual rebuild:

1. **Add canvas particle background** - Port the particle effect from the reference, but use `rgba(124,58,237, opacity)` (violet) particles instead of white, keeping them subtle
2. **Add animated accent grid lines** - CSS keyframe animations for decorative lines at very low opacity in violet
3. **Add vignette overlay** - Dark radial gradient edges
4. **Header bar** - Euphoria logo (existing `euphoriaLogo` asset) top-left, minimal nav link top-right
5. **Card styling** - Apply `card-animate` fadeUp animation, refined input styling with icon prefixes (Mail, Lock icons from lucide-react), show/hide password toggle
6. **Input fields** - Dark `bg-zinc-950 border-zinc-800` styling with violet focus rings, icon prefixes
7. **Social login buttons** - Styled with `bg-zinc-900 border-zinc-800 hover:bg-zinc-800` for Google and Apple
8. **"or" separator** - Styled divider between form submit and social buttons
9. **Remember me checkbox + Forgot password link** on login view

### What Does NOT Change
- All auth logic (signIn, signUp, Google/Apple OAuth handlers)
- Multi-step signup flow (role selection → educator info → form)
- Validation schema and password rules
- Educator profile creation
- Route behavior and navigation
- The `useAuth` hook and Supabase integration

### CSS Additions (in `src/pages/Auth.tsx` inline style tag)
- `@keyframes drawX` / `drawY` for accent lines
- `@keyframes fadeUp` for card entrance
- `@keyframes shimmer` for subtle line shimmer

### No new dependencies needed
All required packages (lucide-react, framer-motion, radix primitives) already exist in the project.

