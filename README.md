# RaskAI.lt

AI-powered B2B marketplace for Lithuania. Buyers describe a business problem in plain language — RaskAI classifies it, estimates cost and complexity, and matches it to verified AI providers. Providers submit quotes. Buyer receives a shortlist.

**Not a freelancer marketplace. Not a catalogue. A procurement layer — an AI broker between problem and solution.**

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Font | Inter (via `next/font/google`) |
| Animations | tsParticles v3, Framer Motion |
| Icons | lucide-react |
| Database | Airtable (source of truth) |
| Automation | Zapier |
| AI | GPT-4o (Dispatcher V4) |
| Payments | Stripe (planned) |
| Hosting | Vercel |

---

## Running Locally

```bash
npm install
cp .env.local.example .env.local   # fill in values (see below)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Other scripts:

```bash
npm run build   # production build
npm run start   # serve production build
npm run lint    # ESLint
```

---

## Environment Variables

Create `.env.local`:

```
AIRTABLE_API_KEY=pat...
AIRTABLE_BASE_ID=appnGWOBl6D4eTOhh
NEXT_PUBLIC_SITE_URL=https://raskai.lt
```

`AIRTABLE_API_KEY` must be a personal access token with read/write on the base. Never commit this value.

---

## Project Structure

```
raskai-lt/
├── app/
│   ├── page.tsx                        # Full homepage (single page)
│   ├── layout.tsx                      # Root layout — Inter font, metadata
│   ├── globals.css
│   ├── api/
│   │   ├── intake/route.ts             # POST buyer problem → Airtable REQUESTS
│   │   ├── provider-signup/route.ts    # POST provider registration → PROVIDER_ENTITIES
│   │   └── quote/route.ts             # POST provider quote → PROPOSALS
│   └── quote/
│       └── page.tsx                    # Magic link landing for providers
├── components/
│   └── ui/
│       ├── particles-bg.tsx            # Memoized tsParticles hero background
│       ├── typewriter-textarea.tsx     # Hero textarea with typewriter placeholder
│       ├── query-examples-modal.tsx    # Example query browser modal
│       └── provider-info-modal.tsx     # "How does provider selection work?" modal
├── lib/
│   ├── tiers.ts                        # Tier1/Tier2 expertise taxonomy + helper
│   └── query-examples.ts             # 14 example queries with category labels
├── tailwind.config.ts
├── CLAUDE.md                           # Design system, Airtable schema, business rules
└── CHANGELOG.md
```

---

## Key Components

### `ParticlesBg`
Orange particle network in the hero section. Wrapped in `React.memo` with a module-level `OPTIONS` constant — this prevents re-renders when other components update state (critical for preventing flicker during typewriter animation).

### `TypewriterTextarea`
Hero textarea with an animated typewriter placeholder. All typewriter state is kept internal to this component — it never lifts state to the parent, which keeps `ParticlesBg` isolated from re-renders.

### `QueryExamplesModal`
Two-column modal with 14 example queries organized by AI category. Left column = category list, right column = example text + 4 "why this works" bullets. Includes copy-to-clipboard and "use this" buttons.

### `ProviderInfoModal`
Simple modal explaining the 4-step provider selection process. Triggered by "Kaip veikia tiekėjų atranka?" links.

### `lib/tiers.ts`
14 Tier1 (outcome categories) and 21 Tier2 (capability tags). The provider registration form uses `getTier2ForTier1(tier1Id)` to render a cascading checkbox selector.

---

## Card Design System

Every card on the page uses identical base styling:

```
bg-[#111116] border border-[#27272F] rounded-[16px] p-6
hover:scale-[1.02] hover:border-orange-500/60 transition-all duration-200 cursor-pointer
```

Number squares (card headers):

```
w-10 h-10 rounded-[8px] border border-[#F97316]
text-sm font-bold text-[#F97316]
```

Card grids use `items-stretch` + `h-full flex flex-col` to enforce equal heights within each row.

---

## Airtable Schema (summary)

**Base ID:** `appnGWOBl6D4eTOhh`

| Table | Purpose |
|---|---|
| REQUESTS | Buyer request lifecycle |
| PROPOSALS | Provider quotes per request |
| PROVIDER_PROFILES | Provider capability profiles |
| PROVIDER_ENTITIES | Provider legal/contact info |
| AUTOMATION_LOGS | Zapier run logs |
| DEAL_OUTCOMES | Closed deal records |

See `CLAUDE.md` for full field IDs and State machine documentation.

---

## Page Sections (in order)

1. **Nav** — logo, "Tapk tiekėju →" button
2. **Hero** — particles background, headline, 3-step progress indicator, intake form
3. **Situacija rinkoje** — 3 buyer problem cards (01/02/03)
4. **Kaip veikia RaskAI** — 5 process step cards
5. **AI KŪRĖJAMS** — section label + title + 4 value cards + two-column provider block
6. **Stats** — Beta / 15% / 48h cards
7. **Footer** — logo, email
