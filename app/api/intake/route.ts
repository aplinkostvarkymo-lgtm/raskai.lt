import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY!;
const BASE_ID = 'appnGWOBl6D4eTOhh';
const REQUESTS_TABLE = 'REQUESTS';
const LOGS_TABLE = 'AUTOMATION_LOGS';

function generateReqId(): string {
  const ts = Date.now().toString().slice(-6);
  const rand = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `REQ_${ts}${rand}`;
}


async function airtableGet(path: string) {
  const res = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${path}`, {
    headers: {
      Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      'Content-Type': 'application/json',
    },
  });
  return res.json();
}

async function airtablePost(table: string, fields: Record<string, unknown>) {
  const res = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${table}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fields }),
  });
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

    // Idempotency key — stable per session (use problem+email, no timestamp)
    const idempotencyKey = createHash('sha256')
      .update(`intake::${email.toLowerCase()}::${problem.trim()}`)
      .digest('hex');

    // READ-before-WRITE: check duplicate
    const existing = await airtableGet(
      `${REQUESTS_TABLE}?filterByFormula=%7BLast_Idempotency_Key%7D%3D%22${idempotencyKey}%22&maxRecords=1`
    );

    if (existing.records?.length > 0) {
      const reqId = existing.records[0].fields.REQ_ID;
      return NextResponse.json({ success: true, req_id: reqId, duplicate: true });
    }

    // Generate IDs
    const reqId = generateReqId();
    const now = new Date();
    const slaDue = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();

    // Write REQUESTS
    const record = await airtablePost(REQUESTS_TABLE, {
      REQ_ID: reqId,
      Email: email.trim().toLowerCase(),
      Name: name?.trim() || '',
      Problem_Raw: problem.trim(),
      State: 'DRAFT',
      Source_Channel: 'web_form',
      SLA_Hours: 24,
      Response_SLA_Due: slaDue,
      Last_Idempotency_Key: idempotencyKey,
      Last_Event_Processed: 'INTAKE_v1',
    });

    if (record.error) {
      console.error('[intake] Airtable error:', record.error);
      return NextResponse.json({ error: 'Failed to create request' }, { status: 500 });
    }

    // Write AUTOMATION_LOGS (best-effort)
    await airtablePost(LOGS_TABLE, {
      Zap_Name: 'WEB_INTAKE',
      REQ_ID: reqId,
      Status: 'Success',
      Payload_JSON: JSON.stringify({ req_id: reqId, source: 'web_form' }),
    }).catch(() => {}); // best-effort, never block main flow

    return NextResponse.json({ success: true, req_id: reqId });

  } catch (err) {
    console.error('[intake] Error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
