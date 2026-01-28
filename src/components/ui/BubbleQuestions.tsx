"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { getRandomQuestions, type BubbleQuestion } from "@/lib/scenarios";

interface Bubble {
    id: number;
    title: string;
    question: string;
}

interface BubbleQuestionsProps {
    onQuestionClick: (question: string) => void;
}

let bubbleIdCounter = 0;

export function BubbleQuestions({ onQuestionClick }: BubbleQuestionsProps) {
    const [bubbles, setBubbles] = useState<Bubble[]>([]);
    const [isPaused, setIsPaused] = useState(false);

    // Create new bubbles
    const createBubbles = useCallback(() => {
        const questions = getRandomQuestions(3);
        const newBubbles: Bubble[] = questions.map((q: BubbleQuestion) => ({
            id: bubbleIdCounter++,
            title: q.title,
            question: q.question,
        }));
        setBubbles(newBubbles);
    }, []);

    // Initial load
    useEffect(() => {
        createBubbles();
    }, [createBubbles]);

    // Refresh bubbles every 20 seconds when not paused
    useEffect(() => {
        if (isPaused) return;

        const interval = setInterval(() => {
            createBubbles();
        }, 20000);

        return () => clearInterval(interval);
    }, [isPaused, createBubbles]);

    const handleBubbleClick = (bubble: Bubble) => {
        setBubbles((prev) => prev.filter((b) => b.id !== bubble.id));
        // Pass the FULL question to the input
        onQuestionClick(bubble.question);

        // Add replacement bubble
        setTimeout(() => {
            const [newQ] = getRandomQuestions(1);
            setBubbles((prev) => [
                ...prev,
                {
                    id: bubbleIdCounter++,
                    title: newQ.title,
                    question: newQ.question,
                },
            ]);
        }, 800);
    };

    return (
        <div
            className={`aquarium-container ${isPaused ? "paused" : ""}`}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div className="bubbles-track">
                <AnimatePresence>
                    {bubbles.map((bubble, index) => (
                        <motion.button
                            key={bubble.id}
                            className="aquarium-bubble"
                            title={bubble.question} // Show full question on native tooltip
                            initial={{ opacity: 0, scale: 0.6 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{
                                scale: [1, 1.4, 0],
                                opacity: 0,
                                transition: { duration: 0.25 }
                            }}
                            transition={{
                                delay: index * 0.2,
                                duration: 0.35,
                            }}
                            onClick={() => handleBubbleClick(bubble)}
                            whileHover={{ scale: 1.08, x: 5 }}
                            whileTap={{ scale: 0.92 }}
                        >
                            {/* Only show SHORT title in bubble */}
                            <span className="bubble-title">{bubble.title}</span>
                            <div className="bubble-shine" />
                        </motion.button>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
