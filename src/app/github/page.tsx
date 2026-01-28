'use client';

import { useEffect, useState, useCallback } from 'react';
import { RepoCard } from '@/components/cards/RepoCard';
import { getGitHubRepos, Repo } from '@/lib/api';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function GitHubPage() {
    const [repos, setRepos] = useState<Repo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<string>('');

    const fetchRepos = useCallback(async () => {
        setLoading(true);
        setError(null);

        const result = await getGitHubRepos();

        setRepos(result.repos || []);
        setError(result.error || null);
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchRepos();
    }, [fetchRepos]);

    const filteredRepos = filter
        ? repos.filter(r => r.language?.toLowerCase() === filter.toLowerCase())
        : repos;

    // Extract unique languages, defined and non-empty
    const languages = [...new Set(repos.map(r => r.language).filter(Boolean))].sort();

    if (loading) {
        return (
            <div className="container mx-auto py-20 px-4 min-h-screen flex flex-col items-center justify-center">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-muted-foreground animate-pulse">Analyzing GitHub profile...</p>
            </div>
        );
    }

    // Error state with retry option
    if (error) {
        return (
            <div className="container mx-auto py-20 px-4 min-h-screen flex flex-col items-center justify-center">
                <motion.div
                    className="text-center max-w-md"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="text-6xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold mb-2 text-foreground">Something went wrong</h2>
                    <p className="text-muted-foreground mb-6">{error}</p>
                    <button
                        onClick={fetchRepos}
                        className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium 
                                   hover:bg-primary/90 transition-all duration-200 
                                   shadow-lg hover:shadow-xl active:scale-95"
                    >
                        Try Again
                    </button>
                    <div className="mt-4">
                        <Link
                            href="/"
                            className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                            ← Back to Portfolio
                        </Link>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 bg-background">
            <div className="container mx-auto max-w-7xl">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12 text-center"
                >
                    <Link href="/" className="inline-block mb-6 text-sm text-muted-foreground hover:text-primary transition-colors">
                        ← Back to Portfolio
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">
                        What I&apos;ve Been Building
                    </h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                        A journey through my recent projects — AI-powered stories revealing the evolution, tech, and purpose behind each build.
                    </p>
                </motion.div>

                {/* Filter */}
                {repos.length > 0 && (
                    <motion.div
                        className="flex gap-2 flex-wrap justify-center mb-12"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <button
                            onClick={() => setFilter('')}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${!filter
                                ? 'bg-primary text-primary-foreground shadow-lg scale-105'
                                : 'bg-muted/50 hover:bg-muted text-muted-foreground'
                                }`}
                        >
                            All Projects
                        </button>
                        {languages.map(lang => (
                            <button
                                key={lang}
                                onClick={() => setFilter(lang)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${filter === lang
                                    ? 'bg-primary text-primary-foreground shadow-lg scale-105'
                                    : 'bg-muted/50 hover:bg-muted text-muted-foreground'
                                    }`}
                            >
                                {lang}
                            </button>
                        ))}
                    </motion.div>
                )}

                {/* Featured Hero - First repo gets special treatment */}
                {repos.length > 0 && !filter && (
                    <motion.div
                        className="mb-12"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <h2 className="text-sm uppercase tracking-wider text-muted-foreground mb-4 font-medium">
                            Featured Project
                        </h2>
                        <RepoCard
                            key={repos[0].id}
                            name={repos[0].display_name}
                            story={repos[0].story}
                            techStack={repos[0].tech_stack?.split(',').filter(Boolean) || []}
                            stars={repos[0].stars}
                            language={repos[0].language}
                            url={repos[0].html_url}
                            thumbnailUrl={repos[0].thumbnail_url}
                            updatedAt={repos[0].updated_at}
                            evolutionSummary={repos[0].evolution_summary}
                            recentCommits={repos[0].recent_commits}
                            isFeatured={true}
                        />
                    </motion.div>
                )}

                {/* Grid - Remaining repos or filtered results */}
                {filteredRepos.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {(filter ? filteredRepos : filteredRepos.slice(1)).map((repo, i) => (
                            <RepoCard
                                key={repo.id || i}
                                name={repo.display_name}
                                story={repo.story}
                                techStack={repo.tech_stack?.split(',').filter(Boolean) || []}
                                stars={repo.stars}
                                language={repo.language}
                                url={repo.html_url}
                                thumbnailUrl={repo.thumbnail_url}
                                updatedAt={repo.updated_at}
                                evolutionSummary={repo.evolution_summary}
                            />
                        ))}
                    </div>
                ) : repos.length === 0 ? (
                    <motion.div
                        className="text-center py-20 border border-dashed border-border rounded-xl bg-card/30"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-xl font-medium mb-2">No repositories found</h3>
                        <p className="text-muted-foreground mb-6">
                            Sync might be in progress or no public repos found.
                        </p>
                    </motion.div>
                ) : null}

                {/* Footer Link */}
                <motion.div
                    className="mt-20 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <a
                        href="https://github.com/Bayurzx"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors border-b border-transparent hover:border-foreground pb-0.5"
                    >
                        <span>View full profile on GitHub</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                    </a>
                </motion.div>
            </div>
        </div>
    );
}
