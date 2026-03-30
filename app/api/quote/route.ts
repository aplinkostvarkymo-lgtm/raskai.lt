import { NextRequest, NextResponse } from "next/server";
import { updateProposal } from "@/lib/airtable";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Neteisingas užklausos formatas" }, { status: 400 });
  }

  const { proposal_id, action, proposed_price, delivery_days, why_fit } =
    body as Record<string, unknown>;

  if (!proposal_id || typeof proposal_id !== "string") {
    return NextResponse.json({ error: "Trūksta proposal_id" }, { status: 400 });
  }
  if (!action || (action !== "quote" && action !== "decline")) {
    return NextResponse.json({ error: "Neteisingas veiksmas" }, { status: 400 });
  }

  try {
    if (action === "quote") {
      if (!proposed_price || !delivery_days || !why_fit) {
        return NextResponse.json(
          { error: "Visi laukai yra privalomi" },
          { status: 400 }
        );
      }
      const price = Number(proposed_price);
      const days = Number(delivery_days);
      if (isNaN(price) || price <= 0) {
        return NextResponse.json(
          { error: "Kaina turi būti teigiamas skaičius" },
          { status: 400 }
        );
      }
      if (isNaN(days) || days <= 0) {
        return NextResponse.json(
          { error: "Dienų skaičius turi būti teigiamas" },
          { status: 400 }
        );
      }
      await updateProposal(proposal_id, {
        fldIsQCNHUpLZ9wu9: "QUOTE_SUBMITTED", // Status
        fldS6WtyEpoPcfJRA: price,              // Proposed_Price
        fldpYyP1edfrKrJqd: days,               // Delivery_Days
        fldpb1jRdZcZULD1R: String(why_fit),    // Why_Fit
      });
    } else {
      // action === 'decline'
      await updateProposal(proposal_id, {
        fldIsQCNHUpLZ9wu9: "REJECTED",
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Serverio klaida";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
