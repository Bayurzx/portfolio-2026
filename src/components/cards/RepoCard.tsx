import { motion } from 'framer-motion';
import { useState } from 'react';
import Image from 'next/image';

interface RepoCardProps {
    name: string;
    story: string;
    techStack: string[];
    stars: number;
    language: string;
    url: string;
    thumbnailUrl?: string;
    updatedAt?: string;
    evolutionSummary?: string;
    recentCommits?: Array<{ sha: string; message: string }>;
    isFeatured?: boolean;
}

/**
 * Calculate human-readable time difference
 */
function getTimeAgo(dateString?: string): string {
    if (!dateString) return '';

    const date = new Date(dateString.replace('Z', '+00:00'));
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Updated today';
    if (diffDays === 1) return 'Updated yesterday';
    if (diffDays < 7) return `Updated ${diffDays} days ago`;
    if (diffDays < 30) return `Updated ${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `Updated ${Math.floor(diffDays / 30)} months ago`;
    return `Updated ${Math.floor(diffDays / 365)} years ago`;
}

/**
 * Language color mapping for visual distinction
 */
const LANGUAGE_COLORS: Record<string, string> = {
    TypeScript: '#3178c6',
    JavaScript: '#f7df1e',
    Python: '#3776ab',
    Rust: '#dea584',
    Go: '#00add8',
    Java: '#b07219',
    'C++': '#f34b7d',
    C: '#555555',
    Ruby: '#cc342d',
    PHP: '#4f5d95',
    Swift: '#ffac45',
    Kotlin: '#a97bff',
    Dart: '#00b4ab',
    Shell: '#89e051',
    HTML: '#e34c26',
    CSS: '#563d7c',
    'Jupyter Notebook': '#da5b0b',
};

export const RepoCard = ({
    name,
    story,
    techStack,
    stars,
    language,
    url,
    thumbnailUrl,
    updatedAt,
    evolutionSummary,
    recentCommits,
    isFeatured = false
}: RepoCardProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [imageError, setImageError] = useState(false);
    const timeAgo = getTimeAgo(updatedAt);
    const langColor = LANGUAGE_COLORS[language] || '#6b7280';

    return (
        <motion.div
            className={`relative bg-card/60 backdrop-blur-md border border-border/40 rounded-2xl overflow-hidden 
                       shadow-lg hover:shadow-2xl transition-all duration-500 group
                       ${isFeatured ? 'md:col-span-2 lg:col-span-2' : ''}`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
        >
            {/* Gradient Border Effect on Hover */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20 
                          opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl" />

            {/* Hero Image Section */}
            <div className="relative h-40 bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10 overflow-hidden">
                {thumbnailUrl && !imageError ? (
                    <Image
                        src={thumbnailUrl}
                        alt={`${name} preview`}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                        onError={() => setImageError(true)}
                        unoptimized // GitHub raw URLs
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-6xl opacity-20 group-hover:opacity-30 transition-opacity">
                            {language === 'TypeScript' ? '📘' :
                                language === 'Python' ? '🐍' :
                                    language === 'JavaScript' ? '📒' :
                                        language === 'Rust' ? '🦀' :
                                            language === 'Go' ? '🔵' :
                                                '💻'}
                        </div>
                    </div>
                )}

                {/* Updated Badge */}
                {timeAgo && (
                    <div className="absolute top-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-sm 
                                  rounded-full text-xs text-white/80 font-medium">
                        {timeAgo}
                    </div>
                )}

                {/* Stars Badge */}
                <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 
                              bg-yellow-500/90 backdrop-blur-sm rounded-full text-xs font-bold text-black">
                    ⭐ {stars}
                </div>
            </div>

            {/* Content Section */}
            <div className="p-5">
                {/* Title - Fixed: No gradient, proper truncation */}
                <h3 className="text-xl font-bold text-foreground mb-2 truncate" title={name}>
                    {name}
                </h3>

                {/* Evolution Summary (new field) */}
                {evolutionSummary && (
                    <p className="text-primary text-sm font-medium mb-3 line-clamp-1 italic">
                        "{evolutionSummary}"
                    </p>
                )}

                {/* Story - Expandable */}
                <div className="relative">
                    <p className={`text-muted-foreground text-sm leading-relaxed 
                                  ${isExpanded ? '' : 'line-clamp-3'}`}>
                        {story}
                    </p>
                    {story.length > 150 && (
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="text-primary text-xs font-medium mt-1 hover:underline"
                        >
                            {isExpanded ? 'Show less' : 'Read more...'}
                        </button>
                    )}
                </div>

                {/* Recent Activity - Show for featured cards or when commits available */}
                {(() => {
                    // Safely parse recentCommits - may come as string from storage
                    let commits: Array<{ sha: string; message: string }> = [];
                    if (recentCommits) {
                        if (Array.isArray(recentCommits)) {
                            commits = recentCommits;
                        } else if (typeof recentCommits === 'string') {
                            try {
                                commits = JSON.parse(recentCommits);
                            } catch { /* ignore parse errors */ }
                        }
                    }

                    if (commits.length > 0 && isFeatured) {
                        return (
                            <div className="mt-4 mb-4 p-3 bg-secondary/30 rounded-lg border border-border/30">
                                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
                                    <span>📝</span> Recent Activity
                                </h4>
                                <ul className="space-y-1.5">
                                    {commits.slice(0, 3).map((commit) => (
                                        <li key={commit.sha} className="flex items-start gap-2 text-xs">
                                            <span className="text-primary font-mono bg-primary/10 px-1 rounded shrink-0">
                                                {commit.sha}
                                            </span>
                                            <span className="text-muted-foreground line-clamp-1">
                                                {commit.message.split('\n')[0]}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        );
                    }
                    return null;
                })()}

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-1.5 mt-4 mb-4">
                    {/* Language pill with color */}
                    {language && (
                        <span
                            className="px-2 py-1 rounded-full text-xs font-semibold text-white"
                            style={{ backgroundColor: langColor }}
                        >
                            {language}
                        </span>
                    )}
                    {techStack.slice(0, 3).map((tech) => (
                        <span
                            key={tech}
                            className="px-2 py-1 bg-secondary/80 text-secondary-foreground rounded-full text-xs border border-border/30"
                        >
                            {tech}
                        </span>
                    ))}
                    {techStack.length > 3 && (
                        <span className="px-2 py-1 bg-secondary/50 text-muted-foreground rounded-full text-xs">
                            +{techStack.length - 3}
                        </span>
                    )}
                </div>

                {/* Footer Link */}
                <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary hover:text-primary/80 
                             transition-all text-sm font-medium group-hover:translate-x-1 duration-300"
                >
                    <span>Explore on GitHub</span>
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1"
                        fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </a>
            </div>
        </motion.div>
    );
};
