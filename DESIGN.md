# Design Brief

## Direction

Terminal Aurora — a developer-portfolio navigation system that reads like frosted code-editor chrome floating over a deep indigo void.

## Tone

Refined technical: Linear/Vercel precision with a single aurora gradient as the only indulgence — restrained, never neon.

## Differentiation

The logo `< Devanath />` is literal syntax with the aurora gradient sweeping across the brackets; the active nav link gets a sliding gradient pill with a soft underglow.

## Color Palette

| Token      | OKLCH (dark)    | OKLCH (light)   | Role                        |
| ---------- | --------------- | --------------- | --------------------------- |
| background | 0.145 0.02 275  | 0.985 0.004 275 | Page canvas (indigo-black)  |
| foreground | 0.95 0.008 275  | 0.185 0.02 275  | Body + heading text         |
| card       | 0.185 0.022 275 | 1.0 0.002 275   | Elevated surfaces           |
| primary    | 0.62 0.24 295   | 0.48 0.22 292   | Violet accent / gradient from |
| accent     | 0.78 0.15 195   | 0.58 0.14 200   | Cyan accent / gradient to   |
| muted      | 0.23 0.024 275  | 0.945 0.012 275 | Inactive nav, subdued text  |
| border     | 0.29 0.024 275  | 0.9 0.01 275    | Hairlines, dividers         |

Gradient pair: `--gradient-from` violet → `--gradient-to` cyan. Contrast: dark fg/bg ΔL 0.805, fg/primary ΔL 0.475; light fg/bg ΔL 0.80, fg/primary ΔL 0.50 — all AA+.

## Typography

- Display: Space Grotesk — logo, nav links, headings; tight tracking, 500–700 weight
- Body: DM Sans — paragraphs, labels, descriptions
- Mono: JetBrains Mono — code-style accents, `< Devanath />` brackets
- Scale: hero `text-5xl md:text-7xl font-bold tracking-tight`, h2 `text-3xl md:text-5xl font-bold tracking-tight`, label `text-xs font-semibold tracking-widest uppercase`, body `text-base md:text-lg`

## Elevation & Depth

Three tiers: flat `bg-background` canvas → `bg-card` panels with hairline borders → translucent glass navbar with backdrop blur; shadows are soft and wide, glow reserved for active/interactive states.

## Structural Zones

| Zone    | Background              | Border                | Notes                                        |
| ------- | ----------------------- | --------------------- | -------------------------------------------- |
| Header  | glass-nav (blur + tint) | hairline bottom       | Transparent over hero → opaque + shadow on scroll |
| Content | bg-background           | —                     | Alternate sections with bg-muted/30          |
| Footer  | bg-muted/40             | border-t              | Quiet close, no gradient                     |

## Spacing & Rhythm

Section gaps `py-20 md:py-28`; content max-width `max-w-6xl mx-auto px-4 md:px-6`; nav height locked at `h-16 md:h-20`; micro-spacing in 4px steps, link gaps `gap-6 lg:gap-8`.

## Component Patterns

- Buttons: pill `rounded-full`, aurora gradient fill on primary, ghost + border on secondary; hover lifts 1px with glow
- Cards: `rounded-xl` (radius 0.75rem), `bg-card`, hairline border, `shadow-subtle`, glass variant where floating
- Badges: `rounded-full`, `bg-gradient-aurora-subtle`, violet/cyan text, uppercase 11px tracking-widest

## Motion

- Entrance: navbar slides down + fades `y:-16 → 0`, 0.5s ease-out; mobile panel staggers links 0.05s apart
- Hover: color shift + gradient underline/glow, 0.3s `cubic-bezier(0.4,0,0.2,1)`, no layout shift
- Decorative: active nav indicator slides between links (spring); ambient orbs drift slowly; glow pulses gently on focus

## Constraints

- Dark mode is the default; light mode is a full peer palette, not an inversion
- No scroll progress bar and no command palette — explicitly out of scope
- Never use raw color literals in components; consume semantic tokens only
- Glow stays subtle — no neon, no full-page gradients, no bouncy animation

## Signature Detail

The syntax-styled logo with a gradient-swept bracket motif, echoed by the sliding gradient pill under the active nav link — a typographic + motion signature unique to this portfolio.
