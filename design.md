---
name: Proton Rail
tokens:
  color:
    # Brand
    primary: '#0A2463'          # Deep navy — branding, headings, primary buttons
    primary-hover: '#0E2E7E'    # Slightly lighter for hover states
    on-primary: '#FFFFFF'
    secondary: '#FFC914'        # Ochre-gold — CTAs, highlight accents
    secondary-soft: '#FFF6D1'   # 10% tint for warning chip backgrounds
    on-secondary: '#3A2A00'

    # Surfaces
    background: '#F8FAFC'       # Page background
    surface: '#FFFFFF'          # Cards, panels
    surface-subtle: '#F1F5F9'   # Inset inputs, secondary panels
    border: '#E2E8F0'           # 1px dividers and card borders
    border-strong: '#CBD5E1'    # Focused inputs, emphasised dividers

    # Text
    text: '#111827'             # Near-black body / headings
    text-muted: '#475569'       # Secondary labels
    text-subtle: '#94A3B8'      # Tertiary / placeholder

    # Data viz (peak / off-peak / weekend dimensions)
    viz-peak: '#F59E0B'         # Amber — peak hours (expensive)
    viz-offpeak: '#4497D1'      # Muted blue — off-peak weekday
    viz-weekend: '#FFC914'      # Gold — weekend
    viz-bar-base: '#0A2463'     # Default bar fill

    # Semantic
    success: '#0F766E'
    error: '#BA1A1A'
    warning: '#F59E0B'

  font:
    display: "'Geist', system-ui, sans-serif"   # Headings, numerics, labels
    body: "'Inter', system-ui, sans-serif"      # Body copy

  radius:
    sm: '4px'                   # Chips, small badges
    md: '8px'                   # Buttons, inputs, standard cards
    lg: '16px'                  # Hero / dashboard frames
    pill: '9999px'              # Status badges

  shadow:
    card-hover: '0 4px 20px rgba(0, 0, 0, 0.05)'
    overlay: '0 12px 40px rgba(15, 23, 42, 0.16)'

  space:
    base: '8px'
    gutter: '24px'
    container-max: '1200px'
    margin-mobile: '16px'
    margin-desktop: '40px'
---

## Brand & Style

A sophisticated railway trip-analysis interface for frequent travellers and data-conscious commuters. The visual language is **corporate / functional-minimalist** — refined color, ample whitespace, and structured card geometry so that complex data stays legible and actionable.

Emotional drivers:
- **Reliability** — structured grids and balanced proportions
- **Precision** — crisp typography and detailed data visualization
- **Ease of use** — reduced visual noise, intuitive hierarchy

## Colors

The palette evolves NS heritage into a "deep tech" aesthetic.

- **Primary `#0A2463`** — deep midnight navy for branding, navigation, primary buttons, and headings. More serious than standard transit blue.
- **Secondary `#FFC914`** — refined ochre-gold (less neon than the source). Used sparingly for CTAs and highlight accents to preserve accessibility.
- **Neutral system** — cool slates. Background is a soft `#F8FAFC` to distinguish it from white cards; primary text is `#111827` for maximum legibility.
- **Data viz** — peak `#F59E0B` (amber), off-peak `#4497D1` (muted blue), weekend `#FFC914` (gold). Differentiate dimensions without overwhelming.

## Typography

Dual-font system.

- **Geist** — headings, numerics, and labels. Its geometric clarity makes it ideal for times, fares, and tabular data.
- **Inter** — body copy and descriptions. Neutral, highly legible.

Usage rules:
- **Display sizes** only for dashboard summaries (e.g., total travel time)
- **Label-sm** for metadata and status badges, often uppercase
- Minimum 4.5:1 contrast for body text

| Role           | Family | Size  | Weight | Line height | Letter spacing |
|----------------|--------|-------|--------|-------------|----------------|
| display-lg     | Geist  | 48px  | 700    | 56px        | -0.02em        |
| headline-lg    | Geist  | 32px  | 600    | 40px        | -0.01em        |
| headline-md    | Geist  | 24px  | 600    | 32px        | —              |
| body-lg        | Inter  | 18px  | 400    | 28px        | —              |
| body-md        | Inter  | 16px  | 400    | 24px        | —              |
| label-md       | Geist  | 14px  | 500    | 20px        | 0.01em         |
| label-sm       | Geist  | 12px  | 600    | 16px        | —              |

Mobile: bump `headline-lg` down to 24px / 32px.

## Layout & Spacing

- **Desktop** — 12-column grid, 24px gutters, max width 1200px. Stat cards span 4 columns; detail lists span 12.
- **Tablet** — 2-column card grid.
- **Mobile** — single-column stack, 16px horizontal margins.

Vertical rhythm uses `stack-lg` (24px) between distinct logical sections. Avoid crowding data points — breathe.

## Elevation & Depth

Hierarchy comes from **tonal layers** and **low-contrast outlines**, not heavy shadows.

- Page background: `#F8FAFC`
- Surface (cards): `#FFFFFF`
- Border: 1px solid `#E2E8F0` — crisp engineered look, no shadow muddiness
- Hover: subtle ambient shadow `0 4px 20px rgba(0,0,0,0.05)` signals interactivity
- Overlays (modals, tooltips): stronger shadow + 8px backdrop blur

## Shapes

Default radius is `0.5rem` (8px) — softens the technical feel without going playful.

- Buttons, inputs, standard cards → `md` (8px)
- Hero / main dashboard frames → `lg` (16px)
- Status badges ("Peak", "Off-peak") → `pill` (fully rounded)

## Components

### Buttons
- **Primary** — `#0A2463` background, white text, `md` radius
- **Secondary** — transparent bg, 1px `#0A2463` border, `#0A2463` text
- **Tertiary** — text-only, underline on hover

### Cards
- White bg, 1px `#E2E8F0` border, `md` radius
- Padding: 24px desktop, 16px mobile
- Use horizontal dividers (`#E2E8F0`) only when separating complex datasets within a single card

### Input fields
- `#F1F5F9` background, 1px `#E2E8F0` border, `md` radius
- Focus: border becomes `#0A2463` with a 2px outer glow at 10% opacity

### Chips & Badges
- Small uppercase Geist label-sm
- Semi-transparent tint of the status color (e.g., 10% amber for peak)
- `pill` radius
