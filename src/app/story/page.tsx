"use client";

import "./story.css";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

const storyData = [
    {
        id: 1,
        title: "The Spark",
        year: "2017",
        icon: "💻",
        image: "/images/story/chapter1-university.png",
        lines: [
            "I started building things for the web while still at UI—University of Ibadan.",
            "I was studying engineering but found myself always creating websites on the side.",
            "Built sites for my department, my father's consultancy business, things like that.",
        ],
        accent: "#6366f1",
    },
    {
        id: 2,
        title: "The Scholarships",
        year: "2020",
        icon: "☁️",
        image: "/images/story/chapter2-cloud.png",
        lines: [
            "After graduating in 2020, I got into Google Cloud and Andela scholarships.",
            "That's really where cloud became my focus.",
            "I got hands-on with AWS, Azure, GCP—building actual production applications.",
        ],
        accent: "#8b5cf6",
    },
    {
        id: 3,
        title: "Building Iglumtech",
        year: "2021",
        icon: "🏢",
        image: "/images/story/chapter3-agency.png",
        lines: [
            "I co-founded Iglumtech, a web agency where we handled client projects.",
            "We grew from basic web development to multi-cloud DevOps consulting.",
            "Building solutions for startups and SMBs across Africa.",
        ],
        accent: "#a855f7",
    },
    {
        id: 4,
        title: "The Innovation",
        year: "2022",
        icon: "🏆",
        image: "/images/story/chapter4-saveearth.png",
        lines: [
            "I built an Azure-powered app using Custom Vision to identify endangered animals.",
            "SaveEarth actually won prizes in competitions and received AWS funding.",
            "That's when I knew I wanted to keep pushing boundaries.",
        ],
        accent: "#d946ef",
    },
    {
        id: 5,
        title: "Enterprise Scale",
        year: "2024",
        icon: "🚀",
        image: "/images/story/chapter5-devops.png",
        lines: [
            "Currently, I'm a DevOps Engineer at Infometics working on enterprise fintech.",
            "My day-to-day involves Docker, Terraform, AWS—building and automating infrastructure.",
            "I've cut infrastructure costs by about 60% through automation.",
        ],
        accent: "#ec4899",
    },
];

const AUTO_ADVANCE_DELAY = 5000; // 5 seconds

export default function StoryPage() {
    const [currentChapter, setCurrentChapter] = useState(0);
    const [visibleLines, setVisibleLines] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    const chapter = storyData[currentChapter];
    const totalLines = chapter.lines.length;

    const nextChapter = useCallback(() => {
        if (currentChapter < storyData.length - 1) {
            setCurrentChapter((prev) => prev + 1);
            setVisibleLines(0);
            setImageLoaded(false);
        }
    }, [currentChapter]);

    const prevChapter = useCallback(() => {
        if (currentChapter > 0) {
            setCurrentChapter((prev) => prev - 1);
            setVisibleLines(0);
            setImageLoaded(false);
        }
    }, [currentChapter]);

    const goToChapter = (index: number) => {
        setCurrentChapter(index);
        setVisibleLines(0);
        setImageLoaded(false);
    };

    // Line-by-line reveal
    useEffect(() => {
        if (visibleLines < totalLines) {
            const timer = setTimeout(() => {
                setVisibleLines((prev) => prev + 1);
            }, 800); // Show next line after 800ms
            return () => clearTimeout(timer);
        }
    }, [visibleLines, totalLines]);

    // Auto-advance after all lines shown
    useEffect(() => {
        if (isPaused || visibleLines < totalLines) return;
        if (currentChapter >= storyData.length - 1) return;

        const timer = setTimeout(() => {
            nextChapter();
        }, AUTO_ADVANCE_DELAY);

        return () => clearTimeout(timer);
    }, [visibleLines, totalLines, isPaused, currentChapter, nextChapter]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight" || e.key === " ") {
                e.preventDefault();
                nextChapter();
            } else if (e.key === "ArrowLeft") {
                e.preventDefault();
                prevChapter();
            } else if (e.key === "p" || e.key === "P") {
                setIsPaused((prev) => !prev);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [nextChapter, prevChapter]);

    // Progress for auto-advance countdown
    const [countdown, setCountdown] = useState(100);

    useEffect(() => {
        if (isPaused || visibleLines < totalLines || currentChapter >= storyData.length - 1) {
            setCountdown(100);
            return;
        }

        const interval = setInterval(() => {
            setCountdown((prev) => Math.max(0, prev - 2));
        }, AUTO_ADVANCE_DELAY / 50);

        return () => clearInterval(interval);
    }, [isPaused, visibleLines, totalLines, currentChapter]);

    // Reset countdown on chapter change
    useEffect(() => {
        setCountdown(100);
    }, [currentChapter]);

    return (
        <div
            className="story-container-v2"
            onClick={() => setIsPaused((prev) => !prev)}
        >
            {/* Header */}
            <header className="story-header-v2" onClick={(e) => e.stopPropagation()}>
                <a href="/" className="back-btn">
                    ← Back
                </a>
                <h1 className="story-title-v2">My Journey</h1>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsPaused((prev) => !prev);
                    }}
                    className={`pause-btn ${isPaused ? "paused" : ""}`}
                    aria-label={isPaused ? "Resume" : "Pause"}
                >
                    {isPaused ? "▶️" : "⏸️"}
                </button>
            </header>

            {/* Progress bar with countdown */}
            <div className="progress-track">
                <motion.div
                    className="progress-bar-v2"
                    style={{ width: `${((currentChapter + 1) / storyData.length) * 100}%` }}
                />
                {visibleLines >= totalLines && currentChapter < storyData.length - 1 && !isPaused && (
                    <motion.div
                        className="countdown-bar"
                        initial={{ width: "100%" }}
                        animate={{ width: "0%" }}
                        transition={{ duration: AUTO_ADVANCE_DELAY / 1000, ease: "linear" }}
                        key={currentChapter}
                    />
                )}
            </div>

            {/* Timeline dots */}
            <nav className="timeline-nav" onClick={(e) => e.stopPropagation()}>
                {storyData.map((ch, index) => (
                    <button
                        key={ch.id}
                        onClick={() => goToChapter(index)}
                        className={`timeline-dot ${currentChapter === index ? "active" : ""} ${index < currentChapter ? "completed" : ""}`}
                        style={{ "--dot-color": ch.accent } as React.CSSProperties}
                    >
                        <span className="timeline-year">{ch.year}</span>
                    </button>
                ))}
            </nav>

            {/* Main content area */}
            <main className="story-main">
                <AnimatePresence mode="wait">
                    <motion.article
                        key={chapter.id}
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 1.05, y: -20 }}
                        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                        className="story-card-v2"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Image */}
                        <motion.div
                            className="chapter-image"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: imageLoaded ? 1 : 0.5, y: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            <Image
                                src={chapter.image}
                                alt={chapter.title}
                                width={400}
                                height={250}
                                className="story-img"
                                onLoad={() => setImageLoaded(true)}
                                priority
                            />
                            <div
                                className="image-overlay"
                                style={{ background: `linear-gradient(135deg, ${chapter.accent}20, transparent)` }}
                            />
                        </motion.div>

                        {/* Content */}
                        <div className="chapter-content-v2">
                            {/* Year badge */}
                            <motion.span
                                className="year-badge"
                                style={{ backgroundColor: chapter.accent }}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                {chapter.year}
                            </motion.span>

                            {/* Title */}
                            <motion.h2
                                className="chapter-title-v2"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.15 }}
                            >
                                <span className="chapter-icon-inline">{chapter.icon}</span>
                                {chapter.title}
                            </motion.h2>

                            {/* Lines - revealed one by one */}
                            <div className="chapter-lines">
                                {chapter.lines.map((line, index) => (
                                    <motion.p
                                        key={index}
                                        className="story-line"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{
                                            opacity: index < visibleLines ? 1 : 0,
                                            x: index < visibleLines ? 0 : -20,
                                        }}
                                        transition={{
                                            duration: 0.4,
                                            ease: "easeOut",
                                            delay: index < visibleLines ? 0 : 0.3
                                        }}
                                    >
                                        {line}
                                    </motion.p>
                                ))}
                            </div>

                            {/* Chapter indicator */}
                            <div className="chapter-indicator">
                                {currentChapter + 1} / {storyData.length}
                            </div>
                        </div>
                    </motion.article>
                </AnimatePresence>

                {/* Navigation buttons */}
                <div className="story-nav-buttons" onClick={(e) => e.stopPropagation()}>
                    <button
                        onClick={prevChapter}
                        disabled={currentChapter === 0}
                        className="nav-btn prev"
                    >
                        ← Previous
                    </button>

                    {currentChapter < storyData.length - 1 ? (
                        <button onClick={nextChapter} className="nav-btn next">
                            Next →
                        </button>
                    ) : (
                        <a href="/" className="nav-btn next cta">
                            Let's Chat 💬
                        </a>
                    )}
                </div>

                {/* Status */}
                <p className="story-status">
                    {isPaused ? (
                        <span className="paused-text">⏸ Paused - Click anywhere to resume</span>
                    ) : visibleLines >= totalLines && currentChapter < storyData.length - 1 ? (
                        <span>Next chapter in {Math.ceil(countdown / 20)}s...</span>
                    ) : (
                        <span>Click anywhere to pause</span>
                    )}
                </p>
            </main>
        </div>
    );
}
