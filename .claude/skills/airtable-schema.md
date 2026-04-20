# RaskAI Airtable Schema

**Skill:** `airtable-schema`
**Kada naudoti:** Kai reikia dirbti su Airtable API — rašyti Zapier steps, Next.js API calls, debuginti field ID'us, kurti naujus laukus ar lenteles, tikrinti schema.

---

## BASE

**Base ID:** `appnGWOBl6D4eTOhh`
**API endpoint:** `https://api.airtable.com/v0/appnGWOBl6D4eTOhh/{tableId}/{recordId}`
**Auth:** `Authorization: Bearer ${AIRTABLE_API_KEY}` — visada iš env, niekada hardcode.

---

## LENTELĖS — ID ŽEMĖLAPIS

| Lentelė | Table ID | Paskirtis |
|---|---|---|
| REQUESTS | `tblfVnpYzUA34tcKP` | Užklausų lifecycle — pagrindinis objektas |
| PROPOSALS | `tblTUSy2Qwz3xKePS` | Tiekėjų pasiūlymai |
| PROVIDER_PROFILES | `tblU45fKAu84kNIAH` | Tiekėjų profiliai (viešas sluoksnis) |
| PROVIDER_ENTITIES | `tblXOQLGeIEMPvxrx` | Tiekėjų juridinė / kontaktinė info |
| DEAL_OUTCOMES | `tblpMtFwRkUrzP8nw` | Sandorių rezultatai, Truth Loop duomenys |
| AUTOMATION_LOGS | `tbl2A2QsydYOusLhk` | Zapier event log'ai |
| REQUESTS_ATTACHMENTS | `tblQvLFzzRTTR4MDi` | Užklausų failai |
| PROPOSAL_ATTACHMENTS | `tblH6inENvCkvAk3P` | Pasiūlymų failai |
| TIER 1 (Expertise) | `tblV93tXIqPJqmuiS` | T1 kategorijų katalogas |
| TIER 2 (Skills) | `tblGadaFsyhJ8cmtQ` | T2 technologijų katalogas |

---

## REQUESTS — kritiniai laukai

| Laukas | Field ID | Tipas | Pastaba |
|---|---|---|---|
| REQ_ID | `fldneTNzvBHaLe1NZ` | singleLineText | Primary key |
| State | `fldTIspvhLNTI59UD` | singleSelect | Lifecycle vartotojas — žr. žemiau |
| Name | `fldY4PU2MPmSsYJgv` | singleLineText | Kliento vardas |
| Email | `fldfjKiZFR0p2A2cJ` | email | |
| Phone | `fldCDOtmBTAFqLCti` | phoneNumber | |
| Problem_Raw | `fldDTRHiTHaN52Tpx` | multilineText | Kliento aprašymas |
| t1_expertise | `fldI86mBg603EybB7` | singleSelect | **B1 matching naudoja šį lauką** |
| t2_skills | `fldxixIJpq1hm0Sbs` | multipleSelects | **B1 matching naudoja šį lauką** |
| AI_Problem_Summary | `fldFptV0nTV94Z7Wv` | multilineText | AI output |
| Spec_JSON | `fldMELeWx6oZK1uYR` | multilineText | Structured spec iš Dispatcher |
| est_price_min | `fldlrvcE6PCWkX7zi` | number | EUR |
| est_price_max | `fldWmzJgLyDLGBVtl` | number | EUR |
| delivery_days_min | `fld2hzT7l5AoZt39Q` | number | |
| delivery_days_max | `fldViyEZSB8UkAsKN` | number | |
| pool_generated | `fldJOy2zmddB46PVi` | checkbox | B1 lock — ar jau sukurtas pool |
| pool_lock | `fld9L7hddI3pRpu9z` | checkbox | Race condition guard |
| clarification_block | `fldc7nSEJGD1jlTgd` | checkbox | Jei true — Matching sustoja |
| dispatcher_lock | `fldvDKhTRg8e8C4RT` | checkbox | A1 idempotency |
| invites_sent | `fldZaL7AN6xbBTY1O` | checkbox | B2 sent flag |
| shortlist_sent | `fldpku1WIG484ENT3` | checkbox | C1 sent flag |
| payment_confirmed | `fldAVaLmPu95RwDuI` | checkbox | C2/C3 |
| quotes_received_count | `fld7wNUGP3VIUydqg` | rollup | Rollup iš PROPOSALS |
| quotes_ready | `fldxToXFC8Asp3L8v` | formula | Bool — ar pakanka quotes |
| last_error_code | `fldEoeiCkVHGYbdS2` | singleLineText | |
| last_error_message | `fld31aCK4e9dnnp8C` | multilineText | |
| manual_review_reason | `fldclkrhLbGXKlxGp` | multilineText | |
| Last_Idempotency_Key | `fldZZbO0Iks8njYcn` | singleLineText | |

### REQUESTS.State reikšmės:
```
DRAFT → DISPATCHING → ANALYZED → PAID
              ↘ WAITING_INFO → DRAFT (re-run)
              ↘ EDUCATIONAL_SENT
              ↘ REJECTED
              ↘ MANUAL_REVIEW
```

**Taisyklė:** State niekada nekeičiamas tiesiogiai iš frontend. Tik per Airtable API su tiksliai apibrėžtomis reikšmėmis.

---

## PROPOSALS — kritiniai laukai

| Laukas | Field ID | Tipas | Pastaba |
|---|---|---|---|
| Proposal_Number | `fld9u5UIO1uo4pvTD` | autoNumber | Primary key (ne record ID) |
| Request_Link | `fldgjk4jrMrkxElcT` | multipleRecordLinks | → REQUESTS |
| Provider_Profile_Link | `fldwclWod5HZwIACI` | multipleRecordLinks | → PROVIDER_PROFILES |
| Status | `fldIsQCNHUpLZ9wu9` | singleSelect | **Visada UPPERCASE** |
| AI_Match_Score | `fld67IaDwvRn5KBZx` | number | |
| Why_Fit | `fldpb1jRdZcZULD1R` | multilineText | Tiekėjo pagrindimas |
| Proposed_Price | `fldS6WtyEpoPcfJRA` | currency | EUR |
| Delivery_Days | `fldpYyP1edfrKrJqd` | number | |
| Payment_Status | `fldAjUdVFhWcv42GW` | singleSelect | |
| Stripe_Payment_Link | `fldv5k9l1rJ72fsft` | url | |
| REQ_ID_lookup | `fldQ1ZYkCWW51ICTM` | multipleLookupValues | Lookup iš Request |
| Event_Type | `fldWihLVG6VXtGZgb` | singleSelect | Zapier trigger |
| Last_Idempotency_Key | `fldwVtTEiA5oBXVHQ` | singleLineText | |

### PROPOSALS.Status reikšmės (UPPERCASE privalomas):
`NEW` | `SENT` | `INVITE_SENT` | `VIEWED` | `QUOTE_SUBMITTED` | `SELECTED` | `REJECTED` | `EXPIRED` | `WITHDRAWN`

### /quote puslapio PATCH operacijos:

```javascript
// action=quote — tiekėjas pateikia kainą
PATCH /v0/appnGWOBl6D4eTOhh/tblTUSy2Qwz3xKePS/{recordId}
{
  "fldIsQCNHUpLZ9wu9": "QUOTE_SUBMITTED",
  "fldS6WtyEpoPcfJRA": proposed_price,      // number
  "fldpYyP1edfrKrJqd": delivery_days,        // number
  "fldpb1jRdZcZULD1R": why_fit               // string
}

// action=decline — tiekėjas atsisako
PATCH /v0/appnGWOBl6D4eTOhh/tblTUSy2Qwz3xKePS/{recordId}
{
  "fldIsQCNHUpLZ9wu9": "REJECTED"
}
```

---

## PROVIDER_PROFILES — kritiniai laukai

| Laukas | Field ID | Tipas | Pastaba |
|---|---|---|---|
| Profile_ID | `fldom2ivz3pcCEkwg` | formula | Primary key |
| Entity_Link | `fldvTdjrLsNK2OQFB` | multipleRecordLinks | → PROVIDER_ENTITIES |
| Display_Name | `fld0S4ILjKbmd4KkI` | singleLineText | Ką mato klientas |
| T1_Expertise | `fldek19pY4nS8qzOy` | singleSelect | **B1 matching naudoja** |
| T2_Skills | `fldlksV2SCB5IcW75` | multipleSelects | **B1 matching naudoja** |
| Public_Status | `fldrOBh707BgCeG2J` | singleSelect | |
| Verification_Status | `fldnnEO8ZA86MT1bf` | singleSelect | |
| Availability_Status | `fldwdqvs0kkOCNtIW` | singleSelect | |
| Win_Rate | `fldUfk7tbgpwIZYIx` | formula | Iš DEAL_OUTCOMES |
| Risk_Score | `fldwRBwJfHx87reAs` | formula | Iš DEAL_OUTCOMES |
| AI_Profile_Vector | `fldz6E3pMoIroXLed` | multilineText | Embedding/matching text |

**Svarbu:** T1_Taxonomy (`fldA9wm9qByKBzIH5`) ir T2_Taxonomy (`fldvSRH9jDSemjyCg`) yra relational links į katalogų lenteles — MIRROR ONLY. B1 matching naudoja `T1_Expertise` (singleSelect) ir `T2_Skills` (multipleSelects).

---

## PROVIDER_ENTITIES — kritiniai laukai

| Laukas | Field ID | Tipas | Pastaba |
|---|---|---|---|
| Entity_ID | `fld6AIs7dlfQaK74t` | formula | Primary key |
| Primary_Contact_Name | `fldzovtNzM4vDcert` | singleLineText | |
| Primary_Contact_Email | `fldRkgqBiGrDytd5m` | email | Pagrindinis kontaktas |
| Representative_Email | `fld9H5wBtaKKy2psL` | email | |
| Legal_Name | `fld0tGKqkI7qt9ZhJ` | singleLineText | |
| Contract_Status | `fld41Jxwnvex8XwNd` | singleSelect | |
| Payment_Status | `flduOP4ZS6fkFfuoI` | singleSelect | |

---

## AUTOMATION_LOGS — kritiniai laukai

| Laukas | Field ID | Tipas | Pastaba |
|---|---|---|---|
| Log_ID | `fldBLNFXkZnYV1Y2Q` | autoNumber | |
| Idempotency_Key | `fldcnVISuZqXUshHl` | singleLineText | |
| Zap_Name | `fldpi8wW4HjZQtB0B` | singleLineText | A1, A1.5, B1, B2, B3... |
| Event_Type | `fldwdxxo7HWsHGRGF` | singleSelect | Business event |
| REQ_ID | `fldWyUxpCzjVqMfoS` | singleLineText | |
| Status | `fldJ87yxBq1MnENfF` | singleSelect | |
| Error_Message | `fldYvmyc923L9tCeW` | multilineText | |
| Payload_JSON | `fldP3H1DOf2D0vAGN` | multilineText | |

---

## DEAL_OUTCOMES — kritiniai laukai

| Laukas | Field ID | Tipas | Pastaba |
|---|---|---|---|
| Outcome_ID | `fldG6lP9Kulmm6RM0` | formula | Primary key |
| Proposal_Link | `fldGhtqBhHWtAj1iH` | multipleRecordLinks | |
| Outcome | `fldMLRDwyQ8tKdDJA` | singleSelect | |
| Satisfaction | `fldx1XPMCNo10WOrJ` | rating | Truth Loop |
| On_Time | `fldy0R7F9TCHtZbwc` | checkbox | |
| Scope_Creep | `fldmpVBrOc8Lae77w` | checkbox | |
| Dispute | `fld2c8fuWhqvbhzjB` | checkbox | |
| Strike_Generated | `fldgImxaas69xphpI` | checkbox | |

---

## TIER SISTEMA

### Tier 1 — KĄ parduodi (singleSelect, max 2 per provider):
`ECOMMERCE_AI` | `BUSINESS_AUTO` | `WEB_APPS` | `CUSTOMER_SUPPORT_AI` | `SALES_AI` | `SOCIAL_GROWTH` | `CONTENT_PROD` | `ADS_CREATIVE` | `KNOWLEDGE_RAG` | `OCR_DATA` | `DATA_ANALYTICS` | `CUSTOM_DEV` | `AI_GOVERNANCE` | `COMPLIANCE`

### Tier 2 — KAIP darai (multipleSelects, max 5 per provider):
`WORKFLOW_AUTO` | `API_INTEGRATIONS` | `RAG_SYSTEMS` | `AI_AGENTS` | `PROMPT_GUARDRAILS` | `OCR_GENERATION` | `CONTENT_REPURPOSING` | `VIDEO_PIPELINE` | `ADS_GEN` | `SOCIAL_SCHEDULING` | `ENGAGEMENT_TRIAGE` | `WEB_APPS` | `BACKEND_DB` | `VECTOR_DB` | `CLOUD_DEPLOY` | `BI_FORECASTING` | `GDPR_COMPLIANCE`

---

## KRITINĖS TAISYKLĖS

1. **Field ID'ai case-sensitive** — naudok tiksliai kaip šiame dokumente
2. **Checkbox false = tuščias laukas** — Zapier filtruose: "is empty", ne "equals false"
3. **PROPOSALS.Status visada UPPERCASE** — `NEW`, ne `New`
4. **API key NIEKADA kode** — `process.env.AIRTABLE_API_KEY`
5. **Linked record laukai grąžina array** — visada `Array.isArray()` check
6. **State machine** — REQUESTS.State nekeičiamas iš frontend tiesiogiai
7. **B1 matching naudoja singleSelect/multipleSelects laukus**, NE relational links:
   - `t1_expertise` (singleSelect) — ne `T1_ID` (multipleRecordLinks)
   - `t2_skills` (multipleSelects) — ne `T2_Skills_descript` (multipleRecordLinks)
8. **Idempotency** — kiekvienas Zap prasideda idempotency check'u prieš bet kokį veiksmą
9. **Race condition** — `pool_lock` checkbox saugo nuo duplicate pool generation

---

## AIRTABLE API HELPER PATTERN (Next.js)

```typescript
// lib/airtable.ts
const BASE_ID = process.env.AIRTABLE_BASE_ID // appnGWOBl6D4eTOhh

export async function patchRecord(
  tableId: string,
  recordId: string,
  fields: Record<string, unknown>
) {
  const res = await fetch(
    `https://api.airtable.com/v0/${BASE_ID}/${tableId}/${recordId}`,
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

export async function getRecord(tableId: string, recordId: string) {
  const res = await fetch(
    `https://api.airtable.com/v0/${BASE_ID}/${tableId}/${recordId}`,
    {
      headers: { Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}` },
    }
  )
  if (!res.ok) throw new Error(`Airtable error: ${res.status}`)
  return res.json()
}
```
