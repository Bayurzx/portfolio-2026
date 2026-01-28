"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { BaseCard } from "./BaseCard";

interface MediaCardProps {
    type: "youtube" | "image";
    url: string;
    title?: string;
    caption?: string;
}

function getYouTubeId(url: string): string | null {
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
        /^[a-zA-Z0-9_-]{11}$/,
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1] || match[0];
    }
    return null;
}

export function MediaCard({ type, url, title, caption }: MediaCardProps) {
    const youtubeId = type === "youtube" ? getYouTubeId(url) : null;

    return (
        <BaseCard variant="default" padding="none" className="overflow-hidden">
            {/* Media Content */}
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="relative"
            >
                {type === "youtube" && youtubeId ? (
                    <div className="relative aspect-video w-full bg-black">
                        <iframe
                            src={`https://www.youtube.com/embed/${youtubeId}`}
                            title={title || "YouTube video"}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="absolute inset-0 h-full w-full"
                        />
                    </div>
                ) : type === "image" ? (
                    <div className="relative aspect-video w-full bg-[var(--bg-elevated)]">
                        <Image
                            src={url}
                            alt={title || "Media image"}
                            fill
                            sizes="(max-width: 768px) 100vw, 600px"
                            className="object-cover"
                        />
                    </div>
                ) : null}
            </motion.div>

            {/* Caption */}
            {(title || caption) && (
                <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                    className="p-4"
                >
                    {title && (
                        <h4 className="text-[var(--text-primary)] font-medium mb-1">
                            {title}
                        </h4>
                    )}
                    {caption && (
                        <p className="text-sm text-[var(--text-secondary)]">
                            {caption}
                        </p>
                    )}
                </motion.div>
            )}

            {/* Play Icon Overlay for YouTube (thumbnail mode) */}
            {type === "youtube" && !youtubeId && (
                <div className="absolute inset-0 flex items-center justify-center
                        bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full
                          bg-[var(--accent-primary)] text-white shadow-lg">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8 ml-1">
                            <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                    </div>
                </div>
            )}
        </BaseCard>
    );
}
