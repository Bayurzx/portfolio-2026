"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { BaseCard } from "./BaseCard";

interface ProjectLink {
    label: string;
    url: string;
    type: "github" | "demo" | "video" | "devpost";
}

interface ProjectCardProps {
    title: string;
    description: string;
    techStack: string[];
    image?: string;
    links?: ProjectLink[];
    achievements?: string[];
    featured?: boolean;
}

const linkIcons: Record<ProjectLink["type"], React.ReactNode> = {
    github: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
        </svg>
    ),
    demo: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
        </svg>
    ),
    video: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
            <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
    ),
    devpost: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
            <path d="M6.002 1.61L0 12.004 6.002 22.39h11.996L24 12.004 17.998 1.61zm1.593 4.084h3.947c3.605 0 6.276 1.695 6.276 6.31 0 4.436-3.21 6.302-6.456 6.302H7.595zm2.517 2.449v7.714h1.241c2.646 0 3.862-1.55 3.862-3.861.009-2.569-1.096-3.853-3.767-3.853z" />
        </svg>
    ),
};

export function ProjectCard({
    title,
    description,
    techStack,
    image,
    links = [],
    achievements = [],
    featured = false,
}: ProjectCardProps) {
    return (
        <BaseCard
            variant={featured ? "elevated" : "default"}
            padding="none"
            className={featured ? "ring-2 ring-[var(--accent-primary)]/30" : ""}
        >
            {/* Image */}
            {image && (
                <div className="relative aspect-video w-full overflow-hidden bg-[var(--bg-elevated)]">
                    <Image
                        src={image}
                        alt={title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-300 hover:scale-105"
                    />
                    {featured && (
                        <div className="absolute top-3 right-3">
                            <span className="px-3 py-1 text-xs font-semibold rounded-full
                             bg-[var(--accent-primary)] text-white">
                                Featured
                            </span>
                        </div>
                    )}
                </div>
            )}

            <div className="p-6">
                {/* Title */}
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">
                    {title}
                </h3>

                {/* Description */}
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-4">
                    {description}
                </p>

                {/* Achievements */}
                {achievements.length > 0 && (
                    <div className="mb-4">
                        {achievements.map((achievement, index) => (
                            <motion.div
                                key={index}
                                initial={{ x: -10, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.3 + index * 0.1 }}
                                className="flex items-center gap-2 text-sm text-[var(--accent-secondary)] mb-1"
                            >
                                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 flex-shrink-0">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                </svg>
                                <span>{achievement}</span>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {techStack.map((tech, index) => (
                        <motion.span
                            key={tech}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2 + index * 0.05 }}
                            className="px-2.5 py-1 text-xs font-medium rounded-full
                         bg-[var(--bg-primary)] text-[var(--text-secondary)]
                         border border-[var(--border-default)]"
                        >
                            {tech}
                        </motion.span>
                    ))}
                </div>

                {/* Links */}
                {links.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-4 border-t border-[var(--border-default)]">
                        {links.map((link, index) => (
                            <a
                                key={index}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg
                           bg-[var(--bg-primary)] text-[var(--text-secondary)]
                           hover:text-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/10
                           transition-all duration-200"
                            >
                                {linkIcons[link.type]}
                                <span>{link.label}</span>
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </BaseCard>
    );
}
