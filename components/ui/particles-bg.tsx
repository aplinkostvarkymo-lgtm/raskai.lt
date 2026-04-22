'use client';

import { useEffect, useState } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';

export default function ParticlesBg() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setReady(true));
  }, []);

  if (!ready) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        willChange: 'transform',
      }}
    >
    <Particles
      id="tsparticles"
      style={{ width: '100%', height: '100%', position: 'fixed', inset: 0 }}
      options={{
        background: { color: { value: 'transparent' } },
        fpsLimit: 60,
        particles: {
          number: { value: 80, density: { enable: true, width: 900 } },
          color: { value: '#F97316' },
          opacity: { value: { min: 0.15, max: 0.4 } },
          size: { value: { min: 1, max: 2.5 } },
          links: {
            enable: true,
            color: '#F97316',
            opacity: 0.15,
            distance: 150,
            width: 1,
          },
          move: {
            enable: true,
            speed: 1,
            direction: 'none',
            random: true,
            outModes: { default: 'bounce' },
          },
        },
        interactivity: {
          detectsOn: 'window',
          events: {
            onHover: { enable: true, mode: 'grab' },
            onClick: { enable: true, mode: 'push' },
          },
          modes: {
            grab: { distance: 200, links: { opacity: 0.5 } },
            push: { quantity: 3 },
          },
        },
        detectRetina: true,
      }}
    />
    </div>
  );
}
