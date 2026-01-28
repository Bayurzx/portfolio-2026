"use client";

import { motion } from "framer-motion";

interface SuggestionChipsProps {
    suggestions: string[];
    onSelect: (suggestion: string) => void;
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05,
            delayChildren: 0.1,
        },
    },
};

const chipVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.3,
            ease: [0.25, 0.46, 0.45, 0.94] as const,
        },
    },
};

export function SuggestionChips({ suggestions, onSelect }: SuggestionChipsProps) {
    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap justify-center gap-2 sm:gap-3"
        >
            {suggestions.map((suggestion, index) => (
                <motion.button
                    key={suggestion}
                    variants={chipVariants}
                    whileHover={{
                        scale: 1.05,
                        y: -2,
                        transition: { duration: 0.15 }
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onSelect(suggestion)}
                    className="group relative px-4 py-2 rounded-full text-sm font-medium
                     bg-[var(--bg-surface)] text-[var(--text-secondary)]
                     border border-[var(--border-default)]
                     hover:border-[var(--accent-primary)] hover:text-[var(--text-primary)]
                     hover:shadow-md hover:shadow-[var(--accent-primary)]/10
                     transition-all duration-200
                     focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
                >
                    {/* Gradient hover effect */}
                    <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100
                           bg-gradient-to-r from-[var(--accent-primary)]/5 to-[var(--accent-secondary)]/5
                           transition-opacity duration-200" />

                    <span className="relative">{suggestion}</span>
                </motion.button>
            ))}
        </motion.div>
    );
}

// Default suggestions for initial display
export const DEFAULT_SUGGESTIONS = [
    "Who are you?",
    "Tell me about your projects",
    "What's your tech stack?",
    "How did you get into tech?",
    "Show me your certifications",
    "Why so many hackathons?",
    "How can I contact you?",
    "I want to hire you",
];
