"use client";

import React from "react";
import type { CardDefinition } from "@/lib/types";
import {
    BioCard,
    ProjectCard,
    StatsCard,
    SkillsCard,
    ContactCard,
    ResumeCard,
    TimelineCard,
    CertsCard,
    MediaCard,
    CardContainer,
} from "@/components/cards";

interface CardRendererProps {
    cards: CardDefinition[];
}

/**
 * Renders an array of cards based on their type
 * Uses CardContainer for staggered animation
 */
export function CardRenderer({ cards }: CardRendererProps) {
    if (!cards || cards.length === 0) {
        return null;
    }

    return (
        <CardContainer className="grid-cols-1 md:grid-cols-2 lg:grid-cols-1">
            {cards.map((card, index) => (
                <React.Fragment key={`${card.type}-${index}`}>
                    {renderCard(card)}
                </React.Fragment>
            ))}
        </CardContainer>
    );
}

/**
 * Render individual card based on type
 */
function renderCard(card: CardDefinition): React.ReactNode {
    switch (card.type) {
        case "bio":
            return (
                <BioCard
                    name={card.data.name}
                    title={card.data.title}
                    photo={card.data.photo}
                    shortBio={card.data.shortBio}
                    socials={card.data.socials}
                />
            );

        case "project":
            return (
                <ProjectCard
                    title={card.data.title}
                    description={card.data.description}
                    techStack={card.data.techStack}
                    image={card.data.image}
                    links={card.data.links}
                    achievements={card.data.achievements}
                    featured={card.data.featured}
                />
            );

        case "stats":
            return (
                <StatsCard
                    stats={card.data.stats}
                    title={card.data.title}
                />
            );

        case "skills":
            return (
                <SkillsCard
                    categories={card.data.categories}
                    title={card.data.title}
                />
            );

        case "contact":
            return (
                <ContactCard
                    email={card.data.email}
                    socials={card.data.socials}
                    location={card.data.location}
                    availability={card.data.availability}
                />
            );

        case "resume":
            return (
                <ResumeCard
                    resumes={card.data.resumes}
                    title={card.data.title}
                />
            );

        case "timeline":
            return (
                <TimelineCard
                    events={card.data.events}
                    title={card.data.title}
                />
            );

        case "certs":
            return (
                <CertsCard
                    certs={card.data.certs}
                    title={card.data.title}
                />
            );

        case "media":
            return (
                <MediaCard
                    type={card.data.type}
                    url={card.data.url}
                    title={card.data.title}
                    caption={card.data.caption}
                />
            );

        default:
            console.warn("Unknown card type:", (card as { type: string }).type);
            return null;
    }
}
