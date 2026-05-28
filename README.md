# PulseAI-Analyzer — Web Performance Analyzer

PulseAI-Analyzer is an elite-grade, full-stack website performance diagnostics and optimization platform. Designed for modern web developers and QA engineers, it runs lightning-fast static page scraping, aggregates direct **PageSpeed Insights** telemetry concurrently, and synthesizes visual performance reports complete with copyable, production-ready diagnostic fixes.

This platform bridges the gap between raw numeric performance scores (LCP, FID/TBT, CLS, FCP) and actionable, high-quality development solutions.


## Preview

> Click the image to watch the demo video

[![Watch Demo](https://res.cloudinary.com/dghqezqbe/image/upload/v1779967316/cover2_zfaqv7.webp)](https://youtu.be/sopytMkF5c8)

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Express.js
- Framer Motion


## Performance

![Performance](https://res.cloudinary.com/dghqezqbe/image/upload/v1779965972/performance_eticqp.webp)


## Live Demo

```Link
https://pulse-ai-analyzer.vercel.app
```

## Features Matrix

### 1. Robust Multi-Metric Analytics
- **Core Web Vitals Telemetry:** Live parsing of **Largest Contentful Paint (LCP)**, **First Contentful Paint (FCP)**, **Total Blocking Time (TBT)**, and **Cumulative Layout Shift (CLS)**.
- **Four-Sectored Page Quality Ratios:** Independent grading of total **Performance**, **Accessibility**, **Best Practices**, and **SEO**.
- **Static DOM Auditing:** Scrapes structural metrics, script loads, image configurations, stylesheet weights, and inline elements asynchronously.

### 2. Multi-Lingual Diagnostics
- Full internationalization support with on-the-fly toggling between English, Uzbek (**O'zbekcha**), and Russian (**Русский**).
- Deep system translation covers all diagnostic tables, error codes, and synthesized recommendations.

### 3. Fully Interactive Developer GUI
- **Dynamic Charting:** Direct visual breakdown of asset weights and resource allocation types.
- **Senior-Level Code Remedies:** Collapsible diagnostics displaying optimized, copy-to-clipboard code snippets (CSS, JS, Webpack/Vite setups, and structural HTML patches).
- **Responsive Simulation:** Real-time toggling between Desktop and Mobile profiles dynamically displaying device-specific metrics.

### 4. Enterprise-Grade Error Defenses
- Parallelized network fetch sequences ensuring latency reductions up to 50%.
- Defensive, multi-tiered error wrappers utilizing PageSpeed API key fallbacks and keyless retries.
- Smart caching and timeout protection preventing bottlenecked connections.


## Project Structure

```text
/
├── api/
│   └── analyze.ts            # Vercel Serverless API handler
├── src/
│   ├── components/
│   │   ├── ReportView.tsx    # Interactive dashboard and charts rendering
│   │   └── ThemeContext.tsx  # Dynamic dark/light theme state provider
│   ├── App.tsx               # Primary single-page entry layout & form validation
│   ├── i18n.ts               # Core translation dictionaries (EN, UZ, RU)
│   ├── index.css             # Tailwind imports & master typography rules
│   └── main.tsx              # React mounting root
│
├── .env.example              # Template for private configuration keys
├── index.html                # Entry HTML shell
├── metadata.json             # AI Studio client metadata and capabilities
├── package.json              # Main project description & dependencies configuration
├── server.ts                 # Full-stack Node.js Express server entrypoint
├── tsconfig.json             # Hardened TypeScript compilation targets
└── vite.config.ts            # React/Vite development/production compile instructions
```


## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/tulkinovdev/pulse-analyzer.git
```
```bash
cd pulse-analyzer
```

### 2. Configure Environment Variables
Copy the env template and enter your optional keys:
```bash
cp .env.example .env
```
Add your PageSpeed Insights and server key configurations inside `.env`:
```env
PAGESPEED_API_KEY=your_pagespeed_api_key_here
GEMINI_API_KEY=your_internal_ai_key_here
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run Development Servers
To boot up the unified Full-Stack Dev server locally:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.


## Build and Deployment

### Build for Production
Compiles the static frontend files and builds the bundled backend Express server into standard Node-executable bundles:
```bash
npm run build
```

### Run Production Server
Launches the high-performance unified server:
```bash
npm run start
```


## Design and Visual Philosophy

- **Swiss-Modern Visual Language:** Centered around high-contrast, modern typography pairing matching **Inter** and **Space Grotesk** headings alongside a technical monospaced font (**JetBrains Mono**).
- **Aesthetic Chromatic Curves:** Beautiful charcoal gray canvas (`slate-900`) combined with emerald accents (`emerald-500`) to highlight optimal ranges and direct user focus.
- **Architectural Honesty:** Displays immediate, highly practical metrics without decorative telemetry noise or low-quality fake status lines. All values are derived purely from native audits.
