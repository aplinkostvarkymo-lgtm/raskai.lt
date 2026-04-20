---
name: quote-page
description: RaskAI /quote magic link landing page — component structure, Airtable PATCH operations, URL param logic, error handling, and Lithuanian UI copy
type: project
---

# RaskAI /quote Page

**Skill:** `quote-page`
**Kada naudoti:** Kai reikia kurti, modifikuoti ar debuginti `raskai.lt/quote` puslapį — komponentai, Airtable API integracija, URL params logika, error handling, UI tekstai lietuviškai.

---

## TIKSLAS

Magic link landing page tiekėjams. Tiekėjas gauna URL su `proposal_id` ir `action` parametrais. Puslapis arba rodo kainos formą arba atsisakymo patvirtinimą — priklausomai nuo `action`.

---

## URL FORMATAS

```
https://raskai.lt/quote?proposal_id=PROPOSAL_ID&action=quote
https://raskai.lt/quote?proposal_id=PROPOSAL_ID&action=decline
```

---

## FAILŲ STRUKTŪRA

```
app/
└── quote/
    └── page.tsx          ← Server component (URL params skaitymas)
components/
├── QuoteForm.tsx          ← action=quote forma
└── DeclineConfirm.tsx     ← action=decline patvirtinimas
lib/
└── airtable.ts            ← Airtable API helpers
```

---

## VEIKIMO LOGIKA

### action=quote — kainos forma

**Laukai:**
- `Proposed_Price` — number, EUR, privalomas
- `Delivery_Days` — number, privalomas
- `Why_Fit` — textarea, privalomas
- `proposal_id` — hidden, iš URL params

**Submit → PATCH į Airtable:**
```javascript
PATCH /v0/appnGWOBl6D4eTOhh/tblTUSy2Qwz3xKePS/{proposal_id}
{
  "fldIsQCNHUpLZ9wu9": "QUOTE_SUBMITTED",   // Status
  "fldS6WtyEpoPcfJRA": proposed_price,       // Proposed_Price (number)
  "fldpYyP1edfrKrJqd": delivery_days,        // Delivery_Days (number)
  "fldpb1jRdZcZULD1R": why_fit               // Why_Fit (string)
}
```

### action=decline — atsisakymo patvirtinimas

**UI:** Tekstas + patvirtinimo mygtukas.

**Submit → PATCH į Airtable:**
```javascript
PATCH /v0/appnGWOBl6D4eTOhh/tblTUSy2Qwz3xKePS/{proposal_id}
{
  "fldIsQCNHUpLZ9wu9": "REJECTED"   // Status — UPPERCASE privalomas
}
```

---

## AIRTABLE API HELPER

```typescript
// lib/airtable.ts
export async function updateProposal(
  proposalId: string,
  fields: Record<string, unknown>
) {
  const res = await fetch(
    `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/tblTUSy2Qwz3xKePS/${proposalId}`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
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

## ERROR HANDLING

| Situacija | Rodyti |
|---|---|
| `proposal_id` nerastas | "Ši nuoroda nebegalioja." |
| PROPOSALS.Status ne `New` ar `Sent` | "Ši nuoroda nebegalioja." |
| Sėkmingas quote submit | Patvirtinimo pranešimas lietuviškai |
| Sėkmingas decline | Patvirtinimo pranešimas lietuviškai |
| Airtable API klaida | "Įvyko klaida. Bandykite dar kartą arba susisiekite su mumis." |

---

## ENVIRONMENT VARIABLES

```bash
AIRTABLE_API_KEY=pat...         # Vercel env, niekada kode
AIRTABLE_BASE_ID=appnGWOBl6D4eTOhh
NEXT_PUBLIC_SITE_URL=https://raskai.lt
```

---

## KRITINĖS TAISYKLĖS

1. `AIRTABLE_API_KEY` — tik `process.env`, niekada hardcode
2. `PROPOSALS.Status` — visada UPPERCASE: `QUOTE_SUBMITTED`, `REJECTED`
3. Po sėkmingo submit — rodyti patvirtinimą, ne redirect
4. Validuoti `proposal_id` egzistavimą ir Status prieš rodant formą
5. `Proposed_Price` ir `Delivery_Days` — siųsti kaip `number`, ne `string`
6. Forma veikia tiesiai su Airtable API — be Zapier tarpininko
