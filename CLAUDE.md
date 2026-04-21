# RaskAI.lt — Claude Code Project Instructions

---

## DESIGN SYSTEM

**Aesthetic:** Dark, technical, purposeful. Three words: Precise. Decisive. Trusted.
Orange = decisive action only. Never decoration.

### Colors
| Token | Hex | Usage |
|---|---|---|
| bg | `#09090B` | Page background |
| surface-1 | `#111116` | Cards, panels |
| surface-2 | `#18181F` | Elevated, modals |
| surface-3 | `#222229` | Hover, selected |
| border | `#27272F` | Default borders |
| border-subtle | `#1C1C23` | Dividers |
| text-primary | `#F1F0EE` | Headings, body |
| text-secondary | `#8A8A98` | Labels, descriptions |
| text-tertiary | `#55555F` | Placeholders, disabled |
| **accent** | `#F97316` | Primary CTA, active — use sparingly |
| accent-hover | `#EA6A08` | Hover on accent |
| accent-subtle | `#F973161A` | Accent bg (10% alpha) |
| accent-border | `#F9731640` | Accent borders (25% alpha) |
| success | `#22C55E` | Matched, confirmed |
| warning | `#EAB308` | Pending, review |
| error | `#EF4444` | Failed, rejected |

### Typography
| Role | Font | Weight |
|---|---|---|
| Display/Headings | `Syne` | 600–800 |
| Body/UI | `DM Sans` | 400–500 |
| Mono/Technical | `JetBrains Mono` | 400 |

| Scale | Size | Line-height | Usage |
|---|---|---|---|
| hero | 64px | 1.05 | Hero headline |
| h1 | 40px | 1.1 | Page titles |
| h2 | 28px | 1.2 | Section headers |
| h3 | 20px | 1.3 | Card titles |
| body | 16px | 1.6 | Body copy |
| sm | 14px | 1.5 | Labels, captions |
| xs | 12px | 1.4 | Badges, timestamps |
| mono | 13px | 1.5 | Code, IDs, status |

### Spacing & Radius
Base unit: 4px. Scale: `4 8 12 16 20 24 32 40 48 64 80 96px`

| Radius | Value | Usage |
|---|---|---|
| sm | 6px | Badges, tags |
| md | 10px | Buttons, inputs |
| lg | 16px | Cards |
| xl | 24px | Modals, large panels |

### Component Rules

**Buttons — 3 variants only:**
- **Primary:** bg `#F97316`, text `#09090B`, hover scale 1.01 + `box-shadow: 0 0 16px #F9731630`
- **Secondary:** bg `#18181F`, border `#27272F`, text `#F1F0EE`, hover bg `#222229`
- **Destructive:** bg `#EF44440D`, border `#EF444440`, text `#EF4444`
- All: `height 40px`, `padding 0 16px`, `border-radius 10px`, DM Sans 500 14px

**Cards:** `bg #111116`, `border 1px solid #27272F`, `border-radius 16px`, `padding 24px`
Hover: border → `#3A3A45`, `box-shadow: 0 0 0 1px #3A3A45`

**Inputs:** `bg #09090B`, `border 1px solid #27272F`, `border-radius 10px`, `padding 12px 14px`
Focus: border `#F9731640`, outline `2px solid #F973161A`. Placeholder: `#55555F`

**Badges:** DM Sans 500 12px, `padding 3px 8px`, `border-radius 99px`. Semantic color 10% alpha bg.

**Nav:** `height 60px`, `bg #09090B`, `border-bottom 1px solid #1C1C23`
Logo left, nav center (max 5), CTA right. Active item: `#F97316` underline 2px.

**Logo (until official):** Syne 700 `#F1F0EE`, prefix `■` `#F97316` — e.g. `■ RaskAI`

### Motion
```
ease-default:  cubic-bezier(0.16, 1, 0.3, 1)    /* snappy settle */
ease-smooth:   cubic-bezier(0.4, 0, 0.2, 1)      /* smooth */
ease-spring:   cubic-bezier(0.34, 1.56, 0.64, 1) /* CTA hover */
duration-fast: 120ms | duration-default: 200ms | duration-slow: 350ms
```
- Section reveal: fade-up `opacity 0→1`, `translateY 12px→0`, 350ms, stagger 60ms
- Card hover: border brightens 120ms, `translateY(-2px)` 200ms — never scale
- Loading: skeleton shimmer `#FFFFFF08→#FFFFFF12` — no spinners
- Spline (hero only): fades in after 600ms, disabled on mobile

### Icons & Imagery
- `lucide-react` only. Size 16px UI / 20px feature. Stroke 1.5px. Never filled.
- No stock illustrations, photography, human faces, or generic "AI brain" imagery.

### Copy Rules
- Sentence case everywhere. ALL CAPS only for badges (max 3 words).
- No AI clichés: never "powerful", "seamless", "cutting-edge", "revolutionize"
- CTAs use verbs: "Submit brief", "Get matched" — not "Learn more"
- Status messages human: "Matching providers..." not "Processing request..."

---

## KAS YRA ŠIS PROJEKTAS

RaskAI.lt yra AI-powered B2B marketplace Lietuvoje. Klientai aprašo verslo problemą natūralia kalba. AI Dispatcher klasifikuoja užklausą, generuoja struktūrizuotą Spec'ą, įvertina kainą ir sutapatina su verified tiekėjais. Tiekėjai pateikia kainas. Klientas gauna shortlist'ą. Sandoris uždaromas per Stripe.

**Tai nėra freelance platforma. Tai nėra katalogas. Tai procurement layer — AI brokeris tarp problemos ir sprendimo.**

---

## TECH STACK

| Sluoksnis | Technologija |
|---|---|
| Frontend | Next.js + Vercel |
| Duomenų bazė | Airtable (source of truth) |
| Automatizacija | Zapier |
| AI modelis | GPT-4o (Dispatcher V4) |
| Mokėjimai | Stripe |
| Domenai | raskai.lt |

**Taisyklė:** Naudok tik šį stack'ą. Nepasiūlyk alternatyvų be aiškios priežasties.

---

## ARCHITEKTŪROS PRINCIPAI

### Event-Driven State Machine
- `REQUESTS.State` = vienintelis lifecycle šaltinis
- Flags, rollups, formulas = sub-step progresas
- Kiekvienas Zap prasideda idempotency check'u
- Bet koks techninis fail'as → `MANUAL_REVIEW`

### State lifecycle:
```
DRAFT → DISPATCHING → ANALYZED → PAID
              ↘ WAITING_INFO → DRAFT (re-run)
              ↘ EDUCATIONAL_SENT
              ↘ REJECTED
              ↘ MANUAL_REVIEW
```

---

## AIRTABLE SCHEMA

**Base ID:** `appnGWOBl6D4eTOhh`

### Pagrindinės lentelės:

| Lentelė | Table ID | Paskirtis |
|---|---|---|
| REQUESTS | `tblfVnpYzUA34tcKP` | Užklausų lifecycle |
| PROPOSALS | `tblTUSy2Qwz3xKePS` | Tiekėjų pasiūlymai |
| PROVIDER_PROFILES | `tblU45fKAu84kNIAH` | Tiekėjų profiliai |
| PROVIDER_ENTITIES | `tblXOQLGeIEMPvxrx` | Tiekėjų juridinė info |
| AUTOMATION_LOGS | `tbl2A2QsydYOusLhk` | Zap'ų log'ai |
| DEAL_OUTCOMES | `tblpMtFwRkUrzP8nw` | Sandorių rezultatai |

### Kritiniai REQUESTS laukai:

| Laukas | Field ID | Tipas | Pastaba |
|---|---|---|---|
| REQ_ID | `fldneTNzvBHaLe1NZ` | singleLineText | Primary key |
| State | `fldTIspvhLNTI59UD` | singleSelect | Lifecycle |
| t1_expertise | `fldI86mBg603EybB7` | singleSelect | B1 matching |
| t2_skills | `fldxixIJpq1hm0Sbs` | multipleSelects | B1 matching |
| pool_generated | `fldJOy2zmddB46PVi` | checkbox | B1 lock |
| pool_lock | `fld9L7hddI3pRpu9z` | checkbox | Race condition guard |
| AI_Problem_Summary | `fldFptV0nTV94Z7Wv` | multilineText | |
| est_price_min | `fldlrvcE6PCWkX7zi` | number | EUR |
| est_price_max | `fldWmzJgLyDLGBVtl` | number | EUR |
| delivery_days_min | `fld2hzT7l5AoZt39Q` | number | |
| delivery_days_max | `fldViyEZSB8UkAsKN` | number | |

### Kritiniai PROPOSALS laukai:

| Laukas | Field ID | Tipas |
|---|---|---|
| Request_Link | `fldgjk4jrMrkxElcT` | multipleRecordLinks |
| Provider_Profile_Link | `fldwclWod5HZwIACI` | multipleRecordLinks |
| Status | `fldIsQCNHUpLZ9wu9` | singleSelect |
| AI_Match_Score | `fld67IaDwvRn5KBZx` | number |
| REQ_ID_lookup | `fldQ1ZYkCWW51ICTM` | multipleLookupValues |

### PROPOSALS.Status reikšmės (UPPERCASE):
`NEW`, `SENT`, `QUOTE_SUBMITTED`, `SELECTED`, `REJECTED`, `EXPIRED`, `VIEWED`, `INVITE_SENT`, `WITHDRAWN`

### PROVIDER_PROFILES kritiniai laukai:

| Laukas | Field ID | Tipas |
|---|---|---|
| T1_Expertise | `fldek19pY4nS8qzOy` | singleSelect |
| T2_Skills | `fldlksV2SCB5IcW75` | multipleSelects |
| Entity_Link | `fldvTdjrLsNK2OQFB` | multipleRecordLinks |
| Display_Name | `fld0S4ILjKbmd4KkI` | singleLineText |

### PROVIDER_ENTITIES kritiniai laukai:

| Laukas | Field ID | Tipas |
|---|---|---|
| Primary_Contact_Email | `fldRkgqBiGrDytd5m` | email |
| Primary_Contact_Name | `fldzovtNzM4vDcert` | singleLineText |
| Representative_Email | `fld9H5wBtaKKy2psL` | email |

---

## TIER SISTEMA

### Tier 1 — KĄ parduodi (outcome, max 2 per provider):
`ECOMMERCE_AI`, `BUSINESS_AUTO`, `WEB_APPS`, `CUSTOMER_SUPPORT_AI`, `SALES_AI`, `SOCIAL_GROWTH`, `CONTENT_PROD`, `ADS_CREATIVE`, `KNOWLEDGE_RAG`, `OCR_DATA`, `DATA_ANALYTICS`, `CUSTOM_DEV`, `AI_GOVERNANCE`, `COMPLIANCE`

### Tier 2 — KAIP darai (capabilities, max 5 per provider):
`WORKFLOW_AUTO`, `API_INTEGRATIONS`, `RAG_SYSTEMS`, `AI_AGENTS`, `PROMPT_GUARDRAILS`, `OCR_GENERATION`, `CONTENT_REPURPOSING`, `VIDEO_PIPELINE`, `ADS_GEN`, `SOCIAL_SCHEDULING`, `ENGAGEMENT_TRIAGE`, `WEB_APPS`, `BACKEND_DB`, `VECTOR_DB`, `CLOUD_DEPLOY`, `BI_FORECASTING`, `GDPR_COMPLIANCE`

---

## ZAP STATUSAI

| Zap | Statusas | Pastaba |
|---|---|---|
| A1 — AI Dispatcher V4 | ✅ AKTYVUS | GPT-4o, 4 keliai |
| A1.5 — Clarification Form | ✅ AKTYVUS | Loop protection su JS validation |
| B1 — Matchmaker & Pool Lock | ✅ AKTYVUS | 10 steps, loop per providers |
| B2 — Provider Invites & Magic Links | 🔄 PUBLISHED, DEBUG | Magic links laukia /quote puslapio |
| B3 — Quote Receiver | ⏳ KURIAMAS | Laukia /quote formos |
| B3.1 — Explicit Decline | ⏳ KURIAMAS | Laukia /quote formos |
| C1 — Client Shortlist | ⏳ KURIAMAS | |
| C2 — Buyer Accept + Stripe | ⏳ KURIAMAS | |
| C3 — Payment Succeeded | ⏳ KURIAMAS | |

---

## RASKAI.LT PUSLAPIS — /quote ROUTE

### Tikslas:
Magic link landing page tiekėjams. Gaunamas `proposal_id` ir `action` iš URL params.

### URL formatas:
```
https://raskai.lt/quote?proposal_id=PROPOSAL_ID&action=quote
https://raskai.lt/quote?proposal_id=PROPOSAL_ID&action=decline
```

### action=quote — forma su laukais:
- `Proposed_Price` (number, EUR)
- `Delivery_Days` (number)
- `Why_Fit` (textarea)
- Hidden: `proposal_id` iš URL

### action=decline — patvirtinimo puslapis:
- Tekstas: "Ar tikrai norite atsisakyti šios užklausos?"
- Mygtukas: "Patvirtinti atsisakymą"

### Submit logika (tiesiai į Airtable API, be Zapier):
```javascript
// action=quote
PATCH /v0/appnGWOBl6D4eTOhh/tblTUSy2Qwz3xKePS/{proposal_id}
{
  "fldIsQCNHUpLZ9wu9": "QUOTE_SUBMITTED",
  "fldS6WtyEpoPcfJRA": proposed_price,
  "fldpYyP1edfrKrJqd": delivery_days,
  "fldpb1jRdZcZULD1R": why_fit
}

// action=decline  
PATCH /v0/appnGWOBl6D4eTOhh/tblTUSy2Qwz3xKePS/{proposal_id}
{
  "fldIsQCNHUpLZ9wu9": "REJECTED"
}
```

### Svarbu:
- AIRTABLE_API_KEY saugoti kaip Vercel environment variable, NIEKADA kode
- Po sėkmingo submit → rodyti patvirtinimo pranešimą lietuviškai
- Error handling — jei proposal_id nerastas arba statusas ne NEW/SENT → rodyti "Ši nuoroda nebegalioja"

---

## SEO + LLMO REIKALAVIMAI

### Techninė bazė (Next.js):
- `next/head` su title, description, og:tags kiekviename puslapyje
- `sitemap.xml` — auto-generate su `next-sitemap`
- `robots.txt` — leisti visiems botams, išskyrus `/api/*`
- Structured data — `SoftwareApplication` + `Organization` Schema.org JSON-LD
- Core Web Vitals — LCP < 2.5s, CLS < 0.1

### llms.txt failas (šaknyje `/public/llms.txt`):
```
# RaskAI.lt

> AI-powered B2B marketplace Lietuvoje. Klientai aprašo verslo problemą natūralia kalba, AI Dispatcher klasifikuoja ir sutapatina su verified tiekėjais.

## Puslapiai

- /: Pagrindinis puslapis — kas yra RaskAI
- /how-it-works: Kaip veikia platforma
- /pricing: Kainodara
- /about: Apie projektą
- /quote: Tiekėjų pasiūlymų forma (magic link landing)
```

### Kiekvienas puslapis turi turėti:
```jsx
<Script type="application/ld+json">
{JSON.stringify({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "RaskAI.lt",
  "description": "AI B2B marketplace Lietuvoje",
  "url": "https://raskai.lt",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web"
})}
</Script>
```

---

## KODO KONVENCIJOS

### Failų struktūra (Next.js App Router):
```
raskai.lt/
├── app/
│   ├── page.tsx          # Pagrindinis
│   ├── quote/
│   │   └── page.tsx      # Magic link landing
│   ├── how-it-works/
│   │   └── page.tsx
│   └── layout.tsx        # Root layout su SEO
├── components/
│   ├── QuoteForm.tsx
│   └── DeclineConfirm.tsx
├── lib/
│   └── airtable.ts       # Airtable API helpers
├── public/
│   └── llms.txt
└── CLAUDE.md
```

### Environment variables (.env.local):
```
AIRTABLE_API_KEY=pat...
AIRTABLE_BASE_ID=appnGWOBl6D4eTOhh
NEXT_PUBLIC_SITE_URL=https://raskai.lt
```

### Airtable API helper pattern:
```typescript
// lib/airtable.ts
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY
const BASE_ID = process.env.AIRTABLE_BASE_ID

export async function updateProposal(proposalId: string, fields: Record<string, unknown>) {
  const res = await fetch(
    `https://api.airtable.com/v0/${BASE_ID}/tblTUSy2Qwz3xKePS/${proposalId}`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fields }),
    }
  )
  if (!res.ok) throw new Error(`Airtable error: ${res.status}`)
  return res.json()
}
```

---

## KRITINĖS TAISYKLĖS

1. **Airtable field ID'ai yra case-sensitive** — visada naudok tiksliai kaip dokumentuota aukščiau
2. **Checkbox laukai grąžina tuščią kai false** — Zapier filtruose naudoti "is empty", ne "equals false"
3. **PROPOSALS.Status visada UPPERCASE** — `NEW`, ne `New`
4. **API key NIEKADA kode** — tik environment variables
5. **Airtable linked record laukai grąžina array** — visada tikrink `Array.isArray()` prieš naudojant
6. **State machine principas** — nekeisk State tiesiogiai iš frontend, tik per Airtable API su tiksliai apibrėžtomis reikšmėmis

---

## BIZNIO MODELIS

- Success fee: 10–20% per deal
- Provider Boost (Verified-3): 49–99 EUR/mėn
- Concierge: 299–999 EUR/projektas
- Tikslinė rinka: LT → EE → LV → PL → NL, DE → Global

---

## DABARTINIS PRIORITETAS

**#1 — Pirmas realus sandoris.** Viskas kita yra antraeilis.

Sekantis techninis žingsnis: sukurti `raskai.lt/quote` puslapį su Airtable API integracija, kad B2 magic links veiktų realiai.
