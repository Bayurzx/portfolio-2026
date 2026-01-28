"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/providers/ThemeProvider";

export function ThemeToggle() {
    const { theme, toggleTheme, mounted } = useTheme();

    // Don't animate on first render to avoid hydration mismatch
    if (!mounted) {
        return (
            <button
                className="relative flex h-10 w-10 items-center justify-center rounded-full 
                   bg-[var(--bg-surface)] border border-[var(--border-default)]
                   transition-all duration-200"
                aria-label="Toggle theme"
            >
                <div className="h-5 w-5" />
            </button>
        );
    }

    return (
        <button
            onClick={toggleTheme}
            className="relative flex h-10 w-10 items-center justify-center rounded-full 
                 bg-[var(--bg-surface)] border border-[var(--border-default)]
                 hover:border-[var(--border-hover)] hover:bg-[var(--bg-elevated)]
                 transition-all duration-200 focus:outline-none focus-visible:ring-2 
                 focus-visible:ring-[var(--accent-primary)]"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
            <div className="relative h-5 w-5">
                {/* Sun Icon */}
                <motion.svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="absolute inset-0 h-5 w-5 text-[var(--text-primary)]"
                    initial={false}
                    animate={{
                        scale: theme === "light" ? 1 : 0,
                        opacity: theme === "light" ? 1 : 0,
                        rotate: theme === "light" ? 0 : -90,
                    }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                    <circle cx="12" cy="12" r="5" />
                    <line x1="12" y1="1" x2="12" y2="3" />
                    <line x1="12" y1="21" x2="12" y2="23" />
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                    <line x1="1" y1="12" x2="3" y2="12" />
                    <line x1="21" y1="12" x2="23" y2="12" />
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </motion.svg>

                {/* Moon Icon */}
                <motion.svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="absolute inset-0 h-5 w-5 text-[var(--text-primary)]"
                    initial={false}
                    animate={{
                        scale: theme === "dark" ? 1 : 0,
                        opacity: theme === "dark" ? 1 : 0,
                        rotate: theme === "dark" ? 0 : 90,
                    }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </motion.svg>
            </div>
        </button>
    );
}
