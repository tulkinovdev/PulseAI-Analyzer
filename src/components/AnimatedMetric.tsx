import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface AnimatedMetricProps {
  score: number;
  label: string;
  size?: "sm" | "lg";
  subtext?: string;
}

export function AnimatedMetric({ score, label, size = "sm", subtext }: AnimatedMetricProps) {
  const [currentScore, setCurrentScore] = useState(0);

  // Animate the score counter from 0 to target score
  useEffect(() => {
    let start = 0;
    const end = score;
    if (start === end) {
      setCurrentScore(end);
      return;
    }

    const duration = 1200; // ms
    const increment = Math.ceil(end / (duration / 16)); // ~60fps
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        clearInterval(timer);
        setCurrentScore(end);
      } else {
        setCurrentScore(start);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [score]);

  // Determine score color grades
  const getColors = (val: number) => {
    if (val >= 90) {
      return {
        stroke: "#10b981", // Emerald 500
        text: "text-emerald-500",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/20",
        glow: "text-glow-green"
      };
    } else if (val >= 50) {
      return {
        stroke: "#f59e0b", // Amber 500
        text: "text-amber-500",
        bg: "bg-amber-500/10",
        border: "border-amber-500/20",
        glow: "text-glow-orange"
      };
    } else {
      return {
        stroke: "#ef4444", // Red 500
        text: "text-red-500",
        bg: "bg-red-500/10",
        border: "border-red-500/20",
        glow: "text-glow-red"
      };
    }
  };

  const colors = getColors(score);

  // SVG Circular parameters
  const radius = size === "lg" ? 64 : 32;
  const strokeWidth = size === "lg" ? 8 : 4;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (currentScore / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center text-center">
      {/* Circle Tracker Wrapper */}
      <div className="relative">
        <svg
          width={size === "lg" ? 148 : 78}
          height={size === "lg" ? 148 : 78}
          className="transform -rotate-90 select-none"
        >
          {/* Background circle */}
          <circle
            cx={size === "lg" ? 74 : 39}
            cy={size === "lg" ? 74 : 39}
            r={radius}
            fill="transparent"
            stroke="currentColor"
            className="text-slate-200 dark:text-slate-800 transition-colors duration-400"
            strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
          <motion.circle
            cx={size === "lg" ? 74 : 39}
            cy={size === "lg" ? 74 : 39}
            r={radius}
            fill="transparent"
            stroke={colors.stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            strokeLinecap="round"
          />
        </svg>

        {/* Floating Centered Score Value */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className={`font-mono font-bold leading-none ${colors.text} ${colors.glow} ${
              size === "lg" ? "text-4xl" : "text-xl"
            }`}
          >
            {currentScore}
          </motion.span>
          {size === "lg" && (
            <span className="mt-1 font-sans text-[10px] font-medium tracking-wider text-slate-400 dark:text-slate-500 uppercase">
              Score
            </span>
          )}
        </div>
      </div>

      {/* Metric Title */}
      <div className="mt-3">
        <h4 className="font-display text-sm font-semibold text-slate-800 dark:text-slate-200 tracking-tight">
          {label}
        </h4>
        {subtext && (
          <p className="mt-0.5 font-sans text-[11px] text-slate-400 dark:text-slate-500">
            {subtext}
          </p>
        )}
      </div>
    </div>
  );
}
