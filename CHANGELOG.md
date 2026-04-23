# Changelog

All notable changes to RaskAI.lt frontend.

---

## [Unreleased] — 2026-04-24

### Added
- `ProviderInfoModal` component — "Kaip veikia tiekėjų atranka?" modal with 4 numbered steps, orange square numbers, backdrop blur, Escape/backdrop close
- 3-step progress indicator in hero section (above textarea): static, horizontal, step 1 active (orange), steps 2–3 inactive (zinc-300)
- "AI KŪRĖJAMS" section with 4 value cards and two-column provider block (steps + form)
- Stats section (Beta / 15% / 48h) split into 3 separate cards with unified card styling
- Hover effects on all cards: `hover:scale-[1.02] hover:border-orange-500/60 transition-all duration-200 cursor-pointer`
- Trust/pricing lines below hero CTA button
- "Esu AI kūrėjas" nav link (later removed)

### Changed
- Provider section restructured: removed old "Tu kuri AI sprendimus?" copy + checkmark bullets; replaced with two-column layout (steps card + form card), equal-width `max-w-[500px]`, centered with `mx-auto`
- All card grids now use `items-stretch` + `h-full flex flex-col` for equal-height rows
- Process steps section changed from `flex` row to `grid grid-cols-1 md:grid-cols-5` — forces equal column widths
- Process step cards: added `min-h-[420px]`, `w-full`, badge text `whitespace-nowrap`; removed ChevronRight arrows
- All cards unified to: `bg-[#111116] border border-[#27272F] rounded-[16px] p-6`
- Number squares unified to: `w-10 h-10 rounded-[8px] border border-[#F97316] text-sm font-bold text-[#F97316]`
- All `text-zinc-400`, `text-zinc-500`, `text-white/30`, `text-[#55555F]` changed to `text-zinc-300` (except input `placeholder-[#55555F]` and typewriter overlay)
- "Situacija rinkoje" cards: removed `gap-px bg-white/5` single-block grid; each card now has individual background, border, radius
- "Esu AI kūrėjas" nav link removed

### Removed
- ChevronRight arrows between process steps (incompatible with equal-width grid layout)
- Old provider left-column copy ("Tu kuri AI sprendimus ir sistemas?", 4 checkmark bullets)
- Standalone "Kaip tai veikia kūrėjui?" mini block (merged into two-column provider layout)

---

## [0.3.0] — 2026-04-23

### Added
- `QueryExamplesModal` component — two-column modal with 14 example query categories, copy/use buttons, `whyGood` bullets
- `lib/query-examples.ts` — 14 `QueryExample` entries (template literals to avoid Lithuanian quote string issues)
- `lib/tiers.ts` — 14 Tier1 + 21 Tier2 options with `getTier2ForTier1()` helper; cascading select in provider form
- `TypewriterTextarea` component — isolated typewriter animation + textarea; isolated to prevent ParticlesBg re-renders
- `ParticlesBg` component — `React.memo` memoized tsParticles background (flickering fix)
- "Gerų užklausų pavyzdžiai" button — solid orange CTA in textarea header
- Provider form label colors changed to `text-zinc-300`
- `app/api/provider-signup/route.ts` — validates `tier1`, writes `T1_Expertise` and `T2_Skills` to Airtable

### Changed
- tsParticles implementation: replaced v2 `init` prop with v3 `initParticlesEngine` + `useState(false)` ready flag
- `OPTIONS` constant moved to module level (outside component) — stable reference prevents React.memo bailout
- Body/description text throughout: `text-[#8A8A98]` → `text-zinc-200`
- Provider card: added orange glow `shadow-[0_0_40px_rgba(249,115,22,0.15)]`

### Fixed
- tsParticles flickering on typewriter keystroke — root cause was React re-render cascade from typewriter state in parent; fixed by isolating state in `TypewriterTextarea` child + `React.memo` on `ParticlesBg`
- Lithuanian curly-quote characters `„"` breaking TypeScript double-quoted strings in `query-examples.ts` — fixed by using template literals for all `example` strings

---

## [0.2.0] — 2026-04-22

### Added
- Animated ChevronRight arrows between process steps (hidden on mobile, `animate-pulse`)
- Cascading Tier1/Tier2 expertise selector in provider registration form
- `app/api/intake/route.ts` — intake form handler writing to Airtable REQUESTS table with idempotency key

### Changed
- Font replaced: Syne + DM Sans + JetBrains Mono → single **Inter** (weights 400–800, variable `--font-inter`)
- `tailwind.config.ts`: `fontFamily.sans` → `["var(--font-inter)", "system-ui", "sans-serif"]`

---

## [0.1.0] — 2026-04-21

### Added
- Initial Next.js 14 App Router project scaffold
- `app/page.tsx` — full single-page homepage with hero, process steps, buyer problem section, provider registration
- `app/api/quote/route.ts` — magic link quote submission endpoint
- `app/quote/page.tsx` — magic link landing page for providers
- Airtable integration: REQUESTS, PROVIDER_ENTITIES tables
- Vercel deployment
- `CLAUDE.md` — design system, Airtable schema, Zap statuses, business rules
