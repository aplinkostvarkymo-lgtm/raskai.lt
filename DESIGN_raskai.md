# RaskAI.lt — Design System

## 1. Brand Essence

RaskAI.lt is an AI-powered procurement and decision-making platform for the Lithuanian B2B market. It takes a raw business problem in natural language and drives it toward a real outcome — no manual browsing, no guesswork. The platform sits at the intersection of precision tooling and intelligent automation.

**Aesthetic direction:** Dark, technical, and purposeful. Not playful. Not flashy. The kind of interface that makes an SME owner feel like they handed the problem to a machine that knows exactly what it's doing. Orange as a signal of decisive action — like a control panel warning light that means "this matters."

**Three words:** Precise. Decisive. Trusted.

---

## 2. Color System

### Base palette

| Token | Hex | Usage |
|---|---|---|
| `--color-bg` | `#09090B` | Page background |
| `--color-surface-1` | `#111116` | Cards, panels |
| `--color-surface-2` | `#18181F` | Elevated surfaces, modals |
| `--color-surface-3` | `#222229` | Hover states, selected rows |
| `--color-border` | `#27272F` | Default borders |
| `--color-border-subtle` | `#1C1C23` | Dividers |

### Text

| Token | Hex | Usage |
|---|---|---|
| `--color-text-primary` | `#F1F0EE` | Headings, body |
| `--color-text-secondary` | `#8A8A98` | Descriptions, labels |
| `--color-text-tertiary` | `#55555F` | Placeholders, disabled |

### Accent — Orange

The only warm element in the system. Used sparingly and with intent. A CTA button, an active badge, a highlighted match — never decoration.

| Token | Hex | Usage |
|---|---|---|
| `--color-accent` | `#F97316` | Primary CTA, active state |
| `--color-accent-hover` | `#EA6A08` | Hover on accent |
| `--color-accent-subtle` | `#F973161A` | Accent backgrounds (10% alpha) |
| `--color-accent-border` | `#F9731640` | Accent borders (25% alpha) |

### Semantic

| Token | Hex | Usage |
|---|---|---|
| `--color-success` | `#22C55E` | Matched, confirmed |
| `--color-warning` | `#EAB308` | Pending, review needed |
| `--color-error` | `#EF4444` | Failed, rejected |
| `--color-info` | `#3B82F6` | Informational |

---

## 3. Typography

### Font stack

**Display / Headings:** `Syne` — geometric, architectural, zero-fluff. Loaded from Google Fonts. Use weights 600–800.

**Body / UI:** `DM Sans` — neutral, readable, modern. Not Inter. Use weights 400–500.

**Monospace / Technical:** `JetBrains Mono` — for status codes, IDs, timestamps, technical strings. Use weight 400.

```css
--font-display: 'Syne', sans-serif;
--font-body: 'DM Sans', sans-serif;
--font-mono: 'JetBrains Mono', monospace;
```

### Scale

| Token | Size | Line Height | Usage |
|---|---|---|---|
| `--text-hero` | `4rem / 64px` | 1.05 | Hero headline |
| `--text-h1` | `2.5rem / 40px` | 1.1 | Page titles |
| `--text-h2` | `1.75rem / 28px` | 1.2 | Section headers |
| `--text-h3` | `1.25rem / 20px` | 1.3 | Card titles |
| `--text-body` | `1rem / 16px` | 1.6 | Body copy |
| `--text-sm` | `0.875rem / 14px` | 1.5 | Labels, captions |
| `--text-xs` | `0.75rem / 12px` | 1.4 | Badges, timestamps |
| `--text-mono` | `0.8125rem / 13px` | 1.5 | Code, IDs, status |

---

## 4. Spacing & Layout

Grid: 12-column, `max-width: 1280px`, gutter `24px`, margin `auto`.

```css
--space-1: 4px
--space-2: 8px
--space-3: 12px
--space-4: 16px
--space-5: 20px
--space-6: 24px
--space-8: 32px
--space-10: 40px
--space-12: 48px
--space-16: 64px
--space-20: 80px
--space-24: 96px
```

**Border radius:**
```css
--radius-sm: 6px   /* Badges, tags */
--radius-md: 10px  /* Buttons, inputs */
--radius-lg: 16px  /* Cards */
--radius-xl: 24px  /* Modals, large panels */
```

---

## 5. Component Patterns

### Buttons

Three variants only. No ghost buttons with thin borders — this system uses weight, not decoration.

**Primary (accent):**
- Background: `--color-accent`
- Text: `#09090B` (dark on orange)
- Hover: `--color-accent-hover` + slight scale `1.01`
- Font: DM Sans 500, 14px, letter-spacing 0.01em

**Secondary (surface):**
- Background: `--color-surface-2`
- Border: `--color-border`
- Text: `--color-text-primary`
- Hover: `--color-surface-3`

**Destructive:**
- Background: `#EF44440D`
- Border: `#EF444440`
- Text: `#EF4444`

All buttons: `height: 40px`, `padding: 0 16px`, `border-radius: --radius-md`.

### Cards

```
background: --color-surface-1
border: 1px solid --color-border
border-radius: --radius-lg
padding: 24px
```

On hover: border transitions to `--color-border-active: #3A3A45`, subtle shadow `0 0 0 1px #3A3A45`.

### Input / Textarea

```
background: --color-bg
border: 1px solid --color-border
border-radius: --radius-md
padding: 12px 14px
font: DM Sans 400 15px
color: --color-text-primary
```

Focus: border `--color-accent-border`, outline `2px solid --color-accent-subtle`.

Placeholder: `--color-text-tertiary`.

### Badge / Status pill

```
font: DM Sans 500, 12px
padding: 3px 8px
border-radius: 99px
```

Use semantic colors with 10% alpha background + matching text color.

### Navigation

Top bar, `height: 60px`, `background: --color-bg`, `border-bottom: 1px solid --color-border-subtle`.

Logo left, nav center (max 5 items), CTA right.

Nav items: DM Sans 400, 14px, `--color-text-secondary` default → `--color-text-primary` hover. Active item gets `--color-accent` underline `2px`.

---

## 6. Motion & Interaction

**Core principle:** Motion confirms intent, not decoration. Everything that moves has a reason.

### Timing

```css
--ease-default: cubic-bezier(0.16, 1, 0.3, 1)   /* Snappy settle */
--ease-smooth: cubic-bezier(0.4, 0, 0.2, 1)       /* Smooth transitions */
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1)  /* Subtle spring for CTA hover */

--duration-fast: 120ms    /* State changes, hover */
--duration-default: 200ms /* Most transitions */
--duration-slow: 350ms    /* Page enters, modals */
```

### Patterns

**Page load / section reveal:** Staggered fade-up. Elements enter with `opacity: 0 → 1`, `translateY: 12px → 0`, `duration: 350ms`, stagger `60ms` between items.

**Card hover:** Border brightens (120ms), optional `translateY(-2px)` (200ms). Never scale.

**CTA button hover:** Scale `1.01` with spring ease, orange glows slightly `box-shadow: 0 0 16px #F9731630`.

**Interactive 3D (Spline):** Used only in hero section. A single ambient 3D object (geometric, abstract — e.g. a rotating mesh sphere or abstract form). Reacts to mouse position passively — not click-based. Must not block text or CTA. Fades in after 600ms delay so page content appears first. On mobile: disabled or static fallback image.

**Loading states:** Skeleton shimmer on dark surfaces using `#FFFFFF08 → #FFFFFF12` gradient animation. No spinners.

---

## 7. Imagery & Iconography

### Icons

Use `lucide-react` exclusively. Size: `16px` for UI, `20px` for feature icons. Stroke width: `1.5px`. Color: inherits text color.

Never use filled icons — this is a stroke system.

### Illustrations / Graphics

No stock illustrations. Use one of:
1. **Abstract 3D Spline scene** (hero only)
2. **Geometric SVG shapes** — dark surfaces, subtle grid lines, orange accent dots
3. **Data visualization mockups** — show the platform "working" (structured brief, provider match, outcome)

No photography. No human faces. No generic "AI brain" imagery.

### Logo mark

Until official logo exists: wordmark in Syne 700, `--color-text-primary`, with a square orange accent `■` prefix at `--color-accent`. Example: `■ RaskAI`

---

## 8. Surface & Depth

This system uses border contrast and subtle shadows, not heavy elevation.

```css
/* Flat card */
box-shadow: none;
border: 1px solid var(--color-border);

/* Elevated panel (modal, dropdown) */
box-shadow: 0 4px 24px #00000060, 0 1px 0 #FFFFFF08 inset;
border: 1px solid var(--color-border);

/* Focused / active element */
box-shadow: 0 0 0 3px var(--color-accent-subtle);
```

Avoid layering more than 3 surface levels on a single screen.

### Subtle texture (optional)

A barely-visible noise grain overlay on `--color-bg` adds depth without using images:
```css
/* Applied to body or page wrapper */
background-image: url("data:image/svg+xml,..."); /* SVG noise */
opacity: 0.03;
```

---

## 9. Voice & Copy Tone

Design is inseparable from copy. All UI text follows these rules:

- **Sentence case everywhere.** No ALL CAPS except badge labels max 3 words.
- **Short and declarative.** "Submit your brief" not "Click here to submit your project brief to our system."
- **No AI clichés.** Never "powerful", "seamless", "cutting-edge", "revolutionize". 
- **Status messages are human.** "Matching providers..." not "Processing request..."
- **CTAs use verbs.** "Submit brief", "See how it works", "Get matched" — not "Learn more".

---

## Usage Instructions

### In Cursor

Place this file as `DESIGN.md` in your project root. Claude and Cursor will automatically reference it when generating UI components. Prompt example:

> "Build a provider card component following DESIGN.md — show provider name, category badge, response time, and a CTA button."

### In Claude.ai Projects

Upload this file as a project knowledge file. All subsequent UI generation requests in that project will stay on-system.

### Extending

When adding new component types not covered here, first ask Claude to extend DESIGN.md following the same token naming conventions before generating the component code. This keeps the system consistent.
