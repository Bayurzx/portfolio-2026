"use client";

import { motion, Variants, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";

// Animation variants for card entrance/exit
export const cardVariants: Variants = {
    hidden: {
        opacity: 0,
        y: 20,
        scale: 0.95,
    },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.4,
            ease: [0.25, 0.46, 0.45, 0.94],
        },
    },
    exit: {
        opacity: 0,
        y: -10,
        scale: 0.98,
        transition: {
            duration: 0.2,
        },
    },
};

// Staggered container for multiple cards
export const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1,
        },
    },
};

interface BaseCardProps extends Omit<HTMLMotionProps<"div">, "children"> {
    children: ReactNode;
    variant?: "default" | "elevated" | "outlined" | "glass";
    padding?: "none" | "sm" | "md" | "lg";
    animate?: boolean;
}

const paddingClasses = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
};

const variantClasses = {
    default: `
    bg-[var(--bg-surface)]
    border border-[var(--border-default)]
  `,
    elevated: `
    bg-[var(--bg-elevated)]
    border border-[var(--border-default)]
    shadow-lg shadow-black/5
  `,
    outlined: `
    bg-transparent
    border-2 border-[var(--border-hover)]
  `,
    glass: `
    glass
    border border-[var(--border-default)]
  `,
};

export function BaseCard({
    children,
    variant = "default",
    padding = "md",
    animate = true,
    className = "",
    ...props
}: BaseCardProps) {
    const baseClasses = `
    rounded-2xl
    overflow-hidden
    transition-all duration-200
    hover:border-[var(--border-hover)]
  `;

    return (
        <motion.div
            variants={animate ? cardVariants : undefined}
            initial={animate ? "hidden" : undefined}
            animate={animate ? "visible" : undefined}
            exit={animate ? "exit" : undefined}
            className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${paddingClasses[padding]}
        ${className}
      `}
            {...props}
        >
            {children}
        </motion.div>
    );
}

// Container for staggered card animations
interface CardContainerProps {
    children: ReactNode;
    className?: string;
}

export function CardContainer({ children, className = "" }: CardContainerProps) {
    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className={`grid gap-4 ${className}`}
        >
            {children}
        </motion.div>
    );
}
