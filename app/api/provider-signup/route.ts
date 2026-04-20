import { NextRequest, NextResponse } from 'next/server';

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY!;
const BASE_ID = 'appnGWOBl6D4eTOhh';
const TABLE_ID = 'PROVIDER_ENTITIES';

export async function POST(req: NextRequest) {
  try {
    const { name, email, company, expertise } = await req.json();

    if (!name || !email || !expertise) {
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
              Name: name,
              Email: email,
              Company: company || '',
              T1_Expertise: expertise,
              Source: 'landing_page',
              Status: 'lead',
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
