"use client";

import React from "react";
import { motion } from "framer-motion";
import { BaseCard } from "./BaseCard";

interface Social {
    type: "github" | "linkedin" | "twitter" | "email" | "devpost" | "website";
    url: string;
    label?: string;
}

interface ContactCardProps {
    email: string;
    socials?: Social[];
    location?: string;
    availability?: string;
}

const socialMeta: Record<Social["type"], { icon: React.ReactNode; label: string; color: string }> = {
    github: {
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
        ),
        label: "GitHub",
        color: "hover:bg-[#333] hover:text-white",
    },
    linkedin: {
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
        ),
        label: "LinkedIn",
        color: "hover:bg-[#0077B5] hover:text-white",
    },
    twitter: {
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
        ),
        label: "X (Twitter)",
        color: "hover:bg-[#1DA1F2] hover:text-white",
    },
    email: {
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
            </svg>
        ),
        label: "Email",
        color: "hover:bg-[var(--accent-primary)] hover:text-white",
    },
    devpost: {
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M6.002 1.61L0 12.004 6.002 22.39h11.996L24 12.004 17.998 1.61zm1.593 4.084h3.947c3.605 0 6.276 1.695 6.276 6.31 0 4.436-3.21 6.302-6.456 6.302H7.595zm2.517 2.449v7.714h1.241c2.646 0 3.862-1.55 3.862-3.861.009-2.569-1.096-3.853-3.767-3.853z" />
            </svg>
        ),
        label: "Devpost",
        color: "hover:bg-[#003E54] hover:text-white",
    },
    website: {
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
        ),
        label: "Website",
        color: "hover:bg-[var(--accent-secondary)] hover:text-white",
    },
};

export function ContactCard({ email, socials = [], location, availability }: ContactCardProps) {
    return (
        <BaseCard variant="elevated" padding="lg">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-6">
                Let&apos;s Connect
            </h3>

            {/* Email */}
            <motion.a
                href={`mailto:${email}`}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-3 p-4 mb-4 rounded-xl
                   bg-gradient-to-r from-[var(--accent-primary)]/10 to-[var(--accent-secondary)]/10
                   border border-[var(--accent-primary)]/20
                   hover:border-[var(--accent-primary)]/40
                   transition-all duration-200 group"
            >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg
                        bg-[var(--accent-primary)]/20 text-[var(--accent-primary)]
                        group-hover:bg-[var(--accent-primary)] group-hover:text-white
                        transition-all duration-200">
                    {socialMeta.email.icon}
                </div>
                <div>
                    <p className="text-sm text-[var(--text-muted)]">Email me at</p>
                    <p className="text-[var(--text-primary)] font-medium">{email}</p>
                </div>
            </motion.a>

            {/* Location & Availability */}
            {(location || availability) && (
                <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-wrap gap-3 mb-6"
                >
                    {location && (
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg
                           bg-[var(--bg-primary)] text-[var(--text-secondary)] text-sm">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                <circle cx="12" cy="10" r="3" />
                            </svg>
                            {location}
                        </div>
                    )}
                    {availability && (
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg
                           bg-green-500/10 text-green-400 text-sm">
                            <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                            {availability}
                        </div>
                    )}
                </motion.div>
            )}

            {/* Social Links */}
            {socials.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {socials.map((social, index) => (
                        <motion.a
                            key={social.type}
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 + index * 0.05 }}
                            className={`
                flex items-center gap-2 p-3 rounded-xl
                bg-[var(--bg-primary)] text-[var(--text-secondary)]
                border border-[var(--border-default)]
                transition-all duration-200
                ${socialMeta[social.type].color}
              `}
                        >
                            {socialMeta[social.type].icon}
                            <span className="text-sm font-medium">
                                {social.label || socialMeta[social.type].label}
                            </span>
                        </motion.a>
                    ))}
                </div>
            )}
        </BaseCard>
    );
}
