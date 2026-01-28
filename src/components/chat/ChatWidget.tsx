"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { sendChatMessage } from "@/lib/api";
import { track } from "@vercel/analytics/react";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
}

interface ChatWidgetProps {
    onSendMessage?: (message: string) => Promise<string>;
}

/**
 * Floating chatbot widget with ✨ icon
 * Opens a slide-up chat panel for text-based conversations
 */
export function ChatWidget({ onSendMessage }: ChatWidgetProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "welcome",
            role: "assistant",
            content: "Hi! I'm an AI assistant. Ask me anything about Adebayo's experience, projects, or skills!",
            timestamp: new Date(),
        },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Focus input when chat opens
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: `user-${Date.now()}`,
            role: "user",
            content: input.trim(),
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);
        track('Chat Message Sent', { role: 'user' });

        try {
            // Use provided handler or default to API
            const response = onSendMessage
                ? await onSendMessage(userMessage.content)
                : await sendChatMessage(userMessage.content);

            const assistantMessage: Message = {
                id: `assistant-${Date.now()}`,
                role: "assistant",
                content: response,
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, assistantMessage]);
        } catch {
            const errorMessage: Message = {
                id: `error-${Date.now()}`,
                role: "assistant",
                content: "Sorry, I couldn't process that. Please try again!",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Floating ✨ Button */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`
          fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center
          rounded-full shadow-lg transition-all duration-300
          ${isOpen
                        ? "bg-[var(--bg-surface)] border border-[var(--border-default)] text-[var(--text-primary)]"
                        : "bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white"
                    }
        `}
                aria-label={isOpen ? "Close chat" : "Open chat"}
            >
                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.span
                            key="close"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                            className="text-2xl"
                        >
                            ×
                        </motion.span>
                    ) : (
                        <motion.span
                            key="open"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="text-2xl"
                        >
                            ✨
                        </motion.span>
                    )}
                </AnimatePresence>
            </motion.button>

            {/* Chat Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-3rem)]
                       rounded-2xl border border-[var(--border-default)] bg-[var(--bg-primary)]
                       shadow-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border-default)]
                            bg-gradient-to-r from-[var(--accent-primary)]/10 to-[var(--accent-secondary)]/10">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full
                              bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)]">
                                <span className="text-lg">✨</span>
                            </div>
                            <div>
                                <h3 className="font-semibold text-[var(--text-primary)]">AI Assistant</h3>
                                <p className="text-xs text-[var(--text-muted)]">Ask me anything!</p>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="h-[300px] overflow-y-auto p-4 space-y-4">
                            {messages.map((message) => (
                                <motion.div
                                    key={message.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${message.role === "user"
                                            ? "bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white"
                                            : "bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-default)]"
                                            }`}
                                    >
                                        <p className="text-sm leading-relaxed">{message.content}</p>
                                    </div>
                                </motion.div>
                            ))}

                            {/* Loading indicator */}
                            {isLoading && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex justify-start"
                                >
                                    <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] 
                                  rounded-2xl px-4 py-3 flex items-center gap-1">
                                        <span className="w-2 h-2 bg-[var(--accent-primary)] rounded-full animate-bounce" />
                                        <span className="w-2 h-2 bg-[var(--accent-primary)] rounded-full animate-bounce delay-100" />
                                        <span className="w-2 h-2 bg-[var(--accent-primary)] rounded-full animate-bounce delay-200" />
                                    </div>
                                </motion.div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <form
                            onSubmit={handleSubmit}
                            className="flex items-center gap-2 p-3 border-t border-[var(--border-default)]"
                        >
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Type a message..."
                                disabled={isLoading}
                                className="flex-1 bg-[var(--bg-surface)] border border-[var(--border-default)]
                           rounded-full px-4 py-2.5 text-sm text-[var(--text-primary)]
                           placeholder:text-[var(--text-muted)]
                           focus:outline-none focus:border-[var(--accent-primary)]
                           disabled:opacity-50 transition-colors"
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || isLoading}
                                className="flex h-10 w-10 items-center justify-center rounded-full
                           bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)]
                           text-white transition-all
                           hover:shadow-lg hover:shadow-[var(--accent-primary)]/30
                           disabled:opacity-50 disabled:cursor-not-allowed"
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
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

/**
 * Fallback response when no API is connected
 * Uses basic keyword matching from scenarios
 */
function getFallbackResponse(input: string): string {
    const lower = input.toLowerCase();

    // Basic keyword matching
    if (lower.includes("name") || lower.includes("who")) {
        return "I'm Adebayo Omolumo, a Senior DevOps & Cloud Engineer with 8+ years of experience!";
    }
    if (lower.includes("skill") || lower.includes("tech")) {
        return "My skills include AWS, Azure, GCP, Kubernetes, Terraform, Docker, Python, TypeScript, and more!";
    }
    if (lower.includes("project")) {
        return "Check out DockerHelper (AI Docker config generator), SaveEarth (endangered species AI), and Synapse (loan management platform)!";
    }
    if (lower.includes("contact") || lower.includes("email")) {
        return "You can reach me at bayurzx@gmail.com or connect on LinkedIn!";
    }
    if (lower.includes("kubernetes") || lower.includes("k8s")) {
        return "I specialize in Kubernetes! I've built production-grade HA clusters on AWS with zero-trust networking.";
    }
    if (lower.includes("hackathon")) {
        return "I've participated in 15+ hackathons with multiple wins including Bunnyshell, Celo, and Datastax!";
    }
    if (lower.includes("hire") || lower.includes("work")) {
        return "I'm open to interesting opportunities! Remote roles in cloud architecture, K8s, or DevOps. Let's connect!";
    }
    if (lower.includes("cert")) {
        return "I hold 10+ certifications including Azure DevOps Engineer Expert, GCP Professional Cloud Architect, and more!";
    }

    return "That's a great question! For the full answer, try the main interview above or check out my projects and experience there.";
}
