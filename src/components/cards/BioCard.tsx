"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { BaseCard } from "./BaseCard";

interface Social {
    type: "github" | "linkedin" | "twitter" | "email" | "devpost" | "website";
    url: string;
}

interface BioCardProps {
    name: string;
    title: string;
    photo?: string;
    shortBio: string;
    socials?: Social[];
}

const socialIcons: Record<Social["type"], React.ReactNode> = {
    github: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
        </svg>
    ),
    linkedin: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
    ),
    twitter: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    ),
    email: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
        </svg>
    ),
    devpost: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
            <path d="M6.002 1.61L0 12.004 6.002 22.39h11.996L24 12.004 17.998 1.61zm1.593 4.084h3.947c3.605 0 6.276 1.695 6.276 6.31 0 4.436-3.21 6.302-6.456 6.302H7.595zm2.517 2.449v7.714h1.241c2.646 0 3.862-1.55 3.862-3.861.009-2.569-1.096-3.853-3.767-3.853z" />
        </svg>
    ),
    website: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
    ),
};

export function BioCard({ name, title, photo, shortBio, socials = [] }: BioCardProps) {
    return (
        <BaseCard variant="elevated" padding="lg" className="text-center">
            {/* Photo */}
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="mx-auto mb-6 relative"
            >
                {photo ? (
                    <div className="relative h-32 w-32 mx-auto overflow-hidden rounded-full 
                          ring-4 ring-[var(--accent-primary)]/20">
                        <Image
                            src={photo}
                            alt={name}
                            fill
                            sizes="128px"
                            className="object-cover"
                            priority
                        />
                    </div>
                ) : (
                    <div className="h-32 w-32 mx-auto rounded-full 
                          bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)]
                          flex items-center justify-center
                          ring-4 ring-[var(--accent-primary)]/20">
                        <span className="text-4xl font-bold text-white">
                            {name.split(" ").map(n => n[0]).join("")}
                        </span>
                    </div>
                )}
            </motion.div>

            {/* Name & Title */}
            <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.4 }}
            >
                <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-1">
                    {name}
                </h2>
                <p className="text-[var(--accent-primary)] font-medium mb-4">
                    {title}
                </p>
            </motion.div>

            {/* Short Bio */}
            <motion.p
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="text-[var(--text-secondary)] leading-relaxed mb-6"
            >
                {shortBio}
            </motion.p>

            {/* Social Links */}
            {socials.length > 0 && (
                <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.4 }}
                    className="flex justify-center gap-3"
                >
                    {socials.map((social, index) => (
                        <a
                            key={index}
                            href={social.type === "email" ? `mailto:${social.url}` : social.url}
                            target={social.type === "email" ? undefined : "_blank"}
                            rel="noopener noreferrer"
                            className="flex h-10 w-10 items-center justify-center rounded-full
                         bg-[var(--bg-primary)] text-[var(--text-secondary)]
                         hover:text-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/10
                         transition-all duration-200"
                            aria-label={social.type}
                        >
                            {socialIcons[social.type]}
                        </a>
                    ))}
                </motion.div>
            )}
        </BaseCard>
    );
}
