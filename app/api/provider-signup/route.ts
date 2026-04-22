import { NextRequest, NextResponse } from 'next/server';

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY!;
const BASE_ID = 'appnGWOBl6D4eTOhh';
const TABLE_ID = 'PROVIDER_ENTITIES';

export async function POST(req: NextRequest) {
  try {
    const { name, email, company, tier1, tier2Skills } = await req.json();

    if (!name || !email || !tier1) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const res = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        records: [
          {
            fields: {
              Legal_Name: company || name,
              Representative_Name: name,
              Representative_Email: email,
              Registration_Status: 'lead',
              T1_Expertise: tier1,
              T2_Skills: Array.isArray(tier2Skills) ? tier2Skills.join(', ') : '',
            },
          },
        ],
        typecast: true,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      console.error('[provider-signup] Airtable error:', err);
      return NextResponse.json({ error: 'Airtable write failed' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[provider-signup] Error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
