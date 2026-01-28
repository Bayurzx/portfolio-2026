"use client";

import React from "react";
import { motion } from "framer-motion";
import { BaseCard } from "./BaseCard";

type SkillLevel = "beginner" | "intermediate" | "advanced" | "expert";

interface Skill {
    name: string;
    level?: SkillLevel;
}

interface SkillCategory {
    name: string;
    skills: Skill[];
    icon?: string;
}

interface SkillsCardProps {
    categories: SkillCategory[];
    title?: string;
}

const levelColors: Record<SkillLevel, string> = {
    beginner: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    intermediate: "bg-green-500/20 text-green-400 border-green-500/30",
    advanced: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    expert: "bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] border-[var(--accent-primary)]/30",
};

const categoryIcons: Record<string, React.ReactNode> = {
    "Cloud & Infrastructure": (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
            <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
        </svg>
    ),
    "Programming": (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
        </svg>
    ),
    "DevOps & CI/CD": (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
    ),
};

export function SkillsCard({ categories, title }: SkillsCardProps) {
    return (
        <BaseCard variant="default" padding="lg">
            {title && (
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-6">
                    {title}
                </h3>
            )}

            <div className="space-y-6">
                {categories.map((category, catIndex) => (
                    <motion.div
                        key={category.name}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 + catIndex * 0.1, duration: 0.4 }}
                    >
                        {/* Category Header */}
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-[var(--accent-primary)]">
                                {categoryIcons[category.name] || (
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                                    </svg>
                                )}
                            </span>
                            <h4 className="text-sm font-semibold text-[var(--text-primary)]">
                                {category.name}
                            </h4>
                        </div>

                        {/* Skills */}
                        <div className="flex flex-wrap gap-2">
                            {category.skills.map((skill, skillIndex) => (
                                <motion.span
                                    key={skill.name}
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.2 + catIndex * 0.1 + skillIndex * 0.03 }}
                                    className={`
                    px-3 py-1.5 text-sm font-medium rounded-lg border
                    transition-all duration-200 hover:scale-105
                    ${skill.level ? levelColors[skill.level] : "bg-[var(--bg-elevated)] text-[var(--text-secondary)] border-[var(--border-default)]"}
                  `}
                                >
                                    {skill.name}
                                </motion.span>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Legend */}
            <div className="mt-6 pt-4 border-t border-[var(--border-default)]">
                <div className="flex flex-wrap gap-4 text-xs text-[var(--text-muted)]">
                    <span className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-[var(--accent-primary)]" /> Expert
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-purple-500" /> Advanced
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-green-500" /> Intermediate
                    </span>
                </div>
            </div>
        </BaseCard>
    );
}
