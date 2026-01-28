import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Adebayo Omolumo | DevOps & Cloud Engineer",
    description:
        "Senior DevOps & Cloud Engineer with 8+ years of experience in AWS, Azure, GCP, Kubernetes, and Terraform.",
};

export default function PortfolioPage() {
    return (
        <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-[var(--border-default)]">
                <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
                    <Link href="/" className="text-lg font-semibold hover:text-[var(--accent-primary)] transition-colors">
                        ← Interactive Version
                    </Link>
                    <nav className="flex items-center gap-6">
                        <a href="#about" className="text-sm hover:text-[var(--accent-primary)]">About</a>
                        <a href="#skills" className="text-sm hover:text-[var(--accent-primary)]">Skills</a>
                        <a href="#projects" className="text-sm hover:text-[var(--accent-primary)]">Projects</a>
                        <a href="#experience" className="text-sm hover:text-[var(--accent-primary)]">Experience</a>
                        <a href="#contact" className="text-sm hover:text-[var(--accent-primary)]">Contact</a>
                    </nav>
                </div>
            </header>

            {/* Hero */}
            <section className="pt-32 pb-20 px-4">
                <div className="mx-auto max-w-4xl text-center">
                    <div className="mx-auto mb-6 flex h-32 w-32 items-center justify-center rounded-full
                          bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)]
                          shadow-lg shadow-[var(--accent-primary)]/20">
                        <span className="text-5xl">👋</span>
                    </div>
                    <h1 className="mb-4 text-4xl font-bold sm:text-5xl">
                        Hi, I&apos;m <span className="gradient-text">Adebayo Omolumo</span>
                    </h1>
                    <p className="mb-6 text-xl text-[var(--text-secondary)]">
                        Senior DevOps & Cloud Engineer | Full Stack Developer
                    </p>
                    <p className="mx-auto max-w-2xl text-[var(--text-muted)] mb-8">
                        I build the invisible infrastructure that makes great software possible.
                        8+ years turning complex cloud challenges into elegant, automated solutions.
                    </p>
                    <div className="flex justify-center gap-4">
                        <a
                            href="#contact"
                            className="px-6 py-3 rounded-full bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white font-medium hover:shadow-lg transition-all"
                        >
                            Get in Touch
                        </a>
                        <a
                            href="#projects"
                            className="px-6 py-3 rounded-full border border-[var(--border-default)] hover:border-[var(--accent-primary)] transition-colors"
                        >
                            View Projects
                        </a>
                    </div>
                </div>
            </section>

            {/* About */}
            <section id="about" className="py-20 px-4 bg-[var(--bg-surface)]">
                <div className="mx-auto max-w-4xl">
                    <h2 className="text-3xl font-bold mb-8 text-center">About Me</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <StatCard number="8+" label="Years Experience" />
                        <StatCard number="15+" label="Hackathons" />
                        <StatCard number="10+" label="Certifications" />
                    </div>
                    <p className="mt-8 text-[var(--text-secondary)] text-center max-w-3xl mx-auto">
                        From founding my own agency to architecting enterprise Kubernetes clusters for Africa&apos;s largest bank,
                        I specialize in Multi-Cloud (AWS, Azure, GCP), container orchestration, and Infrastructure as Code.
                        I ship fast, break things (in staging), and automate everything else.
                    </p>
                </div>
            </section>

            {/* Skills */}
            <section id="skills" className="py-20 px-4">
                <div className="mx-auto max-w-4xl">
                    <h2 className="text-3xl font-bold mb-8 text-center">Skills & Technologies</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <SkillCategory
                            title="Cloud & Infrastructure"
                            skills={["AWS", "Azure", "GCP", "Kubernetes", "Docker", "Terraform", "OpenShift"]}
                        />
                        <SkillCategory
                            title="Programming"
                            skills={["Python", "TypeScript", "Rust", "Bash", "Go"]}
                        />
                        <SkillCategory
                            title="CI/CD & DevOps"
                            skills={["GitHub Actions", "GitLab CI", "ArgoCD", "CircleCI", "Ansible"]}
                        />
                    </div>
                </div>
            </section>

            {/* Projects */}
            <section id="projects" className="py-20 px-4 bg-[var(--bg-surface)]">
                <div className="mx-auto max-w-5xl">
                    <h2 className="text-3xl font-bold mb-8 text-center">Featured Projects</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <ProjectCard
                            title="DockerHelper"
                            description="AI-powered tool that generates optimized Docker configurations from Git repos using LLMs and RAG."
                            tech={["Python", "FastAPI", "LangChain", "Docker", "Gemini"]}
                            github="https://github.com/Bayurzx/dockerhelper"
                            demo="https://www.youtube.com/watch?v=pvCWHUv3t00"
                        />
                        <ProjectCard
                            title="SaveEarth"
                            description="Award-winning AI platform for endangered species awareness using Azure Custom Vision. Won 2 hackathons."
                            tech={["Azure", "AI/ML", "React", "Custom Vision"]}
                            github="https://github.com/Bayurzx/SE"
                            demo="https://www.youtube.com/watch?v=t8w5vo5yMLc"
                        />
                        <ProjectCard
                            title="Synapse"
                            description="Intelligent loan management platform with real-time credit intelligence and ML-powered predictions."
                            tech={["Python", "ML", "FastAPI", "React", "PostgreSQL"]}
                            github="https://github.com/Bayurzx/credit_ai"
                            demo="https://synapse-lma.vercel.app/"
                        />
                        <ProjectCard
                            title="UBA K8s Infrastructure"
                            description="Production-grade, HA Kubernetes cluster for banking workloads with zero-trust networking on AWS."
                            tech={["AWS", "Kubernetes", "Terraform", "Calico", "Velero"]}
                        />
                    </div>
                </div>
            </section>

            {/* Experience */}
            <section id="experience" className="py-20 px-4">
                <div className="mx-auto max-w-4xl">
                    <h2 className="text-3xl font-bold mb-8 text-center">Experience</h2>
                    <div className="space-y-8">
                        <ExperienceCard
                            year="2024 - Present"
                            title="Senior Cloud DevOps Engineer"
                            company="Infometics (UBA Group)"
                            description="Architecting K8s clusters and secure CI/CD pipelines for Africa's largest bank. Leading enterprise cloud infrastructure."
                        />
                        <ExperienceCard
                            year="2019 - Present"
                            title="Founder & Lead Engineer"
                            company="Iglumtech"
                            description="Founded and grew a tech agency from web development to multi-cloud DevOps consulting. Served startups and SMBs."
                        />
                        <ExperienceCard
                            year="2017 - 2019"
                            title="Frontend Developer"
                            company="Freelance"
                            description="Built websites for university departments and local businesses. First professional coding experience."
                        />
                    </div>
                </div>
            </section>

            {/* Certifications */}
            <section className="py-20 px-4 bg-[var(--bg-surface)]">
                <div className="mx-auto max-w-4xl">
                    <h2 className="text-3xl font-bold mb-8 text-center">Certifications</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <CertBadge name="Azure DevOps Engineer Expert" issuer="Microsoft" />
                        <CertBadge name="Azure AI Engineer Expert" issuer="Microsoft" />
                        <CertBadge name="Professional Cloud Architect" issuer="Google Cloud" />
                        <CertBadge name="Cloud Security Engineer" issuer="Google Cloud" />
                        <CertBadge name="Azure Administrator" issuer="Microsoft" />
                        <CertBadge name="Azure Developer" issuer="Microsoft" />
                        <CertBadge name="Associate Cloud Engineer" issuer="Google Cloud" />
                        <CertBadge name="Solutions Architect" issuer="AWS" />
                    </div>
                </div>
            </section>

            {/* Contact */}
            <section id="contact" className="py-20 px-4">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold mb-4">Let&apos;s Connect</h2>
                    <p className="text-[var(--text-muted)] mb-8">
                        Open to remote opportunities in cloud architecture, Kubernetes, and DevOps strategy.
                    </p>
                    <a
                        href="mailto:bayurzx@gmail.com"
                        className="inline-block px-8 py-4 rounded-full bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white font-medium hover:shadow-lg transition-all text-lg"
                    >
                        bayurzx@gmail.com
                    </a>
                    <div className="flex justify-center gap-6 mt-8">
                        <SocialLink href="https://github.com/Bayurzx" label="GitHub" />
                        <SocialLink href="https://linkedin.com/in/adebayo-omolumo" label="LinkedIn" />
                        <SocialLink href="https://x.com/AdebayoOmolumo" label="Twitter/X" />
                        <SocialLink href="https://devpost.com/bayurzx" label="Devpost" />
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 px-4 border-t border-[var(--border-default)] text-center text-sm text-[var(--text-muted)]">
                <p>© 2026 Adebayo Omolumo. Built with Next.js & ❤️</p>
                <p className="mt-2">
                    <Link href="/" className="hover:text-[var(--accent-primary)]">
                        Try the AI-powered interactive version →
                    </Link>
                </p>
            </footer>
        </div>
    );
}

// Component: Stat Card
function StatCard({ number, label }: { number: string; label: string }) {
    return (
        <div className="text-center p-6 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-default)]">
            <div className="text-4xl font-bold gradient-text mb-2">{number}</div>
            <div className="text-sm text-[var(--text-muted)]">{label}</div>
        </div>
    );
}

// Component: Skill Category
function SkillCategory({ title, skills }: { title: string; skills: string[] }) {
    return (
        <div className="p-6 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-default)]">
            <h3 className="font-semibold mb-4 text-[var(--accent-primary)]">{title}</h3>
            <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                    <span
                        key={skill}
                        className="px-3 py-1 rounded-full bg-[var(--bg-primary)] border border-[var(--border-default)] text-sm"
                    >
                        {skill}
                    </span>
                ))}
            </div>
        </div>
    );
}

// Component: Project Card
function ProjectCard({
    title,
    description,
    tech,
    github,
    demo,
}: {
    title: string;
    description: string;
    tech: string[];
    github?: string;
    demo?: string;
}) {
    return (
        <div className="p-6 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-default)] hover:border-[var(--accent-primary)] transition-colors">
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-[var(--text-muted)] mb-4 text-sm">{description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
                {tech.map((t) => (
                    <span key={t} className="px-2 py-0.5 rounded-md bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] text-xs">
                        {t}
                    </span>
                ))}
            </div>
            <div className="flex gap-4">
                {github && (
                    <a href={github} target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent-primary)]">
                        GitHub →
                    </a>
                )}
                {demo && (
                    <a href={demo} target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent-primary)]">
                        Demo →
                    </a>
                )}
            </div>
        </div>
    );
}

// Component: Experience Card
function ExperienceCard({
    year,
    title,
    company,
    description,
}: {
    year: string;
    title: string;
    company: string;
    description: string;
}) {
    return (
        <div className="flex gap-6">
            <div className="w-28 flex-shrink-0 text-sm text-[var(--accent-primary)] font-medium">{year}</div>
            <div className="flex-1 pb-8 border-l-2 border-[var(--border-default)] pl-6 relative">
                <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-[var(--accent-primary)]" />
                <h3 className="font-semibold">{title}</h3>
                <p className="text-[var(--text-secondary)]">{company}</p>
                <p className="text-sm text-[var(--text-muted)] mt-2">{description}</p>
            </div>
        </div>
    );
}

// Component: Cert Badge
function CertBadge({ name, issuer }: { name: string; issuer: string }) {
    return (
        <div className="p-4 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-default)] text-center">
            <div className="text-xs text-[var(--accent-primary)] mb-1">{issuer}</div>
            <div className="text-sm font-medium">{name}</div>
        </div>
    );
}

// Component: Social Link
function SocialLink({ href, label }: { href: string; label: string }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-full border border-[var(--border-default)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-colors text-sm"
        >
            {label}
        </a>
    );
}
