const BASE_ID = process.env.AIRTABLE_BASE_ID || "appnGWOBl6D4eTOhh";
const PROPOSALS_TABLE = "tblTUSy2Qwz3xKePS";

function apiHeaders() {
  const key = process.env.AIRTABLE_API_KEY;
  if (!key) throw new Error("AIRTABLE_API_KEY is not configured");
  return {
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
  };
}

export interface ProposalRecord {
  id: string;
  fields: Record<string, unknown>;
}

export async function getProposal(
  proposalId: string
): Promise<ProposalRecord | null> {
  try {
    const res = await fetch(
      `https://api.airtable.com/v0/${BASE_ID}/${PROPOSALS_TABLE}/${proposalId}`,
      {
        headers: apiHeaders(),
        cache: "no-store",
      }
    );
    if (res.status === 404) return null;
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function updateProposal(
  proposalId: string,
  fields: Record<string, unknown>
): Promise<void> {
  const res = await fetch(
    `https://api.airtable.com/v0/${BASE_ID}/${PROPOSALS_TABLE}/${proposalId}`,
    {
      method: "PATCH",
      headers: apiHeaders(),
      body: JSON.stringify({ fields }),
    }
  );
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Airtable ${res.status}: ${body}`);
  }
}
