"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";
import { BaseCard } from "./BaseCard";

interface Stat {
    label: string;
    value: number;
    suffix?: string;
    prefix?: string;
}

interface StatsCardProps {
    stats: Stat[];
    title?: string;
}

function AnimatedCounter({
    value,
    prefix = "",
    suffix = "",
}: {
    value: number;
    prefix?: string;
    suffix?: string;
}) {
    const count = useMotionValue(0);
    const rounded = useTransform(count, (latest) => Math.round(latest));
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        const controls = animate(count, value, {
            duration: 2,
            ease: "easeOut",
        });

        const unsubscribe = rounded.on("change", (latest) => {
            setDisplayValue(latest);
        });

        return () => {
            controls.stop();
            unsubscribe();
        };
    }, [count, rounded, value]);

    return (
        <span className="tabular-nums">
            {prefix}{displayValue}{suffix}
        </span>
    );
}

export function StatsCard({ stats, title }: StatsCardProps) {
    return (
        <BaseCard variant="default" padding="lg">
            {title && (
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-6 text-center">
                    {title}
                </h3>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 + index * 0.1, duration: 0.4 }}
                        className="text-center"
                    >
                        <div className="text-3xl sm:text-4xl font-bold gradient-text mb-2">
                            <AnimatedCounter
                                value={stat.value}
                                prefix={stat.prefix}
                                suffix={stat.suffix}
                            />
                        </div>
                        <div className="text-sm text-[var(--text-muted)]">
                            {stat.label}
                        </div>
                    </motion.div>
                ))}
            </div>
        </BaseCard>
    );
}
