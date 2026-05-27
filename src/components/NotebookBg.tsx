import { motion } from "motion/react";

interface NotebookBgProps {
  isDark: boolean;
}

export function NotebookBg({ isDark }: NotebookBgProps) {
  // Array of elegant math and web-performance engineering labels to scatter beautifully
  const formulaItems = [
    { text: "FCP = ∫₀ᵀ λ(t)dt ≤ 1.2s", top: "12%", left: "8%" },
    { text: "LCP = max(A_element) ≤ 2.5s", top: "25%", left: "75%" },
    { text: "CLS_score = ∑ (w · d²)", top: "18%", left: "45%" },
    { text: "O(log N + d_RTT)", top: "60%", left: "5%" },
    { text: "FID(t) = R_server - T_input", top: "45%", left: "85%" },
    { text: "TBT = ∫ (t - 50ms) dt", top: "82%", left: "55%" },
    { text: "η_perf = ∑ w_i · s_i", top: "72%", left: "12%" },
    { text: "Δv = v_final - v_first", top: "88%", left: "80%" },
  ];

  return (
    <div className="pointer-events-none fixed inset-0 -z-50 overflow-hidden bg-[#f8f7f4] transition-colors duration-500 dark:bg-[#0A0B0D]">
      {/* 1. Technical Grid Overlay */}
      <div className="grid-blueprint absolute inset-0 opacity-80" />

      {/* 2. Soft, Calm Floating Orbs of Intelligent Gradients */}
      <div className="absolute top-[-10%] left-[10%] h-[350px] w-[350px] rounded-full bg-emerald-250/15 blur-[100px] transition-colors duration-500 dark:bg-emerald-500/5 sm:h-[500px] sm:w-[500px]" />
      <div className="absolute bottom-[20%] right-[10%] h-[400px] w-[400px] rounded-full bg-teal-250/15 blur-[120px] transition-colors duration-500 dark:bg-teal-500/5 sm:h-[600px] sm:w-[600px]" />
      <div className="absolute top-[40%] left-[50%] -translate-x-1/2 h-[300px] w-[300px] rounded-full bg-sky-250/10 blur-[90px] transition-colors duration-500 dark:bg-sky-500/5" />

      {/* 3. Mathematical Sketch Accents (SVG Coordinate Axes & Technical Tick marks) */}
      <svg className="absolute inset-0 h-full w-full opacity-15 dark:opacity-20" xmlns="http://www.w3.org/2000/svg">
        {/* Fine crosshairs in the center of the display */}
        <line x1="10%" y1="50%" x2="90%" y2="50%" stroke={isDark ? "white" : "black"} strokeWidth="0.5" strokeDasharray="4 20" />
        <line x1="50%" y1="10%" x2="50%" y2="90%" stroke={isDark ? "white" : "black"} strokeWidth="0.5" strokeDasharray="4 20" />

        {/* Outer technical markers */}
        <circle cx="50%" cy="50%" r="20%" stroke={isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.03)"} fill="none" strokeWidth="1" strokeDasharray="5 5" />
        <circle cx="50%" cy="50%" r="35%" stroke={isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.01)"} fill="none" strokeWidth="0.5" />

        {/* Small drafting ticks on the borders */}
        <g stroke={isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)"} strokeWidth="1">
          <line x1="40" y1="20" x2="40" y2="35" />
          <line x1="20" y1="40" x2="35" y2="40" />
          <line x1="40" y1="40" x2="40" y2="40" />
        </g>
      </svg>

      {/* 4. Scatter Mathematical Blueprint Inscriptions */}
      <div className="relative h-full w-full">
        {formulaItems.map((item, index) => (
          <motion.div
            key={index}
            className="math-item absolute hidden font-mono text-[10px] text-slate-400 select-none opacity-40 dark:text-slate-600 sm:block"
            style={{
              top: item.top,
              left: item.left,
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 0.45, y: 0 }}
            transition={{ delay: index * 0.2, duration: 2 }}
          >
            {item.text}
          </motion.div>
        ))}
      </div>

      {/* 5. Elegant subtle graph lines (Simulating Performance curves) */}
      <div className="absolute right-0 bottom-0 left-0 h-40 opacity-[0.06] dark:opacity-[0.03]">
        <svg className="h-full w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M 0 120 Q 200 60 400 130 T 800 40 T 1200 110 T 1600 70 T 2000 140"
            stroke={isDark ? "#ffffff" : "#0f172a"}
            strokeWidth="1.5"
          />
          <path
            d="M 0 130 Q 250 100 500 140 T 1000 80 T 1500 120 T 2000 60"
            stroke={isDark ? "#10b981" : "#10b981"}
            strokeWidth="0.75"
            strokeDasharray="4 4"
          />
        </svg>
      </div>
    </div>
  );
}
