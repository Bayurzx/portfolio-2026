"use client";

import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { VoiceToggle } from "@/components/ui/VoiceToggle";
import { motion } from "framer-motion";

interface HeaderProps {
    voice?: import("@/hooks/useVoice").UseVoiceReturn;
}

export function Header({ voice }: HeaderProps) {
    return (
        <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="fixed top-0 left-0 right-0 z-50 glass"
        >
            <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
                {/* Logo / Name */}
                <motion.a
                    href="/"
                    className="flex items-center gap-2 group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg 
                          bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)]">
                        <span className="text-lg font-bold text-white">P</span>
                    </div>
                    <span className="text-lg font-semibold text-[var(--text-primary)] 
                           group-hover:text-[var(--accent-primary)] transition-colors">
                        Portfolio
                    </span>
                </motion.a>

                {/* Right side controls */}
                <div className="flex items-center gap-3">
                    {/* Voice Toggle */}
                    {voice && <VoiceToggle voice={voice} />}

                    {/* Theme Toggle */}
                    <ThemeToggle />
                </div>
            </div>
        </motion.header>
    );
}
