'use client';
import { useState } from 'react';

export default function Home() {
  // Provider signup state (unchanged)
  const [formData, setFormData] = useState({ name: '', email: '', company: '', expertise: '' });
  const [providerSuccess, setProviderSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/provider-signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    if (res.ok) setProviderSuccess(true);
  }

  // Intake flow state
  const [intakeStep, setIntakeStep] = useState<'idle' | 'email' | 'success'>('idle');
  const [problem, setProblem] = useState('');
  const [intakeEmail, setIntakeEmail] = useState('');
  const [intakeLoading, setIntakeLoading] = useState(false);
  const [intakeError, setIntakeError] = useState('');

  async function handleIntakeSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (problem.trim().length < 20) {
      setIntakeError('Aprašyk problemą detaliau — bent 20 simbolių.');
      return;
    }
    setIntakeStep('email');
    setIntakeError('');
  }

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIntakeLoading(true);
    setIntakeError('');
    try {
      const res = await fetch('/api/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problem, email: intakeEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Klaida');
      setIntakeStep('success');
    } catch (err: unknown) {
      setIntakeError(err instanceof Error ? err.message : 'Nepavyko. Bandyk dar kartą.');
    } finally {
      setIntakeLoading(false);
    }
  }

  return (
    <main className="bg-[#090909] text-white min-h-screen font-sans antialiased">

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#090909]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="font-mono text-[#22c55e] font-bold tracking-tight text-lg">
            RASK<span className="text-white">AI</span>
          </span>
          <a
            href="#provider"
            className="text-sm border border-[#22c55e]/40 text-[#22c55e] hover:bg-[#22c55e] hover:text-black transition-all duration-200 px-4 py-1.5 font-mono"
          >
            Tapk tiekėju →
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section className="min-h-screen flex flex-col justify-center px-6 pt-24 pb-16">
        <div className="max-w-2xl mx-auto w-full">
          <span className="inline-block text-xs font-semibold tracking-widest text-green-400 uppercase mb-6">
            Beta · Lietuva
          </span>
          <h1 className="text-5xl md:text-6xl font-black text-white leading-tight mb-6">
            Aprašyk problemą.<br />
            <span className="text-green-400">AI suranda sprendimą.</span>
          </h1>
          <p className="text-gray-400 text-lg mb-10 max-w-xl">
            RaskAI jungia verslo problemas su verified AI tiekėjais. Be skelbimų. Be laiko švaistytmo.
          </p>

          {/* INTAKE FLOW */}
          {intakeStep === 'idle' && (
            <form onSubmit={handleIntakeSubmit} className="flex flex-col gap-4">
              <textarea
                value={problem}
                onChange={e => setProblem(e.target.value)}
                placeholder="Pvz.: Turiu e-parduotuvę, noriu automatiškai generuoti produktų aprašymus ir kelti į socialinių tinklų platformas..."
                rows={5}
                className="w-full bg-gray-900 border border-gray-700 rounded-xl p-4 text-white placeholder-gray-500 resize-none focus:outline-none focus:border-green-400 text-base"
              />
              {intakeError && <p className="text-red-400 text-sm">{intakeError}</p>}
              <button
                type="submit"
                className="self-start bg-green-400 text-black font-bold px-8 py-4 rounded-xl hover:bg-green-300 transition-colors text-base"
              >
                Rasti sprendimą →
              </button>
            </form>
          )}

          {intakeStep === 'email' && (
            <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4 max-w-md">
              <p className="text-gray-300 text-sm">
                Puiku. Įvesk el. paštą — atsiųsime analizės rezultatą ir surastus tiekėjus.
              </p>
              <input
                type="email"
                required
                value={intakeEmail}
                onChange={e => setIntakeEmail(e.target.value)}
                placeholder="tavo@email.lt"
                className="w-full bg-gray-900 border border-gray-700 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-green-400 text-base"
              />
              {intakeError && <p className="text-red-400 text-sm">{intakeError}</p>}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIntakeStep('idle')}
                  className="px-6 py-3 rounded-xl border border-gray-700 text-gray-400 hover:text-white transition-colors text-sm"
                >
                  ← Atgal
                </button>
                <button
                  type="submit"
                  disabled={intakeLoading}
                  className="bg-green-400 text-black font-bold px-8 py-3 rounded-xl hover:bg-green-300 transition-colors text-base disabled:opacity-50"
                >
                  {intakeLoading ? 'Siunčiama...' : 'Pateikti užklausą'}
                </button>
              </div>
            </form>
          )}

          {intakeStep === 'success' && (
            <div className="bg-gray-900 border border-green-400/30 rounded-2xl p-8 max-w-md">
              <div className="text-green-400 text-3xl mb-4">✓</div>
              <h2 className="text-white font-bold text-xl mb-2">Užklausa gauta</h2>
              <p className="text-gray-400 text-sm">
                AI dispatcher jau analizuoja tavo problemą. Per 24h gausite el. laišką su analizės rezultatais ir surastais tiekėjais.
              </p>
            </div>
          )}

          {/* Provider CTA */}
          {intakeStep !== 'success' && (
            <p className="mt-8 text-gray-600 text-sm">
              Esi AI tiekėjas?{' '}
              <a href="#provider" className="text-gray-400 hover:text-white underline transition-colors">
                Registruokis čia →
              </a>
            </p>
          )}
        </div>
      </section>

      {/* PROBLEMA */}
      <section className="px-6 py-24 max-w-6xl mx-auto">
        <p className="font-mono text-xs text-white/30 tracking-widest uppercase mb-4">Situacija rinkoje</p>
        <h2 className="text-3xl md:text-4xl font-black mb-16 max-w-2xl leading-tight">
          Norisi AI sprendimo,
          <br />
          bet nežinai nuo ko pradėti.
        </h2>

        <div className="grid md:grid-cols-3 gap-px bg-white/5">
          {[
            {
              num: '01',
              title: 'Nežinai kur ieškoti',
              body: 'LinkedIn pilnas žmonių kurie "daro AI". Upwork — pilnas siūlymų kurie nieko nesako. Nėra vietos kur gauti patikrintus specialistus.',
            },
            {
              num: '02',
              title: 'Gaišti laiką',
              body: "Brief'ų rašymas, pokalbiai, pasiūlymų laukimas — tai gali užimti savaites. Ir vis tiek lieka klausimas: ar šis žmogus tinkamas?",
            },
            {
              num: '03',
              title: 'Kaina nežinoma',
              body: 'Niekas nepasakys kainos kol neišsiunčia pasiūlymo. O pasiūlymai — skiriasi 5 kartus be aiškios priežasties.',
            },
          ].map((item) => (
            <div key={item.num} className="bg-[#0f0f0f] p-8 md:p-10">
              <span className="font-mono text-xs text-white/20 mb-6 block">{item.num}</span>
              <h3 className="font-bold text-lg mb-3">{item.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* KAIP VEIKIA */}
      <section className="px-6 py-24 bg-[#0d0d0d]">
        <div className="max-w-6xl mx-auto">
          <p className="font-mono text-xs text-white/30 tracking-widest uppercase mb-4">Procesas</p>
          <h2 className="text-3xl md:text-4xl font-black mb-16">Kaip veikia RaskAI</h2>

          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* connector line */}
            <div className="hidden md:block absolute top-8 left-[33%] right-[33%] h-px bg-gradient-to-r from-[#22c55e]/20 via-[#22c55e]/40 to-[#22c55e]/20" />

            {[
              {
                step: '1',
                title: 'Aprašai problemą',
                body: 'Natūralia kalba — kaip draugui. AI Dispatcher supranta ką reikia padaryti, įvertina sudėtingumą ir kainą.',
                tag: 'AI klasifikacija',
              },
              {
                step: '2',
                title: 'AI suranda tiekėjus',
                body: 'Sistema suranda verified tiekėjus pagal tavo užklausą. Gauna pasiūlymus per 48 val. Tik tinkami specialistai.',
                tag: 'Automatinis match',
              },
              {
                step: '3',
                title: "Gauni shortlist'ą",
                body: 'Pamatysi 3 geriausius pasiūlymus su kainomis, terminais ir paaiškinimu kodėl kiekvienas tinka. Pasirenki. Moki.',
                tag: 'Palyginimas',
              },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="w-16 h-16 border border-[#22c55e]/30 flex items-center justify-center mb-6">
                  <span className="font-mono text-2xl font-black text-[#22c55e]">{item.step}</span>
                </div>
                <div className="inline-block border border-white/10 px-2 py-0.5 mb-4">
                  <span className="font-mono text-[10px] text-white/30 tracking-widest uppercase">{item.tag}</span>
                </div>
                <h3 className="font-bold text-lg mb-3">{item.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROVIDER SEKCIJA */}
      <section id="provider" className="px-6 py-24 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          <div>
            <p className="font-mono text-xs text-[#22c55e]/60 tracking-widest uppercase mb-4">AI tiekėjams</p>
            <h2 className="text-3xl md:text-4xl font-black mb-6 leading-tight">
              Tu darai AI.
              <br />
              Mes atvedame klientus.
            </h2>
            <p className="text-white/50 mb-10 leading-relaxed">
              Dauguma gerų AI specialistų praleidžia 30–40% laiko ieškodami klientų.
              RaskAI pašalina šį kaštą — tu gauni tik jau suinteresuotus lead'us.
            </p>

            <div className="space-y-4">
              {[
                'Moki 15% tik nuo sėkmingo sandorio — ne už lead\'us',
                'Gauni struktūrizuotą brief\'ą su biudžetu ir terminais',
                'Verified statusas — klientai mato tave kaip patikrintą specialistą',
                'Nereikia pitch\'inti — tik pateiki kainą ir pagrindimą',
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <span className="text-[#22c55e] mt-0.5 text-lg leading-none">✓</span>
                  <span className="text-white/60 text-sm leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* FORMA */}
          <div className="border border-white/8 bg-[#0f0f0f] p-8">
            {providerSuccess ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 border border-[#22c55e] flex items-center justify-center mx-auto mb-4">
                  <span className="text-[#22c55e] text-xl">✓</span>
                </div>
                <h3 className="font-bold text-lg mb-2">Registracija gauta</h3>
                <p className="text-white/40 text-sm">
                  Susisieksime per 24–48 val. ir aptarsime verified tiekėjo onboardingą.
                </p>
              </div>
            ) : (
              <>
                <h3 className="font-bold text-lg mb-1">Tapk verified tiekėju</h3>
                <p className="text-white/30 text-sm mb-6">Pirmieji 10 tiekėjų — nemokamas Verified-2 statusas</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="font-mono text-xs text-white/30 tracking-widest uppercase block mb-1.5">Vardas</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                      className="w-full bg-[#090909] border border-white/10 px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#22c55e]/50 transition-colors"
                      placeholder="Jonas Jonaitis"
                    />
                  </div>

                  <div>
                    <label className="font-mono text-xs text-white/30 tracking-widest uppercase block mb-1.5">El. paštas</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                      className="w-full bg-[#090909] border border-white/10 px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#22c55e]/50 transition-colors"
                      placeholder="jonas@kompanija.lt"
                    />
                  </div>

                  <div>
                    <label className="font-mono text-xs text-white/30 tracking-widest uppercase block mb-1.5">Kompanija / freelance</label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={e => setFormData(p => ({ ...p, company: e.target.value }))}
                      className="w-full bg-[#090909] border border-white/10 px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#22c55e]/50 transition-colors"
                      placeholder="UAB Kompanija arba freelance"
                    />
                  </div>

                  <div>
                    <label className="font-mono text-xs text-white/30 tracking-widest uppercase block mb-1.5">Ekspertizė</label>
                    <select
                      required
                      value={formData.expertise}
                      onChange={e => setFormData(p => ({ ...p, expertise: e.target.value }))}
                      className="w-full bg-[#090909] border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#22c55e]/50 transition-colors"
                    >
                      <option value="" disabled>Pasirink sritį...</option>
                      <option value="BUSINESS_AUTO">Verslo automatizacija</option>
                      <option value="CUSTOMER_SUPPORT_AI">AI klientų aptarnavimas</option>
                      <option value="ECOMMERCE_AI">E-commerce AI</option>
                      <option value="CONTENT_PROD">Turinio generavimas</option>
                      <option value="SALES_AI">Pardavimų AI</option>
                      <option value="DATA_ANALYTICS">Duomenų analitika</option>
                      <option value="WEB_APPS">Web aplikacijos</option>
                      <option value="CUSTOM_DEV">Custom AI kūrimas</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#22c55e] text-black font-bold py-4 text-sm hover:bg-[#16a34a] transition-colors duration-200"
                  >
                    Registruotis kaip tiekėjas →
                  </button>

                  {false && (
                    <p className="text-red-400 text-xs text-center">Klaida. Bandyk dar kartą arba rašyk info@raskai.lt</p>
                  )}
                </form>
              </>
            )}
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="px-6 py-16 bg-[#0d0d0d]">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-px bg-white/5">
            {[
              { num: 'Beta', label: 'Platforma šiuo metu testuojama su pirmaisiais tiekėjais' },
              { num: '15%', label: 'Komisinis tik nuo sėkmingo sandorio. Jokių kitų mokesčių.' },
              { num: '48h', label: 'Tiekėjai pateikia pasiūlymus per 48 val. po užklausos' },
            ].map((item) => (
              <div key={item.label} className="bg-[#0f0f0f] px-8 py-10">
                <div className="font-mono text-3xl font-black text-[#22c55e] mb-2">{item.num}</div>
                <p className="text-white/30 text-sm leading-relaxed">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="px-6 py-12 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-mono text-[#22c55e] font-bold">
            RASK<span className="text-white">AI</span>
            <span className="text-white/20 font-normal">.lt</span>
          </span>
          <span className="text-white/20 text-sm">info@raskai.lt</span>
          <span className="text-white/10 text-xs font-mono">© 2026 RaskAI · Vilnius, Lithuania</span>
        </div>
      </footer>

    </main>
  );
}
