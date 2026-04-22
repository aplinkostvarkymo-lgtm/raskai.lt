'use client';

import React, { useEffect, useState } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';

// Stable reference — never re-created, prevents options prop from triggering re-render
const OPTIONS = {
  background: { color: { value: 'transparent' } },
  fpsLimit: 60,
  particles: {
    color: { value: '#F97316' },
    links: {
      enable: true,
      color: '#F97316',
      opacity: 0.15,
      distance: 150,
    },
    move: { enable: true, speed: 0.8 },
    opacity: { value: 0.4 },
    size: { value: 2 },
    number: { value: 80 },
  },
  interactivity: {
    detectsOn: 'window' as const,
    events: {
      onHover: { enable: true, mode: 'grab' as const },
      onClick: { enable: true, mode: 'push' as const },
    },
    modes: {
      grab: { distance: 140, links: { opacity: 0.3 } },
      push: { quantity: 3 },
    },
  },
  detectRetina: true,
} as const;

const ParticlesBg = React.memo(() => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setReady(true));
  }, []);

  if (!ready) return null;

  return (
    <Particles
      id="tsparticles"
      style={{ position: 'fixed', inset: 0, zIndex: 0 }}
      options={OPTIONS}
    />
  );
});

ParticlesBg.displayName = 'ParticlesBg';
export default ParticlesBg;
