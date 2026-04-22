'use client';

import { useState, useEffect, useRef } from 'react';

const PROMPTS = [
  'Turiu internetinę parduotuvę, noriu automatizuoti klientų aptarnavimą su AI...',
  'Reikia AI sistemos kuri apdorotų gaunamą korespondenciją ir atsakytų automatiškai...',
  "Noriu sukurti pardavimų AI agentą kuris kvalifikuotų lead'us prieš perduodant vadybininkui...",
  'Mūsų komanda praleidžia 3h/dieną rašydama ataskaitas — noriu tai automatizuoti...',
];

interface Props {
  value: string;
  onChange: (v: string) => void;
  onShowExamples: () => void;
}

export default function TypewriterTextarea({ value, onChange, onShowExamples }: Props) {
  const [typedText, setTypedText] = useState('');
  const [isFading, setIsFading] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let promptIdx = 0;
    let charIdx = 0;

    function tick() {
      const prompt = PROMPTS[promptIdx];
      charIdx++;
      setTypedText(prompt.slice(0, charIdx));
      if (charIdx < prompt.length) {
        timer.current = setTimeout(tick, 40);
      } else {
        timer.current = setTimeout(() => {
          setIsFading(true);
          timer.current = setTimeout(() => {
            promptIdx = (promptIdx + 1) % PROMPTS.length;
            charIdx = 0;
            setTypedText('');
            setIsFading(false);
            timer.current = setTimeout(tick, 300);
          }, 400);
        }, 2500);
      }
    }

    timer.current = setTimeout(tick, 900);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, []);

  return (
    <>
      <div className="flex items-center justify-between">
        <span className="text-xs text-zinc-300">Aprašyk problemą laisva forma</span>
        <button
          type="button"
          onClick={onShowExamples}
          className="flex items-center gap-1.5 text-sm font-semibold text-[#09090B] bg-[#F97316] hover:bg-[#EA6A08] px-5 py-2.5 rounded-[10px] transition-colors duration-200"
        >
          <span>✦</span> Gerų užklausų pavyzdžiai
        </button>
      </div>
      <div className="relative" style={{ isolation: 'isolate' }}>
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          rows={5}
          className="w-full bg-[#09090B] border border-[#27272F] rounded-[10px] p-4 text-[#F1F0EE] resize-none focus:outline-none focus:border-[#F9731640] focus:ring-2 focus:ring-[#F973161A] text-base transition-colors duration-120"
        />
        {!value && (
          <div
            aria-hidden="true"
            className={`absolute top-0 left-0 right-0 p-4 text-base text-[#55555F] pointer-events-none leading-relaxed transition-opacity duration-[400ms] ${isFading ? 'opacity-0' : 'opacity-100'}`}
          >
            {typedText}<span className="opacity-50 animate-pulse">|</span>
          </div>
        )}
      </div>
    </>
  );
}
