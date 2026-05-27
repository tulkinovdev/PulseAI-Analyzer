export type Language = 'eng' | 'uzb' | 'rus';

export interface i18nSchema {
  // Header
  reportsId: string;
  theme: string;
  analyzer: string;
  
  // Hero
  poweredBy: string;
  heroTitle: string;
  heroDesc: string;
  
  // Form
  placeholder: string;
  analyzeBtn: string;
  errorHeader: string;
  invalidUrl: string;
  
  // Demo
  demoTitle: string;
  fast: string;
  moderate: string;
  
  // Loader
  apexScanners: string;
  indexProcess: string;
  loadingStages: Array<{ title: string; detail: string }>;
  
  // Footer
  copyright: string;

  // Report Headers
  targetHost: string;
  secureSsl: string;
  reAnalyze: string;
  shareReport: string;
  linkCopied: string;
  downloadAudit: string;
  deviceScope: string;
  mobile4g: string;
  desktopScope: string;
  auditGenCore: string;
  perfScore: string;
  optimServer: string;
  lowPerf: string;
  accessibility: string;
  bestPractices: string;
  seoEngine: string;
  optimalRange: string;
  aiOptCore: string;
  applyFix: string;
  suggestFix: string;
  gainPts: string;
  toastSuccess: string;

  lcp: string;
  tbt: string;
  cls: string;
  fcp: string;

  assetWeights: string;
  customDiag: string;
  customDiagDesc: string;
  all: string;
  performance: string;
  bestPracticesLabel: string;
  seo: string;
  diagnosticCriteria: string;
  whyItMatters: string;
  estimatedBenefit: string;
  indexGain: string;
  solutionSnippet: string;
  copySnip: string;
  copied: string;
  customAssetRecommended: string;
  newAuditAction: string;
  newAuditDesc: string;
  backToHome: string;
  analyzeAnotherSite: string;
}

export const i18n: Record<Language, i18nSchema> = {
  eng: {
    reportsId: "Report ID: #9902-LX",
    theme: "Theme",
    analyzer: "Analyzer",
    poweredBy: "Powered by tulkinovdev",
    heroTitle: "Inspect site vitals. Generate elite solutions.",
    heroDesc: "A high-end website performance analyzer designed for developers. Input any host URL to produce portfolio-worthy audit reports complete with real-time score indicators, detailed Core Web Vitals, and copyable custom optimization code fixes.",
    placeholder: "apple.com/iphone-15-pro",
    analyzeBtn: "Analyze",
    errorHeader: "Audit Error:",
    invalidUrl: "Failed to make connection with target host. Ensure URL is correct.",
    demoTitle: "TRY THESE DEMO PAGES IMMEDIATELY",
    fast: "Fast",
    moderate: "Moderate",
    apexScanners: "APEX SCANNERS EXECUTING",
    indexProcess: "INDEX PROCESS",
    loadingStages: [
      { title: "PINGING REMOTE APEX DIRECTORY", detail: "Resolving nameserver records, measuring connection latencies..." },
      { title: "RESOLVING DOCUMENT NODE TREE", detail: "Scanning static layout, script references, CSS stylesheets..." },
      { title: "EVALUATING ACCESSIBILITY TAGS", detail: "Checking image alt components, semantic HTML rules..." },
      { title: "RUNNING CORE WEB VITAL MODELS", detail: "Extrapolating FCP, LCP, CLS, and TBT metrics..." },
      { title: "INVOKING GEMINI AI ANALYTICAL LAYER", detail: "Synthesizing diagnostics, compiling optimal remedies..." },
      { title: "POLISHING SCREENSHOT-READY REPORT", detail: "Rendering performance cards and styling senior code fixes..." }
    ],
    copyright: "© 2026 PulseAI Analyzer. All rights reserved.",
    targetHost: "TARGET HOST",
    secureSsl: "SECURE SSL",
    reAnalyze: "Re-Analyze",
    shareReport: "Share",
    linkCopied: "Link Copied!",
    downloadAudit: "Download Audit",
    deviceScope: "Device Analysis Profile:",
    mobile4g: "Mobile (Simulated 4G)",
    desktopScope: "Desktop Scope",
    auditGenCore: "AUDIT GENERATOR CORE v3.5",
    perfScore: "Performance Score",
    optimServer: "Website speed matches industry leaders. Optimal server-side caching.",
    lowPerf: "Core metrics show significant potential for loading optimizations.",
    accessibility: "Accessibility",
    bestPractices: "Best Practices",
    seoEngine: "SEO Engine",
    optimalRange: "Optimal Range",
    aiOptCore: "AI OPTIMIZATION CORE",
    applyFix: "Apply Smart Fix",
    suggestFix: "Our artificial neural model suggests preloading the Largest Contentful Paint image to optimize server response.",
    gainPts: "Estimated Benefit: +2.4 pts",
    toastSuccess: "Code remedy applied and saved successfully!",
    lcp: "Largest Contentful Paint (LCP)",
    tbt: "Total Blocking Time (TBT)",
    cls: "Cumulative Layout Shift (CLS)",
    fcp: "First Contentful Paint (FCP)",
    assetWeights: "Resource Allocation Breakdown",
    customDiag: "Custom Optimization Diagnostics",
    customDiagDesc: "Action tasks synthesized by Gemini AI to optimize performance. Click each row to toggle senior-level remedies.",
    all: "all",
    performance: "performance",
    bestPracticesLabel: "best practices",
    seo: "SEO",
    diagnosticCriteria: "DIAGNOSTIC CRITERIA",
    whyItMatters: "WHY THIS MATTERS",
    estimatedBenefit: "ESTIMATED SCORE BENEFIT",
    indexGain: "total index gain",
    solutionSnippet: "INDUSTRY SOLUTION SNIPPET",
    copySnip: "Copy Snip",
    copied: "Copied!",
    customAssetRecommended: "Custom asset configuration fix recommended. Implement structural CDN or routing layers to resolve.",
    newAuditAction: "Do you want to analyze a new site?",
    newAuditDesc: "Go back to the home page to audit any other site's performance, metrics and receive AI remedies.",
    backToHome: "Return to Home Page",
    analyzeAnotherSite: "Analyze new site"
  },
  uzb: {
    reportsId: "Hisobot ID: #9902-LX",
    theme: "Mavzu",
    analyzer: "Tahlilchi",
    poweredBy: "tulkinovdev tomonidan ishlab chiqilgan",
    heroTitle: "Sayt holatini tekshiring. Mukammal yechimlarni yarating.",
    heroDesc: "Dasturchilar qulayligi uchun yaratilgan ilg'or sayt unumdorligi tahlilchisi. Istalgan URL manzilini kiriting hamda real vaqtda ishlash tezligi ko'rsatkichlari, Core Web Vitals unumdorligi va nusxalash mumkin bo'lgan aqlli Gemini AI tavsiyalariga ega bo'ling.",
    placeholder: "apple.com/iphone-15-pro",
    analyzeBtn: "Tahlil qilish",
    errorHeader: "Tahlil Xatosi:",
    invalidUrl: "Nishon server bilan ulanib bo'lmadi. URL manzili to'g'ri ekanligini qaytadan tekshirib ko'ring.",
    demoTitle: "DEMO SAYTLARNI HOZIROQ SINAB KO'RING",
    fast: "Tezkor",
    moderate: "O'rtacha",
    apexScanners: "LOYIHA SCANNERS ISHGA TUSHDI",
    indexProcess: "INVENTARLASH JARAYONI",
    loadingStages: [
      { title: "NISHON SERVER MANZILINI TEKSHIRISH", detail: "Xost server unumdorligi va serverga ulanish kechikishini hisoblash..." },
      { title: "HUJJAT NODE DARAXTINI ANIQLASH", detail: "Statik sahifa tuzilishi, CSS stillari hamda JS fayllarini aniqlash..." },
      { title: "IMKONIYAT CHEKLOVLARINI BAHOLASH", detail: "Rasmlarda muqobil alt parametrlari va semantik HTML tahlili..." },
      { title: "CORE WEB VITALS MODELINI ISHGA TUSHIRISH", detail: "LCP, FCP, CLS va TBT ko'rsatkichlarini hisoblash..." },
      { title: "GEMINI AI ANALYSIS MODELINI ISHGA TUSHIRISH", detail: "Milliardlik parametrli neyrotarmoq yordamida yechimlar tayyorlash..." },
      { title: "HISOBOTNI YAKUNIY SAYQALLASH", detail: "Premium vizual dizayn, diagramma va optimallashtirish kodlarini yuklash..." }
    ],
    copyright: "© 2026 PulseAI Analyzer. Barcha huquqlar himoyalangan.",
    targetHost: "NISHON XOST",
    secureSsl: "XAVFSIZLIK SSL",
    reAnalyze: "Tahlilni yangilash",
    shareReport: "Ulashish",
    linkCopied: "Havola nusxalandi!",
    downloadAudit: "Hisobotni yuklash",
    deviceScope: "Qurilma tahlili doirasi:",
    mobile4g: "Mobil (4G Simulyatsiyasi)",
    desktopScope: "Kompyuter (Desktop)",
    auditGenCore: "SKANERLASH BRANDI v3.5",
    perfScore: "Tezlik unumdorligi",
    optimServer: "Mobil tezlik ko'rsatkichlari soha yetakchilariga mos keladi. Keshlash to'g'ri sozlangan.",
    lowPerf: "Ushbu qurilmada ishlash sekinligi aniqlandi. Yuklanish unumdorligini yaxshilash zarur.",
    accessibility: "Qulaylik (Accessibility)",
    bestPractices: "Xavfsizlik & Standartlar",
    seoEngine: "SEO Tizimi",
    optimalRange: "Eng yaxshi diapazon",
    aiOptCore: "AI ORQALI TEXNIK TAVSIYALAR",
    applyFix: "Tavsiyani qo'llash",
    suggestFix: "Sun'iy intellekt unumdorlikni va LCP ko'rsatkichini yana +12% ga yaxshilash uchun rasm resurslarini avvaldan yuklashni (preload) tavsiya qiladi.",
    gainPts: "Kutilayotgan foyda: +2.4 ball",
    toastSuccess: "Tavsiya muvaffaqiyatli saqlandi va dasturiy kodga tatbiq qilindi!",
    lcp: "Largest Contentful Paint (Eng yirik rasm yuklanishi)",
    tbt: "Total Blocking Time (Umumiy to'silish vaqti)",
    cls: "Cumulative Layout Shift (Vizual siljish koeffitsiyenti)",
    fcp: "First Contentful Paint (Birinchi element yuklanishi)",
    assetWeights: "Veb-resurslar Hajm Diagrammasi",
    customDiag: "Maxsus optimallashtirish tahlillari",
    customDiagDesc: "Saytingizning ko'rsatkichlarini yaxshilash va qidiruv tizimlarida yuqoriga ko'tarish uchun maxsus neyrotarmoq tavsiyalari va tayyor senior darajasidagi kodlar.",
    all: "barchasi",
    performance: "Tezlik",
    bestPracticesLabel: "Standartlar",
    seo: "SEO",
    diagnosticCriteria: "TASHXIS BILAN BOG'LIQ HOLAT",
    whyItMatters: "BU NEGA MUHIM?",
    estimatedBenefit: "KUTILAYOTGAN SAMARADORLIK",
    indexGain: "umumiy reytingga qo'shiladigan foiz",
    solutionSnippet: "TAVSIYA ETILADIGAN SENIOR DARAHASIDAGI KOD",
    copySnip: "Nusxa olish",
    copied: "Nusxalandi!",
    customAssetRecommended: "Ushbu muammoni hal qilish uchun CDN xizmatlarini ulash yoki sayt yuklanish ssenariylarini o'zgartirish tavsiya etiladi.",
    newAuditAction: "Yangi saytni analiz qilishni xohlaysizmi?",
    newAuditDesc: "Bosh sahifaga qayting va boshqa xohlagan saytingizni tez va bepul analiz qiling.",
    backToHome: "Bosh Sahifaga Qaytish",
    analyzeAnotherSite: "Yangi saytni analiz qilish"
  },
  rus: {
    reportsId: "ID отчета: #9902-LX",
    theme: "Тема",
    analyzer: "Анализатор",
    poweredBy: "Работает на базе tulkinovdev",
    heroTitle: "Инспектируйте показатели. Создавайте элитные решения.",
    heroDesc: "Передовой анализатор производительности сайтов, разработанный специально для программистов. Введите рабочий URL-адрес, чтобы получить детальный отчет Core Web Vitals вместе с готовым к копированию кодом от Gemini AI.",
    placeholder: "apple.com/iphone-15-pro",
    analyzeBtn: "Анализировать",
    errorHeader: "Ошибка Аудита:",
    invalidUrl: "Не удалось подключиться к целевому хосту. Убедитесь в правильности URL-адреса.",
    demoTitle: "ПОПРОБУЙТЕ ДЕМО-СТРАНИЦЫ ПРЯМО СЕЙЧАС",
    fast: "Быстро",
    moderate: "Умеренно",
    apexScanners: "ВЫПОЛНЕНИЕ СКАНИРОВАНИЯ APEX",
    indexProcess: "ПРОЦЕСС ИНДЕКСАЦИИ",
    loadingStages: [
      { title: "ПРОВЕРКА АДРЕСА ЦЕЛЕВОГО СЕРВЕРА", detail: "Разрешение DNS записей, измерение задержки ответа локального хоста..." },
      { title: "РАЗБОР СТРУКТУРЫ СТРАНИЦЫ", detail: "Анализ структуры тегов, стилей CSS и скриптов JS..." },
      { title: "ОЦЕНКА ДОСТУПНОСТИ И СЕМАНТИКИ", detail: "Проверка альтернативных alt-тегов картинок, семантический разбор..." },
      { title: "ЗАПУСК МОДЕЛИ CORE WEB VITALS", detail: "Вычисление параметров скорости LCP, FCP, CLS и TBT..." },
      { title: "АКТИВАЦИЯ АНАЛИТИЧЕСКИХ МОДЕЛЕЙ GEMINI AI", detail: "Интеллектуальный синтез диагностических решений и кода..." },
      { title: "КОНЕЧНАЯ ПОЛИРОВКА ОТЧЕТА", detail: "Рендеринг карточек отчета и подгоночная обработка стилей..." }
    ],
    copyright: "© 2026 PulseAI Analyzer. Все права защищены.",
    targetHost: "АДРЕС ХОСТА",
    secureSsl: "SECURE SSL",
    reAnalyze: "Заново",
    shareReport: "Поделиться",
    linkCopied: "Скопировано!",
    downloadAudit: "Скачать отчет",
    deviceScope: "Область анализа устройства:",
    mobile4g: "Мобильные устройства (Эмуляция 4G)",
    desktopScope: "Компьютеры (Desktop)",
    auditGenCore: "СКАНИРУЮЩИЙ ДВИЖОК v3.5",
    perfScore: "Производительность",
    optimServer: "Показатели скорости на данном устройстве соответствуют лидерам рынка.",
    lowPerf: "Обнаружены серьезные просадки в скорости загрузки. Требуется оптимизация.",
    accessibility: "Доступность",
    bestPractices: "Стандарты безопасности",
    seoEngine: "SEO Оптимизация",
    optimalRange: "Оптимально",
    aiOptCore: "РЕКОМЕНДАЦИИ ИСКУССТВЕННОГО ИНТЕЛЛЕКТА",
    applyFix: "Применить исправление",
    suggestFix: "Нейросеть рекомендует внедрить предварительную загрузку (preload) ключевых медиаресурсов LCP для ускорения загрузки еще на +12%.",
    gainPts: "Ожидаемый прирост: +2.4 балла",
    toastSuccess: "Рекомендация ИИ успешно применена в конфигурации репозитория!",
    lcp: "Largest Contentful Paint (LCP)",
    tbt: "Total Blocking Time (TBT)",
    cls: "Cumulative Layout Shift (CLS)",
    fcp: "First Contentful Paint (FCP)",
    assetWeights: "Соотношение размера ресурсов сайта",
    customDiag: "Рекомендации по точечной оптимизации",
    customDiagDesc: "Персонализированные задачи, созданные с целью улучшить производительность веб-приложения и поднять его в поисковой выдаче.",
    all: "все",
    performance: "скорость",
    bestPracticesLabel: "стандарты",
    seo: "SEO",
    diagnosticCriteria: "СВЯЗАННЫЙ ДИАГНОЗ",
    whyItMatters: "ПОЧЕМУ ЭТО ВАЖНО?",
    estimatedBenefit: "ОЖИДАЕМЫЙ ЭФФЕКТ",
    indexGain: "суммарная прибавка в скорости",
    solutionSnippet: "РЕКОМЕНДУЕМЫЙ ГОТОВЫЙ КОД ОПТИМИЗАЦИИ",
    copySnip: "Копировать",
    copied: "Скопировано!",
    customAssetRecommended: "Рекомендуется подключить раздачу медиаконтента через системы CDN или оптимизировать очереди загрузки.",
    newAuditAction: "Хотите проанализировать другой сайт?",
    newAuditDesc: "Вернитесь на главную страницу, чтобы получить детальный аудит любого другого веб-ресурса бесплатно.",
    backToHome: "Вернуться на главную",
    analyzeAnotherSite: "Анализировать новый сайт"
  }
};
