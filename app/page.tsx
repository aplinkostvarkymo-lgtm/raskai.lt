'use client';
import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import ParticlesBg from '@/components/ui/particles-bg';
import TypewriterTextarea from '@/components/ui/typewriter-textarea';
import { tier1Options, getTier2ForTier1 } from '@/lib/tiers';
import QueryExamplesModal from '@/components/ui/query-examples-modal';

export default function Home() {
 const [formData, setFormData] = useState({ name: '', email: '', company: '', tier1: '', tier2Skills: [] as string[] });
 const [showExamples, setShowExamples] = useState(false);
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
 <>
 <main className="bg-[#09090B] text-[#F1F0EE] min-h-screen antialiased">

 {/* NAV */}
 <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#1C1C23] bg-[#09090B]/90 backdrop-blur-md">
 <div className="max-w-6xl mx-auto px-6 h-[60px] flex items-center justify-between">
 <div className="flex items-center gap-3">
 <span className="font-bold tracking-tight text-lg text-[#F1F0EE]">
 <span className="text-[#F97316]">■</span> RaskAI
 </span>
 <span className="hidden sm:inline text-[#55555F] text-xs">· Powered by Robertas + Claude</span>
 </div>
 <div className="flex items-center">
 <button
 type="button"
 onClick={() => document.getElementById('provider')?.scrollIntoView({ behavior: 'smooth' })}
 className="text-sm text-zinc-400 hover:text-zinc-200 hover:underline transition-colors duration-200 mr-4 no-underline"
 >
 Esu AI kūrėjas
 </button>
 <a
 href="#provider"
 className="text-sm font-medium border border-[#F9731640] text-[#F97316] hover:bg-[#F97316] hover:text-[#09090B] transition-all duration-200 px-4 py-1.5 rounded-[10px]"
 >
 Tapk tiekėju →
 </a>
 </div>
 </div>
 </nav>

 {/* HERO */}
 <section className="relative min-h-screen flex flex-col justify-center px-6 pt-24 pb-16 overflow-hidden">
 <ParticlesBg />
 <div className="relative z-10 max-w-4xl mx-auto w-full">
 <span className="inline-block text-xs font-medium tracking-widest text-[#F97316] uppercase mb-6 border border-[#F9731640] bg-[#F973161A] px-3 py-1 rounded-[6px]">
 Beta · Lietuva
 </span>
 <h1 className="font-extrabold text-5xl md:text-6xl text-[#F1F0EE] leading-[1.05] tracking-tight mb-6">
 Aprašyk problemą.<br />
 <span className="text-[#F97316]">AI suranda sprendimą.</span>
 </h1>
 <p className="text-zinc-200 text-lg mb-10 max-w-2xl leading-relaxed">
 RaskAI sujungia verslo problemas su atrinktais AI Kūrėjais. Be laiko švaistymo. Jūsų problema + atrinkti AI kūrėjai = sprendimas būtent jums.
 </p>

 {/* 3-STEP PROGRESS INDICATOR */}
 <div className="flex items-center max-w-2xl mb-4">
 {[
 { desktop: '1 · Aprašai problemą', mobile: '1 · Aprašai', active: true },
 { desktop: '2 · Gauni AI analizę', mobile: '2 · AI analizė', active: false },
 { desktop: '3 · Pasirenki ką daryti toliau', mobile: '3 · Pasirenki', active: false },
 ].map((s, i) => (
 <div key={i} className="flex items-center flex-1 min-w-0">
 <div className="flex items-center gap-2 min-w-0">
 <div className={`w-5 h-5 rounded-full flex-shrink-0 ${s.active ? 'bg-[#F97316]' : 'bg-[#27272F]'}`} />
 <span className={`text-xs font-medium whitespace-nowrap ${s.active ? 'text-[#F1F0EE]' : 'text-zinc-500'}`}>
 <span className="hidden md:inline">{s.desktop}</span>
 <span className="md:hidden">{s.mobile}</span>
 </span>
 </div>
 {i < 2 && <div className="flex-1 mx-2 h-px bg-[#27272F] min-w-[8px]" />}
 </div>
 ))}
 </div>

 {intakeStep === 'idle' && (
 <form onSubmit={handleIntakeSubmit} className="flex flex-col gap-4 max-w-2xl">
 <TypewriterTextarea
 value={problem}
 onChange={setProblem}
 onShowExamples={() => setShowExamples(true)}
 />
 {intakeError && <p className="text-[#EF4444] text-sm">{intakeError}</p>}
 <button
 type="submit"
 className="self-start bg-[#F97316] text-[#09090B] font-medium px-8 py-3 h-10 rounded-[10px] hover:bg-[#EA6A08] transition-all duration-200 text-sm tracking-[0.01em] hover:scale-[1.01]"
 style={{ transition: 'background 200ms, transform 200ms cubic-bezier(0.34,1.56,0.64,1), box-shadow 200ms' }}
 onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 0 16px #F9731630')}
 onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
 >
 Rasti sprendimą →
 </button>
 <div className="mt-3 flex flex-col gap-1">
 <p className="text-[13px] text-zinc-300">Užklausa ir AI analizė — nemokama. Tiekėjams perduodamos tik patvirtintos užklausos.</p>
 <p className="text-[12px] text-zinc-500">Jei norite tik pasitikrinti kryptį ar kainos rėžį — galite tai padaryti be įsipareigojimo.</p>
 </div>
 </form>
 )}

 {intakeStep === 'email' && (
 <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4 max-w-md">
 <p className="text-zinc-200 text-sm">
 Puiku. Įvesk el. paštą — atsiųsime analizės rezultatą ir surastus tiekėjus.
 </p>
 <input
 type="email"
 required
 value={intakeEmail}
 onChange={e => setIntakeEmail(e.target.value)}
 placeholder="tavo@email.lt"
 className="w-full bg-[#09090B] border border-[#27272F] rounded-[10px] p-4 text-[#F1F0EE] placeholder-[#55555F] focus:outline-none focus:border-[#F9731640] focus:ring-2 focus:ring-[#F973161A] text-base transition-colors duration-120"
 />
 {intakeError && <p className="text-[#EF4444] text-sm">{intakeError}</p>}
 <div className="flex gap-3">
 <button
 type="button"
 onClick={() => setIntakeStep('idle')}
 className="px-6 py-2 h-10 rounded-[10px] border border-[#27272F] bg-[#18181F] text-zinc-200 hover:bg-[#222229] hover:text-[#F1F0EE] transition-all duration-120 text-sm"
 >
 ← Atgal
 </button>
 <button
 type="submit"
 disabled={intakeLoading}
 className="bg-[#F97316] text-[#09090B] font-medium px-8 py-2 h-10 rounded-[10px] hover:bg-[#EA6A08] transition-all duration-200 text-sm disabled:opacity-50 hover:scale-[1.01]"
 style={{ transition: 'background 200ms, transform 200ms cubic-bezier(0.34,1.56,0.64,1)' }}
 >
 {intakeLoading ? 'Siunčiama...' : 'Pateikti užklausą'}
 </button>
 </div>
 </form>
 )}

 {intakeStep === 'success' && (
 <div className="bg-[#111116] border border-[#27272F] rounded-2xl p-8 max-w-md">
 <div className="text-[#F97316] text-3xl mb-4">✓</div>
 <h2 className="text-[#F1F0EE] font-bold text-xl mb-2">Užklausa gauta</h2>
 <p className="text-zinc-200 text-sm leading-relaxed">
 AI dispatcher jau analizuoja tavo problemą. Per 24h gausite el. laišką su analizės rezultatais ir surastais tiekėjais.
 </p>
 </div>
 )}

 {intakeStep !== 'success' && (
 <p className="mt-8 text-[#55555F] text-sm">
 Esi AI tiekėjas?{' '}
 <a href="#provider"className="text-zinc-200 hover:text-[#F1F0EE] underline transition-colors duration-120">
 Registruokis čia →
 </a>
 </p>
 )}
 </div>
 </section>

 {/* PROBLEMA */}
 <section className="px-6 py-24 max-w-6xl mx-auto">
 <p className="text-xs text-white/30 tracking-widest uppercase mb-4">Situacija rinkoje</p>
 <h2 className="font-extrabold text-3xl md:text-4xl mb-16 max-w-2xl leading-tight">
 Norisi AI sprendimo,<br />bet nežinai nuo ko pradėti.
 </h2>
 <div className="grid md:grid-cols-3 gap-px bg-white/5">
 {[
 {
 num: '01',
 title: 'Nežinai kur ieškoti',
 body: 'LinkedIn pilnas žmonių kurie"daro AI". Upwork — pilnas siūlymų kurie nieko nesako. Nėra vietos kur gauti patikrintus specialistus.',
 },
 {
 num: '02',
 title: 'Gaišti laiką',
 body:"Brief'ų rašymas, pokalbiai, pasiūlymų laukimas — tai gali užimti savaites. Ir vis tiek lieka klausimas: ar šis žmogus tinkamas?",
 },
 {
 num: '03',
 title: 'Kaina nežinoma',
 body: 'Niekas nepasakys kainos kol neišsiunčia pasiūlymo. O pasiūlymai — skiriasi 5 kartus be aiškios priežasties.',
 },
 ].map((item) => (
 <div key={item.num} className="bg-[#111116] p-8 md:p-10">
 <span className="text-xs text-[#55555F] mb-6 block">{item.num}</span>
 <h3 className="font-bold text-lg mb-3">{item.title}</h3>
 <p className="text-zinc-200 text-sm leading-relaxed">{item.body}</p>
 </div>
 ))}
 </div>
 </section>

 {/* KAIP VEIKIA */}
 <section className="px-6 py-24 bg-[#0d0d0d]">
 <div className="max-w-6xl mx-auto">
 <p className="text-xs text-white/30 tracking-widest uppercase mb-4">Procesas</p>
 <h2 className="font-extrabold text-3xl md:text-4xl mb-16">Kaip veikia RaskAI</h2>

 <div className="flex flex-col md:flex-row md:items-start gap-0">
 {[
 {
 step: '1',
 tag: 'AI KLASIFIKACIJA',
 title: 'Aprašai problemą',
 body: 'Natūralia kalba — kaip draugui, pasakai kokio AI sprendimo ieškai. RaskAI architektas supranta ką reikia padaryti, įvertina sudėtingumą ir kainą.',
 },
 {
 step: '2',
 tag: 'AUTOMATINIS MATCH',
 title: 'AI suranda tiekėjus',
 body: 'Sistema suranda atrinktus tiekėjus pagal tavo užklausą. Surenka pasiūlymus per 48 val. Tik tinkami specialistai. Informacija pateikiama tik Jums.',
 },
 {
 step: '3',
 tag: 'PALYGINIMAS',
 title:"Gauni shortlist'ą",
 body: 'Pamatysi 3 pasiūlymus su kainomis, terminais ir paaiškinimu kodėl kiekvienas tinka.',
 },
 {
 step: '4',
 tag: 'SPRENDIMAS',
 title: 'Pasirenki tinkamą tiekėją',
 body: 'Peržiūrite pasiūlymus ir pasirenkate kas jums labiausiai tinka. Jokių paslėptų sąlygų — tik sprendimai.',
 },
 {
 step: '5',
 tag: 'REZULTATAS',
 title: 'Gaunate veikiančią AI sistemą',
 body: 'Sumokėjęs gaunate būtent Jums suprojektuotą ir veikiančią AI sistemą. Ne konceptą — realų, veikiantį sprendimą.',
 },
 ].map((item, index, arr) => (
 <div key={item.step} className="flex flex-col md:flex-row md:items-start flex-1 min-w-0">
 <div className="flex-1 min-w-0 mb-8 md:mb-0">
 <div className="w-14 h-14 border border-[#F9731640] flex items-center justify-center mb-6">
 <span className="text-xl font-black text-[#F97316]">{item.step}</span>
 </div>
 <div className="inline-block border border-[#F9731620] bg-[#F973160D] px-2 py-0.5 mb-4 rounded-[4px]">
 <span className="text-[10px] text-[#F97316]/50 tracking-widest uppercase">{item.tag}</span>
 </div>
 <h3 className="font-bold text-base mb-3">{item.title}</h3>
 <p className="text-zinc-200 text-sm leading-relaxed">{item.body}</p>
 </div>
 {index < arr.length - 1 && (
 <div className="hidden md:flex items-start justify-center pt-6 px-2 flex-shrink-0">
 <ChevronRight size={24} className="text-[#F97316]/60 animate-pulse" />
 </div>
 )}
 </div>
 ))}
 </div>
 </div>
 </section>

 {/* AI KŪRĖJAMS SEKCIJA */}
 <section className="px-6 py-24 bg-[#0d0d0d]">
 <div className="max-w-6xl mx-auto">
 <p className="text-xs text-white/30 tracking-widest uppercase mb-4">AI KŪRĖJAMS</p>
 <h2 className="font-extrabold text-3xl md:text-4xl mb-4 max-w-2xl leading-tight">
 Kodėl man verta prisijungti prie RaskAI
 </h2>
 <p className="text-zinc-400 text-base mb-14 max-w-2xl leading-relaxed">
 RaskAI skirtas AI kūrėjams, kurie nori mažiau pitch&apos;inti, mažiau deginti laiką ant tuščių užklausų ir daugiau dirbti su realiu poreikiu.
 </p>

 <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
 {[
 {
 title: 'Mažiau tuščio triukšmo',
 text: 'RaskAI filtruoja smalsumą nuo realios intencijos. Tik patvirtintos A tipo užklausos pereina į realų tiekėjų etapą.',
 },
 {
 title: "Aiškesnis brief'as",
 text: 'Jūs gaunate ne chaotišką „reikia AI", o AI susistemintą problemos kryptį, kainos rėžį ir aiškesnį poreikį.',
 },
 {
 title: 'Vertinamas fit, ne tik kaina',
 text: 'RaskAI logika orientuota į atitikimą ir tikėtiną rezultatą, o ne į lenktynes kas pasiūlys mažiausią kainą.',
 },
 {
 title: 'Verified statusas kuria pranašumą',
 text: 'Patikimi AI kūrėjai tampa matomesni sistemoje, o jų reputacija remiasi ne marketingu, o elgsena ir rezultatais.',
 },
 ].map((card) => (
 <div key={card.title} className="bg-[#111116] border border-[#1C1C23] rounded-[12px] p-6 flex flex-col gap-3">
 <div className="w-1 h-5 bg-[#F97316] rounded-full" />
 <h3 className="font-semibold text-[#F1F0EE] text-sm leading-snug">{card.title}</h3>
 <p className="text-zinc-400 text-sm leading-relaxed">{card.text}</p>
 </div>
 ))}
 </div>

 <div id="provider" className="flex flex-col md:flex-row gap-12 items-start mt-16">
 {/* LEFT: how it works + CTA */}
 <div className="w-full md:w-[420px] flex-shrink-0">
 <p className="text-xs text-white/30 tracking-widest uppercase mb-4">Kaip tai veikia kūrėjui?</p>
 <ul className="flex flex-col gap-4 mb-5">
 {[
 'Prisijungiate kaip AI kūrėjas',
 'RaskAI atrenka tik jums tinkamas užklausas',
 'Gavę kvietimą sprendžiate, ar norite dalyvauti',
 ].map((item, i) => (
 <li key={i} className="flex items-start gap-3 text-sm text-zinc-300">
 <span className="mt-0.5 w-5 h-5 rounded-full border border-[#F97316]/40 flex items-center justify-center flex-shrink-0 text-[10px] text-[#F97316]">{i + 1}</span>
 {item}
 </li>
 ))}
 </ul>
 <p className="text-xs text-zinc-500 mb-8">Tikslas — mažiau beverčių lead&apos;ų, daugiau tikslingų galimybių.</p>
 <div className="flex flex-col sm:flex-row gap-3 items-start">
 <a
 href="#provider"
 className="text-sm font-semibold bg-[#F97316] hover:bg-[#EA6A08] text-[#09090B] px-6 py-2.5 rounded-[10px] transition-colors duration-200"
 >
 Tapti AI kūrėju RaskAI
 </a>
 <button
 type="button"
 onClick={() => document.getElementById('provider')?.scrollIntoView({ behavior: 'smooth' })}
 className="text-sm text-zinc-400 hover:text-zinc-200 hover:underline transition-colors duration-200 py-2.5"
 >
 Kaip veikia tiekėjų atranka?
 </button>
 </div>
 </div>

 {/* FORMA */}
 <div className="border border-[#F97316]/30 bg-zinc-900/80 rounded-[16px] p-8 shadow-[0_0_40px_rgba(249,115,22,0.15)]">
 {providerSuccess ? (
 <div className="text-center py-8">
 <div className="w-12 h-12 border border-[#F97316] flex items-center justify-center mx-auto mb-4 rounded-[10px]">
 <span className="text-[#F97316] text-xl">✓</span>
 </div>
 <h3 className="font-bold text-lg mb-2">Registracija gauta</h3>
 <p className="text-zinc-200 text-sm">
 Susisieksime per 24–48 val. ir aptarsime verified tiekėjo onboardingą.
 </p>
 </div>
 ) : (
 <>
 <h3 className="font-bold text-lg mb-1">Tapk verified tiekėju</h3>
 <p className="text-zinc-400 text-sm mb-6">Pirmieji 10 tiekėjų — nemokamas Verified-2 statusas</p>

 <form onSubmit={handleSubmit} className="space-y-4">
 <div>
 <label className="text-xs text-zinc-300 tracking-widest uppercase block mb-1.5">Vardas</label>
 <input
 type="text"
 required
 value={formData.name}
 onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
 className="w-full bg-[#09090B] border border-orange-500/40 rounded-[10px] px-4 py-3 text-sm text-[#F1F0EE] placeholder-[#55555F] focus:outline-none focus:border-[#F9731640] focus:ring-2 focus:ring-[#F973161A] transition-colors"
 placeholder="Jonas Jonaitis"
 />
 </div>

 <div>
 <label className="text-xs text-zinc-300 tracking-widest uppercase block mb-1.5">El. paštas</label>
 <input
 type="email"
 required
 value={formData.email}
 onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
 className="w-full bg-[#09090B] border border-orange-500/40 rounded-[10px] px-4 py-3 text-sm text-[#F1F0EE] placeholder-[#55555F] focus:outline-none focus:border-[#F9731640] focus:ring-2 focus:ring-[#F973161A] transition-colors"
 placeholder="jonas@kompanija.lt"
 />
 </div>

 <div>
 <label className="text-xs text-zinc-300 tracking-widest uppercase block mb-1.5">Kompanija / freelance</label>
 <input
 type="text"
 value={formData.company}
 onChange={e => setFormData(p => ({ ...p, company: e.target.value }))}
 className="w-full bg-[#09090B] border border-orange-500/40 rounded-[10px] px-4 py-3 text-sm text-[#F1F0EE] placeholder-[#55555F] focus:outline-none focus:border-[#F9731640] focus:ring-2 focus:ring-[#F973161A] transition-colors"
 placeholder="UAB Kompanija arba freelance"
 />
 </div>

 <div>
 <label className="text-xs text-zinc-300 tracking-widest uppercase block mb-1.5">Ekspertizės sritis</label>
 <select
 required
 value={formData.tier1}
 onChange={e => setFormData(p => ({ ...p, tier1: e.target.value, tier2Skills: [] }))}
 className="w-full bg-[#09090B] border border-orange-500/40 rounded-[10px] px-4 py-3 text-sm text-[#F1F0EE] focus:outline-none focus:border-[#F9731640] focus:ring-2 focus:ring-[#F973161A] transition-colors"
 >
 <option value="" disabled>Pasirink sritį...</option>
 {tier1Options.map(t1 => (
 <option key={t1.id} value={t1.id}>{t1.label}</option>
 ))}
 </select>
 </div>

 {formData.tier1 && getTier2ForTier1(formData.tier1).length > 0 && (
 <div>
 <label className="text-xs text-zinc-300 tracking-widest uppercase block mb-2">Technologijos / įrankiai</label>
 <div className="grid grid-cols-1 gap-1.5 max-h-48 overflow-y-auto pr-1">
 {getTier2ForTier1(formData.tier1).map(t2 => {
 const checked = formData.tier2Skills.includes(t2.id);
 return (
 <label
 key={t2.id}
 className={`flex items-center gap-3 px-3 py-2.5 rounded-[8px] border cursor-pointer transition-colors ${
 checked
 ? 'border-[#F97316]/50 bg-[#F973160D]'
 : 'border-[#27272F] bg-[#09090B] hover:border-[#F97316]/30'
 }`}
 >
 <input
 type="checkbox"
 checked={checked}
 onChange={() => setFormData(p => ({
 ...p,
 tier2Skills: checked
 ? p.tier2Skills.filter(s => s !== t2.id)
 : [...p.tier2Skills, t2.id],
 }))}
 className="sr-only"
 />
 <span className={`w-4 h-4 flex-shrink-0 rounded-[4px] border flex items-center justify-center transition-colors ${
 checked ? 'border-[#F97316] bg-[#F97316]' : 'border-[#27272F]'
 }`}>
 {checked && (
 <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
 <path d="M1 4L3.5 6.5L9 1" stroke="#09090B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
 </svg>
 )}
 </span>
 <span className="text-sm text-[#F1F0EE]">{t2.label}</span>
 </label>
 );
 })}
 </div>
 </div>
 )}

 <button
 type="submit"
 className="w-full bg-[#F97316] text-[#09090B] font-medium py-3 h-10 rounded-[10px] text-sm hover:bg-[#EA6A08] transition-colors duration-200 hover:scale-[1.01]"
 style={{ transition: 'background 200ms, transform 200ms cubic-bezier(0.34,1.56,0.64,1)' }}
 >
 Registruotis kaip tiekėjas →
 </button>
 </form>
 </>
 )}
 </div>
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
 <div key={item.label} className="bg-[#111116] px-8 py-10">
 <div className="text-3xl font-black text-[#F97316] mb-2">{item.num}</div>
 <p className="text-zinc-200 text-sm leading-relaxed">{item.label}</p>
 </div>
 ))}
 </div>
 </div>
 </section>

 {/* FOOTER */}
 <footer className="px-6 py-12 border-t border-[#1C1C23]">
 <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
 <span className="font-bold text-[#F97316]">
 ■ <span className="text-[#F1F0EE]">RaskAI</span>
 <span className="text-[#55555F] font-normal">.lt</span>
 </span>
 <span className="text-[#55555F] text-sm">info@raskai.lt</span>
 <span className="text-[#27272F] text-xs">© 2026 RaskAI · Vilnius, Lithuania</span>
 </div>
 </footer>

 </main>

 {showExamples && (
 <QueryExamplesModal
 onClose={() => setShowExamples(false)}
 onUse={text => { setProblem(text); setShowExamples(false); }}
 />
 )}
 </>
 );
}
