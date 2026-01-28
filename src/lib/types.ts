// Scenario Types for AI Portfolio
// These types define the structure for conversation scenarios

export type CardType =
    | "bio"
    | "project"
    | "skills"
    | "timeline"
    | "certs"
    | "contact"
    | "resume"
    | "media"
    | "stats";

export type AnimationStyle = "professional" | "playful" | "minimalist";

export type SkillLevel = "beginner" | "intermediate" | "advanced" | "expert";

export type SocialType = "github" | "linkedin" | "twitter" | "email" | "devpost" | "website";

export type ProjectLinkType = "github" | "demo" | "video" | "devpost";

export type TimelineEventType = "work" | "education" | "achievement" | "project";

export type ResumeType = "general" | "specialized" | "cv";

// Social link
export interface Social {
    type: SocialType;
    url: string;
    label?: string;
}

// Card data types
export interface BioCardData {
    name: string;
    title: string;
    photo?: string;
    shortBio: string;
    socials?: Social[];
}

export interface ProjectCardData {
    title: string;
    description: string;
    techStack: string[];
    image?: string;
    links?: { label: string; url: string; type: ProjectLinkType }[];
    achievements?: string[];
    featured?: boolean;
}

export interface StatsCardData {
    stats: { label: string; value: number; suffix?: string; prefix?: string }[];
    title?: string;
}

export interface SkillsCardData {
    categories: {
        name: string;
        skills: { name: string; level?: SkillLevel }[];
    }[];
    title?: string;
}

export interface ContactCardData {
    email: string;
    socials?: Social[];
    location?: string;
    availability?: string;
}

export interface ResumeCardData {
    resumes: {
        name: string;
        description: string;
        file: string;
        type?: ResumeType;
    }[];
    title?: string;
}

export interface TimelineCardData {
    events: {
        year: string;
        title: string;
        company?: string;
        description: string;
        type?: TimelineEventType;
    }[];
    title?: string;
}

export interface CertsCardData {
    certs: {
        name: string;
        issuer: string;
        image?: string;
        date?: string;
        url?: string;
    }[];
    title?: string;
}

export interface MediaCardData {
    type: "youtube" | "image";
    url: string;
    title?: string;
    caption?: string;
}

// Card definition with type discrimination
export type CardDefinition =
    | { type: "bio"; data: BioCardData }
    | { type: "project"; data: ProjectCardData }
    | { type: "stats"; data: StatsCardData }
    | { type: "skills"; data: SkillsCardData }
    | { type: "contact"; data: ContactCardData }
    | { type: "resume"; data: ResumeCardData }
    | { type: "timeline"; data: TimelineCardData }
    | { type: "certs"; data: CertsCardData }
    | { type: "media"; data: MediaCardData };

// Scenario response
export interface ScenarioResponse {
    text: string;
    voiceText?: string;
    animationStyle: AnimationStyle;
    cards: CardDefinition[];
    suggestions: string[];
}

// Full scenario structure
export interface Scenario {
    id: string;
    name: string;
    triggers: string[];
    keywords: string[];
    response: ScenarioResponse;
}
