---
name: zapier-flows
description: RaskAI Zapier automation pipeline — all Zap steps, trigger views, idempotency patterns, field mappings, and status lifecycle from A1 to C3
type: project
---

# RaskAI Zapier Flows

**Skill:** `zapier-flows`
**Kada naudoti:** Kai reikia kurti, debuginti ar modifikuoti Zapier automatizacijas — naujų žingsnių rašymas, Code step'ų logika, trigger sąlygos, idempotency, laukų mapping'as tarp Airtable ir Zapier.

**Šaltinis:** RaskAI_Zap_Registras_v2.1 — STATE OF TRUTH (patvirtinta per Airtable MCP API, 2026-03)

---

## GLOBALIOS TAISYKLĖS — BEZ IŠIMČIŲ

**Architektūros branduolys:**
- `REQUESTS.State` = vienintelis lifecycle šaltinis
- Dispatcher V4 grąžina flat JSON + Spec_JSON — jis NEVALDO state, tik grąžina `decision_signal`
- Pricing Engine V1 yra deterministinis Code step — be LLM kainų spėjimo
- Bet koks techninis fail'as → `MANUAL_REVIEW` + `last_error_*` + `raw_ai_payload` + `dispatcher_lock=false`

**Triggerių taisyklė:**
Visi triggeriai — Airtable Views (išskyrus Stripe webhook, formų ir tiekėjų atsakymų). Airtable Views filtruoja būsenas — Zapier tik reaguoja.

**Idempotency (kiekvienas Zap pradeda nuo šio):**
```
S0: Find Record pagal REQ_ID
F0: Filter by State = [laukiama būsena]
    → Jei neatitinka — Zap sustoja be klaidų
```

**Logging (kiekvienas Zap baigiasi šiuo):**
```
FINAL: Create record AUTOMATION_LOGS
  Zap_Name: A1 / A1.5 / B1 / B2 / B3 / B3.1 / C1 / C2 / C3
  REQ_ID: [iš konteksto]
  Status: Success / Error
  Error_Message: [jei yra]
  Timestamp: [auto]
```
⚠️ `Zap_Name` ir `Event_Type` yra ATSKIRI laukai — nemaišyti.

---

## ZAP STATUSAI

| Zap | Statusas | Kitas žingsnis |
|---|---|---|
| A1 — AI Dispatcher | ✅ AKTYVUS | View sugriežtinimas (attempts<3 + clarification_block) |
| A1.5 — Clarification Form | ✅ AKTYVUS | Patikrinti ar forma turi tik 2 laukus |
| B1 — Matchmaker & Pool | 🔧 KURIAMAS | **Pirmas prioritetas** |
| B2 — Provider Invites | 🔧 KURIAMAS | Po B1 |
| B3 — Quote Receiver | 🔧 KURIAMAS | Webhook + PROPOSALS update |
| B3.1 — Explicit Decline | 🔧 KURIAMAS | Webhook decline |
| C1 — Shortlist | 🔧 KURIAMAS | Po B3 |
| C2 — Buyer Accept | 🔧 KURIAMAS | Webhook + Stripe |
| C3 — Payment Success | 🔧 KURIAMAS | Stripe webhook + DEAL_OUTCOMES |

---

## AIRTABLE VIEWS — TRIGGERIAI

| View | Zap | Filtras |
|---|---|---|
| `A1__DRAFT_TO_DISPATCH` | A1 | State=DRAFT AND dispatcher_lock=false AND clarification_block=false AND attempts<3 |
| `B1__ANALYZED_TO_POOL` | B1 | State=ANALYZED AND pool_generated=false AND pool_lock=false |
| `PROPOSALS__NEEDS_SENDING` | B2 | PROPOSALS.Status=New |
| `C1__QUOTES_READY_TO_SHORTLIST` | C1 | State=ANALYZED AND quotes_ready=1 AND shortlist_sent=false |
| `ERROR__MANUAL_REVIEW` | Admin | State=MANUAL_REVIEW |

---

## ZAP A1 — AI Dispatcher ✅

**Trigger:** `A1__DRAFT_TO_DISPATCH`
**AI:** GPT-4o Dispatcher V4

```
S0  Idempotency: Find REQ_ID → Filter State=DRAFT + dispatcher_lock=false + attempts<3
S1  UPDATE REQUESTS: State=DISPATCHING, dispatcher_lock=true, attempts+=1, dispatcher_run_id=uuid, dispatcher_version=v4
S2  Filter: attempts <= 3 (jei > 3 → MANUAL_REVIEW + unlock)
S3  OpenAI GPT-4o: Input=Problem_Raw (+clarification_text jei yra)
    Output JSON: decision_signal, Intent_Score, confidence_score, t1_expertise,
                 t2_skills, complexity_level, cq1_type, cq1_text, cq2_type, cq2_text,
                 Spec_JSON, user_feedback_message
S4  Code: Validate+Parse JSON (7 privalomi laukai), normalizuoti t2_skills → ok=true/false
S5  Filter: ok=false → MANUAL_REVIEW + last_error_* + raw_ai_payload + unlock → stop

S6  Paths (4 keliai pagal decision_signal):

P-A READY:
  Code: Pricing Engine V1
    Base_Price(t1_expertise) × Complexity_Multiplier × Skill_Extras × Compliance_Premium
    → est_price_min/max, delivery_days_min/max
  UPDATE REQUESTS: State=ANALYZED, visi AI output laukai, pricing laukai, dispatcher_lock=false
  EMAIL klientui: patvirtinimas + preliminari kaina

P-B NEEDS_CLARIFICATION:
  UPDATE REQUESTS: State=WAITING_INFO, clarification_block=true, cq1/cq2 laukai, dispatcher_lock=false
  EMAIL klientui: klausimai + URL į clarification formą (?req_id=...)

P-C EDUCATIONAL:
  UPDATE REQUESTS: State=EDUCATIONAL_SENT, dispatcher_lock=false
  EMAIL klientui: user_feedback_message

P-D REJECTED:
  UPDATE REQUESTS: State=REJECTED, dispatcher_lock=false
  EMAIL klientui: atmetimo priežastis

FINAL: AUTOMATION_LOGS
```

---

## ZAP A1.5 — Clarification Form ✅

**Trigger:** Zapier Interfaces form submission
**Forma:** TIKTAI 2 laukai: `req_id` (hidden) + `clarification_text` (long text)

```
S1  Form Trigger: gauti req_id, clarification_text
S2  Airtable Find Record pagal req_id
S3  Code: validuoti (min 10 simbolių), attempts+=1 → shouldProceed=yes/no
S4  Filter: shouldProceed=yes (apsauga nuo tuščios formos re-loop)
S5  UPDATE REQUESTS:
      Problem_Raw = esamas + '\n--- KLIENTO PATIKSLINIMAS ---\n' + clarification_text
      attempts = newAttempts
      State = DRAFT  ← automatiškai paleidžia A1 per A1__DRAFT_TO_DISPATCH view
      dispatcher_lock = false
      clarification_block = false
      cq1_text = '' / cq2_text = ''
FINAL: AUTOMATION_LOGS
```

---

## ZAP B1 — Matchmaker & Pool Lock 🔧

**Trigger:** `B1__ANALYZED_TO_POOL`
**KRITINIS:** Matching naudoja `t1_expertise` (singleSelect) ir `t2_skills` (multipleSelects) — NE `T1_ID` / `T2_Skills_descript` (tie yra MIRROR ONLY)

```
S0  Idempotency: Filter State=ANALYZED + pool_generated=false + pool_lock=false
S1  UPDATE REQUESTS: pool_lock=true (race condition guard)
S2  Search PROVIDER_PROFILES:
      T1_Expertise = request.t1_expertise
      T2_Skills CONTAINS request.t2_skills
      Availability_Status = Available
      Verification_Status >= Verified-2
      Strike_Count < 3
      Rikiuoti: Risk_Score ASC, Avg_Satisfaction DESC
      Limit: pool_size_target (default 5)
S3  Filter: rasta >= 3 (jei < 3 → Supply_Gap + MANUAL_REVIEW)
S4  Loop: kiekvienam tiekėjui CREATE PROPOSALS:
      Request_Link = REQ_ID
      Provider_Profile_Link = provider record
      Status = New
      AI_Match_Score = T1 match + T2 overlap %
S5  UPDATE REQUESTS: pool_generated=true, pool_generated_at=now, pool_lock=false, pool_size_target=n
FAIL: pool_lock=false, State=MANUAL_REVIEW, last_error_code, last_error_message
FINAL: AUTOMATION_LOGS
```

---

## ZAP B2 — Provider Invites & Magic Links 🔧

**Trigger:** `PROPOSALS__NEEDS_SENDING` (PROPOSALS.Status=New)
**KRITINIS:** Trigger eina iš PROPOSALS lygio — NE iš REQUESTS. `REQUESTS.invites_sent` = tik audit signalas.

```
S0  Idempotency: Filter PROPOSALS.Status=New
S1  Find linked REQUEST: AI_Problem_Summary, est_price_min/max, t1_expertise, delivery_days_min/max
S2  Code: Generate Magic URLs:
      Quote URL:   https://raskai.lt/quote?proposal_id={{PROPOSAL_ID}}&req_id={{REQ_ID}}&action=quote
      Decline URL: https://raskai.lt/quote?proposal_id={{PROPOSAL_ID}}&action=decline
S3  UPDATE PROPOSALS: Status=Sent, Quote_SLA_Due=now+48h, Provider_Action_Due=now+48h
S4  EMAIL tiekėjui: problema + preliminari kaina + terminai
      [Pateikti kainą] → Quote URL
      [Atsisakyti]     → Decline URL
FINAL: AUTOMATION_LOGS
```

---

## ZAP B3 — Quote Receiver 🔧

**Trigger:** Webhook / Zapier Forms (tiekėjas užpildo /quote formą)

```
S1  Webhook: gauti proposal_id, req_id, Proposed_Price, Delivery_Days, Why_Fit, Risks_Assumptions
S2  Find PROPOSALS pagal proposal_id. Filter: Status=Sent
S3  Validate: Proposed_Price > 0, Delivery_Days > 0
S4  UPDATE PROPOSALS:
      Status = Quote_Submitted
      Proposed_Price, Delivery_Days, Why_Fit, Risks_Assumptions
      Last_Modified = now
S5  (Optional) Email klientui: 'Gautas naujas pasiūlymas'
    quotes_received_count Rollup perskaičiuoja automatiškai
FINAL: AUTOMATION_LOGS
```

---

## ZAP B3.1 — Explicit Decline 🔧

**Trigger:** Webhook (tiekėjas spaudžia "Atsisakyti" mygtutką)

```
S1  Webhook: gauti proposal_id, action=decline
S2  UPDATE PROPOSALS: Status=Declined (SVARBU: ne REJECTED — tai PROPOSALS statusas)
S3  (Optional) Re-invite: jei pool'e yra uninvited → triggerinti B2
FINAL: AUTOMATION_LOGS
```

---

## ZAP C1 — Client Shortlist 🔧

**Trigger:** `C1__QUOTES_READY_TO_SHORTLIST`
**Sąlyga:** `quotes_ready` = Airtable formula: `IF(quotes_received_count >= min_quotes_required, 1, 0)`

```
S0  Idempotency: shortlist_sent=false AND quotes_ready=1
S1  Search PROPOSALS: Request_Link=REQ_ID AND Status=Quote_Submitted → rikiuoti AI_Match_Score DESC
S2  Code: Format shortlist (max 3):
      kiekvienam → Display_Name, AI_Match_Score, Proposed_Price, Delivery_Days, Why_Fit, Risks
S3  (Optional) ChatGPT: 1-2 sakinių lietuviškas summary kiekvienam
S4  UPDATE REQUESTS: shortlist_sent=true, shortlist_sent_at=now
S5  EMAIL klientui: 3 pasiūlymai + kainos + terminai + AI match score + "Pasirinkti laimėtoją" mygtukas
FINAL: AUTOMATION_LOGS
```

---

## ZAP C2 — Buyer Accept + Stripe 🔧

**Trigger:** Webhook (klientas pasirenka laimėtoją iš accept formos)
**KRITINIS:** C2 = TIKTAI buyer accept → sukuria payment link → siunčia klientui. Stripe payment succeeded = C3 darbas.

```
S1  Webhook: gauti req_id, selected_proposal_id
S2  Find PROPOSALS pagal selected_proposal_id. Validate: Status=Quote_Submitted
S3  Stripe: Create Payment Link
      Suma = Proposed_Price, currency = EUR
      Metadata: { req_id, proposal_id }  ← BŪTINA C3 correlation'ui
      → Gauti payment_url
S4  UPDATE PROPOSALS: Status=Pending_Payment, Stripe_Payment_Link=payment_url,
      Stripe_Customer_ID, Stripe_Payment_Intent_ID (tik auditui)
S5  EMAIL klientui: mokėjimo nuoroda + 24h terminas
FINAL: AUTOMATION_LOGS
```

---

## ZAP C3 — Payment Success (Stripe Webhook) 🔧

**Trigger:** Stripe webhook: `checkout.session.completed`
**KRITINIS:** Correlation key = `metadata.proposal_id` + `metadata.req_id`. Stripe_Session_ID lauko nereikia.

```
S1  Stripe Webhook: gauti metadata.req_id, metadata.proposal_id, amount
S2  Find PROPOSALS pagal metadata.proposal_id. Validate: metadata.req_id sutampa
S3  UPDATE REQUESTS: State=PAID, payment_confirmed=true
S4  UPDATE PROPOSALS (laimėtojas): Status=Accepted
    UPDATE PROPOSALS (kiti to paties REQ_ID): Status=Lost
S5  CREATE DEAL_OUTCOMES:
      Proposal_Link = laimėtojo proposal record
      Request_Link = REQ_ID
      Outcome = 'WON'  ← UPPERCASE privalomas
      Created_At = now
      ⚠️ Is_Won ir Is_Won_Numeric = FORMULA laukai — Zapier nerašo!
FINAL: AUTOMATION_LOGS
```

---

## ŽINOMOS PROBLEMOS

| # | Problema | Sprendimas | Kada |
|---|---|---|---|
| 1 | `DEAL_OUTCOMES.Is_Won` formulė tikrina `'Won'` vietoj `'WON'` | Airtable UI → Is_Won → pakeisti į `IF({Outcome}='WON',1,0)` | **Prieš C3 kūrimą** |
| 2 | `REQUESTS.invites_sent` — potencialiai naudojamas kaip trigger | Patvirtinti: laukas = tik audit signalas, ne B2 trigger | Prieš B2 kūrimą |

---

## ATEITIES ZAP'AI (POST-MVP)

| Zap | Tikslas |
|---|---|
| A0.5 — Duplicate Detector | AI similarity check — dvigubos užklausos per 24h |
| D1 — Kickoff | PAID → sujungti klientą ir tiekėją |
| E1 — Satisfaction Capture | DELIVERED → satisfaction forma → DEAL_OUTCOMES |
| E2 — Strike Engine | Bad DEAL_OUTCOMES → +1 Strike. Strike >= 3 → Suspended |
| F1 — Expired Quotes SLA | Quote_SLA_Due < Now AND Status=Sent → Expired |
| G1 — Supply Gap Detector | B1 randa < 3 tiekėjų → Supply_Gap=true |

---

## PROPOSALS.Status LIFECYCLE

```
New → Sent → Quote_Submitted → Pending_Payment → Accepted
           → Declined (B3.1)
           → Expired (F1 future)
           → Lost (C3 — kiti pasiūlymai kai laimėtojas selected)
```

⚠️ Status visada UPPERCASE: `New`, `Sent`, `Quote_Submitted`, `Declined`, `Accepted`, `Lost`, `Expired`, `Pending_Payment`
