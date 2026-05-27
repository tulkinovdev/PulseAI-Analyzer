import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, 
  Sparkles, 
  Terminal, 
  Settings, 
  ShieldCheck, 
  AlertCircle, 
  ArrowRight,
  Brain,
  History,
  TrendingUp,
  Gauge
} from "lucide-react";
import { NotebookBg } from "./components/NotebookBg";
import { ThemeToggle } from "./components/ThemeToggle";
import { ReportView } from "./components/ReportView";
import { PerformanceReport, DualDeviceReport } from "./types";
import { i18n, Language } from "./i18n";

export default function App() {
  const [lang, setLang] = useState<Language>('uzb');
  const [url, setUrl] = useState("");
  const [isDark, setIsDark] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<DualDeviceReport | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  // Shortcut mapping to focus key visual input instantly
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Load translations based on active tongue
  const t = i18n[lang];

  // Loader stage descriptions for high-tech scanning wait animations
  const loadingStages = t.loadingStages;

  // 1. Synchronize theme settings on render
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (savedTheme === "dark" || (!savedTheme && systemPrefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const handleToggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  // 2. Cycle loader ticks sequentially to keep loading state engaging
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (loading && loadingStage < loadingStages.length - 1) {
      timer = setTimeout(() => {
        setLoadingStage(prev => prev + 1);
      }, 1600);
    }
    return () => clearTimeout(timer);
  }, [loading, loadingStage]);

  // 3. Initiate site audit fetch
  const handleAnalyze = async (targetUrl: string = url) => {
    if (!targetUrl.trim()) return;
    
    // Clear previous reports or issues
    setError(null);
    setReport(null);
    setLoading(true);
    setLoadingStage(0);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: targetUrl.trim(), lang })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "An unexpected scanning error occurred.");
      }

      const parsedReport = await response.json();
      setReport(parsedReport);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to make connection with target host. Ensure URL is correct.");
    } finally {
      setLoading(false);
    }
  };

  const handleInteractiveFastTest = (sampleUrl: string) => {
    setUrl(sampleUrl);
    handleAnalyze(sampleUrl);
  };

  return (
    <div className="relative min-h-screen px-4 pb-20 pt-6 transition-colors duration-500 sm:px-6 md:px-8">
      {/* Interactive Blueprint Mathematical Canvas Grid */}
      <NotebookBg isDark={isDark} />

      {/* Application Master Header Boundary */}
      <header className="mx-auto flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 bg-transparent pb-4 sm:pb-5 dark:border-slate-800 w-full max-w-5xl">
        <div className="flex items-center justify-between sm:justify-start gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-3">
            {/* Minimalist Signature Ink Logo Square */}
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#111111] font-mono text-base font-extrabold text-white dark:bg-white dark:text-[#111111] transition-all">
              A
            </div>
            <div>
              <h1 className="font-display text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-1">
                PulseAI <span className="opacity-40 font-normal font-sans text-xs">Analyzer</span>
              </h1>
            </div>
          </div>
        </div>

        {/* Floating actions menu */}
        <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto mt-1 sm:mt-0">
          <div className="text-[11px] font-mono text-slate-400 dark:text-slate-500 font-medium tracking-tight">
            {t.reportsId}
          </div>

          <div className="flex items-center gap-2">
            {/* New Language Selector Pill Buttons */}
            <div className="flex items-center gap-0.5 rounded-lg border border-slate-200 bg-white/50 p-1 dark:border-slate-850 dark:bg-slate-900/50">
              {(['eng', 'uzb', 'rus'] as Language[]).map((l) => (
                <button
                  key={l}
                  id={`lang-sel-${l}`}
                  onClick={() => setLang(l)}
                  className={`rounded-md px-2 py-0.5 text-[9.5px] font-bold tracking-tight uppercase transition-all cursor-pointer ${
                    lang === l
                      ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950 shadow-xs"
                      : "text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-350"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>

            <ThemeToggle isDark={isDark} onToggle={handleToggleTheme} />
          </div>
        </div>
      </header>

      {/* Main Container Layout */}
      <main className="mx-auto mt-12 flex max-w-5xl flex-col items-center">
        
        {/* Dynamic State Router */}
        <AnimatePresence mode="wait">
          {!loading && !report && (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="flex w-full flex-col items-center"
            >
              {/* Grand Elegant Hero Banner */}
              <div className="max-w-xl text-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="mx-auto inline-flex items-center gap-1.5 rounded-full border border-emerald-500/10 bg-emerald-500/5 px-3 py-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>{t.poweredBy}</span>
                </motion.div>
                
                <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl md:text-5xl">
                  {lang === 'uzb' ? (
                    <>Sayt holatini tekshiring.<br /><span className="text-emerald-500 font-extrabold pb-0.5">Mukammal</span> yechimlarni yarating.</>
                  ) : lang === 'rus' ? (
                    <>Инспектируйте показатели.<br />Создавайте <span className="text-emerald-500 font-extrabold pb-0.5">элитные</span> решения.</>
                  ) : (
                    <>Inspect site vitals.<br />Generate <span className="text-emerald-500 font-extrabold pb-0.5">elite</span> solutions.</>
                  )}
                </h2>
                
                <p className="mt-4 font-sans text-sm font-light leading-relaxed text-slate-500 dark:text-slate-400 sm:text-base pr-2">
                  {t.heroDesc}
                </p>
              </div>

              {/* URL Input Form bar */}
              <div className="mt-10 w-full max-w-xl px-2">
                <form
                  onSubmit={(e) => { e.preventDefault(); handleAnalyze(); }}
                  className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-sm transition-all duration-300 focus-within:border-[#111111]/40 focus-within:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:focus-within:border-white/40"
                  id="analyzer-submit-form"
                >
                  <div className="flex items-center">
                    <div className="pl-3.5 text-slate-400 flex items-center shrink-0">
                      <Search className="h-4 w-4 mr-1.5 text-slate-400/80" />
                      <span className="font-mono text-xs opacity-30 select-none">https://</span>
                    </div>
                    
                    <input
                      id="analyzer-url-input"
                      ref={inputRef}
                      type="text"
                      placeholder={t.placeholder}
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="w-full bg-transparent py-2.5 pl-1.5 pr-[110px] sm:pr-[215px] font-mono text-xs font-semibold text-slate-800 outline-none placeholder:font-sans placeholder:font-normal placeholder:text-slate-400/70 dark:text-slate-100 dark:placeholder:text-slate-650"
                    />

                    <div className="absolute right-1.5 top-1.5 bottom-1.5 flex items-center gap-2">
                      <div className="hidden sm:inline-flex bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 px-2 py-0.5 rounded text-[9px] font-mono font-bold select-none tracking-tight whitespace-nowrap">
                        CTRL+K
                      </div>
                      <button
                        id="analyzer-submit-button"
                        type="submit"
                        disabled={!url.trim()}
                        className="h-full flex items-center gap-1.5 rounded-lg bg-[#111111] px-4 text-xs font-semibold text-white shadow-sm transition-all hover:bg-slate-800 active:scale-97 disabled:scale-100 disabled:opacity-45 dark:bg-white dark:text-[#111111] dark:hover:bg-slate-150 whitespace-nowrap cursor-pointer disabled:cursor-not-allowed"
                      >
                        <span>{t.analyzeBtn}</span>
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </form>

                {/* Error notification ribbons */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50/50 p-4 text-xs dark:border-red-950/20 dark:bg-red-950/10"
                  >
                    <AlertCircle className="h-4.5 w-4.5 shrink-0 text-red-500" />
                    <div className="flex-1 text-red-700 dark:text-red-400 font-medium">
                      <strong>{t.errorHeader}</strong> {error}
                    </div>
                  </motion.div>
                )}

                {/* Direct Demo quick clicks */}
                <div className="mt-8">
                  <span className="block font-mono text-[9px] font-bold text-slate-400 dark:text-slate-550 text-center tracking-widest uppercase">
                    {t.demoTitle}
                  </span>
                  
                  <div className="mt-3.5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {[
                      { label: "Stripe", url: "https://stripe.com", speed: t.fast },
                      { label: "GitHub", url: "https://github.com", speed: t.moderate },
                      { label: "Wikipedia", url: "https://wikipedia.org", speed: t.fast },
                      { label: "Apple Store", url: "https://apple.com", speed: t.moderate }
                    ].map((demo) => (
                      <button
                        id={`demo-host-button-${demo.label.toLowerCase()}`}
                        key={demo.label}
                        onClick={() => handleInteractiveFastTest(demo.url)}
                        className="flex flex-col items-start rounded-xl border border-slate-200/60 bg-white/40 p-3 text-left transition hover:border-slate-300 hover:bg-white/70 dark:border-slate-800/60 dark:bg-slate-900/15 dark:hover:border-slate-705 w-full cursor-pointer"
                      >
                        <span className="font-display text-xs font-bold text-slate-700 dark:text-slate-300">
                          {demo.label}
                        </span>
                        <span className="mt-1 font-mono text-[9.5px] font-medium text-slate-400 dark:text-slate-500 truncate w-full">
                          {demo.url.replace("https://", "")}
                        </span>
                        <span className={`mt-2 rounded px-1.5 py-0.5 font-sans text-[8.5px] font-bold ${
                          demo.speed === t.fast 
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" 
                            : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                        }`}>
                          {demo.speed}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Clean Copyright 2026 Footnote replacing standard feature cards */}
              <div className="mt-16 w-full max-w-xl text-center border-t border-slate-250/30 pt-8 dark:border-slate-800/40">
                <p className="font-mono text-[11px] font-semibold text-slate-400 dark:text-slate-550 tracking-wide">
                  {t.copyright}
                </p>
              </div>
            </motion.div>
          )}

          {/* Cinematic active analysis loader console */}
          {loading && (
            <motion.div
              key="loader"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex w-full max-w-xl flex-col items-center justify-center py-10"
            >
              <div className="relative flex h-20 w-20 items-center justify-center">
                {/* Rotating outer technical ring */}
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-slate-200 border-t-emerald-500 dark:border-slate-800 dark:border-t-emerald-400"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                />
                <Brain className="h-8 w-8 text-emerald-500 animate-pulse" />
              </div>

              {/* High-tech status screen layout */}
              <div className="mt-8 w-full overflow-hidden rounded-2xl border border-slate-200/80 bg-white/70 p-5 shadow-lg backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/70">
                <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5">
                  <Terminal className="h-4 w-4 text-emerald-500" />
                  <span className="font-mono text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-wider uppercase">
                    {t.apexScanners}
                  </span>
                </div>

                <div className="mt-4 min-h-24">
                  {/* Current executing task title */}
                  <motion.h3 
                    key={loadingStage}
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="font-display text-sm font-bold text-slate-800 dark:text-slate-100 tracking-tight"
                  >
                    {loadingStages[loadingStage]?.title}
                  </motion.h3>

                  {/* Curated descriptions */}
                  <motion.p 
                    key={`desc-${loadingStage}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="mt-1.5 font-mono text-xs text-slate-400 dark:text-slate-500 leading-relaxed"
                  >
                    STATUS: <span className="text-emerald-500 font-semibold">{loadingStages[loadingStage]?.detail}</span>
                  </motion.p>
                </div>

                {/* Progress pipeline tracker bar */}
                <div className="mt-6">
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 dark:text-slate-505 font-mono">
                    <span>{t.indexProcess}: {Math.round((loadingStage / (loadingStages.length - 1)) * 100)}%</span>
                    <span className="text-emerald-500 select-all">SYSTEM_SAFE</span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <motion.div
                      className="h-full bg-emerald-500"
                      initial={{ width: "0%" }}
                      animate={{ width: `${(loadingStage / (loadingStages.length - 1)) * 100}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Render Full-Fidelity Screenshot-Ready Report */}
          {report && !loading && (
            <motion.div
              key="report"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full flex justify-center"
            >
              <ReportView report={report} onReset={() => { setReport(null); setError(null); }} lang={lang} />
            </motion.div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
}
