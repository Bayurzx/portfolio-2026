"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { BaseCard } from "./BaseCard";

interface Certification {
    name: string;
    issuer: string;
    image?: string;
    date?: string;
    url?: string;
}

interface CertsCardProps {
    certs: Certification[];
    title?: string;
}

export function CertsCard({ certs, title }: CertsCardProps) {
    return (
        <BaseCard variant="default" padding="lg">
            {title && (
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-6">
                    {title}
                </h3>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {certs.map((cert, index) => (
                    <motion.div
                        key={cert.name}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.1 + index * 0.05, duration: 0.3 }}
                    >
                        {cert.url ? (
                            <a
                                href={cert.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block group"
                            >
                                <CertItem cert={cert} />
                            </a>
                        ) : (
                            <CertItem cert={cert} />
                        )}
                    </motion.div>
                ))}
            </div>

            {/* Count */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-4 text-sm text-center text-[var(--text-muted)]"
            >
                {certs.length} certifications earned
            </motion.p>
        </BaseCard>
    );
}

function CertItem({ cert }: { cert: Certification }) {
    return (
        <div className="flex flex-col items-center p-3 rounded-xl
                    bg-[var(--bg-elevated)] border border-[var(--border-default)]
                    hover:border-[var(--accent-primary)]/30
                    hover:bg-[var(--accent-primary)]/5
                    transition-all duration-200 group cursor-pointer">
            {/* Badge Image */}
            <div className="relative h-16 w-16 mb-3 group-hover:scale-110 transition-transform duration-200">
                {cert.image ? (
                    <Image
                        src={cert.image}
                        alt={cert.name}
                        fill
                        sizes="96px"
                        className="object-contain"
                    />
                ) : (
                    <div className="h-full w-full rounded-full flex items-center justify-center
                          bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)]">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                            className="h-8 w-8 text-white">
                            <circle cx="12" cy="8" r="7" />
                            <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
                        </svg>
                    </div>
                )}
            </div>

            {/* Name */}
            <h4 className="text-xs font-medium text-[var(--text-primary)] text-center line-clamp-2 mb-1">
                {cert.name}
            </h4>

            {/* Issuer */}
            <p className="text-xs text-[var(--text-muted)] text-center">
                {cert.issuer}
            </p>

            {/* Date */}
            {cert.date && (
                <p className="text-xs text-[var(--accent-primary)] mt-1">
                    {cert.date}
                </p>
            )}
        </div>
    );
}
