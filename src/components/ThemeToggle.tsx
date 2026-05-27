import { motion } from "motion/react";
import { Sun, Moon } from "lucide-react";

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

export function ThemeToggle({ isDark, onToggle }: ThemeToggleProps) {
  return (
    <div className="relative inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/80 p-1 shadow-sm backdrop-blur-md transition-all duration-300 dark:border-slate-800 dark:bg-slate-900/80">
      <button
        id="theme-toggle-light"
        onClick={() => !isDark || onToggle()}
        className={`relative z-10 flex h-7 items-center justify-center gap-1.5 rounded-full px-3 text-xs font-semibold cursor-pointer transition-colors ${
          !isDark
            ? "text-emerald-700 dark:text-emerald-300"
            : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
        }`}
        aria-label="Light mode"
      >
        <Sun className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Light</span>
        {!isDark && (
          <motion.div
            layoutId="activeThemeBg"
            className="absolute inset-0 -z-10 rounded-full bg-emerald-500/10 shadow-sm"
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
          />
        )}
      </button>

      <button
        id="theme-toggle-dark"
        onClick={() => isDark || onToggle()}
        className={`relative z-10 flex h-7 items-center justify-center gap-1.5 rounded-full px-3 text-xs font-semibold cursor-pointer transition-colors ${
          isDark
            ? "text-emerald-300"
            : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
        }`}
        aria-label="Dark mode"
      >
        <Moon className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Dark</span>
        {isDark && (
          <motion.div
            layoutId="activeThemeBg"
            className="absolute inset-0 -z-10 rounded-full bg-emerald-500/10 shadow-sm"
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
          />
        )}
      </button>
    </div>
  );
}
