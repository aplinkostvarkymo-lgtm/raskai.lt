'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';

interface Props {
  onClose: () => void;
}

const STEPS = [
  'Užpildai registracijos formą ir nurodai savo ekspertizę',
  'RaskAI sistema tikrina ar tavo profilis atitinka gaunamas užklausas',
  'Gavęs kvietimą pats sprendžiai ar nori dalyvauti konkrečioje užklausoje',
  'Tik patvirtintos užklausos pasiekia tiekėjus — jokio triukšmo',
];

export default function ProviderInfoModal({ onClose }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-zinc-900 border border-[#27272F] rounded-[16px] w-full max-w-[480px] p-8 relative"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-[8px] text-zinc-300 hover:text-[#F1F0EE] hover:bg-[#1C1C23] transition-colors"
        >
          <X size={16} />
        </button>

        <h2 className="font-bold text-lg text-[#F1F0EE] mb-8 pr-8">Kaip veikia tiekėjų atranka?</h2>

        <ol className="flex flex-col gap-5 mb-8">
          {STEPS.map((step, i) => (
            <li key={i} className="flex items-start gap-4">
              <span className="w-10 h-10 rounded-[8px] border border-[#F97316] flex items-center justify-center flex-shrink-0 text-sm font-bold text-[#F97316]">
                {i + 1}
              </span>
              <span className="text-zinc-300 text-sm leading-relaxed mt-2.5">{step}</span>
            </li>
          ))}
        </ol>

        <p className="text-xs text-zinc-300">Tikslas — mažiau beverčių kontaktų, daugiau tikslingų galimybių.</p>
      </div>
    </div>
  );
}
