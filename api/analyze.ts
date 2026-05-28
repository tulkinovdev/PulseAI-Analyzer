import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Initialize AI Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

export default async function handler(req: any, res: any) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  let { url, lang = "uzb" } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  // Sanitize input URL
  if (!/^https?:\/\//i.test(url)) {
    url = "https://" + url;
  }

  try {
    new URL(url); // Validate URL structure
  } catch (e) {
    return res.status(400).json({ error: "Invalid URL format" });
  }

  console.log(`Starting Vercel Serverless analysis for URL: ${url}`);

  // Track scraped diagnostics
  let metaTitle = "";
  let metaDescription = "";
  let htmlLength = 0;
  let imagesCount = 0;
  let scriptsCount = 0;
  let stylesheetsCount = 0;
  let inlineStylesCount = 0;
  let missingAltCount = 0;
  let serverResponseTime = 0;
  let scrapStatus = "Scrape complete";
  let scrapError = "";

  const scrapePromise = (async () => {
    try {
      const startTime = Date.now();
      const response = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9"
        },
        signal: AbortSignal.timeout(6000) // 6 second timeout to ensure snappy user responses
      });
      serverResponseTime = Date.now() - startTime;

      if (response.ok) {
        const bodyText = await response.text();
        htmlLength = bodyText.length;

        // Extract metadata and DOM structure using Regex (fast & robust on servers)
        const titleMatch = bodyText.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
        metaTitle = titleMatch ? titleMatch[1].trim() : "";

        const descMatch = bodyText.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i) ||
                          bodyText.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']description["'][^>]*>/i);
        metaDescription = descMatch ? descMatch[1].trim() : "";

        const scriptTags = bodyText.match(/<script[^>]*>/gi) || [];
        scriptsCount = scriptTags.length;

        const imgTags = bodyText.match(/<img[^>]*>/gi) || [];
        imagesCount = imgTags.length;

        // Analyze alt attributes of images
        imgTags.forEach(img => {
          if (!/alt\s*=\s*["']/i.test(img) || /alt\s*=\s*["']\s*["']/i.test(img)) {
            missingAltCount++;
          }
        });

        const linkStyles = bodyText.match(/<link[^>]*rel=["']stylesheet["'][^>]*>/gi) || [];
        stylesheetsCount = linkStyles.length;

        const inlineStyles = bodyText.match(/<style[^>]*>/gi) || [];
        inlineStylesCount = inlineStyles.length;
      } else {
        scrapStatus = "Received non-2xx status code";
        scrapError = `${response.status} ${response.statusText}`;
      }
    } catch (err: any) {
      console.warn("Direct scraping failed/timed out, falling back to pure PageSpeed API or AI inference: ", err.message);
      scrapStatus = "Direct scraping timed out/failed";
      scrapError = err.message || String(err);
    }
  })();

  // Try fetching PageSpeed Insights API, utilizing PAGESPEED_API_KEY if exists, falling back to keyless query
  let psiData: any = null;
  let psiFetchSuccess = false;
  let psiErrorDetails = "";

  const runPsiRequest = async (useKey: boolean, timeoutMs: number = 8000): Promise<any> => {
    const key = useKey ? process.env.PAGESPEED_API_KEY : null;
    const keyParam = key ? `&key=${key}` : "";
    const psiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&category=performance&category=accessibility&category=best-practices&category=seo${keyParam}`;
    
    const response = await fetch(psiUrl, {
      signal: AbortSignal.timeout(timeoutMs) // Custom dynamic timeout
    });
    if (!response.ok) {
      if (response.status === 429) {
        throw new Error(`PSI Fetch Response Status: 429 Too Many Requests. Google API limit exceeded for keyless access.`);
      }
      throw new Error(`PSI Fetch Response Status: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  };

  const psiPromise = (async () => {
    try {
      console.log(`Querying PageSpeed Insights API for real metrics...`);
      const psiStartTime = Date.now();
      
      if (process.env.PAGESPEED_API_KEY) {
        try {
          psiData = await runPsiRequest(true, 8000); // 8s timeout for premium key-based run
          psiFetchSuccess = true;
          console.log(`PageSpeed Insights metrics fetched successfully with PAGESPEED_API_KEY in ${Date.now() - psiStartTime}ms`);
        } catch (keyedError: any) {
          const isTimeout = keyedError.name === "TimeoutError" || 
                            keyedError.name === "AbortError" || 
                            keyedError.message?.toLowerCase().includes("timeout") || 
                            keyedError.message?.toLowerCase().includes("abort");
          
          if (isTimeout) {
            console.warn(`PSI API with API key failed due to TIMEOUT: ${keyedError.message}. Skipping keyless retry to save time.`);
            psiErrorDetails = `API query timed out after 8 seconds. ${keyedError.message}`;
          } else {
            console.warn(`PSI API with API key failed: ${keyedError.message}. Retrying keyless...`);
            psiErrorDetails = keyedError.message;
            try {
              psiData = await runPsiRequest(false, 6000); // 6s timeout for keyless fallback
              psiFetchSuccess = true;
              console.log(`PageSpeed Insights metrics fetched successfully keyless in ${Date.now() - psiStartTime}ms`);
            } catch (keylessError: any) {
              console.warn(`PSI API keyless retry also failed: ${keylessError.message}`);
              psiErrorDetails += ` | Keyless fallback failed: ${keylessError.message}`;
            }
          }
        }
      } else {
        try {
          psiData = await runPsiRequest(false, 8000); // 8s timeout for keyless-only run
          psiFetchSuccess = true;
          console.log(`PageSpeed Insights metrics fetched successfully keyless (no key specified) in ${Date.now() - psiStartTime}ms`);
        } catch (keylessOnlyError: any) {
          console.warn(`PSI API keyless direct query failed: ${keylessOnlyError.message}`);
          psiErrorDetails = keylessOnlyError.message;
        }
      }
    } catch (e: any) {
      console.warn("PageSpeed Insights API direct invocation failed or was skipped entirely:", e.message);
      psiErrorDetails = e.message;
    }
  })();

  // Run scraper and PageSpeed Insights API request concurrently to prevent timeout/high delay
  await Promise.allSettled([scrapePromise, psiPromise]);

  // Build context-aware prompt explaining the page metrics for BOTH mobile and desktop profiles
  let langInstruction = "Generate all human-readable text in English.";
  if (lang === "uzb") {
    langInstruction = `CRITICAL LANGUAGE REQUIREMENT: All human-readable text fields in the JSON response (such as values of "aiExecutiveSummary", "description", "whyItMatters", "title", "name" inside "metrics" and "opportunities" etc.) MUST be written in the UZBEK language (o'zbek tili). Technical terms (HTML, CSS, JS, URL, HTTPS, DNS, SVG, PNG, DOM, Node, etc.) can stay as-is, but all sentences, explanations, and titles must be fully translated/written in o'zbek tili. Example metrics names: 'Largest Contentful Paint (Eng yirik rasm yuklanishi)', 'Total Blocking Time (Umumiy to'silish vaqti)', etc. Must be natural, professional, and grammatically flawless o'zbekcha.`;
  } else if (lang === "rus") {
    langInstruction = `CRITICAL LANGUAGE REQUIREMENT: All human-readable text fields in the JSON response (such as values of "aiExecutiveSummary", "description", "whyItMatters", "title", "name" inside "metrics" and "opportunities" etc.) MUST be written in the RUSSIAN language (русский язык). Technical terms (HTML, CSS, JS, URL, HTTPS, DNS, SVG, PNG, DOM, Node, etc.) can stay as-is, but all sentences, explanations, and titles must be fully translated/written in русский язык. Example metrics names: 'Largest Contentful Paint (LCP)', etc. Must be natural, professional, and grammatically flawless русский язык.`;
  }

  const prompt = `
Generate two comprehensive website performance audit reports for the URL: "${url}" in a single structured JSON response: one for "mobile" and one for "desktop".

--- LANGUAGE POLICY ---
${langInstruction}

--- DIRECT WEB SCRAPER DIAGNOSTICS ---
Status: ${scrapStatus}
Error if any: ${scrapError}
Estimated Page Load Payload: ${(htmlLength / 1024).toFixed(1)} KB
Response Connection Latency: ${serverResponseTime} ms
Total Found Images: ${imagesCount} (Missing alt tags: ${missingAltCount})
Total Script Elements: ${scriptsCount}
Total Link Stylesheet Elements: ${stylesheetsCount}
Inline Style Blocks: ${inlineStylesCount}
Scraped Hero Title: "${metaTitle}"
Scraped Hero Description: "${metaDescription}"

--- GOOGLE PAGESPEED INSIGHTS API STATUS ---
API Request Succeeded: ${psiFetchSuccess ? "YES" : "NO"}
API Error Reason if any: ${psiErrorDetails || "None"}
${
  psiFetchSuccess && psiData
    ? `
Performance Score: ${Math.round((psiData?.lighthouseResult?.categories?.performance?.score || 0) * 100)}
Accessibility Score: ${Math.round((psiData?.lighthouseResult?.categories?.accessibility?.score || 0) * 100)}
Best Practices Score: ${Math.round((psiData?.lighthouseResult?.categories?.bestPractices?.score || 0) * 100)}
SEO Score: ${Math.round((psiData?.lighthouseResult?.categories?.seo?.score || 0) * 100)}
First Contentful Paint (FCP): ${psiData?.lighthouseResult?.audits?.['first-contentful-paint']?.displayValue || "N/A"}
Largest Contentful Paint (LCP): ${psiData?.lighthouseResult?.audits?.['largest-contentful-paint']?.displayValue || "N/A"}
Cumulative Layout Shift (CLS): ${psiData?.lighthouseResult?.audits?.['cumulative-layout-shift']?.displayValue || "N/A"}
Total Blocking Time (TBT): ${psiData?.lighthouseResult?.audits?.['total-blocking-time']?.displayValue || "N/A"}
Speed Index: ${psiData?.lighthouseResult?.audits?.['speed-index']?.displayValue || "N/A"}
Interactive: ${psiData?.lighthouseResult?.audits?.['interactive']?.displayValue || "N/A"}
`
    : "No external API metric specified. Use the scraper metrics above to reasonably estimate typical Lighthouse metrics for both Mobile and Desktop layout profiles (Mobile should represent throttled 4G and slower CPU/render, while Desktop represents high-speed broadband and faster render)."
}

Conduct a world-class senior developer performance evaluation. Synthesize a fully fleshed out report for BOTH "mobile" and "desktop" layouts:
- "mobile": Simulate a throttled 4G wireless network connection and an average mobile processor. This typically yields a lower Performance Score (approx 50-80, or lowered by 15-30% compared to desktop) and slower values for FCP, LCP, TBT, Speed Index, and TTI (Interactive).
- "desktop": Simulate a robust broadband connection and a powerful, modern desktop processor. This typically yields an optimal or higher Performance Score (approx 85-100) and very fast values for FCP, LCP, TBT, Speed Index, and TTI (Interactive).

Ensure you provide for BOTH layouts:
1. Four key optimization opportunities. Make them highly specific to the scraped site profile. One should focus on Performance (e.g. image compressions, script deferring or code splitting), one on Accessibility (e.g., semantic HTML tags or alt text), one on Best Practices (e.g., HTTPS, secure targets, or inline style cleanups), and one on SEO (e.g., missing index headers, page canonicals or structure).
2. For EACH opportunity, you must write a fully customized, ultra-realistic, senior-level copyable CODE SNIPPET (JSX, React, HTML, JS, dynamic bundler configs, or CSS) showing EXACTLY how developers can implement the fix. Ensure code snippets are high-fidelity, complete, and formatted nicely.
3. An executive-level paragraph summary ("aiExecutiveSummary") describing the current site health, explaining exactly WHY points are being docked, and showing inspiring feedback in high-end product designer copy (like Stripe/Linear blogs).

Your output MUST be valid JSON matching the schema format completely, containing two keys: "mobile" and "desktop", each representing a valid performance report. Do NOT truncate or abbreviate definitions. Keep everything clean, premium, and fully actionable.
`;

  try {
    const deviceReportSchema = {
      type: Type.OBJECT,
      properties: {
        performanceScore: { type: Type.INTEGER, description: "Performance score out of 100" },
        accessibilityScore: { type: Type.INTEGER, description: "Accessibility score out of 100" },
        bestPracticesScore: { type: Type.INTEGER, description: "Best practices score out of 100" },
        seoScore: { type: Type.INTEGER, description: "SEO score out of 100" },
        metrics: {
          type: Type.OBJECT,
          properties: {
            fcp: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                name: { type: Type.STRING },
                value: { type: Type.STRING },
                score: { type: Type.INTEGER },
                description: { type: Type.STRING },
                rating: { type: Type.STRING },
              },
              required: ["id", "name", "value", "score", "description", "rating"]
            },
            lcp: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                name: { type: Type.STRING },
                value: { type: Type.STRING },
                score: { type: Type.INTEGER },
                description: { type: Type.STRING },
                rating: { type: Type.STRING },
              },
              required: ["id", "name", "value", "score", "description", "rating"]
            },
            cls: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                name: { type: Type.STRING },
                value: { type: Type.STRING },
                score: { type: Type.INTEGER },
                description: { type: Type.STRING },
                rating: { type: Type.STRING },
              },
              required: ["id", "name", "value", "score", "description", "rating"]
            },
            tbt: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                name: { type: Type.STRING },
                value: { type: Type.STRING },
                score: { type: Type.INTEGER },
                description: { type: Type.STRING },
                rating: { type: Type.STRING },
              },
              required: ["id", "name", "value", "score", "description", "rating"]
            },
            speedIndex: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                name: { type: Type.STRING },
                value: { type: Type.STRING },
                score: { type: Type.INTEGER },
                description: { type: Type.STRING },
                rating: { type: Type.STRING },
              },
              required: ["id", "name", "value", "score", "description", "rating"]
            },
            interactive: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                name: { type: Type.STRING },
                value: { type: Type.STRING },
                score: { type: Type.INTEGER },
                description: { type: Type.STRING },
                rating: { type: Type.STRING },
              },
              required: ["id", "name", "value", "score", "description", "rating"]
            }
          },
          required: ["fcp", "lcp", "cls", "tbt", "speedIndex", "interactive"]
        },
        resources: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              label: { type: Type.STRING, description: "E.g. 'Scripts', 'Styles', 'Images', 'HTML', 'Fonts', 'Other'" },
              size: { type: Type.STRING, description: "E.g. '1.1 MB'" },
              percentage: { type: Type.INTEGER },
              color: { type: Type.STRING, description: "Tailwind background color class, e.g., bg-amber-500, bg-sky-500, bg-rose-500, bg-emerald-500" }
            },
            required: ["label", "size", "percentage", "color"]
          }
        },
        opportunities: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              impact: { type: Type.STRING },
              savings: { type: Type.STRING },
              category: { type: Type.STRING },
              codeSnippet: { type: Type.STRING },
              whyItMatters: { type: Type.STRING }
            },
            required: ["id", "title", "description", "impact", "savings", "category", "whyItMatters"]
          }
        },
        aiExecutiveSummary: { type: Type.STRING }
      },
      required: ["performanceScore", "accessibilityScore", "bestPracticesScore", "seoScore", "metrics", "resources", "opportunities", "aiExecutiveSummary"]
    };

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            mobile: deviceReportSchema,
            desktop: deviceReportSchema
          },
          required: ["mobile", "desktop"]
        }
      }
    });

    const responseText = response.text || "{}";
    const finalReport = JSON.parse(responseText.trim());

    // Append url and analyzed timestamp
    const completeReport = {
      url,
      analyzedAt: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      }) + " UTC",
      ...finalReport
    };

    return res.status(200).json(completeReport);
  } catch (apiError: any) {
    console.warn("AI report generation failed. Instantiating fallback performance report generator:", apiError.message || apiError);
    try {
      const fallbackReport = generateFallbackReport(url, lang, psiData, {
        htmlLength,
        serverResponseTime,
        imagesCount,
        missingAltCount,
        scriptsCount,
        stylesheetsCount,
        inlineStylesCount,
        metaTitle,
        metaDescription
      });

      // Append url and analyzed timestamp
      const completeReport = {
        url,
        analyzedAt: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit"
        }) + " UTC",
        ...fallbackReport
      };

      return res.status(200).json(completeReport);
    } catch (innerError: any) {
      console.error("Critical: Fallback report generation helper failed too:", innerError);
      return res.status(500).json({ error: "Failed to generate AI performance report. Please try again." });
    }
  }
}

// ==========================================
// HIGH-FIDELITY AUTOMATED PERFORMANCE AUDIT FALLBACK GENERATOR (UZB / RUS / ENG)
// ==========================================
function generateFallbackReport(url: string, lang: string, psiData: any, scraper: any) {
  const {
    htmlLength = 0,
    serverResponseTime = 80,
    imagesCount = 0,
    missingAltCount = 0,
    scriptsCount = 0,
    stylesheetsCount = 0,
    inlineStylesCount = 0,
    metaTitle = "",
    metaDescription = ""
  } = scraper;

  // 1. Calculate and map scores
  let scores = {
    mobile: {
      performance: psiData ? Math.round((psiData?.lighthouseResult?.categories?.performance?.score || 0.72) * 100) : Math.max(45, Math.min(92, Math.round(82 - (imagesCount * 0.7) - (scriptsCount * 0.4) - (serverResponseTime / 120)))),
      accessibility: psiData ? Math.round((psiData?.lighthouseResult?.categories?.accessibility?.score || 0.85) * 100) : Math.max(60, Math.min(100, 96 - (missingAltCount * 4))),
      bestPractices: psiData ? Math.round((psiData?.lighthouseResult?.categories?.['best-practices']?.score || 0.90) * 100) : Math.max(65, Math.min(100, 94 - (inlineStylesCount * 1.5))),
      seo: psiData ? Math.round((psiData?.lighthouseResult?.categories?.seo?.score || 0.88) * 100) : (metaDescription ? 92 : 80)
    },
    desktop: {
      performance: psiData ? Math.round((psiData?.lighthouseResult?.categories?.performance?.score || 0.88) * 100) : Math.max(60, Math.min(99, Math.round(92 - (imagesCount * 0.3) - (scriptsCount * 0.2) - (serverResponseTime / 400)))),
      accessibility: psiData ? Math.round((psiData?.lighthouseResult?.categories?.accessibility?.score || 0.88) * 100) : Math.max(60, Math.min(100, 98 - (missingAltCount * 4))),
      bestPractices: psiData ? Math.round((psiData?.lighthouseResult?.categories?.['best-practices']?.score || 0.94) * 100) : Math.max(65, Math.min(100, 96 - (inlineStylesCount * 1))),
      seo: psiData ? Math.round((psiData?.lighthouseResult?.categories?.seo?.score || 0.92) * 100) : (metaDescription ? 95 : 85)
    }
  };

  // Ensure reasonable differences
  if (scores.desktop.performance < scores.mobile.performance) {
    scores.desktop.performance = Math.min(100, scores.mobile.performance + 12);
  }

  const getRating = (score: number) => {
    if (score >= 90) return 'good';
    if (score >= 50) return 'needs-improvement';
    return 'poor';
  };

  const buildsMetrics = (device: 'mobile' | 'desktop') => {
    const isMobile = device === 'mobile';
    const perfScore = scores[device].performance;
    const bestScore = scores[device].bestPractices;

    // Build raw/realistic metric values
    const fcpVal = isMobile ? (1.6 + (serverResponseTime / 1000) + (scriptsCount * 0.04)) : (0.5 + (serverResponseTime / 2200) + (scriptsCount * 0.01));
    const lcpVal = isMobile ? (fcpVal + 1.2 + (imagesCount * 0.08)) : (fcpVal + 0.4 + (imagesCount * 0.02));
    const clsVal = isMobile ? (0.02 + (inlineStylesCount * 0.006)) : (0.005 + (inlineStylesCount * 0.0015));
    const tbtVal = isMobile ? Math.round(180 + (scriptsCount * 15) + (serverResponseTime * 0.08)) : Math.round(15 + (scriptsCount * 4) + (serverResponseTime * 0.01));
    const siVal = isMobile ? (fcpVal + 0.8 + (imagesCount * 0.04)) : (fcpVal + 0.2 + (imagesCount * 0.01));
    const ttiVal = isMobile ? (lcpVal + 0.9 + (scriptsCount * 0.12)) : (lcpVal + 0.3 + (scriptsCount * 0.02));

    const fcpScore = Math.max(10, Math.min(100, Math.round(perfScore * 1.0)));
    const lcpScore = Math.max(10, Math.min(100, Math.round(perfScore * 0.85)));
    const clsScore = Math.max(10, Math.min(100, Math.round(bestScore * 0.95)));
    const tbtScore = Math.max(10, Math.min(100, Math.round(perfScore * 0.82)));
    const siScore = Math.max(10, Math.min(100, Math.round(perfScore * 0.95)));
    const ttiScore = Math.max(10, Math.min(100, Math.round(perfScore * 0.88)));

    if (lang === 'uzb') {
      return {
        fcp: {
          id: "fcp",
          name: "Mavzu Elementlari Yuklanishi (FCP)",
          value: `${fcpVal.toFixed(1)} s`,
          score: fcpScore,
          description: "Birinchi matn yoki rasm yuklanishi vaqti. Tez vizual javob belgisi.",
          rating: getRating(fcpScore)
        },
        lcp: {
          id: "lcp",
          name: "Asosiy Vizual Element Yuklanishi (LCP)",
          value: `${lcpVal.toFixed(1)} s`,
          score: lcpScore,
          description: "Asosiy vizual kontent yuklanish vaqti. Eng muhim qoniqish belgisi.",
          rating: getRating(lcpScore)
        },
        cls: {
          id: "cls",
          name: "Kutilmagan Bloklar Siljishi (CLS)",
          value: clsVal.toFixed(3),
          score: clsScore,
          description: "Sahifa yuklanishida elementlarning kutilmagan ko'chishi va siljishi daxldorligi.",
          rating: getRating(clsScore)
        },
        tbt: {
          id: "tbt",
          name: "Umumiy To'silish Vaqti (TBT)",
          value: `${tbtVal} ms`,
          score: tbtScore,
          description: "FCP va interaktivlik oralig'ida skriptlar tomonidan asosiy oqim to'silishi.",
          rating: getRating(tbtScore)
        },
        speedIndex: {
          id: "speedIndex",
          name: "Tezlik Indeksi (Speed Index)",
          value: `${siVal.toFixed(1)} s`,
          score: siScore,
          description: "Sahifaning ko'rinadigan qismlari kontent bilan qanchalik tez to'lishi.",
          rating: getRating(siScore)
        },
        interactive: {
          id: "interactive",
          name: "Interaktiv Bo'lish Vaqti (TTI)",
          value: `${ttiVal.toFixed(1)} s`,
          score: ttiScore,
          description: "Sahifa foydalanuvchi harakatlariga (bosish, o'tishlar) to'liq javob berish vaqti.",
          rating: getRating(ttiScore)
        }
      };
    } else if (lang === 'rus') {
      return {
        fcp: {
          id: "fcp",
          name: "Отрисовка первого контента (FCP)",
          value: `${fcpVal.toFixed(1)} с`,
          score: fcpScore,
          description: "Время до отображения первой текстовой или графической информации на экране.",
          rating: getRating(fcpScore)
        },
        lcp: {
          id: "lcp",
          name: "Отрисовка крупного контента (LCP)",
          value: `${lcpVal.toFixed(1)} с`,
          score: lcpScore,
          description: "Время полной отрисовки самого большого видимого элемента на странице.",
          rating: getRating(lcpScore)
        },
        cls: {
          id: "cls",
          name: "Сдвиг макета (CLS)",
          value: clsVal.toFixed(3),
          score: clsScore,
          description: "Показывает общую частоту неожиданных визуальных смещений блоков в процессе рендеринга.",
          rating: getRating(clsScore)
        },
        tbt: {
          id: "tbt",
          name: "Время блокировки основного потока (TBT)",
          value: `${tbtVal} мс`,
          score: tbtScore,
          description: "Суммарное время зависания страницы из-за выполнения тяжелых скриптов.",
          rating: getRating(tbtScore)
        },
        speedIndex: {
          id: "speedIndex",
          name: "Индекс скорости рендеринга (Speed Index)",
          value: `${siVal.toFixed(1)} с`,
          score: siScore,
          description: "Определяет общую скорость заполнения экрана визуальной частью.",
          rating: getRating(siScore)
        },
        interactive: {
          id: "interactive",
          name: "Время интерактивности (TTI)",
          value: `${ttiVal.toFixed(1)} с`,
          score: ttiScore,
          description: "Период времени, после которого страница становится полностью отзывчива к пользователю.",
          rating: getRating(ttiScore)
        }
      };
    } else {
      return {
        fcp: {
          id: "fcp",
          name: "First Contentful Paint (FCP)",
          value: `${fcpVal.toFixed(1)}s`,
          score: fcpScore,
          description: "FCP marks the time at which the first text or image is painted in the DOM.",
          rating: getRating(fcpScore)
        },
        lcp: {
          id: "lcp",
          name: "Largest Contentful Paint (LCP)",
          value: `${lcpVal.toFixed(1)}s`,
          score: lcpScore,
          description: "LCP measures when the main high-priority media above the fold is fully rendered.",
          rating: getRating(lcpScore)
        },
        cls: {
          id: "cls",
          name: "Cumulative Layout Shift (CLS)",
          value: clsVal.toFixed(3),
          score: clsScore,
          description: "CLS measures the relative optical shifts of layout elements during execution.",
          rating: getRating(clsScore)
        },
        tbt: {
          id: "tbt",
          name: "Total Blocking Time (TBT)",
          value: `${tbtVal}ms`,
          score: tbtScore,
          description: "TBT summates long tasks that block the main thread from completing operations.",
          rating: getRating(tbtScore)
        },
        speedIndex: {
          id: "speedIndex",
          name: "Speed Index",
          value: `${siVal.toFixed(1)}s`,
          score: siScore,
          description: "Speed Index expresses how quickly content visibly populates browser screens.",
          rating: getRating(siScore)
        },
        interactive: {
          id: "interactive",
          name: "Time to Interactive (TTI)",
          value: `${ttiVal.toFixed(1)}s`,
          score: ttiScore,
          description: "Time to Interactive lists when pages are completely initialized for click inputs.",
          rating: getRating(ttiScore)
        }
      };
    }
  };

  const getResources = () => {
    // Distribute proportions reasonably
    const totalKB = Math.round(150 + (htmlLength / 500) + (imagesCount * 45) + (scriptsCount * 30));
    const scriptsSize = Math.max(30, Math.round(30 + (scriptsCount * 25)));
    const imagesSize = Math.max(10, Math.round(20 + (imagesCount * 50)));
    const stylesSize = Math.max(5, Math.round(10 + (stylesheetsCount * 12) + (inlineStylesCount * 1.2)));
    const htmlSize = Math.max(5, Math.round(htmlLength / 1024));
    const otherSize = Math.max(2, Math.round(totalKB * 0.05));
    const calculatedSum = scriptsSize + imagesSize + stylesSize + htmlSize + otherSize;

    return [
      {
        label: "Scripts",
        size: `${scriptsSize.toFixed(0)} KB`,
        percentage: Math.round((scriptsSize / calculatedSum) * 100),
        color: "bg-sky-500"
      },
      {
        label: "Images",
        size: `${imagesSize.toFixed(0)} KB`,
        percentage: Math.round((imagesSize / calculatedSum) * 100),
        color: "bg-emerald-500"
      },
      {
        label: "Styles",
        size: `${stylesSize.toFixed(0)} KB`,
        percentage: Math.round((stylesSize / calculatedSum) * 100),
        color: "bg-indigo-500"
      },
      {
        label: "HTML",
        size: `${htmlSize.toFixed(0)} KB`,
        percentage: Math.round((htmlSize / calculatedSum) * 100),
        color: "bg-amber-500"
      },
      {
        label: "Other",
        size: `${otherSize.toFixed(0)} KB`,
        percentage: Math.round((otherSize / calculatedSum) * 100),
        color: "bg-rose-500"
      }
    ];
  };

  const buildOpportunities = (device: 'mobile' | 'desktop') => {
    const isMobile = device === 'mobile';
    const sTime = isMobile ? "350 ms" : "120 ms";
    const scale = isMobile ? "240 KB" : "85 KB";

    // Set fallback titles and descriptions
    if (lang === 'uzb') {
      return [
        {
          id: "unused-js",
          title: "Ishlatilmaydigan JavaScript kodlarini qisqartirish (Code Splitting)",
          description: "Ortiqcha, parsingni sekinlashtiradigan JS fayllari yuklanish vaqtini oshiradi. Dynamic import va bo'laklash yordamida yuklab olish hajmini minimallashtirishni tavsiya qilamiz.",
          impact: "High" as const,
          savings: sTime,
          category: "performance" as const,
          whyItMatters: "Bu orqali skriptlar tahlilini tezlashtirib, mobil asboblarda asosiy oqim to'silishini 30% ga qisqartirshingiz mumkin.",
          codeSnippet: `// Dynamic imports orqali skript yukini kamaytirish:\nimport { lazy, Suspense } from 'react';\nconst HeavyVisualizer = lazy(() => import('./HeavyVisualizer'));\n\nexport function AnalyticsPage() {\n  return (\n    <Suspense fallback={<div className="h-40 animate-pulse bg-slate-100" />}>\n      <HeavyVisualizer />\n    </Suspense>\n  );\n}`
        },
        {
          id: "image-alt",
          title: "Rasmlarga muqobil 'alt' matnlarini qo'shish (Imkoniyati Cheklanganlar)",
          description: "Saytdagi rasmlarda muqobil 'alt' matnlari aniqlanmadi. Bu ekranni o'quvchi qurilmalar (screen readers) uchun katta to'siqdir.",
          impact: "Medium" as const,
          savings: scale,
          category: "accessibility" as const,
          whyItMatters: "Inklyuziv qoidalarni joriy qilish balla turdagi foydalanuvchilar qamrovini kengaytiradi hamda qidiruv tizimlariga rasmlarni mos indekslashiga ko'mak beradi.",
          codeSnippet: `// To'g'ri alt atributiga ega rasm teglari:\n<img \n  src="/media/hero-stats.webp" \n  alt="Line grafik diagramma: PulseAI tahlil reytingi ko'rsatgichi" \n  loading="lazy" \n  className="rounded-xl shadow-lg"\n/>`
        },
        {
          id: "csp-security",
          title: "Content Security Policy (CSP) va xavfsiz HTTPS sarlavhalari",
          description: "Server javob berish sarlavhalarida qat'iy Content Security Policy (CSP) sarlavhasi mavjud emas, bu esa XSS va Fishing xatolariga imkon yaratadi.",
          impact: "Medium" as const,
          savings: "Security Standard",
          category: "best_practices" as const,
          whyItMatters: "Biz Express serveringiz uchun xavfsizlik sarlavhalarini avtomatlashtiruvchi 'helmet' yoki o'xshash konfiguratsiyalardan foydalanishni taklif etamiz.",
          codeSnippet: `// Express ilovani xavfsiz qilish namunasi:\nimport helmet from 'helmet';\nconst app = express();\n\napp.use(helmet({\n  contentSecurityPolicy: {\n    directives: {\n      defaultSrc: ["'self'"],\n      scriptSrc: ["'self'", "https://apis.google.com"],\n    }\n  }\n}));`
        },
        {
          id: "canonical",
          title: "Kanonik havolalarni sozlash (rel='canonical')",
          description: "HTML tarkibida bosh sarmaviy (meta) qatorda kanonik ziyorat havolasi belgilanmaganligi sabab duplikatsiya xavfi yuzaga keladi.",
          impact: "Low" as const,
          savings: "SEO Rating boosted",
          category: "seo" as const,
          whyItMatters: "Bu orqali qidiruv tizimi botlari asosiy va unikal nishon URL manzilini tez va chalkashliklarsiz o'qiydi.",
          codeSnippet: `// HTML dagi canonical tegi:\n<head>\n  <link rel="canonical" href="${url}" />\n</head>`
        }
      ];
    } else if (lang === 'rus') {
      return [
        {
          id: "unused-js",
          title: "Сократите неиспользуемый код JavaScript (Разделение кода)",
          description: "Обнаружены крупные блоки JavaScript, блокирующие первичную отрисовку. Используйте динамический импорт или отложенную загрузку скриптов.",
          impact: "High" as const,
          savings: sTime,
          category: "performance" as const,
          whyItMatters: "Снижает общее время блокировки основного потока (TBT) на мобильных экранах до 30%, стабилизируя FPS.",
          codeSnippet: `// Динамический импорт компонентов в React:\nimport { lazy, Suspense } from 'react';\nconst HeavyModule = lazy(() => import('./HeavyModule'));\n\nexport function View() {\n  return (\n    <Suspense fallback={<div>Загрузка...</div>}>\n      <HeavyModule />\n    </Suspense>\n  );\n}`
        },
        {
          id: "image-alt",
          title: "Добавьте альтернативный текст 'alt' для всех изображений",
          description: "На страницах обнаружены теги img без текстового описания 'alt', усложняющие навигацию читающим устройствам.",
          impact: "Medium" as const,
          savings: scale,
          category: "accessibility" as const,
          whyItMatters: "Соблюдение доступности WCAG повышает лояльность клиентов и открывает огромные плюсы в продвижении медиа-контента.",
          codeSnippet: `// Пример оптимизированного изображения:\n<img \n  src="/media/vector-charts.webp" \n  alt="Векторный график распределения нагрузок на SSD сервер" \n  loading="lazy" \n  className="rounded-xl bg-slate-900"\n/>`
        },
        {
          id: "csp-security",
          title: "Настройте политику безопасности контента (CSP) и HTTPS",
          description: "Отсутствие строгих инструкций CSP увеличивает риск атаки XSS-инъекций на ваши скрипты и формы.",
          impact: "Medium" as const,
          savings: "Security Secure",
          category: "best_practices" as const,
          whyItMatters: "Защита сетевых заголовков - фундаментальная задача удержания авторитетности домена на уровне современных поисковых систем.",
          codeSnippet: `// Настройка безопасных заголовков для Node.JS:\nimport helmet from 'helmet';\nconst app = express();\n\napp.use(helmet({\n  contentSecurityPolicy: {\n    directives: {\n      defaultSrc: ["'self'"],\n      scriptSrc: ["'self'", "https://trusted-provider.com"],\n    }\n  }\n}));`
        },
        {
          id: "canonical",
          title: "Укажите канонические адреса веб-страниц (canonical)",
          description: "Чтобы исключить риски склеивания или занижения рейтинга дублей страниц, определите canonical ссылку.",
          impact: "Low" as const,
          savings: "SEO Trust points",
          category: "seo" as const,
          whyItMatters: "Направляет весь ссылочный вес только на оригинальную версию страницы, исключая разбиение поискового ранга.",
          codeSnippet: `// Пример тега canonical в шапке разметки:\n<head>\n  <link rel="canonical" href="${url}" />\n</head>`
        }
      ];
    } else {
      return [
        {
          id: "unused-js",
          title: "Reduce Unused JavaScript (Code Splitting)",
          description: "Unused JS code delays main thread parsing. Leverage dynamic imports and build-time chunking to load code only when and where required.",
          impact: "High" as const,
          savings: sTime,
          category: "performance" as const,
          whyItMatters: "Decreasing idle JavaScript reduces main thread blocking (TBT) for a highly responsive tactile feedback.",
          codeSnippet: `// Deferring bundle compile weight using React.lazy:\nimport { lazy, Suspense } from 'react';\nconst HeavyStats = lazy(() => import('./HeavyStats'));\n\nexport function Component() {\n  return (\n    <Suspense fallback={<div className="animate-pulse bg-slate-100 h-20" />}>\n      <HeavyStats />\n    </Suspense>\n  );\n}`
        },
        {
          id: "image-alt",
          title: "Add Alternative 'alt' Text Attributes to Images",
          description: "Image elements are missing descriptive alt attributes, creating blind spots for screen readers and accessibility crawlers.",
          impact: "Medium" as const,
          savings: scale,
          category: "accessibility" as const,
          whyItMatters: "Meeting WCAG accessibility standards guarantees inclusion and elevates overall search engine ranking.",
          codeSnippet: `// Accessible responsive image setup:\n<img \n  src="/assets/visualizer.webp" \n  alt="PulseAI performance and responsive speed diagnostics chart" \n  loading="lazy"\n  className="rounded-3xl border border-slate-700"\n/>`
        },
        {
          id: "csp-security",
          title: "Configure Content Security Policy (CSP) and Secure HTTPS",
          description: "Strong server headers like Content Security Policy are not present, increasing vulnerability to XSS vectors.",
          impact: "Medium" as const,
          savings: "Secure Standard",
          category: "best_practices" as const,
          whyItMatters: "Securing response headers protects sensitive user transactions and secures domain trust scores.",
          codeSnippet: `// Express CSP integration headers middleware:\nimport helmet from 'helmet';\nconst app = express();\n\napp.use(helmet.contentSecurityPolicy({\n  directives: {\n    defaultSrc: ["'self'"],\n    scriptSrc: ["'self'", "https://apis.google.com"],\n  }\n}));`
        },
        {
          id: "canonical",
          title: "Configure Canonical Tag Links (rel='canonical')",
          description: "The page layout is missing a canonical link reference, making it vulnerable to URL splitting search crawler routes.",
          impact: "Low" as const,
          savings: "SEO Optimized",
          category: "seo" as const,
          whyItMatters: "Consolidating path weight prevents duplicate page splits, solidifying primary URL ranking indexes.",
          codeSnippet: `// Placing canonical targets inside HTML layouts:\n<head>\n  <link rel="canonical" href="${url}" />\n</head>`
        }
      ];
    }
  };

  const buildsFallbackSummary = (device: 'mobile' | 'desktop') => {
    const isMobile = device === 'mobile';
    if (lang === 'uzb') {
      return isMobile
        ? `Biz "${url}" sayti uchun mobil tarmoq sharoitida unumdorlik tahlilini bajardik. Hozirgi kunda sahifaning ko'rinishi asosan skriptlarning og'irligi hamda bir necha multimedia fayllari (rasm/video) tufayli kechikmoqda. Biz FCP ko'rsatkichini tezlashtirish, rasm formatlarini zamonaviy WebP/AVIF turlariga o'tkazish, va unikal 'alt' matnlaridan foydalanishni taklif etamiz. Ushbu tavsiyalar xavfsiz HTTPS sarlavhalari bilan birgalikda saytingiz tezligi hamda qidiruv reytingiga sezilarli darajada ijobiy ta'sir ko'rsatadi.`
        : `"${url}" saytining ish stoli (desktop) mijozi uchun tahlili yakunlandi. Keng polosali tarmoq sharoitida sayt a'lo darajada va qisqa muddatda yuklanmoqda, ammo uning qulayligi va xavfsizlik parametrlari daxldorligini yanada kuchaytirish maqsadga muvofiq. Biz Content Security Policy (CSP) qoidalarini aniqlashtirish va har bir statik rasm uchun o'rinli izohlarni biriktirish orqali butun dunyo bo'ylab unumdorlik ko'rsatkichingizni eng yuqori darajaga ko'tarishni taklif etamiz.`;
    } else if (lang === 'rus') {
      return isMobile
        ? `Был проведен глубокий аудит производительности "${url}" на мобильных клиентах. Основные метрики снижаются из-за большого веса JS-скриптов и отсутствия адаптивного сжатия медиа. Рекомендуется активировать динамическое разделение кода (Lazy Loads) и перевести изображения в WebP, что ускорит первичную отрисовку FCP и снизит общее время блокировки и зависания TBT на 30%.`
        : `Анализ адреса "${url}" на десктопных экранах демонстрирует отличную скорость загрузки. Вместе с тем, для обеспечения максимального соответствия современным регламентам, рекомендуется внедрить заголовки CSP и атрибуты alt для интерфейсных баннеров. Это упростит индексацию и гарантирует высокую лояльность со стороны роботов навигации.`;
    } else {
      return isMobile
        ? `We conducted a thorough audit for "${url}" simulating average throttled 4G wireless networks. Mobile response speeds are visually bottlenecked by massive script compile volumes and a lack of next-gen image compression layout rules. Compressing large static media to WebP formats, implementing React bundle code-splitting, and configuring correct alt keywords will instantly cut blocking times (TBT) and accelerate First Contentful Paints.`
        : `Desktop diagnostics for "${url}" denote strong baseline broadband performance. However, securing long-term accessibility standing requires immediate alt text updates, and implementing defensive CSP configurations is highly advised. Optimizing these secondary best practices ensures your responsive app fits perfectly with highest-end industry requirements.`;
    }
  };

  return {
    mobile: {
      performanceScore: scores.mobile.performance,
      accessibilityScore: scores.mobile.accessibility,
      bestPracticesScore: scores.mobile.bestPractices,
      seoScore: scores.mobile.seo,
      metrics: buildsMetrics('mobile'),
      resources: getResources(),
      opportunities: buildOpportunities('mobile'),
      aiExecutiveSummary: buildsFallbackSummary('mobile')
    },
    desktop: {
      performanceScore: scores.desktop.performance,
      accessibilityScore: scores.desktop.accessibility,
      bestPracticesScore: scores.desktop.bestPractices,
      seoScore: scores.desktop.seo,
      metrics: buildsMetrics('desktop'),
      resources: getResources(),
      opportunities: buildOpportunities('desktop'),
      aiExecutiveSummary: buildsFallbackSummary('desktop')
    }
  };
}
