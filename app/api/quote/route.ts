/**
 * POST /api/quote
 *
 * Handles two provider actions:
 *   action=quote   → saves fields → Status=QUOTE_SUBMITTED
 *   action=decline → Status=REJECTED
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  getRecord,
  updateRecord,
  TABLES,
  PROPOSALS_FIELDS,
  PROPOSAL_STATUS,
  PROPOSAL_ACTIONABLE,
} from '@/lib/airtable';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { proposal_id, action, proposed_price, delivery_days, why_fit, risks_assumptions } = body;

    if (!proposal_id || typeof proposal_id !== 'string') {
      return NextResponse.json({ error: 'proposal_id is required' }, { status: 400 });
    }
    if (!action || !['quote', 'decline'].includes(action)) {
      return NextResponse.json({ error: 'action must be "quote" or "decline"' }, { status: 400 });
    }

    let proposal;
    try {
      proposal = await getRecord(TABLES.PROPOSALS, proposal_id);
    } catch (err: any) {
      if (err.message?.includes('404') || err.message?.includes('NOT_FOUND')) {
        return NextResponse.json({ error: 'Proposal not found' }, { status: 404 });
      }
      throw err;
    }

    const statusField = proposal.fields[PROPOSALS_FIELDS.Status];
    const currentStatus: string = typeof statusField === 'object' && statusField !== null
      ? statusField.name ?? ''
      : statusField ?? '';

    // Idempotency: already processed
    if (!PROPOSAL_ACTIONABLE.includes(currentStatus as any)) {
      return NextResponse.json({ success: true, already_processed: true, current_status: currentStatus });
    }

    if (action === 'decline') {
      await updateRecord(TABLES.PROPOSALS, proposal_id, {
        [PROPOSALS_FIELDS.Status]: PROPOSAL_STATUS.REJECTED,
      });
      return NextResponse.json({ success: true, action: 'declined' });
    }

    if (action === 'quote') {
      if (!proposed_price || !delivery_days || !why_fit) {
        return NextResponse.json(
          { error: 'proposed_price, delivery_days, and why_fit are required' },
          { status: 400 },
        );
      }

      const priceNum = Number(proposed_price);
      const daysNum  = Number(delivery_days);

      if (isNaN(priceNum) || priceNum <= 0)
        return NextResponse.json({ error: 'proposed_price must be a positive number' }, { status: 400 });
      if (isNaN(daysNum) || daysNum <= 0 || !Number.isInteger(daysNum))
        return NextResponse.json({ error: 'delivery_days must be a positive integer' }, { status: 400 });
      if (String(why_fit).trim().length < 20)
        return NextResponse.json({ error: 'why_fit must be at least 20 characters' }, { status: 400 });

      await updateRecord(TABLES.PROPOSALS, proposal_id, {
        [PROPOSALS_FIELDS.Status]:           PROPOSAL_STATUS.QUOTE_SUBMITTED,
        [PROPOSALS_FIELDS.Proposed_Price]:   priceNum,
        [PROPOSALS_FIELDS.Delivery_Days]:    daysNum,
        [PROPOSALS_FIELDS.Why_Fit]:          String(why_fit).trim(),
        [PROPOSALS_FIELDS.Risks_Assumptions]: String(risks_assumptions ?? '').trim(),
      });

      return NextResponse.json({ success: true, action: 'quoted' });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });

  } catch (err: any) {
    console.error('[/api/quote] Error:', err);
    return NextResponse.json({ error: 'Internal server error', detail: err.message }, { status: 500 });
  }
}
