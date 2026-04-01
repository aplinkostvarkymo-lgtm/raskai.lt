/**
 * /quote — Provider magic link landing page
 * noindex — must not appear in search results.
 */

import { Metadata } from 'next';
import {
  getRecord,
  TABLES,
  PROPOSALS_FIELDS,
  REQUESTS_FIELDS,
} from '@/lib/airtable';
import QuoteClient from './QuoteClient';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function QuotePage({ searchParams }: PageProps) {
  const proposal_id = typeof searchParams.proposal_id === 'string'
    ? searchParams.proposal_id.trim() : null;
  const rawAction = typeof searchParams.action === 'string'
    ? searchParams.action.trim() : null;

  if (!proposal_id) {
    return <QuoteClient proposalId="" action="quote"
      error="Netinkama nuoroda. Patikrinkite ar nukopijuotas visas laiškas URL." />;
  }
  if (!rawAction || !['quote', 'decline'].includes(rawAction)) {
    return <QuoteClient proposalId={proposal_id} action="quote"
      error="Nežinomas veiksmas. Naudokite nuorodą iš el. laiško." />;
  }

  const action = rawAction as 'quote' | 'decline';

  let proposal;
  try {
    proposal = await getRecord(TABLES.PROPOSALS, proposal_id);
  } catch (err: any) {
    const isNotFound = err.message?.includes('404') || err.message?.includes('NOT_FOUND');
    return <QuoteClient proposalId={proposal_id} action={action}
      error={isNotFound
        ? 'Pasiūlymas nerastas. Galbūt nuoroda nebegalioja.'
        : 'Nepavyko gauti pasiūlymo duomenų. Bandykite vėliau.'} />;
  }

  const statusField = proposal.fields[PROPOSALS_FIELDS.Status];
  const currentStatus: string = typeof statusField === 'object' && statusField !== null
    ? statusField.name ?? ''
    : statusField ?? '';
  const actionable = ['NEW', 'INVITE_SENT'];
  console.log('[quote page] proposal_id:', proposal_id, 'currentStatus:', currentStatus, 'actionable:', actionable.includes(currentStatus));

  // Idempotency: already processed — show status screen, not form
  if (!actionable.includes(currentStatus)) {
    return <QuoteClient proposalId={proposal_id} action={action}
      alreadyProcessed currentStatus={currentStatus} />;
  }

  // Fetch linked REQUEST for context
  const requestLinks: any[] = proposal.fields[PROPOSALS_FIELDS.Request_Link] ?? [];
  const requestRecordId: string | null = requestLinks[0] ?? null;

  let problemSummary: string | undefined;
  let estPriceMin: number | undefined;
  let estPriceMax: number | undefined;
  let deliveryDaysMin: number | undefined;
  let deliveryDaysMax: number | undefined;
  let t1Expertise: string | undefined;

  if (requestRecordId) {
    try {
      const request = await getRecord(TABLES.REQUESTS, requestRecordId);
      const rf = request.fields;
      problemSummary  = rf[REQUESTS_FIELDS.ai_dispatcher_problem_summary] ?? undefined;
      estPriceMin     = rf[REQUESTS_FIELDS.est_price_min]     ?? undefined;
      estPriceMax     = rf[REQUESTS_FIELDS.est_price_max]     ?? undefined;
      deliveryDaysMin = rf[REQUESTS_FIELDS.delivery_days_min] ?? undefined;
      deliveryDaysMax = rf[REQUESTS_FIELDS.delivery_days_max] ?? undefined;
      t1Expertise     = rf[REQUESTS_FIELDS.t1_expertise]      ?? undefined;
    } catch {
      // Non-fatal — form still works without context
    }
  }

  const aiMatchScore: number | undefined =
    proposal.fields[PROPOSALS_FIELDS.AI_Match_Score] ?? undefined;

  return (
    <QuoteClient
      proposalId={proposal_id}
      action={action}
      problemSummary={problemSummary}
      estPriceMin={estPriceMin}
      estPriceMax={estPriceMax}
      deliveryDaysMin={deliveryDaysMin}
      deliveryDaysMax={deliveryDaysMax}
      t1Expertise={t1Expertise}
      aiMatchScore={aiMatchScore}
    />
  );
}
