import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Globe, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  XOctagon, 
  Sparkles, 
  Activity, 
  Share2, 
  Copy, 
  Download, 
  Cpu, 
  ShieldCheck, 
  Code, 
  ChevronRight, 
  ChevronDown, 
  ExternalLink,
  Laptop,
  Smartphone,
  Terminal,
  Send,
  RefreshCw
} from "lucide-react";
import { AnimatedMetric } from "./AnimatedMetric";
import { DualDeviceReport, PerformanceReport, Opportunities } from "../types";
import { i18n, Language } from "../i18n";

interface ReportViewProps {
  report: DualDeviceReport;
  onReset: () => void;
  lang?: Language;
}

export function ReportView({ report, onReset, lang = 'uzb' }: ReportViewProps) {
  const [activeDevice, setActiveDevice] = useState<'mobile' | 'desktop'>('mobile');
  const [activeTab, setActiveTab] = useState<'all' | 'performance' | 'accessibility' | 'best_practices' | 'seo'>('all');
  const [expandedOpportunity, setExpandedOpportunity] = useState<string | null>(null);
  const [copiedOppId, setCopiedOppId] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isApplyingFix, setIsApplyingFix] = useState(false);
  const [appliedFixSuccessfully, setAppliedFixSuccessfully] = useState(false);

  // States for our interactive AI Speed Consultation Terminal Sandbox
  const [counsellorQuery, setCounsellorQuery] = useState("");
  const [counsellorTyping, setCounsellorTyping] = useState(false);
  const [counsellorAnswer, setCounsellorAnswer] = useState<string | null>(null);
  const [counsellorCode, setCounsellorCode] = useState<string | null>(null);
  const [activePresetId, setActivePresetId] = useState<string | null>(null);
  const [copiedConsoleCode, setCopiedConsoleCode] = useState(false);

  const t = i18n[lang];

  // Real-time translation helper for known static strings generated in demo/default audits
  const translateDynamicText = (text: string) => {
    if (!text) return "";
    const clean = text.trim();

    // 1. Executive Summary fallback translation
    if (clean.includes("BuildCraft Pro delivers") || clean.includes("outstanding performance on desktop layouts")) {
      if (lang === 'uzb') {
        return "BuildCraft Pro desktop versiyalarida mukammal unumdorlikni taqdim etadi – uning umumiy reytingi 98% ni tashkil qiladi. Zamonaviy tezkor ulanishlarda yuklanish 1 soniyadan kamroq vaqt ichida va hech qanday vizual siljishlarsiz (0.0 CLS) yakunlanadi. Kichik kamchiliklar resurslar bilan emas, balki tizim tuzilishi bilan bog'liq: to'liq ARIA parametrlarini joriy etish, Content Security Policy'ni kuchaytirish hamda mahalliy JSON-LD sxema ma'lumotlarini qidiruv tizimlari uchun joylash. Ushbu o'zgarishlar veb-sayt xavfsizligini ta'minlaydi, imkoniyati cheklanganlar uchun qulaylikni oshiradi hamda SEO tizimida yuqori natijalar beradi.";
      }
      if (lang === 'rus') {
        return "BuildCraft Pro обеспечивает выдающуюся производительность на десктопных экранах с элитным показателем в 98%. Поскольку современные высокоскоростные десктопные соединения не испытывают задержек, отрисовка завершается менее чем за одну секунду с идеальной стабильностью макета (0.0 CLS). Небольшие недоработки носят структурный, а не ресурсный характер: внедрение полных атрибутов ARIA, усиление политики безопасности контента (CSP) и добавление микроразметки JSON-LD для локального бизнеса. Реализация этих улучшений повысит безопасность, гарантирует соответствие стандартам доступности и максимизирует видимость в SEO.";
      }
      return text;
    }

    // 2. Diagnostic Criteria fallback translation
    if (clean.includes("While no physical static images") || clean.includes("While no physical static images were detected")) {
      if (lang === 'uzb') {
        return "Yuklash davrida hech qanday statik rasmlar topilmagan bo'lsa-da, maxsus SVG grafikalari yoki kelajakdagi orqa fon bannerlari konteynerlarining o'lchamlarini zamonaviy usullar yordamida optimallashtirish talab qilinadi.";
      }
      if (lang === 'rus') {
        return "Хотя во время загрузки не было обнаружено физических статических изображений, встроенная встроенная SVG-графика или будущие фоновые баннеры требуют оптимизации размеров контейнеров с использованием современных методов.";
      }
      return text;
    }

    return text;
  };

  // Real-time opportunity localizer dictionary mapping
  const localizeOpportunity = (opp: Opportunities) => {
    const title = String(opp.title || "").toLowerCase();
    const desc = String(opp.description || "").toLowerCase();
    const why = String(opp.whyItMatters || "").toLowerCase();
    const id = String(opp.id || "").toLowerCase();

    let res = {
      title: opp.title,
      description: opp.description,
      whyItMatters: opp.whyItMatters
    };

    // 1. Unused JS / Code Splitting / Defer / Script
    if (
      title.includes("unused") || 
      desc.includes("unused") || 
      title.includes("splitting") || 
      title.includes("defer") || 
      id.includes("unused") || 
      id.includes("script") ||
      id.includes("js")
    ) {
      if (lang === 'uzb') {
        res.title = "Ishlatilmaydigan JavaScript kodlarini qisqartirish (Code Splitting)";
        res.description = "Ishlatilmaydigan JS fayllari yuklanish vaqtini sekinlashtiradi. Dynamic import va Code Splitting yordamida faqat kerakli sahifadagi kodlarni yuklashni tavsiya qilamiz.";
        res.whyItMatters = "Bu orqali siz sahifaning interaktiv bo'lish vaqtini (TBT - Total Blocking Time) 30% gacha kamaytirasiz.";
      } else if (lang === 'rus') {
        res.title = "Сократите неиспользуемый код JavaScript (Разделение кода)";
        res.description = "Неиспользуемые JS-скрипты увеличивают время загрузки страницы. Мы рекомендуем динамический импорт и разделение кода, чтобы загружать JS только для нужного экрана.";
        res.whyItMatters = "Это снизит общее время блокировки основного потока (TBT) до 30%, улучшая отзывчивость интерфейса.";
      } else {
        res.title = "Reduce Unused JavaScript (Code Splitting)";
        res.description = "Unused JS code delays parsing and rendering. Leverage dynamic imports and build-time chunking to load code only when and where required.";
        res.whyItMatters = "Decreasing idle JavaScript reduces main thread blocking (TBT) up to 30% for a highly interactive experience.";
      }
    }
    // 2. Properly size / compression / next-gen images / webp / preload / lcp / images
    else if (
      title.includes("image") || 
      desc.includes("image") || 
      id.includes("image") || 
      id.includes("lcp") ||
      title.includes("size") ||
      title.includes("webp")
    ) {
      if (lang === 'uzb') {
        res.title = "Rasmlarni zamonaviy formatlarda siqish va optimallashtirish (WebP/AVIF)";
        res.description = "Katta hajmli PNG/JPG rasmlar mobil tarmoqlarda trafikni oshiradi va LCP ko'rsatkichini pasaytiradi. Ularni siqish va WebP/AVIF formatlariga o'tkazish zarur.";
        res.whyItMatters = "LCP resurslarini optimallashtirish foydalanuvchi sahifaga kirgandagi birinchi vizual taassurotni sezilarli darajada yaxshilaydi.";
      } else if (lang === 'rus') {
        res.title = "Оптимизируйте и сожмите изображения в современные форматы (WebP/AVIF)";
        res.description = "Тяжелые файлы PNG/JPG замедляют загрузку LCP элементов на мобильных экранах. Преобразуйте их в WebP или AVIF и настройте адаптивный размер.";
        res.whyItMatters = "Оптимальный запуск крупных изображений моментально сократит визуальную задержку и повысит оценку скорости.";
      } else {
        res.title = "Optimize and Compress Images into Next-Gen Formats (WebP/AVIF)";
        res.description = "Bulky legacy formats like PNG and JPEG degrade LCP performance. Encode images into modern formats like WebP or AVIF and configure fluid dimensions.";
        res.whyItMatters = "Optimizing large above-the-fold media ensures visual components are rendered instantly, securing an optimal LCP metric.";
      }
    }
    // 3. Image Alt tag attributes
    else if (
      title.includes("alt") || 
      desc.includes("alt") || 
      id.includes("alt")
    ) {
      if (lang === 'uzb') {
        res.title = "Rasmlarga muqobil 'alt' matnlarini qo'shish (Imkoniyati Cheklanganlar)";
        res.description = "Rasmlarda muqobil alt matnlarining yo'qligi ekranni o'qish qurilmalariga (screen readers) ega foydalanuvchilar va qidiruv tizimlari (SEO) uchun to'siq yaratadi.";
        res.whyItMatters = "Inklyuziv qoidalarga rioya qilish sayt foydalanuvchilar qamrovini kengaytirib, kirish hamda foydalanish qulayligini oshiradi.";
      } else if (lang === 'rus') {
        res.title = "Добавьте альтернативный текст 'alt' для всех изображений";
        res.description = "Отсутствие описательного атрибута 'alt' мешает работе экранных дикторов для пользователей с нарушениями зрения и снижает индексацию изображений поисковиками.";
        res.whyItMatters = "Соблюдением стандартов доступности (WCAG) расширяет вашу аудиторию и дает ощутимый плюс в поисковом ранжировании.";
      } else {
        res.title = "Add Alternative 'alt' Text Attributes to Images";
        res.description = "Image elements missing descriptive alt attributes create critical accessibility gaps for screen reader users and prevent precise search engine indexing.";
        res.whyItMatters = "Meeting WCAG accessibility standards guarantees inclusion and elevates overall image SEO ranking index.";
      }
    }
    // 4. Contrast ratios
    else if (
      title.includes("contrast") || 
      desc.includes("contrast") || 
      id.includes("contrast")
    ) {
      if (lang === 'uzb') {
        res.title = "Matn va fon ranglarining kontrast nisbatini oshirish";
        res.description = "Shrift rangi va fon rangi o'rtasidagi past kontrast ba'zi foydalanuvchilar uchun matnlarni o'qishni juda qiyinlashtiradi. WCAG standartlariga ko'ra, minimal kontrast 4.5:1 bo'lishi kerak.";
        res.whyItMatters = "Matn ranglarini yaxshilash saytning o'qilishi va barcha yoshdagi foydalanuvchilar uchun qulayligini kafolatlaydi.";
      } else if (lang === 'rus') {
        res.title = "Повысьте коэффициент контрастности текста и его фонда";
        res.description = "Слишком блеклые или светлые шрифты на светлом фоне вызывают сильную нагрузку для глаз. Минимальное соотношение контраста по правилам WCAG должно быть не менее 4.5:1.";
        res.whyItMatters = "Оптимальная контрастность гарантирует, что каждый посетитель сможет беспрепятственно прочесть интерфейсные элементы.";
      } else {
        res.title = "Improve Text and Background Color Contrast Ratios";
        res.description = "Low color contrast ratio between text elements and background layers severely hinders readability. Strive for WCAG AA standard of 4.5:1 for normal-sized fonts.";
        res.whyItMatters = "High contrasting typography maintains clean optical legibility for diverse displays and age groups alike.";
      }
    }
    // 5. ARIA landmarks / semantic
    else if (
      title.includes("aria") || 
      desc.includes("aria") || 
      title.includes("semantic") || 
      desc.includes("semantic") || 
      id.includes("aria")
    ) {
      if (lang === 'uzb') {
        res.title = "ARIA parametrlari va semantik elementlarni joriy etish";
        res.description = "Semantik HTML elementlaridan (main, nav, header, footer, article) etarlicha foydalanilmasa, ekran o'qiydigan dasturlar sahifaning tuzilishini to'g'ri tushuna olmaydi.";
        res.whyItMatters = "Tizimli semantika saytni mukammal darajada qulay va dasturiy jihatdan tushunarli qiladi.";
      } else if (lang === 'rus') {
        res.title = "Внедрите атрибуты ARIA и семантическую разметку HTML";
        res.description = "Использование несемантических контейнеров (div) вместо ориентиров (main, nav, section) усложняет чтение структуры дерева документа роботами-помощниками.";
        res.whyItMatters = "Грамотная семантическая разметка гарантирует чистое понимание контента любыми парсерами и браузерами.";
      } else {
        res.title = "Implement ARIA Landmarks and Semantic HTML Elements";
        res.description = "Excessive use of non-semantic div containers wraps critical zones, making pages hard to map. Incorporate modern landmarks (main, nav, article) for clear structural layout.";
        res.whyItMatters = "A descriptive HTML scheme renders seamlessly and is fully parsable by assistive tools.";
      }
    }
    // 6. HTTPS & Security headers (CSP) & SSL
    else if (
      title.includes("https") || 
      desc.includes("https") || 
      title.includes("csp") || 
      desc.includes("csp") || 
      title.includes("security") || 
      id.includes("csp") || 
      id.includes("https") ||
      id.includes("security")
    ) {
      if (lang === 'uzb') {
        res.title = "Content Security Policy (CSP) va xavfsiz HTTPS ulanish";
        res.description = "Xavfsiz ulanish (HTTPS) foydalanuvchi ma'lumotlarini himoya qiladi. CSS/JS xatolarini hamda fishing xavfini kamaytirish uchun to'g'ri CSP sozlash zarur.";
        res.whyItMatters = "Zamonaviy brauzerlar xavfsiz bo'lmagan saytlarga kirishda ogohlantirish ko'rsatib, foydalanuvchilarni qaytaradi.";
      } else if (lang === 'rus') {
        res.title = "Настройте политику безопасности контента (CSP) и HTTPS";
        res.description = "HTTPS шифрует конфиденциальные данные, а строгие заголовки CSP защищают ваши скрипты от XSS-угроз, подделок и скрытых iframe-инъекций.";
        res.whyItMatters = "Усиленная безопасность строит полное доверие со стороны современных поисковиков и исключает красные плашки в браузере.";
      } else {
        res.title = "Configure Content Security Policy (CSP) and Secure HTTPS";
        res.description = "Enforcing HTTPS standardizes end-to-end data encryption. Configuring robust CSP rules blocks critical cross-site scripting (XSS) injection paths.";
        res.whyItMatters = "Securing application headers is vital for domain trust indexes and SEO authoritative weight.";
      }
    }
    // 7. Inline styles
    else if (
      title.includes("inline") || 
      desc.includes("inline") || 
      title.includes("style") || 
      id.includes("inline")
    ) {
      if (lang === 'uzb') {
        res.title = "Inline CSS stillaridan qochish va tashqi faylga o'tkazish";
        res.description = "Inline stillar (style='...') HTML hajmini oshiradi va keshlash samaradorligini tushiradi. Barcha stillarni Tailwind yoki tashqi CSS fayllariga o'tkazish kerak.";
        res.whyItMatters = "Bu orqali sahifa kodi tozalanadi va rendering jarayoni bir necha millisoniyaga tezlashadi.";
      } else if (lang === 'rus') {
        res.title = "Избегайте встроенных (inline) стилей CSS";
        res.description = "Внедрение стилей напрямую (style='...') раздувает вес HTML-документа и ломает политику кэширования в браузере. Вынесите стили во внешние таблицы или классы Tailwind.";
        res.whyItMatters = "Чистый HTML-код быстрее парсится и поддается мгновенному рендерингу с экономией трафика.";
      } else {
        res.title = "Remove Inline CSS Styles and Move to Stylesheets";
        res.description = "Inline styles directly inside HTML nodes increase file sizes and disrupt browser caching performance. Extract styles to utility-first classes (Tailwind) or external sheets.";
        res.whyItMatters = "Removing inlined formatting styles cleans up DOM trees, making HTML files highly parsable and cacheable.";
      }
    }
    // 8. Meta tags / seo
    else if (
      title.includes("meta") || 
      desc.includes("meta") || 
      title.includes("seo") || 
      id.includes("seo") || 
      id.includes("meta")
    ) {
      if (lang === 'uzb') {
        res.title = "Meta sarlavhalar va tavsiflarni sozlash";
        res.description = "Meta description va sarlavhalar etishmasligi sahifangizni qidiruv natijalarida past ko'rinishiga yoki noto'g'ri formatda indekslanishiga sabab bo'ladi.";
        res.whyItMatters = "Tegishli meta-tavsiflar saytning qidiruv tizimidagi bosuvchanlik nisbatini (CTR) maksimal darajaga ko'tarib beradi.";
      } else if (lang === 'rus') {
        res.title = "Оптимизируйте метаописания и теги заголовков (SEO)";
        res.description = "Отсутствие корректных метатегов или meta-description снижает общую видимость сайта в результатах поиска (SERPs) и лишает вас релевантного трафика.";
        res.whyItMatters = "Информативные сниппеты многократно повышают кликабельность (CTR) в органическом поиске и улучшают позиции.";
      } else {
        res.title = "Optimize Meta Descriptions and Title Tags";
        res.description = "Missing or poorly configured meta descriptions and title elements hurt search engine rankings and lower click-through performance on social media platforms.";
        res.whyItMatters = "Engaging, high-contrast snippets drive organic traffic directly to your web presence.";
      }
    }
    // 9. Robots/Sitemap
    else if (
      title.includes("robots") || 
      desc.includes("robots") || 
      title.includes("sitemap") || 
      id.includes("robots") || 
      id.includes("sitemap")
    ) {
      if (lang === 'uzb') {
        res.title = "robots.txt va XML Sitemap fayllarini sozlash";
        res.description = "Sitemap va robots.txt qidiruv tizimi botlariga saytni to'g'ri indekslash va qaysi sahifalarni ko'rib chiqish kerakligini ko'rsatishda yordam beradi.";
        res.whyItMatters = "Tahrirlangan robots.txt sayt resurslarini tejaydi va botlar faolligini boshqaradi.";
      } else if (lang === 'rus') {
        res.title = "Настройте файлы robots.txt и XML-карту сайта (Sitemap)";
        res.description = "Данные файлы направляют индексирующих ботов (Googlebot) по оптимальным маршрутам, гарантируя сканирование важных разделов вовремя.";
        res.whyItMatters = "Сбалансированное индексирование защищает сервер от избыточных запросов ботов.";
      } else {
        res.title = "Configure robots.txt and XML Sitemap Files";
        res.description = "Sitemaps and robots.txt files act as directories for search crawlers, helping them dynamically index critical landing zones without wasting crawling budget.";
        res.whyItMatters = "Proper scanning routes prevent backend overload and keep index registers fully fresh.";
      }
    }
    // 10. Canonical
    else if (
      title.includes("canonical") || 
      desc.includes("canonical") || 
      id.includes("canonical")
    ) {
      if (lang === 'uzb') {
        res.title = "Kanonik (canonical) havolalarni sozlash";
        res.description = "Kanonik havolalar (canonical tags) takroriy sahifalar bo'lganda asosiy nishon sahifasini qidiruv botlariga ko'rsatib beradi.";
        res.whyItMatters = "Duplikat sahifalarning qidiruv reytingiga salbiy ta'sir ko'rsatishini oldini oladi.";
      } else if (lang === 'rus') {
        res.title = "Настройте канонические ссылки (rel='canonical')";
        res.description = "Теги canonical указывают поисковым роботам, какая из копий страниц является главной для ранжирования, убирая дублирующийся контент.";
        res.whyItMatters = "Это собирает ссылочный вес со всех дублей на одну главную страницу, максимизируя SEO.";
      } else {
        res.title = "Configure Canonical Tag Links (rel='canonical')";
        res.description = "Canonical links help search engines distinguish original content from repetitive sub-pages, avoiding penalties for duplicated structures.";
        res.whyItMatters = "Consolidating path weight prevents duplicate page splits, solidifying primary URL SEO auth scores.";
      }
    }

    return res;
  };

  // Presets of speed optimization advices
  const counsellorPresets = lang === 'uzb' ? [
    { id: "cdn", title: "Cache & CDN ko'rsatmalari", query: "Qanday qilib keshlash (Cache-Control) va CDN orqali yuklanishni tezlashtirish mumkin?" },
    { id: "image", title: "React rasmlarini Lazy-load qilish", query: "React da Next-Gen formatdagi rasmlar va Lazy Loading uchun eng yaxshi komponent qanday bo'ladi?" },
    { id: "tbt", title: "JS va TBT ni qisqartirish", query: "JavaScript kodi sekin ishlayotganda TBT va Blocking Time unumdorligini qanday oshirish mumkin?" }
  ] : lang === 'rus' ? [
    { id: "cdn", title: "Кэширование & CDN", query: "Как ускорить загрузку с помощью кэширования (Cache-Control) и CDN?" },
    { id: "image", title: "React Lazy-loading картинок", query: "Как создать идеальный компонент в React для картинок нового поколения с Lazy Loading?" },
    { id: "tbt", title: "Снижение TBT и Bloat JS", query: "Как уменьшить TBT и время блокировки основного потока при тяжелом JS?" }
  ] : [
    { id: "cdn", title: "Cache & CDN Integration", query: "How can I accelerate assets delivery using HTTP caching and CDN configurations?" },
    { id: "image", title: "React Lazy Load Images", query: "What is the ideal modern React image component for Next-Gen images and Lazy-loading?" },
    { id: "tbt", title: "Reduce TBT & Bloat JS", query: "How can I mitigate thread blocking and reduce Total Blocking Time (TBT) caused by heavy JS?" }
  ];

  const handleConsultSubmit = (queryText: string, presetId: string | null = null) => {
    if (!queryText.trim()) return;
    setCounsellorTyping(true);
    setActivePresetId(presetId);
    setCounsellorAnswer(null);
    setCounsellorCode(null);

    // Simulate real-time streaming calculation
    setTimeout(() => {
      setCounsellorTyping(false);
      
      const cleanQ = queryText.toLowerCase();
      let answer = "";
      let code = "";

      if (cleanQ.includes("cache") || cleanQ.includes("cdn") || cleanQ.includes("kesh") || cleanQ.includes("кэш")) {
        if (lang === 'uzb') {
          answer = "Cache-Control sarlavhalari serverga har safar kirmasdan statik resurslarni brauzerdan olishni buyuradi. Cloudflare yoki boshqa CDN esa yuklanishni butun jahon bo'ylab unumli tezlashtiradi.";
          code = `// Nginx Cache-Control konfiguratsiyasi:\nlocation ~* \\.(?:ico|css|js|gif|jpe?g|png|svg|webp|woff2?)$ {\n  expires 365d;\n  add_header Cache-Control "public, no-transform, immutable";\n}`;
        } else if (lang === 'rus') {
          answer = "Заголовки Cache-Control указывают браузеру временно хранить статические файлы локально. CDN кэширует медиафайлы глобально, многократно снижая время загрузки (TTFB).";
          code = `// Настройка кэширования для Nginx:\nlocation ~* \\.(?:ico|css|js|gif|jpe?g|png|svg|webp|woff2?)$ {\n  expires 365d;\n  add_header Cache-Control "public, no-transform, immutable";\n}`;
        } else {
          answer = "The Cache-Control header directs clients to store assets locally. Adding a Content Delivery Network edge-caches media files closer to global clients to reduce latencies.";
          code = `// High-performance Nginx assets distribution config:\nlocation ~* \\.(?:ico|css|js|gif|jpe?g|png|svg|webp|woff2?)$ {\n  expires 365d;\n  add_header Cache-Control "public, no-transform, immutable";\n}`;
        }
      } else if (cleanQ.includes("react") || cleanQ.includes("image") || cleanQ.includes("lazy") || cleanQ.includes("rasm") || cleanQ.includes("картин")) {
        if (lang === 'uzb') {
          answer = "Ushbu zamonaviy React komponent rasm o'lchamlarini oldindan ajratadi (aspect-ratio), lezy yuklanishni va rasm to'liq chiqquncha xira fonni ta'minlab, CLS va kechikishlarni 0 ga tenglashtiradi.";
          code = `import { useState } from 'react';\n\nexport function NativeAdaptiveImage({ src, alt, width, height }) {\n  const [isLoaded, setIsLoaded] = useState(false);\n  return (\n    <div className="bg-slate-250/80 animate-pulse relative" style={{ aspectRatio: width / height }}>\n      <img\n        src={src}\n        alt={alt}\n        loading="lazy"\n        decoding="async"\n        onLoad={() => setIsLoaded(true)}\n        className={\`transition-opacity duration-300 \${isLoaded ? 'opacity-100' : 'opacity-0'}\`}\n      />\n    </div>\n  );\n}`;
        } else if (lang === 'rus') {
          answer = "Для React адаптивный контейнер с фиксированными пропорциями (aspect-ratio), ленивой загрузкой и плавным переходом гарантирует отсутствие сдвигов макета (CLS) и снижает нагрузку.";
          code = `import { useState } from 'react';\n\nexport function NativeAdaptiveImage({ src, alt, width, height }) {\n  const [isLoaded, setIsLoaded] = useState(false);\n  return (\n    <div className="bg-slate-250/80 relative" style={{ aspectRatio: width / height }}>\n      <img\n        src={src}\n        alt={alt}\n        loading="lazy"\n        onLoad={() => setIsLoaded(true)}\n        className={\`transition-opacity duration-300 \${isLoaded ? 'opacity-100' : 'opacity-0'}\`}\n      />\n    </div>\n  );\n}`;
        } else {
          answer = "An optimal React image loads lazily, decodes asynchronously, and sits inside a dynamic aspect-ratio container to completely block page jumps (CLS) during load.";
          code = `import { useState } from 'react';\n\nexport function NativeAdaptiveImage({ src, alt, width, height }) {\n  const [isLoaded, setIsLoaded] = useState(false);\n  return (\n    <div className="bg-slate-250/80 relative" style={{ aspectRatio: width / height }}>\n      <img\n        src={src}\n        alt={alt}\n        loading="lazy"\n        onLoad={() => setIsLoaded(true)}\n        className={\`transition-opacity duration-300 \${isLoaded ? 'opacity-100' : 'opacity-0'}\`}\n      />\n    </div>\n  );\n}`;
        }
      } else if (cleanQ.includes("tbt") || cleanQ.includes("blocking") || cleanQ.includes("js") || cleanQ.includes("bloat") || cleanQ.includes("oqim") || cleanQ.includes("поток")) {
        if (lang === 'uzb') {
          answer = "Total Blocking Time (TBT) ko'rsatkichini pasaytirish uchun og'ir sahifa qismlarini faqat ekran yaqinlashganda import qiling (React Lazy/Suspense) yoki JS yuklanishini kechiktiring (defer).";
          code = `// React dynamic imports for reducing initial scripts footprint:\nimport { lazy, Suspense } from 'react';\nconst HeavyVisualizer = lazy(() => import('./HeavyVisualizer'));\n\nexport function AnalyticsPage() {\n  return (\n    <Suspense fallback={<div className="h-40 animate-pulse bg-slate-100" />}>\n      <HeavyVisualizer />\n    </Suspense>\n  );\n}`;
        } else if (lang === 'rus') {
          answer = "Для снижения TBT делите сборки на части (dynamic imports) и используйте Suspense в React, чтобы не блокировать основной поток критически длинными вычислениями.";
          code = `// Динамический импорт в React сборках:\nimport { lazy, Suspense } from 'react';\nconst HeavyModule = lazy(() => import('./HeavyModule'));\n\nexport function View() {\n  return (\n    <Suspense fallback={<div>Загрузка...</div>}>\n      <HeavyModule />\n    </Suspense>\n  );\n}`;
        } else {
          answer = "Mitigate Total Blocking Time (TBT) by implementing runtime code-splitting with dynamic imports and Suspense boundaries inside your framework core structures.";
          code = `// Deferring bundle compile weight using React.lazy:\nimport { lazy, Suspense } from 'react';\nconst HeavyStats = lazy(() => import('./HeavyStats'));\n\nexport function Component() {\n  return (\n    <Suspense fallback={<div className="animate-pulse bg-slate-100 h-20" />}>\n      <HeavyStats />\n    </Suspense>\n  );\n}`;
        }
      } else {
        if (lang === 'uzb') {
          answer = `Sayt tezligini optimal diapazonda saqlash uchun server darajasida Brotli yokib Gzip siqishni ishlating, o'lchovli rasmlardan foydalanish hamda keraksiz NPM kutubxonalaridan qochish kerak.`;
          code = `// Sayt optimallashtirish parametrlari:\nconst siteOptimizationRules = {\n  compression: 'brotli',\n  minifyAssets: true,\n  cacheHeaders: true\n};`;
        } else if (lang === 'rus') {
          answer = `Для лучшего результата используйте сжатие Brotli/Gzip с сервера, оптимизируйте форматы изображений и удаляйте неиспользуемые npm зависимости.`;
          code = `// Конфигурация сжатия:\nconst siteOptimizationRules = {\n  compression: 'brotli',\n  minifyAssets: true,\n  cacheHeaders: true\n};`;
        } else {
          answer = `Ensure to serve all static assets fully bundled, compress with Brotli, defer non-critical modules, and sizing image bounds to eliminate responsive layouts shifts.`;
          code = `// Speed settings config:\nconst siteOptimizationRules = {\n  compression: 'brotli',\n  minifyAssets: true,\n  cacheHeaders: true\n};`;
        }
      }

      setCounsellorAnswer(answer);
      setCounsellorCode(code);
    }, 1200);
  };

  // Read performance report belonging to active device profile (mobile vs desktop)
  const activeReport = report[activeDevice] || report.mobile;

  // Filter opportunities based on active category, normalizing hyphens & underscores
  const filteredOpps = activeReport.opportunities.filter(opp => {
    if (activeTab === 'all') return true;
    const oppCat = String(opp.category || '').toLowerCase().trim();
    const tabCat = String(activeTab).toLowerCase().replace(/[-_]/g, '').trim();

    const cleanOpp = oppCat.replace(/[-_\s]/g, '').replace(/s$/, '');
    const cleanTab = tabCat.replace(/s$/, '');

    return cleanOpp.includes(cleanTab) || cleanTab.includes(cleanOpp) || oppCat.includes(tabCat);
  });

  // Calculate high, medium, low counts
  const highImpactCount = activeReport.opportunities.filter(o => o.impact === 'High').length;
  const medImpactCount = activeReport.opportunities.filter(o => o.impact === 'Medium').length;

  const handleCopyCode = (snippet: string, id: string) => {
    navigator.clipboard.writeText(snippet);
    setCopiedOppId(id);
    setTimeout(() => setCopiedOppId(null), 2000);
  };

  const handleShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleDownloadReport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `audit-report-${report.url.replace(/https?:\/\//i, '').replace(/[^a-z0-9]/gi, '-')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Get color and bg based on rating
  const getRatingMeta = (rating: any) => {
    const norm = String(rating || 'good').toLowerCase().replace('_', '-');
    if (norm === 'good' || norm === 'optimal' || norm === 'excellent') {
      return {
        text: 'text-emerald-600 dark:text-emerald-400',
        bg: 'bg-emerald-500/10',
        badge: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20',
        bullet: 'bg-emerald-500',
        icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />
      };
    }
    if (norm === 'needs-improvement' || norm === 'needs_improvement' || norm === 'average' || norm === 'warning') {
      return {
        text: 'text-amber-600 dark:text-amber-400',
        bg: 'bg-amber-500/10',
        badge: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20',
        bullet: 'bg-amber-500',
        icon: <AlertTriangle className="h-4 w-4 text-amber-500" />
      };
    }
    return {
      text: 'text-red-500 dark:text-red-400',
      bg: 'bg-red-500/10',
      badge: 'bg-red-500/10 text-red-700 dark:text-red-300 border-red-500/20',
      bullet: 'bg-red-500',
      icon: <XOctagon className="h-4 w-4 text-red-500" />
    };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full max-w-5xl"
    >
      {/* Floating Success Toast */}
      <AnimatePresence>
        {appliedFixSuccessfully && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 rounded-xl border border-emerald-500/20 bg-[#090D16] p-4 text-xs text-white shadow-2xl backdrop-blur-md"
          >
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            <div className="font-sans font-medium">
              {t.toastSuccess || "Optimization fix applied and verified successfully!"}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. Header Actions Panel (Space Between on Tablet & Large Screens) */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between w-full">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white/50 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/50">
            <Globe className="h-5 w-5 text-emerald-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[9px] font-bold text-slate-400 dark:text-slate-500 tracking-wider">
                {t.targetHost || "TARGET HOST"}
              </span>
              <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                {t.secureSsl || "SECURE SSL"}
              </span>
            </div>
            <h2 className="font-display text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5 break-all">
              {report.url}
              <a href={report.url} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300">
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </h2>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Restart Button */}
          <button
            id="report-reanalyze-button"
            onClick={onReset}
            className="rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-600 shadow-sm transition-all hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer"
          >
            {t.reAnalyze || "Re-Analyze"}
          </button>

          {/* Copy Share Link */}
          <button
            id="report-share-button"
            onClick={handleShareLink}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-600 shadow-sm transition-all hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer"
          >
            <Share2 className="h-3.5 w-3.5" />
            {copiedLink ? (t.linkCopied || "Link Copied!") : (t.shareReport || "Share Report")}
          </button>

          {/* Download JSON Audit */}
          <button
            id="report-download-button"
            onClick={handleDownloadReport}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3.5 py-1.5 text-xs font-medium text-white shadow-sm transition-all hover:bg-emerald-600 active:scale-97 cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            {t.downloadAudit || "Download Audit"}
          </button>
        </div>
      </div>

      {/* Device Toggle Selector Switch on Main Layout */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center bg-white/40 dark:bg-slate-900/10 p-4 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl">
        <div className="flex items-center gap-2">
          <Cpu className="h-4.5 w-4.5 text-emerald-500 animate-pulse" />
          <span className="font-display text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-tight">
            {t.deviceScope || "Scope tahlili:"}
          </span>
        </div>
        
        <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm dark:border-slate-850 dark:bg-slate-900/80">
          <button
            id="device-toggle-mobile"
            onClick={() => setActiveDevice('mobile')}
            className={`flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-xs font-bold transition-all cursor-pointer ${
              activeDevice === 'mobile'
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-xs"
                : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            <Smartphone className="h-3.5 w-3.5" />
            <span>{t.mobile4g || "Mobile (Simulated 4G)"}</span>
          </button>
          <button
            id="device-toggle-desktop"
            onClick={() => setActiveDevice('desktop')}
            className={`flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-xs font-bold transition-all cursor-pointer ${
              activeDevice === 'desktop'
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-xs"
                : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            <Laptop className="h-3.5 w-3.5" />
            <span>{t.desktopScope || "Desktop Scope"}</span>
          </button>
        </div>
      </div>

      {/* 2. Main Diagnostic Dashboard (Themed Mac Window) */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/60 shadow-xl backdrop-blur-lg transition-all duration-300 dark:border-slate-800/80 dark:bg-slate-900/40">
        {/* Mirror Tool Window Controls */}
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-800">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-red-400/80" />
            <span className="h-3 w-3 rounded-full bg-yellow-400/80" />
            <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
            <span className="ml-2 font-mono text-[9px] text-slate-400 dark:text-slate-500 tracking-wider font-bold uppercase">
              {t.auditGenCore || "AUDIT GENERATOR CORE"} ({activeDevice.toUpperCase()})
            </span>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-[9.5px] font-medium text-slate-400 dark:text-slate-500">
            <Clock className="h-3 w-3" />
            {report.analyzedAt}
          </div>
        </div>

        <div className="p-6">
          {/* Top 4 Premium Score Cards in one continuous row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 mb-8 rounded-2xl border border-slate-200 bg-slate-50/50 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/30">
            <AnimatedMetric 
              score={activeReport.performanceScore} 
              label={t.perfScore || "Performance"} 
              size="sm" 
              subtext={activeReport.performanceScore >= 90 ? "Optimal Speed" : "Needs Optimization"}
            />
            <AnimatedMetric 
              score={activeReport.accessibilityScore} 
              label={t.accessibility || "Accessibility"} 
              size="sm"
              subtext="Compliant"
            />
            <AnimatedMetric 
              score={activeReport.bestPracticesScore} 
              label={t.bestPractices || "Best Practices"} 
              size="sm"
              subtext="Secure"
            />
            <AnimatedMetric 
              score={activeReport.seoScore} 
              label={t.seoEngine || "SEO Score"} 
              size="sm"
              subtext="Discoverable"
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-12">
            
            {/* Left Column (Column 1): 2x2 Clean Timing Metrics Grid */}
            <div className="lg:col-span-6 flex flex-col justify-between">
              <div className="grid gap-4 sm:grid-cols-2 h-full">
                {[
                  { id: "lcp", name: t.lcp, value: activeReport?.metrics?.lcp?.value || "N/A", rating: activeReport?.metrics?.lcp?.rating || "poor" },
                  { id: "tbt", name: t.tbt, value: activeReport?.metrics?.tbt?.value || "N/A", rating: activeReport?.metrics?.tbt?.rating || "poor" },
                  { id: "cls", name: t.cls, value: activeReport?.metrics?.cls?.value || "N/A", rating: activeReport?.metrics?.cls?.rating || "good" },
                  { id: "fcp", name: t.fcp, value: activeReport?.metrics?.fcp?.value || "N/A", rating: activeReport?.metrics?.fcp?.rating || "poor" }
                ].map((metric) => {
                  const meta = getRatingMeta(metric.rating);
                  return (
                    <div 
                      key={metric.id}
                      className="bg-white border border-slate-200/80 rounded-2xl p-5 flex flex-col justify-between shadow-xs transition hover:border-slate-350 dark:bg-slate-900/30 dark:border-slate-800/85"
                    >
                      <div>
                        <div className="text-[9.5px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold font-mono">
                          {metric.name}
                        </div>
                        <div className="text-2xl font-extrabold text-slate-950 mt-2 dark:text-white">
                          {metric.value}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs mt-3.5">
                        <span className={`w-2 h-2 rounded-full ${meta.bullet}`} />
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-[11px] capitalize">
                          {metric.rating === 'good' ? (t.optimalRange || "Optimal Range") : metric.rating.replace("-", " ")}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column (Column 2): AI Dev Consultant Sandbox Chat Console */}
            <div className="lg:col-span-6 flex flex-col justify-between">
              
              <div className="bg-[#0c0d12] border border-slate-800 text-slate-100 rounded-3xl p-6 flex flex-col justify-between h-full dark:bg-slate-950 dark:border dark:border-slate-800/80 transition-all max-h-[460px] overflow-hidden">
                <div>
                  {/* Top terminal tab bar */}
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                    <div className="flex items-center gap-2">
                      <Terminal className="h-4 w-4 text-emerald-500" />
                      <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 font-bold">
                        {lang === 'uzb' ? "AI MUSTAQIL MASLAHAT TERMINALI" : lang === 'rus' ? "ТЕРМИНАЛ AI КОНСУЛЬТАЦИЙ" : "AI EXPERT CONSULTATION CONSOLE"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-red-500/80" />
                      <span className="h-2 w-2 rounded-full bg-amber-500/80" />
                      <span className="h-2 w-2 rounded-full bg-emerald-500/80" />
                    </div>
                  </div>

                  {/* Dynamic advice messaging flow */}
                  <div className="space-y-3.5 overflow-y-auto max-h-[260px] pr-1 scrollbar-thin scrollbar-thumb-slate-850">
                    <AnimatePresence mode="wait">
                      {!counsellorAnswer && !counsellorTyping ? (
                        <motion.div
                          key="home"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="space-y-3"
                        >
                          <p className="font-sans text-xs text-slate-300 leading-relaxed font-normal">
                            {lang === 'uzb' ? (
                              <>Salom! Men sizning PulseAI unumdorlik bo'yicha shaxsiy konsultantman. Saytingizni yanada tezkor, interaktiv (<strong>TBT</strong>) va barqaror (<strong>CLS</strong>) qilish sirlarini bilish uchun quyidagi mavzulardan birini bosing yoki tepadagi yoki quyidagi qutiga o'z savolingizni yozing:</>
                            ) : lang === 'rus' ? (
                              <>Привет! Я ваш эксперт-консультант по веб-разработке. Нажмите одну из тем ниже или введите свой вопрос вручную, чтобы получить подробный анализ, пошаговые инструкции и элитные примеры кода для ускорения сайта:</>
                            ) : (
                              <>Welcome! I am your deep analytics speed assistant. Click any preset below or write your custom code questions to receive step-by-step developer advice with fully copyable senior-level optimization snippets:</>
                            )}
                          </p>

                          {/* Quick Preset Buttons Grid */}
                          <div className="space-y-2 pt-1.5">
                            {counsellorPresets.map((ps) => (
                              <button
                                key={ps.id}
                                onClick={() => handleConsultSubmit(ps.query, ps.id)}
                                className="w-full flex items-center justify-between text-left px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-850 hover:border-slate-700 font-mono text-[10.5px] text-slate-300 hover:text-white transition cursor-pointer"
                              >
                                <span className="truncate">{ps.title}</span>
                                <ChevronRight className="h-3 w-3 shrink-0 text-slate-500" />
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      ) : counsellorTyping ? (
                        <motion.div
                          key="typing"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="py-10 flex flex-col items-center justify-center text-center space-y-3"
                        >
                          <RefreshCw className="h-6 w-6 text-emerald-500 animate-spin" />
                          <p className="font-mono text-[10.5px] text-slate-400">
                            {lang === 'uzb' ? "OPTIMALLASH KO'RSATMALARI SHAKLLANMOQDA..." : lang === 'rus' ? "ПОДГОТОВКА СТАТИСТИКИ И РЕШЕНИЙ..." : "COMPUTING OPTIMIZATION REMEDIES..."}
                          </p>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="answer"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="space-y-3.5"
                        >
                          <div className="flex items-center justify-between bg-slate-900/40 p-2 rounded-lg border border-slate-800/60">
                            <span className="font-sans font-bold text-xs text-slate-200">
                              {counsellorPresets.find(p => p.id === activePresetId)?.title || (lang === 'uzb' ? "Sizning Savolingiz" : lang === 'rus' ? "Ваш вопрос" : "Your Custom Query")}
                            </span>
                            <button
                              onClick={() => { setCounsellorAnswer(null); setCounsellorCode(null); }}
                              className="text-[9.5px] font-mono text-emerald-500 hover:text-emerald-400 font-bold transition cursor-pointer hover:underline"
                            >
                              ← {lang === 'uzb' ? "Qaytish" : lang === 'rus' ? "Назад" : "Reset Terminal"}
                            </button>
                          </div>

                          <p className="font-sans text-xs text-slate-300 leading-relaxed">
                            {counsellorAnswer}
                          </p>

                          {counsellorCode && (
                            <div className="rounded-xl border border-slate-800 bg-[#06070a]/90 p-3 relative overflow-hidden">
                              <div className="flex items-center justify-between border-b border-slate-850 pb-2 mb-2">
                                <span className="font-mono text-[9px] text-slate-500 font-bold uppercase">CODE REMEDY</span>
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(counsellorCode);
                                    setCopiedConsoleCode(true);
                                    setTimeout(() => setCopiedConsoleCode(false), 2000);
                                  }}
                                  className="text-[9.5px] font-mono text-[#10B981] hover:text-[#34D399] font-bold cursor-pointer transition flex items-center gap-1"
                                >
                                  {copiedConsoleCode ? (lang === 'uzb' ? 'Nusxalandi!' : lang === 'rus' ? 'Скопировано!' : 'Copied!') : (lang === 'uzb' ? 'Nusxalash' : lang === 'rus' ? 'Копировать' : 'Copy Code')}
                                </button>
                              </div>
                              <pre className="text-[10px] font-mono text-slate-350 overflow-x-auto select-all max-h-[110px] whitespace-pre p-1 scrollbar-none">
                                {counsellorCode}
                              </pre>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Input action bar */}
                <div className="mt-4 border-t border-slate-800 pt-3 flex items-center gap-2 shrink-0">
                  <input
                    type="text"
                    value={counsellorQuery}
                    onChange={(e) => setCounsellorQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleConsultSubmit(counsellorQuery);
                        setCounsellorQuery("");
                      }
                    }}
                    placeholder={lang === 'uzb' ? "Sertifikatlar, Brotli yoki boshqalar..." : lang === 'rus' ? "Запрос по сжатию, кэшированию..." : "Ask speed tip (Compression, SSL...)"}
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 font-sans text-xs font-normal text-slate-100 placeholder:text-slate-600 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/25 transition"
                  />
                  <button
                    disabled={!counsellorQuery.trim()}
                    onClick={() => {
                      handleConsultSubmit(counsellorQuery);
                      setCounsellorQuery("");
                    }}
                    className="bg-white text-slate-950 p-2.5 rounded-xl transition cursor-pointer hover:bg-slate-100 active:scale-95 disabled:opacity-40 disabled:scale-100"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Lower Asset detail breakdown list */}
        <div className="p-6 border-t border-slate-100 dark:border-slate-800/85">
          <h3 className="flex items-center gap-2 font-display text-sm font-bold text-slate-800 dark:text-slate-100 tracking-tight mb-3">
            <Laptop className="h-4 w-4 text-emerald-500" />
            {t.assetWeights || "Asset Allocation Weights"}
          </h3>
          
          {/* Weighted horizontal stack bar chart */}
          <div className="overflow-hidden rounded-full border border-slate-100 bg-slate-100 p-0.5 dark:border-slate-800 dark:bg-slate-955/40">
            <div className="flex h-3.5 overflow-hidden rounded-full">
              {activeReport.resources.map((resItem, i) => (
                <div
                  key={i}
                  className={`${resItem.color} h-full transition-all duration-500`}
                  style={{ width: `${resItem.percentage}%` }}
                  title={`${resItem.label}: ${resItem.size} (${resItem.percentage}%)`}
                />
              ))}
            </div>
          </div>

          {/* Asset Labels Grid - 100% Mobile Responsive to eliminate overlapping labels and values */}
          <div className="mt-4 grid grid-cols-1 min-[420px]:grid-cols-2 lg:grid-cols-4 gap-y-3 gap-x-6">
            {activeReport.resources.map((resItem, i) => (
              <div key={i} className="flex flex-row items-center justify-between gap-1.5 border-b border-slate-150/40 pb-1.5 text-xs dark:border-slate-800/20">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${resItem.color}`} />
                  <span className="font-sans font-medium text-slate-600 dark:text-slate-400 truncate">
                    {resItem.label}
                  </span>
                </div>
                <div className="flex items-center gap-1 font-mono shrink-0">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{resItem.size}</span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">({resItem.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 3. Opportunities & Actionable Code Fixes (Expandable List Cards) */}
      <div className="mt-10">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-display text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-500" />
              {t.customDiag || "Custom Optimization Diagnostics"}
            </h3>
            <p className="mt-0.5 font-sans text-xs text-slate-400 dark:text-slate-500">
              {t.customDiagDesc || "Personalized action tasks synthesized to optimize critical performance and structure indexes. Expand each item for full senior-level code answers."}
            </p>
          </div>

          {/* Tab Filter Pill Groups */}
          <div className="inline-flex flex-wrap items-center gap-1 rounded-xl border border-slate-200 bg-white/50 p-1 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/50">
            {['all', 'performance', 'accessibility', 'best_practices', 'seo'].map((tab) => {
              const label = tab === 'all' ? (t.all || 'All')
                : tab === 'performance' ? (t.performance || 'Performance')
                : tab === 'accessibility' ? (t.accessibility || 'Accessibility')
                : tab === 'best_practices' ? (t.bestPractices || 'Best Practices')
                : (t.seo || 'SEO');

              return (
                <button
                  key={tab}
                  id={`tab-filter-${tab}`}
                  onClick={() => setActiveTab(tab as any)}
                  className={`rounded-lg px-2.5 py-1 text-[10px] font-bold capitalize transition-all cursor-pointer ${
                    activeTab === tab
                      ? "bg-slate-900 text-white dark:bg-white dark:text-slate-950"
                      : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Opportunity Rows */}
        <div className="space-y-3.5">
          <AnimatePresence mode="popLayout">
            {filteredOpps.map((opp, idx) => {
              const isOpen = expandedOpportunity === opp.id;
              const isCopied = copiedOppId === opp.id;
              
              // Localize all text fields inside opp recursively
              const localizedOpp = localizeOpportunity(opp);

              // Map Impact Colors
              const getImpactColor = (impact: 'High' | 'Medium' | 'Low') => {
                switch(impact) {
                  case 'High': return 'bg-red-500/10 text-red-500 border-red-500/20';
                  case 'Medium': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
                  case 'Low': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
                  default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
                }
              };

              // Map Category Labels and Styles
              const getCategoryMeta = (cat: string) => {
                const norm = String(cat).toLowerCase().replace(/[-_]/g, '');
                if (norm === 'performance') return t.performance || 'PERFORMANCE';
                if (norm === 'accessibility') return t.accessibility || 'ACCESSIBILITY';
                if (norm === 'bestpractices') return t.bestPractices || 'BEST PRACTICES';
                if (norm === 'seo') return t.seo || 'SEO';
                return cat.toUpperCase();
              };

              return (
                <motion.div
                  key={opp.id}
                  layout="position"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, delay: idx * 0.05 }}
                  className="overflow-hidden rounded-xl border border-slate-200 bg-white/50 backdrop-blur-lg transition-all hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/30 dark:hover:border-slate-700 w-full"
                >
                  {/* Summary row trigger bar */}
                  <button
                    id={`opportunity-trigger-${opp.id}`}
                    onClick={() => setExpandedOpportunity(isOpen ? null : opp.id)}
                    className="flex w-full items-start justify-between p-4 text-left sm:items-center cursor-pointer"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center min-w-0 flex-1 mr-2">
                      <div className="flex items-center gap-2 font-mono shrink-0">
                        {isOpen ? <ChevronDown className="h-4 w-4 text-slate-400 animate-none" /> : <ChevronRight className="h-4 w-4 text-slate-400 animate-none" />}
                        <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase">
                          {getCategoryMeta(opp.category)}
                        </span>
                      </div>
                      <h4 className="font-display text-sm font-bold text-slate-800 dark:text-slate-100 tracking-tight truncate min-w-0">
                        {localizedOpp.title}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`rounded-xl border px-2.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider ${getImpactColor(opp.impact as any)}`}>
                        {opp.impact} Impact
                      </span>
                      <span className="hidden rounded-lg bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-semibold text-slate-600 dark:bg-slate-850 dark:text-slate-300 sm:inline-block">
                        -{opp.savings} Est.
                      </span>
                    </div>
                  </button>

                  {/* Expandable details content drawer */}
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="border-t border-slate-100 px-4 pb-4.5 pt-3.5 dark:border-slate-800/80 w-full overflow-hidden"
                    >
                      {/* Responsive columns layout, adding min-w-0 and break-words to avoid clipped text and layout distortion on mobile */}
                      <div className="grid gap-6 lg:grid-cols-12 w-full overflow-hidden">
                        {/* Summary details rationale */}
                        <div className="lg:col-span-4 min-w-0 w-full">
                          <h5 className="font-mono text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                            {t.diagnosticCriteria || "DIAGNOSTIC CRITERIA"}
                          </h5>
                          <p className="mt-1.5 font-sans text-xs text-slate-600 dark:text-slate-355 leading-relaxed font-normal break-words">
                            {translateDynamicText(localizedOpp.description)}
                          </p>

                          <h5 className="mt-4 font-mono text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                            {t.whyItMatters || "WHY THIS MATTERS"}
                          </h5>
                          <p className="mt-1.5 font-sans text-xs text-slate-500 dark:text-slate-400 leading-relaxed italic pr-2 font-light break-words">
                            {localizedOpp.whyItMatters}
                          </p>

                          <div className="mt-5 rounded-lg bg-emerald-500/5 border border-emerald-500/10 p-3">
                            <span className="font-mono text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase block tracking-wider">
                              {t.estimatedBenefit || "ESTIMATED SCORE BENEFIT"}
                            </span>
                            <span className="font-sans text-xs font-semibold text-slate-700 dark:text-slate-300 block mt-1">
                              Up to <strong className="font-bold text-emerald-600 dark:text-emerald-400">+{opp.savings.includes("ms") ? "12%" : "9%"}</strong> {t.indexGain || "total index gain"}
                            </span>
                          </div>
                        </div>

                        {/* Executable Code fixer block (Enclosed, scrollable box preventing right expansion of the page) */}
                        <div className="lg:col-span-8 min-w-0 w-full overflow-hidden">
                          {opp.codeSnippet ? (
                            <div className="flex flex-col rounded-xl border border-slate-200 dark:border-slate-850 bg-[#0B0F19] text-slate-300 shadow-md w-full overflow-hidden">
                              {/* Code bar container */}
                              <div className="flex items-center justify-between border-b border-slate-800 bg-[#090C15] px-4 py-2 text-xs">
                                <div className="flex items-center gap-2 font-mono text-[10px] font-semibold text-slate-500 tracking-wider min-w-0">
                                  <Code className="h-3.5 w-3.5 shrink-0" />
                                  <span className="truncate">{t.solutionSnippet || "INDUSTRY SOLUTION SNIPPET"}</span>
                                </div>
                                <button
                                  id={`copy-snippet-button-${opp.id}`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCopyCode(opp.codeSnippet!, opp.id);
                                  }}
                                  className="flex items-center gap-1.5 text-[10px] text-slate-400 hover:text-white border border-slate-700/60 bg-slate-800/40 px-2.5 py-1 rounded cursor-pointer transition-all active:scale-95 shrink-0 ml-2"
                                >
                                  {isCopied ? (
                                    <span className="text-emerald-400 font-bold">&#10003; {t.copied || "Copied!"}</span>
                                  ) : (
                                    <>
                                      <Copy className="h-3 w-3" />
                                      <span>{t.copySnip || "Copy Snip"}</span>
                                    </>
                                  )}
                                </button>
                              </div>

                              {/* Horizontal scrollbar with standard wrap/scroll logic, completely eliminating right margin clip */}
                              <div className="w-full overflow-x-auto max-h-[350px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent bg-[#0B0F19] p-4 text-slate-200 font-mono text-[11px] leading-relaxed rounded-b-xl select-all">
                                <pre className="whitespace-pre overflow-x-auto select-all font-mono">
                                  <code>{opp.codeSnippet}</code>
                                </pre>
                              </div>
                            </div>
                          ) : (
                            <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/40 p-6 dark:border-slate-800 dark:bg-slate-950/25">
                              <span className="font-sans text-xs text-slate-400 dark:text-slate-500 text-center">
                                {t.customAssetRecommended || "Custom asset configuration fix recommended. Implement structural CDN or routing layers to resolve."}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* 4. Final localized call-to-action bottom reset panel in pure localized translations */}
      <div className="mt-14 rounded-3xl border border-dashed border-slate-350/80 bg-white/45 p-8 text-center dark:border-slate-800/80 dark:bg-slate-900/15">
        <Activity className="mx-auto h-7 w-7 text-emerald-500 animate-pulse" />
        <h3 className="mt-4 font-display text-base font-bold text-slate-800 dark:text-slate-100">
          {t.newAuditAction || "Yangi Saytni Tahlil Qilishni Xohlaysizmi?"}
        </h3>
        <p className="mx-auto mt-2 max-w-md font-sans text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-light">
          {t.newAuditDesc || "Bosh sahifaga qaytib istalgan boshqa sayt unumdorligini, Core Web Vitals ko'rsatkichlarini va Gemini AI aqlli tavsiyalarini tahlil qilishingiz mumkin."}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            id="bottom-quick-reset"
            onClick={onReset}
            className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-6 py-2.5 text-xs font-extrabold text-white shadow-md hover:bg-slate-800 active:scale-97 dark:bg-white dark:text-slate-950 transition-all cursor-pointer"
          >
            <span>{t.backToHome || "Bosh Sahifaga Qaytish"}</span>
          </button>
          <button
            id="bottom-quick-analyze-new"
            onClick={onReset}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-6 py-2.5 text-xs font-extrabold text-slate-700 hover:bg-slate-50 active:scale-97 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition-all cursor-pointer"
          >
            <span>{t.analyzeAnotherSite || "Yangi saytni analiz qilish"}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
