---
name: seo-setup
description: RaskAI SEO and LLMO configuration — Next.js metadata, Schema.org JSON-LD, sitemap, robots.txt, llms.txt, and Core Web Vitals targets
type: project
---

# RaskAI SEO & LLMO Setup

**Skill:** `seo-setup`
**Kada naudoti:** Kai reikia pridėti ar modifikuoti SEO elementus — meta tags, structured data, sitemap, robots.txt, llms.txt, Core Web Vitals optimizacija.

---

## TECHNINĖ BAZĖ (Next.js App Router)

Kiekvienas puslapis privalo turėti:
- `next/head` su title, description, og:tags
- Schema.org JSON-LD structured data
- Core Web Vitals: LCP < 2.5s, CLS < 0.1

---

## ROOT LAYOUT — SEO PATTERN

```tsx
// app/layout.tsx
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'RaskAI.lt — AI B2B marketplace Lietuvoje',
  description: 'Aprašyk verslo problemą natūralia kalba. AI Dispatcher sutapatins su verified tiekėjais.',
  openGraph: {
    title: 'RaskAI.lt',
    description: 'AI-powered B2B marketplace Lietuvoje',
    url: 'https://raskai.lt',
    siteName: 'RaskAI.lt',
    locale: 'lt_LT',
    type: 'website',
  },
}
```

---

## STRUCTURED DATA — kiekviename puslapyje

```tsx
import Script from 'next/script'

// app/layout.tsx arba individualiuose puslapiuose
<Script
  id="schema-org"
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "RaskAI.lt",
      "description": "AI B2B marketplace Lietuvoje",
      "url": "https://raskai.lt",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web"
    })
  }}
/>
```

**Organization schema (root layout papildomai):**
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "RaskAI.lt",
  "url": "https://raskai.lt",
  "description": "AI-powered procurement platforma Lietuvoje"
}
```

---

## SITEMAP

```javascript
// next.config.js arba next-sitemap.config.js
// Paketas: npm install next-sitemap

module.exports = {
  siteUrl: 'https://raskai.lt',
  generateRobotsTxt: true,
  exclude: ['/api/*', '/quote'],  // /quote — magic link, neindeksuoti
}
```

---

## ROBOTS.TXT

```
User-agent: *
Allow: /
Disallow: /api/
Disallow: /quote

Sitemap: https://raskai.lt/sitemap.xml
```

---

## LLMS.TXT — AI Search Discovery

**Failas:** `/public/llms.txt`

```
# RaskAI.lt

> AI-powered B2B marketplace Lietuvoje. Klientai aprašo verslo problemą natūralia kalba, AI Dispatcher klasifikuoja ir sutapatina su verified tiekėjais.

## Puslapiai

- /: Pagrindinis puslapis — kas yra RaskAI
- /how-it-works: Kaip veikia platforma
- /pricing: Kainodara
- /about: Apie projektą
- /quote: Tiekėjų pasiūlymų forma (magic link landing)
```

`llms.txt` yra LLMO (LLM Optimization) failas — leidžia ChatGPT, Perplexity, Google AI ir kitiems AI paieškos varikliams suprasti svetainės struktūrą. Analogiškas `robots.txt`, bet skirtas AI.

---

## PUSLAPIŲ SEO CHECKLIST

Kiekvienas naujas puslapis:

```
☐ export const metadata: Metadata = { title, description, openGraph }
☐ Schema.org JSON-LD <Script> blokas
☐ Puslapis įtrauktas į llms.txt
☐ /quote išskirtas iš sitemap ir robots.txt
☐ Image alt tekstai (jei yra vaizdų)
```

---

## CORE WEB VITALS

| Metrika | Tikslas | Kaip pasiekti |
|---|---|---|
| LCP | < 2.5s | next/image, font preload, server components |
| CLS | < 0.1 | Rezervuoti vietą images, vengti dinaminių insertų |
| FID/INP | < 100ms | Minimizuoti client-side JS |

Next.js App Router pagal nutylėjimą naudoja Server Components — tai gerai LCP.

---

## KRITINĖS TAISYKLĖS

1. `/quote` — niekada neindeksuoti (Disallow robots.txt + exclude sitemap)
2. `llms.txt` — atnaujinti kai pridedamas naujas puslapis
3. Schema.org JSON-LD — naudoti `next/script` su `dangerouslySetInnerHTML`, ne inline `<script>`
4. og:tags — privalomi kiekvienam puslapiui (socialiniai tinklai ir AI preview)
5. `next-sitemap` — auto-generate, ne rankinis XML rašymas
