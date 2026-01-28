"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { SuggestionChips } from "@/components/interview/SuggestionChips";
import { CardRenderer } from "@/components/interview/CardRenderer";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { BubbleQuestions } from "@/components/ui/BubbleQuestions";
import { EasterEggController } from "@/components/ui/EasterEggController";
import "@/components/ui/BubbleQuestions.css";
import { matchScenario, getDefaultSuggestions } from "@/lib/scenarios";
import type { Scenario } from "@/lib/types";
import { track } from "@vercel/analytics/react";
import { useVoice } from "@/hooks/useVoice";

export default function Home() {
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>(getDefaultSuggestions());
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);


  const inputRef = useRef<HTMLInputElement>(null);

  const [voiceError, setVoiceError] = useState<string | null>(null);

  const voice = useVoice({
    onResult: (text) => {
      setInputValue(text);
      setVoiceError(null);
      // Don't auto-focus - this was stealing focus from ChatWidget
    },
    onError: (err) => {
      console.error("Voice error:", err);
      // Detect Brave browser
      const isBrave = (navigator as Navigator & { brave?: { isBrave?: () => Promise<boolean> } }).brave !== undefined;

      // Show user-friendly error messages
      const errorMessages: Record<string, string> = {
        "network": isBrave
          ? "Voice not supported in Brave - try Chrome or Edge"
          : "Network error - check your internet connection",
        "not-allowed": "Microphone access denied - please enable it in browser settings",
        "no-speech": "No speech detected - try again",
        "audio-capture": "No microphone found",
        "service-not-allowed": isBrave
          ? "Brave blocks voice services - try Chrome or Edge"
          : "Speech service blocked",
        "aborted": "Speech was cancelled",
      };
      setVoiceError(errorMessages[err] || `Voice error: ${err}`);
      // Auto-clear error after 5 seconds
      setTimeout(() => setVoiceError(null), 5000);
    }
  });

  // Effect to automatically start listening when voice enabled changes if it was triggered by the user
  // This avoids the stale closure issue with setTimeout
  const [shouldStartListening, setShouldStartListening] = useState(false);

  useEffect(() => {
    if (shouldStartListening && voice.voiceEnabled && !voice.isListening) {
      voice.startListening();
      setShouldStartListening(false);
    }
  }, [voice.voiceEnabled, shouldStartListening, voice.isListening, voice.startListening]);

  const handleVoiceInteraction = () => {
    if (!voice.voiceEnabled) {
      voice.setVoiceEnabled(true);
      setShouldStartListening(true);
    } else {
      if (voice.isListening) {
        voice.stopListening();
      } else {
        voice.startListening();
      }
    }
  };

  // Global keyboard event handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape key - unfocus input
      if (e.key === "Escape") {
        inputRef.current?.blur();
        return;
      }

      // Ignore if typing in an input, textarea, or content editable element
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      // If typing a letter/number and not already focused on input, focus it
      if (
        e.key.length === 1 &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.altKey &&
        document.activeElement !== inputRef.current
      ) {
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleQuestion = useCallback((question: string) => {
    if (!question.trim()) return;

    setIsLoading(true);

    // Small delay for animation effect
    setTimeout(() => {
      const matched = matchScenario(question);

      if (matched) {
        setCurrentScenario(matched);
        track('Scenario Matched', { scenarioId: matched.id });
        // Update suggestions with follow-ups from the matched scenario
        setSuggestions(matched.response.suggestions);
      } else {
        // No match - show default suggestions
        setCurrentScenario(null);
        setSuggestions(getDefaultSuggestions());
      }

      setIsLoading(false);
    }, 300);
  }, []);

  const handleSuggestionSelect = (suggestion: string) => {
    handleQuestion(suggestion);
    setInputValue("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      handleQuestion(inputValue);
      setInputValue("");
    }
  };

  // Handle bubble click - load question into input box
  const handleBubbleClick = useCallback((question: string) => {
    setInputValue(question);
    inputRef.current?.focus();
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Header voice={voice} />

      {/* Main Interview UI - Positioned at Top, Centered */}
      <main className="flex min-h-screen flex-col items-center px-4 pt-24 pb-32">
        <div className="mx-auto w-full max-w-3xl">

          {/* Hero Section - Only show when no scenario is active */}
          <AnimatePresence mode="wait">
            {!currentScenario && (
              <motion.div
                key="hero"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="mb-12 text-center"
              >
                {/* Avatar/Logo */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full
                             bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)]
                             shadow-lg shadow-[var(--accent-primary)]/20"
                >
                  <span className="text-4xl font-bold text-white">👋</span>
                </motion.div>

                {/* Welcome Text */}
                <h1 className="mb-4 text-3xl font-bold text-[var(--text-primary)] sm:text-4xl">
                  Hi, I&apos;m{" "}
                  <span className="gradient-text">Adebayo Omolumo</span>
                </h1>

                <p className="mx-auto mb-2 max-w-2xl text-lg text-[var(--text-secondary)]">
                  Senior DevOps & Cloud Engineer | Full Stack Developer
                </p>

                <p className="mx-auto max-w-2xl text-[var(--text-muted)]">
                  Ask me anything about my experience, projects, or skills.
                  <br />
                  Click a suggestion below or type your own question.
                </p>
                <p className="mt-4 text-sm flex gap-4 justify-center flex-wrap">
                  <a href="/story" className="text-[var(--accent-secondary)] hover:underline font-medium">
                    ✨ My Story →
                  </a>
                  <a href="/github" className="text-[var(--accent-primary)] hover:underline font-medium">
                    🚀 Open Source Projects →
                  </a>
                  <a href="/portfolio" className="text-[var(--text-muted)] hover:underline">
                    View static portfolio →
                  </a>
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Voice Input Button for Main Interview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-6 flex justify-center"
          >
            <button
              className={`flex items-center gap-2 rounded-full px-5 py-2.5
                         bg-gradient-to-r from-[var(--accent-primary)]/10 to-[var(--accent-secondary)]/10
                         border border-[var(--accent-primary)]/30
                         text-[var(--text-secondary)] hover:text-[var(--accent-primary)]
                         hover:border-[var(--accent-primary)]/50
                         hover:bg-[var(--accent-primary)]/15
                         transition-all duration-200 group
                         ${voice.isListening ? 'animate-pulse ring-2 ring-red-500/50' : ''}`}
              aria-label="Voice input"
              onClick={handleVoiceInteraction}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 group-hover:scale-110 transition-transform"
              >
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="23" />
                <line x1="8" y1="23" x2="16" y2="23" />
              </svg>
              <span className="text-sm font-medium">
                {voice.isListening ? "Listening..." : "Ask with voice"}
              </span>
            </button>
            {voiceError && (
              <p className="mt-2 text-sm text-red-500 text-center">{voiceError}</p>
            )}
          </motion.div>

          {/* Suggestion Chips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-8"
          >
            <SuggestionChips
              suggestions={suggestions}
              onSelect={handleSuggestionSelect}
            />
          </motion.div>

          {/* Loading State */}
          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-center py-8"
              >
                <div className="flex items-center gap-2 text-[var(--text-muted)]">
                  <div className="h-2 w-2 rounded-full bg-[var(--accent-primary)] animate-bounce" />
                  <div className="h-2 w-2 rounded-full bg-[var(--accent-primary)] animate-bounce delay-100" />
                  <div className="h-2 w-2 rounded-full bg-[var(--accent-primary)] animate-bounce delay-200" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Response Area with Cards */}
          <AnimatePresence mode="wait">
            {currentScenario && !isLoading && (
              <motion.div
                key={currentScenario.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                {/* Text Response */}
                <div className="rounded-2xl border border-[var(--border-default)] 
                                bg-[var(--bg-surface)] p-6">
                  <p className="text-lg text-[var(--text-primary)] leading-relaxed">
                    {currentScenario.response.text}
                  </p>
                </div>

                {/* Cards */}
                <CardRenderer cards={currentScenario.response.cards} />

                {/* Back to Start */}
                <div className="flex justify-center pt-4">
                  <button
                    onClick={() => {
                      setCurrentScenario(null);
                      setSuggestions(getDefaultSuggestions());
                    }}
                    className="text-sm text-[var(--text-muted)] hover:text-[var(--accent-primary)]
                               transition-colors duration-200"
                  >
                    ← Start over
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* No Match Message */}
          <AnimatePresence>
            {!currentScenario && inputValue && !isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center text-[var(--text-muted)] py-4"
              >
                I&apos;m not sure about that. Try one of the suggestions above!
              </motion.div>
            )}
          </AnimatePresence>

          {/* Input Bar */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            onSubmit={handleSubmit}
            className="fixed bottom-0 left-0 right-0 p-4 glass"
          >
            <div className="mx-auto flex max-w-2xl items-center gap-3">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your question... (press any key to focus)"
                className="flex-1 rounded-full border border-[var(--border-default)] 
                           bg-[var(--bg-surface)] px-5 py-3 text-[var(--text-primary)]
                           placeholder:text-[var(--text-muted)]
                           focus:border-[var(--accent-primary)] focus:outline-none
                           transition-colors duration-200"
              />

              {/* Voice Button */}
              <button
                type="button"
                className={`flex h-12 w-12 items-center justify-center rounded-full
                           bg-[var(--bg-surface)] border border-[var(--border-default)]
                           text-[var(--text-secondary)] hover:text-[var(--text-primary)]
                           hover:border-[var(--border-hover)] transition-all duration-200
                           ${voice.isListening ? 'text-red-500 border-red-500' : ''}`}
                aria-label="Voice input"
                onClick={handleVoiceInteraction}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" y1="19" x2="12" y2="23" />
                  <line x1="8" y1="23" x2="16" y2="23" />
                </svg>
              </button>

              {/* Send Button */}
              <button
                type="submit"
                className="flex h-12 w-12 items-center justify-center rounded-full
                           bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)]
                           text-white shadow-lg shadow-[var(--accent-primary)]/20
                           hover:shadow-xl hover:shadow-[var(--accent-primary)]/30
                           active:scale-95 transition-all duration-200"
                aria-label="Send message"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </motion.form>

        </div>
      </main>

      {/* Floating Bubble Questions */}
      <BubbleQuestions onQuestionClick={handleBubbleClick} />

      {/* Floating Chat Widget */}
      <ChatWidget />

      {/* Easter Eggs Controller */}
      <EasterEggController />
    </div>
  );
}
