"use client";

import { motion } from "framer-motion";
import { BaseCard } from "./BaseCard";

interface TimelineEvent {
    year: string;
    title: string;
    company?: string;
    description: string;
    type?: "work" | "education" | "achievement" | "project";
}

interface TimelineCardProps {
    events: TimelineEvent[];
    title?: string;
}

const typeColors: Record<string, string> = {
    work: "bg-blue-500",
    education: "bg-green-500",
    achievement: "bg-[var(--accent-secondary)]",
    project: "bg-[var(--accent-primary)]",
};

export function TimelineCard({ events, title }: TimelineCardProps) {
    return (
        <BaseCard variant="default" padding="lg">
            {title && (
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-6">
                    {title}
                </h3>
            )}

            <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-[var(--border-default)]" />

                {/* Events */}
                <div className="space-y-6">
                    {events.map((event, index) => (
                        <motion.div
                            key={`${event.year}-${event.title}`}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.1 + index * 0.1, duration: 0.4 }}
                            className="relative pl-8"
                        >
                            {/* Dot */}
                            <div className={`
                absolute left-0 top-1.5 h-4 w-4 rounded-full
                ${typeColors[event.type || "work"]}
                ring-4 ring-[var(--bg-surface)]
              `} />

                            {/* Content */}
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full
                                 bg-[var(--bg-elevated)] text-[var(--text-muted)]">
                                        {event.year}
                                    </span>
                                    {event.company && (
                                        <span className="text-xs text-[var(--accent-primary)]">
                                            @ {event.company}
                                        </span>
                                    )}
                                </div>

                                <h4 className="text-[var(--text-primary)] font-medium mb-1">
                                    {event.title}
                                </h4>

                                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                                    {event.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Legend */}
            <div className="mt-6 pt-4 border-t border-[var(--border-default)]">
                <div className="flex flex-wrap gap-4 text-xs text-[var(--text-muted)]">
                    <span className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-blue-500" /> Work
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-[var(--accent-secondary)]" /> Achievement
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-[var(--accent-primary)]" /> Project
                    </span>
                </div>
            </div>
        </BaseCard>
    );
}
