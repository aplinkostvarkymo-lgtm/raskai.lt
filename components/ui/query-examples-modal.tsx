'use client';

import { useState, useEffect } from 'react';
import { X, Copy, Check, ArrowRight } from 'lucide-react';
import { queryExamples } from '@/lib/query-examples';

interface Props {
  onClose: () => void;
  onUse: (text: string) => void;
}

export default function QueryExamplesModal({ onClose, onUse }: Props) {
  const [selectedId, setSelectedId] = useState(queryExamples[0].tier1Id);
  const [copied, setCopied] = useState(false);

  const selected = queryExamples.find(e => e.tier1Id === selectedId)!;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  async function handleCopy() {
    await navigator.clipboard.writeText(selected.example);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-4xl max-h-[88vh] flex flex-col bg-[#111116] border border-[#27272F] rounded-[20px] shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#27272F] flex-shrink-0">
          <div>
            <h2 className="font-bold text-base text-[#F1F0EE]">Gerų užklausų pavyzdžiai</h2>
            <p className="text-xs text-zinc-300 mt-0.5">Pasirink kategoriją ir naudok pavyzdį kaip šabloną</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-[8px] text-zinc-300 hover:text-[#F1F0EE] hover:bg-[#1C1C23] transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-1 min-h-0">

          {/* Left: category list */}
          <div className="w-56 flex-shrink-0 border-r border-[#27272F] overflow-y-auto py-3">
            {queryExamples.map(ex => (
              <button
                key={ex.tier1Id}
                onClick={() => { setSelectedId(ex.tier1Id); setCopied(false); }}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between gap-2 ${
                  selectedId === ex.tier1Id
                    ? 'bg-[#F973160D] text-[#F97316] border-r-2 border-[#F97316]'
                    : 'text-[#8A8A98] hover:text-[#F1F0EE] hover:bg-[#1C1C23]'
                }`}
              >
                <span className="leading-snug">{ex.categoryLabel}</span>
                {selectedId === ex.tier1Id && <ArrowRight size={12} className="flex-shrink-0" />}
              </button>
            ))}
          </div>

          {/* Right: example + why good */}
          <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">

            <div>
              <p className="text-[10px] text-[#F97316]/60 tracking-widest uppercase mb-2">Pavyzdys</p>
              <div className="bg-[#09090B] border border-[#27272F] rounded-[12px] p-4 text-sm text-[#C8C7C4] leading-relaxed whitespace-pre-wrap">
                {selected.example}
              </div>
            </div>

            <div>
              <p className="text-[10px] text-[#F97316]/60 tracking-widest uppercase mb-3">Kodėl šis pavyzdys geras?</p>
              <ul className="flex flex-col gap-2">
                {selected.whyGood.map((point, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-[#8A8A98]">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full border border-[#F9731640] bg-[#F973160D] flex items-center justify-center text-[10px] text-[#F97316] font-bold mt-0.5">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#27272F] flex-shrink-0">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 h-9 rounded-[10px] border border-[#27272F] bg-[#18181F] text-sm text-[#8A8A98] hover:text-[#F1F0EE] hover:border-[#3A3A45] transition-colors"
          >
            {copied ? <Check size={14} className="text-[#F97316]" /> : <Copy size={14} />}
            {copied ? 'Nukopijuota' : 'Kopijuoti'}
          </button>
          <button
            onClick={() => { onUse(selected.example); onClose(); }}
            className="flex items-center gap-2 px-5 py-2 h-9 rounded-[10px] bg-[#F97316] text-[#09090B] text-sm font-medium hover:bg-[#EA6A08] transition-colors"
          >
            Naudoti šį pavyzdį →
          </button>
        </div>

      </div>
    </div>
  );
}
