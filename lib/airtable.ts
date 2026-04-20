/**
 * RaskAI — Airtable REST Client
 * Base: appnGWOBl6D4eTOhh
 * Env var: AIRTABLE_API_KEY
 *
 * Field IDs verified via Airtable MCP API (2026-03)
 */

const BASE_ID = 'appnGWOBl6D4eTOhh';
const BASE_URL = `https://api.airtable.com/v0/${BASE_ID}`;

// ─── Table IDs ────────────────────────────────────────────────────────────────
export const TABLES = {
  REQUESTS:          'tblfVnpYzUA34tcKP',
  PROPOSALS:         'tblTUSy2Qwz3xKePS',
  PROVIDER_PROFILES: 'tblU45fKAu84kNIAH',
  PROVIDER_ENTITIES: 'tblXOQLGeIEMPvxrx',
  DEAL_OUTCOMES:     'tblpMtFwRkUrzP8nw',
  AUTOMATION_LOGS:   'tbl2A2QsydYOusLhk',
} as const;

// ─── PROPOSALS field IDs (verified 2026-03) ───────────────────────────────────
export const PROPOSALS_FIELDS = {
  Proposal_Number:          'fld9u5UIO1uo4pvTD',
  Request_Link:             'fldgjk4jrMrkxElcT',
  Provider_Profile_Link:    'fldwclWod5HZwIACI',
  Status:                   'fldIsQCNHUpLZ9wu9',
  AI_Match_Score:           'fld67IaDwvRn5KBZx',
  Why_Fit:                  'fldpb1jRdZcZULD1R',
  Risks_Assumptions:        'fld4ukKkDICC6qXGD',
  Proposed_Price:           'fldS6WtyEpoPcfJRA',
  Delivery_Days:            'fldpYyP1edfrKrJqd',
  Provider_Action_Due:      'fldF8DNGGq3FLMLCf',
  Quote_SLA_Due:            'fldmXcId6VzRZD0gQ',
  Created_At:               'fldajiM3MguPr20xc',
  Last_Modified:            'fldDiUiFDu3v2Ieob',
  Payment_Status:           'fldAjUdVFhWcv42GW',
  Stripe_Customer_ID:       'fld3N0FJQba0eoaLx',
  Stripe_Payment_Link:      'fldv5k9l1rJ72fsft',
  Stripe_Payment_Intent_ID: 'fld1lHzNngGn4KWbc',
  REQ_ID_lookup:            'fldQ1ZYkCWW51ICTM',
} as const;

// ─── PROPOSALS.Status — visi UPPERCASE (verified 2026-03) ────────────────────
export const PROPOSAL_STATUS = {
  NEW:             'NEW',
  INVITE_SENT:     'INVITE_SENT',
  PENDING_QUOTE:   'PENDING_QUOTE',
  QUOTE_SUBMITTED: 'QUOTE_SUBMITTED',
  VIEWED:          'VIEWED',
  SELECTED:        'SELECTED',
  REJECTED:        'REJECTED',
  EXPIRED:         'EXPIRED',
  WITHDRAWN:       'WITHDRAWN',
} as const;

// Statuses where provider can still act (quote or decline)
export const PROPOSAL_ACTIONABLE = [
  PROPOSAL_STATUS.NEW,
  PROPOSAL_STATUS.INVITE_SENT,
] as const;

// ─── REQUESTS field IDs (subset used in /quote) ───────────────────────────────
export const REQUESTS_FIELDS = {
  REQ_ID:                        'fldneTNzvBHaLe1NZ',
  ai_dispatcher_problem_summary: 'fldpwRKQmCplLXLQb',
  est_price_min:                 'fldlrvcE6PCWkX7zi',
  est_price_max:                 'fldWmzJgLyDLGBVtl',
  delivery_days_min:             'fld2hzT7l5AoZt39Q',
  delivery_days_max:             'fldViyEZSB8UkAsKN',
  t1_expertise:                  'fldI86mBg603EybB7',
  t2_skills:                     'fldxixIJpq1hm0Sbs',
} as const;

// ─── Types ────────────────────────────────────────────────────────────────────
export interface AirtableRecord {
  id: string;
  fields: Record<string, any>;
  createdTime?: string;
}

export interface AirtableListResponse {
  records: AirtableRecord[];
  offset?: string;
}

// ─── Core fetch with retry + exponential backoff ──────────────────────────────
async function airtableFetch(
  path: string,
  options: RequestInit = {},
  retries = 3,
): Promise<any> {
  const apiKey = process.env.AIRTABLE_API_KEY;
  if (!apiKey) throw new Error('AIRTABLE_API_KEY is not set');

  const url = `${BASE_URL}${path}`;
  const headers: Record<string, string> = {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> ?? {}),
  };

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const res = await fetch(url, {
        ...options,
        headers,
        cache: 'no-store',
      });

      if (res.status === 429) {
        await new Promise(r => setTimeout(r, 1000 * Math.pow(2, attempt)));
        continue;
      }

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(`Airtable ${res.status}: ${JSON.stringify(errBody)}`);
      }

      return await res.json();
    } catch (err: any) {
      if (attempt === retries - 1) throw err;
      await new Promise(r => setTimeout(r, 500 * (attempt + 1)));
    }
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function getRecord(tableId: string, recordId: string): Promise<AirtableRecord> {
  return airtableFetch(`/${tableId}/${recordId}?returnFieldsByFieldId=true`);
}

export async function updateRecord(
  tableId: string,
  recordId: string,
  fields: Record<string, any>,
): Promise<AirtableRecord> {
  return airtableFetch(`/${tableId}/${recordId}`, {
    method: 'PATCH',
    body: JSON.stringify({ fields }),
  });
}

export async function findRecords(
  tableId: string,
  filterFormula: string,
  maxRecords = 10,
): Promise<AirtableListResponse> {
  const params = new URLSearchParams({ filterByFormula: filterFormula, maxRecords: String(maxRecords), returnFieldsByFieldId: 'true' });
  return airtableFetch(`/${tableId}?${params}`);
}

export async function createRecords(
  tableId: string,
  records: Array<{ fields: Record<string, any> }>,
): Promise<AirtableListResponse> {
  return airtableFetch(`/${tableId}`, { method: 'POST', body: JSON.stringify({ records }) });
}
