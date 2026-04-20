---
name: tier-system
description: RaskAI T1/T2 taxonomy — full enum values, matching logic, Airtable field mapping, Dispatcher validation rules, and provider classification constraints
type: project
---

# RaskAI Tier Sistema

**Skill:** `tier-system`
**Kada naudoti:** Kai reikia dirbti su T1/T2 klasifikacija — provider onboarding, matching logika, Dispatcher output validacija, naujų kategorijų svarstymas, UI labels.

---

## KONCEPCIJA

Dviejų lygių taksonomija aprašo tiekėją ir užklausą vienu metu.

**Tier 1** = KĄ parduodi (outcome, verslo rezultatas)
**Tier 2** = KAIP darai (techniniai gebėjimai)

Matching logika: `REQUESTS.t1_expertise` ↔ `PROVIDER_PROFILES.T1_Expertise` (enum-to-enum)
ir `REQUESTS.t2_skills` ↔ `PROVIDER_PROFILES.T2_Skills` (enum-to-enum, multipleSelects)

---

## TIER 1 — Expertise (singleSelect)

Maksimum **2 per provider**. Dispatcher rašo 1 reikšmę į `REQUESTS.t1_expertise`.

| Reikšmė | Aprašymas |
|---|---|
| `ECOMMERCE_AI` | E-komercijos AI sprendimai |
| `BUSINESS_AUTO` | Verslo procesų automatizacija |
| `WEB_APPS` | Web aplikacijos ir platformos |
| `CUSTOMER_SUPPORT_AI` | AI klientų aptarnavimas |
| `SALES_AI` | Pardavimų AI įrankiai |
| `SOCIAL_GROWTH` | Socialinių tinklų augimas |
| `CONTENT_PROD` | Turinio gamyba ir automatizacija |
| `ADS_CREATIVE` | Reklamos kūryba ir optimizacija |
| `KNOWLEDGE_RAG` | Žinių bazės ir RAG sistemos |
| `OCR_DATA` | OCR ir duomenų ekstraktavimas |
| `DATA_ANALYTICS` | Duomenų analizė ir BI |
| `CUSTOM_DEV` | Individualus AI/tech kūrimas |
| `AI_GOVERNANCE` | AI valdymas ir politika |
| `COMPLIANCE` | Atitiktis ir reguliavimas |

---

## TIER 2 — Skills (multipleSelects)

Maksimum **5 per provider**. Dispatcher rašo masyvą į `REQUESTS.t2_skills`.

| Reikšmė | Aprašymas |
|---|---|
| `WORKFLOW_AUTO` | Workflow automatizacija (Zapier, Make ir kt.) |
| `API_INTEGRATIONS` | API integracijos |
| `RAG_SYSTEMS` | RAG sistemų kūrimas |
| `AI_AGENTS` | AI agentų kūrimas |
| `PROMPT_GUARDRAILS` | Prompt inžinerija ir apsaugos |
| `OCR_GENERATION` | OCR ir dokumentų generavimas |
| `CONTENT_REPURPOSING` | Turinio pertvarkimas |
| `VIDEO_PIPELINE` | Video kūrimo pipeline |
| `ADS_GEN` | Reklamos generavimas |
| `SOCIAL_SCHEDULING` | Socialinių tinklų planavimas |
| `ENGAGEMENT_TRIAGE` | Žinučių ir komentarų valdymas |
| `WEB_APPS` | Web aplikacijų kūrimas |
| `BACKEND_DB` | Backend ir duomenų bazės |
| `VECTOR_DB` | Vektorinės duomenų bazės |
| `CLOUD_DEPLOY` | Cloud deployment |
| `BI_FORECASTING` | BI ir prognozavimas |
| `GDPR_COMPLIANCE` | GDPR ir duomenų apsauga |

---

## AIRTABLE LAUKAI

| Laukas | Lentelė | Tipas | Pastaba |
|---|---|---|---|
| `t1_expertise` | REQUESTS | singleSelect | Dispatcher output — **B1 matching naudoja** |
| `t2_skills` | REQUESTS | multipleSelects | Dispatcher output — **B1 matching naudoja** |
| `T1_Expertise` | PROVIDER_PROFILES | singleSelect | Provider profilis |
| `T2_Skills` | PROVIDER_PROFILES | multipleSelects | Provider profilis |
| `T1_ID` | REQUESTS | multipleRecordLinks | MIRROR ONLY — B1 nenaudoja |
| `T2_Skills_descript` | REQUESTS | multipleRecordLinks | MIRROR ONLY — B1 nenaudoja |
| `T1_Taxonomy` | PROVIDER_PROFILES | multipleRecordLinks | MIRROR ONLY — B1 nenaudoja |
| `T2_Taxonomy` | PROVIDER_PROFILES | multipleRecordLinks | MIRROR ONLY — B1 nenaudoja |

**Taisyklė:** Matching visada per `singleSelect`/`multipleSelects` laukus — ne per relational links.

---

## KATALOGŲ LENTELĖS

Tier reikšmių katalogas saugomas atskirose lentelėse:

| Lentelė | Table ID | Paskirtis |
|---|---|---|
| TIER 1: Sprendimai | `tblV93tXIqPJqmuiS` | T1 kategorijų detalės, spec templates, pricing |
| TIER 2: Technologijos | `tblGadaFsyhJ8cmtQ` | T2 skills detalės, AI tools, use cases |

Šios lentelės yra **referensinės** — Dispatcher ir B1 jų neklausoja runtime metu.

---

## DISPATCHER VALIDACIJA

Kai A1 grąžina JSON, Code step turi patikrinti:
- `t1_expertise` reikšmė yra iš T1 sąrašo aukščiau
- `t2_skills` yra masyvas, kiekviena reikšmė iš T2 sąrašo aukščiau
- `t2_skills.length` <= 5

Jei neatitinka → `ok=false` → MANUAL_REVIEW.

---

## KRITINĖS TAISYKLĖS

1. T1 ir T2 reikšmės — visada UPPERCASE su underscore (`BUSINESS_AUTO`, ne `Business Auto`)
2. Provider gali turėti max 2 T1 ir max 5 T2
3. B1 matching: T1 = exact match, T2 = "contains any" logika
4. Naują kategoriją pridėti reikia trijose vietose: enum sąraše, Airtable singleSelect/multipleSelects options, katalogo lentelėje
