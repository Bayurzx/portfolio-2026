"use client";

import { useEffect, useState, useRef } from "react";
import canvasConfetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";

export function EasterEggController() {
    const [keys, setKeys] = useState<string>("");
    const [showMatrix, setShowMatrix] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Append key and keep last 20 characters
            setKeys((prev) => (prev + e.key).slice(-20));
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    useEffect(() => {
        const input = keys.toLowerCase();

        if (input.endsWith("matrix")) {
            setShowMatrix(true);
            setKeys("");
            // Matrix effect duration
            setTimeout(() => setShowMatrix(false), 8000);
        }

        if (input.endsWith("confetti") || input.endsWith("party")) {
            fireConfetti();
            setKeys("");
        }
    }, [keys]);

    const fireConfetti = () => {
        const duration = 2000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

        const randomInRange = (min: number, max: number) => {
            return Math.random() * (max - min) + min;
        }

        const interval: NodeJS.Timeout = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);

            // multiple origins
            canvasConfetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            canvasConfetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);
    };

    return (
        <AnimatePresence>
            {showMatrix && <MatrixOverlay />}
        </AnimatePresence>
    );
}

function MatrixOverlay() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Set dimensions
        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener("resize", resize);

        // Matrix settings
        const letters = "01010101ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const fontSize = 14;
        const columns = Math.ceil(canvas.width / fontSize);
        const drops = Array(columns).fill(1).map(() => Math.random() * -100); // Randomize start lines

        const draw = () => {
            // Semi-transparent black to create trail effect
            ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = "#0F0"; // Green text
            ctx.font = `${fontSize}px monospace`;

            for (let i = 0; i < drops.length; i++) {
                const text = letters[Math.floor(Math.random() * letters.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                // Reset drop or move it down
                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        };

        const interval = setInterval(draw, 33);

        return () => {
            clearInterval(interval);
            window.removeEventListener("resize", resize);
        };
    }, []);

    return (
        <motion.canvas
            ref={canvasRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] pointer-events-none bg-black"
        />
    );
}
