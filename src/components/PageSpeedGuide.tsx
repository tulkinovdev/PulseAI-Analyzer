import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Key, ChevronDown, ChevronUp, CheckCircle, Info, Settings, ShieldAlert } from "lucide-react";

export function PageSpeedGuide() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-8 w-full max-w-xl px-2">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white/50 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/45 transition-all">
        {/* Accordion Trigger Header */}
        <button
          id="api-guide-accordion-trigger"
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full items-center justify-between p-4.5 text-left transition hover:bg-slate-50/50 dark:hover:bg-slate-800/20 cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Key className="h-4.5 w-4.5" />
            </div>
            <div>
              <h4 className="font-display text-sm font-bold text-slate-800 dark:text-slate-100">
                PAGESPEED_API_KEY kalitini olish bo'yicha yo'riqnoma
              </h4>
              <p className="font-sans text-[11px] text-slate-400 dark:text-slate-500">
                429 (Too Many Requests) xatoligini chetlab o'tish va cheksiz tahlil qilish uchun
              </p>
            </div>
          </div>
          {isOpen ? (
            <ChevronUp className="h-4 w-4 text-slate-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-slate-400" />
          )}
        </button>

        {/* Accordion Content */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="border-t border-slate-150/40 px-5 pb-5 pt-4 dark:border-slate-800/50"
            >
              <div className="rounded-xl bg-amber-500/5 border border-amber-500/15 p-3.5 mb-5 flex gap-2.5 items-start">
                <ShieldAlert className="h-4.5 w-4.5 text-amber-500 shrink-0 mt-0.5 animate-pulse" />
                <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                  <strong className="font-semibold text-slate-800 dark:text-slate-200">Nega bu kerak?</strong> Anonim (API kalitsiz) so'rovlar uchun Google juda qattiq cheklovlar (Rate Limits) qo'yadi. Shu sababli ko'p so'rov yuborilganda <code className="px-1 py-0.5 rounded bg-amber-500/10 font-mono text-[10px] text-amber-600">429 Too Many Requests</code> xatoligi chiqadi. O'zingizning bepul shaxsiy kalitingizni o'rnatish orqali buni butunlay hal qilasiz.
                </div>
              </div>

              <div className="space-y-4 text-xs text-slate-600 dark:text-slate-300">
                <div>
                  <h5 className="font-display font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 leading-none">
                    <span className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold text-white dark:bg-slate-100 dark:text-slate-900">
                      1
                    </span>
                    Google Cloud Konsoliga kiring
                  </h5>
                  <p className="mt-1.5 ml-6 font-normal text-slate-500 dark:text-slate-400 leading-relaxed">
                    <a
                      href="https://console.cloud.google.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-500 hover:text-emerald-600 font-semibold inline-flex items-center gap-0.5"
                    >
                      Google Cloud Console <Info className="h-3 w-3 inline-block" />
                    </a> sahifasiga o'z Google hisobingiz orqali kiring. Mavjud loyihani tanlang yoki yangi loyiha (Project) yarating.
                  </p>
                </div>

                <div>
                  <h5 className="font-display font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 leading-none">
                    <span className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold text-white dark:bg-slate-100 dark:text-slate-900">
                      2
                    </span>
                    PageSpeed Insights API-ni faollashtiring
                  </h5>
                  <p className="mt-1.5 ml-6 font-normal text-slate-500 dark:text-slate-400 leading-relaxed">
                    Yuqoridagi Qidiruv paneliga <span className="font-semibold text-slate-700 dark:text-slate-350">"PageSpeed Insights API"</span> deb yozing yoki to'g'ridan-to'g'ri ko'k rangdagi <span className="font-semibold text-emerald-500">"API and Services" &gt; "Library"</span> rukniga o'tib, uni bosing va <span className="font-semibold text-slate-800 dark:text-slate-200">"ENABLE"</span> tugmasini bosing.
                  </p>
                </div>

                <div>
                  <h5 className="font-display font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 leading-none">
                    <span className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold text-white dark:bg-slate-100 dark:text-slate-900">
                      3
                    </span>
                    API Kalitini Yarating (Credentials)
                  </h5>
                  <p className="mt-1.5 ml-6 font-normal text-slate-500 dark:text-slate-400 leading-relaxed">
                    Chap menyudan <span className="font-semibold">"APIs & Services" &gt; "Credentials"</span> sahifasiga o'ting. Tepada joylashgan <span className="font-semibold text-emerald-500">+ CREATE CREDENTIALS</span> tugmasini bosing hamda <span className="font-semibold text-slate-800 dark:text-slate-200">"API Key"</span> ni tanlang. Tizim sizga kalitni (<code className="font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">AIzaSy...</code>) taqdim etadi. Uni nusxalab oling.
                  </p>
                </div>

                <div>
                  <h5 className="font-display font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 leading-none">
                    <span className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold text-white dark:bg-slate-100 dark:text-slate-900">
                      4
                    </span>
                    AI Studio Secrets paneliga saqlang
                  </h5>
                  <p className="mt-1.5 ml-6 font-normal text-slate-500 dark:text-slate-400 leading-relaxed">
                    Ushbu ilova yoki AI Studio chat interfeysining yuqori panelida joylashgan <span className="font-semibold text-slate-800 dark:text-slate-200"><Settings className="h-3 w-3 inline" /> Settings (Sozlamalar yoki Secrets)</span> menyusini oching va quyidagi o'zgaruvchini kiritib saqlang:
                  </p>
                  <div className="mt-2.5 ml-6 font-mono text-[11px] bg-slate-950 text-emerald-400 p-3 rounded-lg border border-slate-800">
                    <div>PAGESPEED_API_KEY="siz_olgan_kalit_kodi"</div>
                  </div>
                </div>
              </div>

              <div className="mt-4 border-t border-slate-150/40 pt-4 dark:border-slate-800/40 flex justify-end items-center text-[11px] text-emerald-600 dark:text-emerald-400 font-bold gap-1">
                <CheckCircle className="h-4 w-4" />
                <span>Tekshirish: Kalit o'rnatilgach, cheklovlar butunlay olib tashlanadi!</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
