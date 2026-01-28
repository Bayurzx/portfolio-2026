"use client";

import Fuse from "fuse.js";
import type { Scenario } from "./types";

// Import all scenario JSONs
// Scenarios are stored in src/data/scenarios for Next.js compatibility
import introScenario from "@/data/scenarios/01-introduction.json";
import originScenario from "@/data/scenarios/02-origin-story.json";
import currentRoleScenario from "@/data/scenarios/03-current-role.json";
import skillsScenario from "@/data/scenarios/04-skills-overview.json";
import kubernetesScenario from "@/data/scenarios/05-kubernetes.json";
import terraformScenario from "@/data/scenarios/06-terraform.json";
import cloudScenario from "@/data/scenarios/07-cloud-preference.json";
import languagesScenario from "@/data/scenarios/08-languages.json";
import bestProjectScenario from "@/data/scenarios/09-best-project.json";
import dockerhelperScenario from "@/data/scenarios/10-dockerhelper.json";
import saveearthScenario from "@/data/scenarios/11-saveearth.json";
import synapseScenario from "@/data/scenarios/12-synapse.json";
import hackathonProjectsScenario from "@/data/scenarios/13-hackathon-projects.json";
import githubScenario from "@/data/scenarios/14-github.json";
import currentProjectScenario from "@/data/scenarios/15-current-project.json";
import workHistoryScenario from "@/data/scenarios/16-work-history.json";
import certificationsScenario from "@/data/scenarios/17-certifications.json";
import hackathonCountScenario from "@/data/scenarios/18-hackathon-count.json";
import awardsScenario from "@/data/scenarios/19-awards.json";
import biggestChallengeScenario from "@/data/scenarios/20-biggest-challenge.json";
import whyHackathonsScenario from "@/data/scenarios/21-why-hackathons.json";
import stayUpdatedScenario from "@/data/scenarios/22-stay-updated.json";
import motivationScenario from "@/data/scenarios/23-motivation.json";
import futureGoalsScenario from "@/data/scenarios/24-future-goals.json";
import contactScenario from "@/data/scenarios/25-contact.json";
import hireMeScenario from "@/data/scenarios/26-hire-me.json";
import resumeDevopsScenario from "@/data/scenarios/27-resume-devops.json";
import resumeFullstackScenario from "@/data/scenarios/28-resume-fullstack.json";
import funFactsScenario from "@/data/scenarios/29-fun-facts.json";
import easterEggsScenario from "@/data/scenarios/30-easter-eggs.json";

// All scenarios array
const scenarios: Scenario[] = [
    introScenario as Scenario,
    originScenario as Scenario,
    currentRoleScenario as Scenario,
    skillsScenario as Scenario,
    kubernetesScenario as Scenario,
    terraformScenario as Scenario,
    cloudScenario as Scenario,
    languagesScenario as Scenario,
    bestProjectScenario as Scenario,
    dockerhelperScenario as Scenario,
    saveearthScenario as Scenario,
    synapseScenario as Scenario,
    hackathonProjectsScenario as Scenario,
    githubScenario as Scenario,
    currentProjectScenario as Scenario,
    workHistoryScenario as Scenario,
    certificationsScenario as Scenario,
    hackathonCountScenario as Scenario,
    awardsScenario as Scenario,
    biggestChallengeScenario as Scenario,
    whyHackathonsScenario as Scenario,
    stayUpdatedScenario as Scenario,
    motivationScenario as Scenario,
    futureGoalsScenario as Scenario,
    contactScenario as Scenario,
    hireMeScenario as Scenario,
    resumeDevopsScenario as Scenario,
    resumeFullstackScenario as Scenario,
    funFactsScenario as Scenario,
    easterEggsScenario as Scenario,
];

// Fuse.js configuration for fuzzy matching
const fuseOptions = {
    keys: [
        { name: "triggers", weight: 0.7 },
        { name: "keywords", weight: 0.3 },
    ],
    threshold: 0.4,
    includeScore: true,
};

const fuse = new Fuse(scenarios, fuseOptions);

/**
 * Match user input to a scenario
 * 
 * Matching priority:
 * 1. Exact trigger match (normalized)
 * 2. Keyword match (at least 2 keywords)
 * 3. Fuzzy matching via Fuse.js
 * 
 * @param input - User's question or input
 * @returns Matched scenario or null if no match
 */
export function matchScenario(input: string): Scenario | null {
    if (!input || input.trim().length === 0) {
        return null;
    }

    const normalized = input.toLowerCase().trim();

    // 1. Exact trigger match
    for (const scenario of scenarios) {
        for (const trigger of scenario.triggers) {
            if (normalized.includes(trigger.toLowerCase())) {
                return scenario;
            }
        }
    }

    // 2. Keyword match (at least 2 keywords)
    for (const scenario of scenarios) {
        const matchCount = scenario.keywords.filter((keyword) =>
            normalized.includes(keyword.toLowerCase())
        ).length;

        if (matchCount >= 2) {
            return scenario;
        }
    }

    // 3. Fuzzy matching with Fuse.js
    const results = fuse.search(normalized);
    if (results.length > 0 && results[0].score !== undefined && results[0].score < 0.5) {
        return results[0].item;
    }

    // No match found
    return null;
}

/**
 * Get all available scenarios
 */
export function getAllScenarios(): Scenario[] {
    return scenarios;
}

/**
 * Get a scenario by ID
 */
export function getScenarioById(id: string): Scenario | null {
    return scenarios.find((s) => s.id === id) || null;
}

/**
 * Get default suggestions from the first scenario or a default set
 */
export function getDefaultSuggestions(): string[] {
    if (scenarios.length > 0 && scenarios[0].response.suggestions.length > 0) {
        return scenarios[0].response.suggestions;
    }

    return [
        "Who are you?",
        "Tell me about your projects",
        "What's your tech stack?",
        "How did you get into tech?",
        "Show me your certifications",
        "Why so many hackathons?",
        "How can I contact you?",
        "I want to hire you",
    ];
}

/**
 * Get random questions from all scenarios
 * Returns objects with title (short display) and question (full question)
 */
export interface BubbleQuestion {
    title: string;
    question: string;
}

export function getRandomQuestions(count: number = 3): BubbleQuestion[] {
    // Mapping of scenario names to proper full questions
    const questionMap: Record<string, string> = {
        "Introduction": "Who are you?",
        "Origin Story": "How did you get into tech?",
        "Current Role": "What's your current role?",
        "Skills Overview": "What are your main skills?",
        "Kubernetes": "Tell me about your Kubernetes experience",
        "Terraform": "What's your experience with Terraform?",
        "Cloud Preference": "Which cloud platform do you prefer?",
        "Languages": "What programming languages do you use?",
        "Best Project": "What's your best project?",
        "DockerHelper": "Tell me about DockerHelper",
        "SaveEarth": "Tell me about the SaveEarth project",
        "Synapse": "What is Synapse?",
        "Hackathon Projects": "What hackathon projects have you built?",
        "GitHub": "Where can I find your GitHub?",
        "Current Project": "What are you currently working on?",
        "Work History": "Tell me about your work experience",
        "Certifications": "What certifications do you have?",
        "Hackathon Count": "How many hackathons have you done?",
        "Awards": "What awards have you won?",
        "Biggest Challenge": "What's your biggest challenge?",
        "Why Hackathons": "Why do you do so many hackathons?",
        "Stay Updated": "How do you stay updated with tech?",
        "Motivation": "What motivates you?",
        "Future Goals": "What are your future goals?",
        "Contact": "How can I contact you?",
        "Hire Me": "I want to hire you",
        "Resume DevOps": "Show me your DevOps resume",
        "Resume Fullstack": "Show me your fullstack resume",
        "Fun Facts": "Tell me some fun facts about you",
        "Easter Eggs": "Any hidden surprises?",
    };

    // Collect sample questions from all scenarios
    const allQuestions: BubbleQuestion[] = scenarios.map((s) => ({
        title: s.name,
        question: questionMap[s.name] || `Tell me about ${s.name.toLowerCase()}`,
    }));

    // Shuffle and pick random ones
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}
