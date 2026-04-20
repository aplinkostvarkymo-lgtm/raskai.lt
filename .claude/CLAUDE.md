# RaskAI.lt — Claude Code Project Instructions

## KAS YRA ŠIS PROJEKTAS

RaskAI.lt yra AI-powered B2B marketplace Lietuvoje. Klientas aprašo verslo problemą natūralia kalba. AI Dispatcher klasifikuoja užklausą, generuoja struktūrizuotą Spec'ą, įvertina kainą ir sutapatina su verified tiekėjais. Tiekėjai pateikia kainas. Klientas gauna shortlist'ą. Sandoris uždaromas per Stripe.

**Tai nėra freelance platforma. Tai nėra katalogas. Tai procurement layer — AI brokeris tarp problemos ir sprendimo.**

---

## TECH STACK

| Sluoksnis | Technologija |
|---|---|
| Frontend | Next.js 14 + Vercel |
| Duomenų bazė | Airtable (source of truth) |
| Automatizacija | Zapier |
| AI modelis | GPT-4o (Dispatcher V4) |
| Mokėjimai | Stripe |
| Domenas | raskai.lt |

**Taisyklė:** Naudok tik šį stack'ą. Nepasiūlyk alternatyvų be aiškios priežasties.

---

## ARCHITEKTŪROS PRINCIPAI

- `REQUESTS.State` = vienintelis lifecycle šaltinis
- Kiekvienas Zap prasideda idempotency check'u
- Bet koks techninis fail'as → `MANUAL_REVIEW`
- Dispatcher V4 grąžina sprendimą — nevaldo state
- Pricing Engine V1 yra deterministinis Code step — be LLM

### State lifecycle:
```
DRAFT → DISPATCHING → ANALYZED → PAID
              ↘ WAITING_INFO → DRAFT (re-run)
              ↘ EDUCATIONAL_SENT
              ↘ REJECTED
              ↘ MANUAL_REVIEW
```

---

## SKILLS — DETALI DOKUMENTACIJA

Visa techninė dokumentacija yra `.claude/skills/`. Naudok prieš rašant bet kokį kodą ar Zapier logiką.

| Skill failas | Naudoti kai |
|---|---|
| `airtable-schema.md` | Airtable API, field ID'ai, lentelių struktūra |
| `zapier-flows.md` | Zap'ų kūrimas, steps, triggeriai, idempotency |
| `quote-page.md` | `/quote` puslapis, forma, Airtable PATCH logika |
| `tier-system.md` | T1/T2 klasifikacija, matching, enum reikšmės |
| `seo-setup.md` | Meta tags, structured data, sitemap, llms.txt |

---

## KODO KONVENCIJOS

### Failų struktūra (Next.js App Router):
```
raskai.lt/
├── app/
│   ├── page.tsx
│   ├── quote/page.tsx
│   ├── how-it-works/page.tsx
│   └── layout.tsx
├── components/
│   ├── QuoteForm.tsx
│   └── DeclineConfirm.tsx
├── lib/
│   └── airtable.ts
├── public/
│   └── llms.txt
└── CLAUDE.md
```

### Environment variables:
```
AIRTABLE_API_KEY=pat...
AIRTABLE_BASE_ID=appnGWOBl6D4eTOhh
NEXT_PUBLIC_SITE_URL=https://raskai.lt
```

---

## KRITINĖS TAISYKLĖS

1. **Airtable field ID'ai case-sensitive** — visada iš `airtable-schema.md`
2. **Checkbox false = tuščias laukas** — Zapier: "is empty", ne "equals false"
3. **PROPOSALS.Status visada UPPERCASE** — `QUOTE_SUBMITTED`, ne `Quote_Submitted`
4. **API key NIEKADA kode** — tik environment variables
5. **Linked record laukai grąžina array** — visada `Array.isArray()` check
6. **State machine** — `REQUESTS.State` nekeičiamas iš frontend

---

## BIZNIO MODELIS

- Success fee: 10–20% per deal
- Provider Boost (Verified-3): 49–99 EUR/mėn
- Concierge: 299–999 EUR/projektas
- Tikslinė rinka: LT → EE → LV → PL → NL, DE → Global

---

## DABARTINIS PRIORITETAS

**#1 — Pirmas realus sandoris.**

Sekantis techninis žingsnis: sukurti `raskai.lt/quote` puslapį su Airtable API integracija, kad B2 magic links veiktų realiai.
