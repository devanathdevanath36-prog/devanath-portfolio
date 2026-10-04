import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, Github, Linkedin } from "lucide-react";
import type { ComponentType } from "react";
import {
  SiJavascript,
  SiMongodb,
  SiNodedotjs,
  SiPython,
  SiReact,
} from "react-icons/si";

import "./Hero.css";

/**
 * Shared focus treatment. Raw anchors/buttons do not inherit the shadcn
 * button focus styles, so the ring is applied explicitly — matching the
 * class string used by the Navbar.
 */
const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

interface TechChip {
  label: string;
  Icon: ComponentType<{ className?: string }>;
  position: string;
}

const TECH_CHIPS: TechChip[] = [
  { label: "React", Icon: SiReact, position: "hero__chip--1" },
  { label: "JavaScript", Icon: SiJavascript, position: "hero__chip--2" },
  { label: "Node.js", Icon: SiNodedotjs, position: "hero__chip--3" },
  { label: "Python", Icon: SiPython, position: "hero__chip--4" },
  { label: "MongoDB", Icon: SiMongodb, position: "hero__chip--5" },
  { label: "GitHub", Icon: Github, position: "hero__chip--6" },
];

const SOCIAL_LINKS = [
  {
    label: "GitHub profile",
    href: "https://github.com/Deva-1706",
    Icon: Github,
    ocid: "hero.github_link",
  },
  {
    label: "LinkedIn profile",
    href: "https://www.linkedin.com/in/devanathn1706",
    Icon: Linkedin,
    ocid: "hero.linkedin_link",
  },
];

function scrollToSection(id: string) {
  const target = document.getElementById(id);
  if (!target) return;
  target.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function Hero() {
  const prefersReducedMotion = useReducedMotion();

  const fadeUp = (delay: number) => ({
    initial: prefersReducedMotion ? false : { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: prefersReducedMotion
      ? { duration: 0 }
      : { duration: 0.6, delay, ease: "easeOut" as const },
  });

  return (
    <section
      id="home"
      data-ocid="section.home"
      className="hero flex min-h-screen scroll-mt-24 items-center border-b border-border px-4 pb-24 pt-28 md:px-6 md:pb-28 md:pt-32"
    >
      <div className="hero__grid" aria-hidden="true" />
      <div className="hero__dots" aria-hidden="true" />
      <div className="orb hero__orb hero__orb--violet" aria-hidden="true" />
      <div className="orb hero__orb hero__orb--cyan" aria-hidden="true" />

      <div className="mx-auto grid w-full max-w-6xl items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        {/* ------------------------------ Intro ------------------------------ */}
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <motion.span
            {...fadeUp(0)}
            data-ocid="hero.availability_badge"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-gradient-aurora-subtle px-3.5 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-widest text-foreground"
          >
            <span className="hero__status-dot" aria-hidden="true" />
            Available for opportunities
          </motion.span>

          <motion.p
            {...fadeUp(0.08)}
            className="mt-7 font-mono text-xs font-semibold uppercase tracking-[0.3em] text-accent"
          >
            Hello, I&apos;m
          </motion.p>

          <motion.h1
            {...fadeUp(0.16)}
            className="mt-3 font-display font-bold leading-[1.02] tracking-tight text-foreground"
            style={{ fontSize: "clamp(2.75rem, 8vw, 5rem)" }}
          >
            Devanath N
          </motion.h1>

          <motion.h2
            {...fadeUp(0.24)}
            className="mt-4 font-display text-2xl font-semibold tracking-tight text-muted-foreground md:text-3xl"
          >
            Full-Stack Developer
          </motion.h2>

          <motion.p
            {...fadeUp(0.32)}
            className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg"
          >
            I design and ship fast, accessible web products — from typed React
            interfaces and design systems to Motoko canisters running on the
            Internet Computer.
          </motion.p>

          <motion.p
            {...fadeUp(0.4)}
            className="mt-5 font-mono text-sm text-muted-foreground"
          >
            Learn <span className="text-accent">→</span> Build{" "}
            <span className="text-accent">→</span> Improve{" "}
            <span className="text-accent">→</span> Grow{" "}
            <span aria-hidden="true">🚀</span>
          </motion.p>

          <motion.div
            {...fadeUp(0.48)}
            className="mt-9 flex items-center gap-3"
          >
            {SOCIAL_LINKS.map(({ label, href, Icon, ocid }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                data-ocid={ocid}
                className={cn(
                  "grid h-11 w-11 place-items-center rounded-full border border-border bg-card/60 text-muted-foreground transition-smooth hover:-translate-y-0.5 hover:border-accent/50 hover:text-foreground hover:shadow-glow-accent",
                  FOCUS_RING,
                )}
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </motion.div>
        </div>

        {/* --------------------------- Developer visual --------------------------- */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : { duration: 0.7, delay: 0.2, ease: "easeOut" }
          }
          className="order-first lg:order-last"
          aria-hidden="true"
        >
          <div className="hero__visual">
            <div className="hero__ring hero__ring--outer">
              <span className="hero__ring-node" />
            </div>
            <div className="hero__ring hero__ring--mid">
              <span className="hero__ring-node" />
            </div>
            <div className="hero__ring hero__ring--inner" />

            <div className="hero__core">
              <img
                src="/assets/images/devanath-portrait.jpeg"
                alt=""
                width={512}
                height={512}
                loading="eager"
                decoding="async"
                className="hero__portrait"
              />
            </div>

            {TECH_CHIPS.map(({ label, Icon, position }) => (
              <span key={label} className={cn("hero__chip", position)}>
                <Icon className="h-3.5 w-3.5" />
                {label}
              </span>
            ))}

            <div className="hero__code">
              <div className="hero__code-line">
                <span className="hero__code-key">const</span>
                <span>stack = [</span>
              </div>
              <div className="hero__code-line">
                <span className="hero__code-str">&quot;react&quot;</span>
                <span>,</span>
                <span className="hero__code-str">&quot;motoko&quot;</span>
              </div>
              <div className="hero__code-line">
                <span>];</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* --------------------------- Scroll indicator --------------------------- */}
      <motion.button
        type="button"
        data-ocid="hero.scroll_indicator"
        onClick={() => scrollToSection("about")}
        initial={prefersReducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={
          prefersReducedMotion ? { duration: 0 } : { duration: 0.6, delay: 0.9 }
        }
        className={cn(
          "absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1.5 rounded-full px-3 py-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground md:flex",
          FOCUS_RING,
        )}
      >
        Scroll to explore
        <ArrowDown className="hero__scroll-arrow h-4 w-4" />
      </motion.button>
    </section>
  );
}
