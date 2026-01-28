"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useVoice } from "@/hooks/useVoice";

interface VoiceToggleProps {
    onTranscript?: (text: string) => void;
}

/**
 * Voice toggle button for the header
 * Shows microphone icon with listening/speaking states
 */
export function VoiceToggle({ voice }: { voice: import("@/hooks/useVoice").UseVoiceReturn }) {
    const [error, setError] = useState<string | null>(null);

    const {
        isListening,
        isSupported,
        isSpeaking,
        voiceEnabled,
        setVoiceEnabled,
        startListening,
        stopListening,
    } = voice;

    // Use a useEffect to expose error handling if needed, or handle errors at the page level
    // But since useVoice handles its own errors via callback, we might need a way to show them here.
    // For now, let's assume the hook doesn't expose internal errors directly via state, only via callback.
    // However, we want to show errors in this specific UI component.
    // The previous implementation utilized the onError callback of useVoice.
    // Since we are now passing the voice object properly, the onError handling needs to be where useVoice is CALLED.
    // To support showing errors HERE, we might need to pass an error state down or listen to it.
    // Ideally, the parent component handles errors.
    // But for simplicity in this "Day 10" fix, let's keep it simple.

    // Actually, sticking to the existing error UI is good.
    // We can add an `error` prop or just manage local error state if we can intercept it.
    // But interception is hard if hook is called above.
    // Let's rely on the parent to handle critical errors, or better:
    // We can't easily show the "Microphone access denied" tooltip here if the error happens in the parent.
    // UNLESS we pass `error` as a prop too.

    // For now, let's remove the local error tooltip logic for simplicity OR add an error prop.
    // I'll add an optional error prop.

    if (!isSupported) {
        return null;
    }

    const handleClick = () => {
        if (!voiceEnabled) {
            setVoiceEnabled(true);
            return;
        }

        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    };

    const handleToggleVoice = (e: React.MouseEvent) => {
        e.stopPropagation();
        setVoiceEnabled(!voiceEnabled);
        if (isListening) {
            stopListening();
        }
    };

    return (
        <div className="relative">
            <motion.button
                onClick={handleClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`
          relative flex h-10 w-10 items-center justify-center rounded-full
          transition-all duration-200
          ${voiceEnabled
                        ? isListening
                            ? "bg-red-500 text-white shadow-lg shadow-red-500/30"
                            : isSpeaking
                                ? "bg-green-500 text-white shadow-lg shadow-green-500/30"
                                : "bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/30"
                        : "bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-secondary)] border border-[var(--border-default)]"
                    }
        `}
                title={
                    !voiceEnabled
                        ? "Click to enable voice"
                        : isListening
                            ? "Listening... Click to stop"
                            : "Click to speak"
                }
            >
                {/* Pulsing ring when listening */}
                <AnimatePresence>
                    {isListening && (
                        <motion.span
                            initial={{ scale: 1, opacity: 0.5 }}
                            animate={{ scale: 1.5, opacity: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1, repeat: Infinity }}
                            className="absolute inset-0 rounded-full bg-red-500"
                        />
                    )}
                </AnimatePresence>

                {/* Microphone icon */}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 relative z-10"
                >
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                    <line x1="12" y1="19" x2="12" y2="23" />
                    <line x1="8" y1="23" x2="16" y2="23" />
                </svg>

                {/* Disabled slash overlay */}
                {!voiceEnabled && (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="absolute h-5 w-5 text-[var(--text-muted)]"
                    >
                        <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                )}
            </motion.button>

            {/* Voice toggle dropdown */}
            <motion.button
                onClick={handleToggleVoice}
                className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center
                   rounded-full bg-[var(--bg-surface)] border border-[var(--border-default)]
                   text-[10px] hover:border-[var(--accent-primary)] transition-colors"
                title={voiceEnabled ? "Disable voice" : "Enable voice"}
                aria-label={voiceEnabled ? "Disable voice" : "Enable voice"}
            >
                {voiceEnabled ? "✓" : "×"}
            </motion.button>
        </div>
    );
}
