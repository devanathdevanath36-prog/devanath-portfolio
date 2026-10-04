import { motion, useReducedMotion } from "framer-motion";
import { Database, Layers, Server, Sparkles, Wrench } from "lucide-react";
import type { ComponentType } from "react";
import {
  SiCss,
  SiExpress,
  SiGit,
  SiGithub,
  SiHtml5,
  SiJavascript,
  SiMongodb,
  SiNodedotjs,
  SiPython,
  SiReact,
  SiSqlite,
} from "react-icons/si";

import "./Skills.css";

interface SkillCategory {
  id: string;
  title: string;
  blurb: string;
  Icon: ComponentType<{ className?: string }>;
  items: string[];
}

const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: "frontend",
    title: "Frontend Development",
    blurb: "Accessible, responsive interfaces built with modern web standards.",
    Icon: Layers,
    items: ["HTML5", "CSS3", "JavaScript", "React.js", "Responsive Web Design"],
  },
  {
    id: "backend",
    title: "Backend Development",
    blurb: "Server-side logic and APIs that power reliable applications.",
    Icon: Server,
    items: ["Node.js", "Express.js", "Python", "REST APIs"],
  },
  {
    id: "database",
    title: "Database",
    blurb: "Modeling, querying, and persisting application data.",
    Icon: Database,
    items: ["MongoDB", "SQL", "SQLite"],
  },
  {
    id: "tools",
    title: "Tools & Technologies",
    blurb: "The everyday toolkit for building and shipping software.",
    Icon: Wrench,
    items: ["Git", "GitHub", "VS Code", "MS Office"],
  },
  {
    id: "exploring",
    title: "Currently Exploring",
    blurb: "Areas I'm actively learning and building toward next.",
    Icon: Sparkles,
    items: [
      "MERN Stack",
      "AI-Powered Applications",
      "Full-Stack Development",
      "AI Integration",
    ],
  },
];

/** Brand logos for the chips that map to a known technology. */
const BRAND_ICONS: Record<string, ComponentType<{ className?: string }>> = {
  HTML5: SiHtml5,
  CSS3: SiCss,
  JavaScript: SiJavascript,
  "React.js": SiReact,
  "Node.js": SiNodedotjs,
  "Express.js": SiExpress,
  Python: SiPython,
  MongoDB: SiMongodb,
  SQLite: SiSqlite,
  Git: SiGit,
  GitHub: SiGithub,
};

export function Skills() {
  const prefersReducedMotion = useReducedMotion();

  const fadeUp = (delay: number) => ({
    initial: prefersReducedMotion ? false : { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: prefersReducedMotion
      ? { duration: 0 }
      : { duration: 0.55, delay, ease: "easeOut" as const },
  });

  return (
    <section
      id="skills"
      data-ocid="section.skills"
      className="skills flex min-h-screen scroll-mt-24 items-center border-b border-border px-4 py-20 md:px-6 md:py-28"
    >
      <div className="skills__grid" aria-hidden="true" />
      <div className="orb skills__orb skills__orb--violet" aria-hidden="true" />
      <div className="orb skills__orb skills__orb--cyan" aria-hidden="true" />

      <div className="mx-auto w-full max-w-6xl">
        <motion.div {...fadeUp(0)} className="max-w-3xl">
          <p className="font-mono text-xs font-semibold uppercase tracking-widest text-accent">
            #skills
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground md:text-5xl">
            Skills &amp; Technologies
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
            The languages, frameworks, and tools I use to design, build, and
            ship full-stack web applications — from the first component to the
            deployed product.
          </p>
        </motion.div>

        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SKILL_CATEGORIES.map(({ id, title, blurb, Icon, items }, index) => (
            <motion.li
              key={id}
              {...fadeUp(0.06 * index)}
              data-ocid={`skills.card.${index + 1}`}
              className="skills__card group flex h-full flex-col rounded-2xl border border-border bg-card/60 p-6 shadow-subtle transition-smooth hover:border-accent/50 md:p-7"
            >
              <div className="flex items-center gap-3">
                <span className="skills__icon grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-border bg-secondary text-accent">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="font-display text-lg font-semibold tracking-tight text-foreground">
                  {title}
                </h3>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {blurb}
              </p>

              <ul
                data-ocid={`skills.list.${index + 1}`}
                className="mt-5 flex flex-wrap gap-2"
              >
                {items.map((item) => {
                  const BrandIcon = BRAND_ICONS[item];
                  return (
                    <li
                      key={item}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3 py-1.5 font-mono text-xs font-medium text-foreground transition-smooth group-hover:border-accent/40"
                    >
                      {BrandIcon ? (
                        <BrandIcon
                          className="h-3.5 w-3.5 text-accent"
                          aria-hidden="true"
                        />
                      ) : (
                        <span
                          className="h-1.5 w-1.5 rounded-full bg-gradient-aurora"
                          aria-hidden="true"
                        />
                      )}
                      {item}
                    </li>
                  );
                })}
              </ul>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
