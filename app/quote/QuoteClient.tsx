'use client';

import { useState } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface ProposalContext {
  proposalId: string;
  action: 'quote' | 'decline';
  reqId?: string;
  problemSummary?: string;
  estPriceMin?: number;
  estPriceMax?: number;
  deliveryDaysMin?: number;
  deliveryDaysMax?: number;
  t1Expertise?: string;
  aiMatchScore?: number;
  alreadyProcessed?: boolean;
  currentStatus?: string;
  error?: string;
}

// ─── Main Client Component ─────────────────────────────────────────────────────
export default function QuoteClient(props: ProposalContext) {
  const {
    proposalId,
    action,
    problemSummary,
    estPriceMin,
    estPriceMax,
    deliveryDaysMin,
    deliveryDaysMax,
    t1Expertise,
    aiMatchScore,
    alreadyProcessed,
    currentStatus,
    error: initError,
  } = props;

  // ── Form state ──────────────────────────────────────────────────────────────
  const [price, setPrice]               = useState('');
  const [days, setDays]                 = useState('');
  const [whyFit, setWhyFit]             = useState('');
  const [risks, setRisks]               = useState('');

  // ── UI state ────────────────────────────────────────────────────────────────
  const [status, setStatus]             = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg]         = useState('');
  const [declineConfirmed, setDeclineConfirmed] = useState(false);

  // ── Early exit states ────────────────────────────────────────────────────────
  if (initError) return <ErrorScreen message={initError} />;

  if (alreadyProcessed) return <AlreadyProcessedScreen status={currentStatus} />;

  // ── Submit handler (quote) ───────────────────────────────────────────────────
  async function submitQuote(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proposal_id: proposalId,
          action: 'quote',
          proposed_price: price,
          delivery_days: days,
          why_fit: whyFit,
          risks_assumptions: risks,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error ?? 'Nepavyko pateikti kainos');
      }

      setStatus('success');
    } catch (err: any) {
      setStatus('error');
      setErrorMsg(err.message ?? 'Serverio klaida. Bandykite dar kartą.');
    }
  }

  // ── Submit handler (decline) ──────────────────────────────────────────────────
  async function submitDecline() {
    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proposal_id: proposalId, action: 'decline' }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error ?? 'Nepavyko atsisakyti');
      }

      setStatus('success');
    } catch (err: any) {
      setStatus('error');
      setErrorMsg(err.message ?? 'Serverio klaida. Bandykite dar kartą.');
    }
  }

  // ── Success screens ──────────────────────────────────────────────────────────
  if (status === 'success' && action === 'quote') {
    return (
      <SuccessScreen
        icon="✓"
        title="Kaina pateikta"
        message="Jūsų pasiūlymas gautas. Jei klientas pasirenka jūsų pasiūlymą, gausite pranešimą."
      />
    );
  }

  if (status === 'success' && action === 'decline') {
    return (
      <SuccessScreen
        icon="—"
        title="Atsisakyta"
        message="Suprantame. Jūsų vieta atsilaisvino kitiems tiekėjams. Ačiū už greitą atsakymą."
      />
    );
  }

  // ── DECLINE flow ─────────────────────────────────────────────────────────────
  if (action === 'decline') {
    return (
      <div className="min-h-screen bg-[#0f0f0f] text-[#e8e8e8] font-mono flex items-center justify-center px-4">
        <div className="w-full max-w-lg">
          <Logo />

          <div className="mt-10 border border-[#2a2a2a] rounded-xl p-8 space-y-6">
            <div className="space-y-1">
              <p className="text-xs text-[#666] uppercase tracking-widest">Atsisakymas</p>
              <h1 className="text-xl font-semibold text-white">Atsisakyti šio pasiūlymo?</h1>
            </div>

            {problemSummary && (
              <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-4">
                <p className="text-xs text-[#666] uppercase tracking-wider mb-2">Užklausa</p>
                <p className="text-sm text-[#ccc] leading-relaxed">{problemSummary}</p>
              </div>
            )}

            <p className="text-sm text-[#888]">
              Atsisakius, jūsų vieta bus perduota kitam tiekėjui. Šis veiksmas yra neatšaukiamas.
            </p>

            {errorMsg && (
              <p className="text-sm text-red-400 bg-red-950/20 border border-red-900/40 rounded-lg px-4 py-3">
                {errorMsg}
              </p>
            )}

            {!declineConfirmed ? (
              <div className="flex gap-3">
                <button
                  onClick={() => setDeclineConfirmed(true)}
                  className="flex-1 py-3 rounded-lg border border-[#3a3a3a] text-[#888] text-sm hover:border-red-800 hover:text-red-400 transition-colors"
                >
                  Atsisakyti
                </button>
                <a
                  href="/"
                  className="flex-1 py-3 rounded-lg bg-[#1e1e1e] text-[#ccc] text-sm text-center hover:bg-[#252525] transition-colors"
                >
                  Atgal
                </a>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-amber-400">Ar tikrai? Šis veiksmas neatšaukiamas.</p>
                <button
                  onClick={submitDecline}
                  disabled={status === 'loading'}
                  className="w-full py-3 rounded-lg bg-red-900/40 border border-red-800 text-red-300 text-sm hover:bg-red-900/60 transition-colors disabled:opacity-50"
                >
                  {status === 'loading' ? 'Siunčiama…' : 'Taip, atsisakau'}
                </button>
              </div>
            )}
          </div>

          <Footer />
        </div>
      </div>
    );
  }

  // ── QUOTE FORM ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0f0f0f] text-[#e8e8e8] font-mono px-4 py-12">
      <div className="w-full max-w-2xl mx-auto space-y-8">
        <Logo />

        {/* Context panel */}
        <div className="border border-[#2a2a2a] rounded-xl overflow-hidden">
          <div className="px-6 py-4 bg-[#141414] border-b border-[#2a2a2a] flex items-center justify-between">
            <p className="text-xs text-[#555] uppercase tracking-widest">Užklausa</p>
            {aiMatchScore !== undefined && (
              <span className="text-xs text-emerald-400 tabular-nums">
                AI match {aiMatchScore}%
              </span>
            )}
          </div>
          <div className="px-6 py-5 space-y-4">
            {problemSummary ? (
              <p className="text-sm text-[#ccc] leading-relaxed">{problemSummary}</p>
            ) : (
              <p className="text-sm text-[#555] italic">Problemos aprašymas nepateiktas</p>
            )}

            {(t1Expertise || estPriceMin || deliveryDaysMin) && (
              <div className="flex flex-wrap gap-3 pt-2 border-t border-[#1f1f1f]">
                {t1Expertise && (
                  <Tag label="Kategorija" value={t1Expertise} />
                )}
                {estPriceMin !== undefined && estPriceMax !== undefined && (
                  <Tag label="Orientacinė kaina" value={`${estPriceMin}–${estPriceMax} EUR`} />
                )}
                {deliveryDaysMin !== undefined && deliveryDaysMax !== undefined && (
                  <Tag label="Terminai" value={`${deliveryDaysMin}–${deliveryDaysMax} d.`} />
                )}
              </div>
            )}
          </div>
        </div>

        {/* Quote form */}
        <form onSubmit={submitQuote} className="border border-[#2a2a2a] rounded-xl overflow-hidden">
          <div className="px-6 py-4 bg-[#141414] border-b border-[#2a2a2a]">
            <p className="text-xs text-[#555] uppercase tracking-widest">Jūsų pasiūlymas</p>
          </div>

          <div className="px-6 py-6 space-y-6">
            {/* Price + Days row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-xs text-[#666] uppercase tracking-wider">
                  Kaina (EUR) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  required
                  placeholder="pvz. 1500"
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-3 text-sm text-white placeholder-[#444] focus:outline-none focus:border-[#444] transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-xs text-[#666] uppercase tracking-wider">
                  Terminas (dienomis) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={days}
                  onChange={e => setDays(e.target.value)}
                  required
                  placeholder="pvz. 14"
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-3 text-sm text-white placeholder-[#444] focus:outline-none focus:border-[#444] transition-colors"
                />
              </div>
            </div>

            {/* Why fit */}
            <div className="space-y-2">
              <label className="block text-xs text-[#666] uppercase tracking-wider">
                Kodėl jūs tinkamas šiai užklausai <span className="text-red-500">*</span>
              </label>
              <textarea
                value={whyFit}
                onChange={e => setWhyFit(e.target.value)}
                required
                minLength={20}
                rows={4}
                placeholder="Aprašykite konkrečiai: ką darysite, kokius rezultatus pasieksite, kodėl ši problema yra jūsų kompetencijoje."
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-3 text-sm text-white placeholder-[#444] focus:outline-none focus:border-[#444] transition-colors resize-none leading-relaxed"
              />
              <p className="text-xs text-[#555]">min. 20 simbolių</p>
            </div>

            {/* Risks */}
            <div className="space-y-2">
              <label className="block text-xs text-[#666] uppercase tracking-wider">
                Rizikos ir prielaidos <span className="text-[#555] font-normal normal-case">(neprivaloma)</span>
              </label>
              <textarea
                value={risks}
                onChange={e => setRisks(e.target.value)}
                rows={3}
                placeholder="Kas galėtų paveikti terminą ar kainą? Kokias prielaidas darote apie kliento infrastruktūrą?"
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-3 text-sm text-white placeholder-[#444] focus:outline-none focus:border-[#444] transition-colors resize-none leading-relaxed"
              />
            </div>

            {/* Error */}
            {status === 'error' && errorMsg && (
              <p className="text-sm text-red-400 bg-red-950/20 border border-red-900/40 rounded-lg px-4 py-3">
                {errorMsg}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full py-4 rounded-lg bg-white text-black text-sm font-semibold hover:bg-[#e8e8e8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? 'Siunčiama…' : 'Pateikti kainą →'}
            </button>
          </div>
        </form>

        <Footer />
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="w-7 h-7 rounded bg-white/10 border border-white/20 flex items-center justify-center">
        <span className="text-white text-xs font-bold">R</span>
      </div>
      <span className="text-sm text-[#888]">RaskAI</span>
    </div>
  );
}

function Tag({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-[10px] text-[#555] uppercase tracking-wider">{label}</span>
      <span className="text-xs text-[#aaa]">{value}</span>
    </div>
  );
}

function Footer() {
  return (
    <p className="text-center text-xs text-[#444] pb-4">
      raskai.lt · Tiekėjų pasiūlymų platforma
    </p>
  );
}

function SuccessScreen({ icon, title, message }: { icon: string; title: string; message: string }) {
  return (
    <div className="min-h-screen bg-[#0f0f0f] text-[#e8e8e8] font-mono flex items-center justify-center px-4">
      <div className="w-full max-w-sm text-center space-y-6">
        <div className="w-14 h-14 rounded-full border border-[#2a2a2a] bg-[#1a1a1a] flex items-center justify-center mx-auto">
          <span className="text-xl text-white">{icon}</span>
        </div>
        <div className="space-y-2">
          <h1 className="text-lg font-semibold text-white">{title}</h1>
          <p className="text-sm text-[#888] leading-relaxed">{message}</p>
        </div>
        <p className="text-xs text-[#444]">raskai.lt</p>
      </div>
    </div>
  );
}

function AlreadyProcessedScreen({ status }: { status?: string }) {
  const label =
    status === 'QUOTE_SUBMITTED' ? 'Kaina jau pateikta' :
    status === 'REJECTED'        ? 'Pasiūlymas atsisakytas' :
    status === 'SELECTED'        ? 'Pasiūlymas priimtas' :
    status === 'EXPIRED'         ? 'Pasiūlymo laikas baigėsi' :
    'Pasiūlymas jau apdorotas';

  return (
    <SuccessScreen
      icon="·"
      title={label}
      message="Šis pasiūlymas jau buvo apdorotas. Jei turite klausimų, susisiekite su mumis."
    />
  );
}

function ErrorScreen({ message }: { message: string }) {
  return (
    <div className="min-h-screen bg-[#0f0f0f] text-[#e8e8e8] font-mono flex items-center justify-center px-4">
      <div className="w-full max-w-sm text-center space-y-4">
        <div className="w-14 h-14 rounded-full border border-red-900/40 bg-red-950/20 flex items-center justify-center mx-auto">
          <span className="text-xl text-red-400">!</span>
        </div>
        <h1 className="text-lg font-semibold text-white">Klaida</h1>
        <p className="text-sm text-[#888]">{message}</p>
        <p className="text-xs text-[#444]">raskai.lt</p>
      </div>
    </div>
  );
}
