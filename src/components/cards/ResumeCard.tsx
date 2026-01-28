"use client";

import React from "react";
import { motion } from "framer-motion";
import { track } from "@vercel/analytics/react";
import { BaseCard } from "./BaseCard";

interface Resume {
    name: string;
    description: string;
    file: string;
    type?: "general" | "specialized" | "cv";
}

interface ResumeCardProps {
    resumes: Resume[];
    title?: string;
}

const typeIcons: Record<string, React.ReactNode> = {
    general: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
        </svg>
    ),
    specialized: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </svg>
    ),
    cv: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
            <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
        </svg>
    ),
};

const typeColors: Record<string, string> = {
    general: "from-blue-500 to-cyan-500",
    specialized: "from-purple-500 to-pink-500",
    cv: "from-[var(--accent-primary)] to-[var(--accent-secondary)]",
};

export function ResumeCard({ resumes, title }: ResumeCardProps) {
    return (
        <BaseCard variant="default" padding="lg">
            {title && (
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-6">
                    {title}
                </h3>
            )}

            <div className="space-y-3">
                {resumes.map((resume, index) => (
                    <motion.a
                        key={resume.name}
                        href={resume.file}
                        download
                        onClick={() => track('Resume Downloaded', {
                            name: resume.name,
                            url: resume.file
                        })}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.1 + index * 0.1, duration: 0.4 }}
                        className="flex items-center gap-4 p-4 rounded-xl
                       bg-[var(--bg-elevated)] border border-[var(--border-default)]
                       hover:border-[var(--accent-primary)]/30
                       hover:bg-[var(--accent-primary)]/5
                       transition-all duration-200 group cursor-pointer"
                    >
                        {/* Icon */}
                        <div className={`
              flex h-12 w-12 items-center justify-center rounded-xl
              bg-gradient-to-br ${typeColors[resume.type || "general"]}
              text-white shadow-lg
              group-hover:scale-110 transition-transform duration-200
            `}>
                            {typeIcons[resume.type || "general"]}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <h4 className="text-[var(--text-primary)] font-medium truncate">
                                {resume.name}
                            </h4>
                            <p className="text-sm text-[var(--text-muted)] truncate">
                                {resume.description}
                            </p>
                        </div>

                        {/* Download Icon */}
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg
                           text-[var(--text-muted)] group-hover:text-[var(--accent-primary)]
                           group-hover:bg-[var(--accent-primary)]/10
                           transition-all duration-200">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="7 10 12 15 17 10" />
                                <line x1="12" y1="15" x2="12" y2="3" />
                            </svg>
                        </div>
                    </motion.a>
                ))}
            </div>

            {/* Tip */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-4 text-xs text-[var(--text-muted)] text-center"
            >
                Click to download • PDF format
            </motion.p>
        </BaseCard>
    );
}
