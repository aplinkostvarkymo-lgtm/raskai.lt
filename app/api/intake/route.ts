import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';

const BASE_ID = process.env.AIRTABLE_BASE_ID || 'appnGWOBl6D4eTOhh';
const TOKEN = process.env.AIRTABLE_API_TOKEN || process.env.AIRTABLE_API_KEY || '';
const BASE_URL = `https://api.airtable.com/v0/${BASE_ID}`;

const headers = {
  Authorization: `Bearer ${TOKEN}`,
  'Content-Type': 'application/json',
};

async function airtableFetch(path: string, init: RequestInit, attempt = 0): Promise<Response> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: { ...headers, ...(init.headers || {}) },
  });
  if (res.status === 429) {
    if (attempt > 5) throw new Error('Airtable rate limit exceeded');
    await new Promise(r => setTimeout(r, Math.min(1000 * 2 ** attempt, 8000)));
    return airtableFetch(path, init, attempt + 1);
  }
  return res;
}

async function assertOk(res: Response) {
  if (!res.ok) {
    let detail = '';
    try { detail = await res.text(); } catch {}
    throw new Error(`Airtable ${res.status}: ${res.statusText} | ${detail}`);
  }
}

async function findOne(table: string, formula: string) {
  const res = await airtableFetch(
    `/${table}?filterByFormula=${encodeURIComponent(formula)}&maxRecords=1`,
    { method: 'GET' }
  );
  await assertOk(res);
  const data = await res.json();
  return data.records?.[0] ?? null;
}

async function createRecord(table: string, fields: Record<string, unknown>) {
  const res = await airtableFetch(`/${table}`, {
    method: 'POST',
    body: JSON.stringify({ fields }),
  });
  await assertOk(res);
  return res.json();
}

async function updateRecord(table: string, recordId: string, fields: Record<string, unknown>) {
  const res = await airtableFetch(`/${table}/${recordId}`, {
    method: 'PATCH',
    body: JSON.stringify({ fields }),
  });
  await assertOk(res);
  return res.json();
}

export async function POST(req: NextRequest) {
  try {
    const { problem, email, name } = await req.json();

    if (!problem || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    if (problem.trim().length < 20) {
      return NextResponse.json({ error: 'Problem description too short' }, { status: 400 });
    }

    const reqId = `REQ_${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;

    const idempotencyKey = createHash('sha256')
      .update(JSON.stringify({ REQ_ID: reqId, Email: email.toLowerCase().trim(), Problem_Raw: problem.trim() }))
      .digest('hex');

    // READ-before-WRITE
    let record = await findOne('REQUESTS', `{Last_Idempotency_Key}="${idempotencyKey}"`);
    if (record) {
      return NextResponse.json({ success: true, req_id: record.fields.REQ_ID, duplicate: true });
    }

    // CREATE
    record = await createRecord('REQUESTS', {
      REQ_ID: reqId,
      Email: email.trim().toLowerCase(),
      Name: name?.trim() || '',
      Problem_Raw: problem.trim(),
      Source_Channel: 'web_form',
      State: 'DRAFT',
      Last_Idempotency_Key: idempotencyKey,
    });

    // AUTOMATION_LOG best-effort
    try {
      const logKey = createHash('sha256').update(`intake_ok_${reqId}`).digest('hex');
      await createRecord('AUTOMATION_LOGS', {
        Idempotency_Key: logKey,
        Zap_Name: 'WEB_INTAKE',
        REQ_ID: reqId,
        Status: 'Success',
        Payload_JSON: JSON.stringify({ req_id: reqId }),
      });
    } catch {}

    return NextResponse.json({ success: true, req_id: reqId });

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    console.error('[intake] ERROR:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
