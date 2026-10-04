import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Code2,
  GraduationCap,
  Rocket,
  Sparkles,
} from "lucide-react";
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
} from "react-icons/si";

import "./About.css";

interface ProfileFact {
  label: string;
  Icon: ComponentType<{ className?: string }>;
}

const PROFILE_FACTS: ProfileFact[] = [
  { label: "Full-Stack Developer", Icon: Code2 },
  { label: "Computer Science Graduate", Icon: GraduationCap },
  { label: "MCA Student", Icon: BookOpen },
  { label: "Currently Learning & Building", Icon: Rocket },
];

interface TechItem {
  label: string;
  Icon: ComponentType<{ className?: string }>;
}

const TECH_STACK: TechItem[] = [
  { label: "HTML", Icon: SiHtml5 },
  { label: "CSS", Icon: SiCss },
  { label: "JavaScript", Icon: SiJavascript },
  { label: "React", Icon: SiReact },
  { label: "Node.js", Icon: SiNodedotjs },
  { label: "Express.js", Icon: SiExpress },
  { label: "MongoDB", Icon: SiMongodb },
  { label: "Python", Icon: SiPython },
  { label: "Git", Icon: SiGit },
  { label: "GitHub", Icon: SiGithub },
];

const BIO_PARAGRAPHS = [
  "I'm a Full-Stack Development learner and Computer Science graduate passionate about building modern, practical, and user-friendly web applications.",
  "I'm currently pursuing my Master of Computer Applications (MCA) and continuing my development journey as an NxtWave CCBP 4.0 student, where I'm strengthening my skills in web development, programming, and problem-solving.",
  "I enjoy working with technologies such as HTML, CSS, JavaScript, React, Node.js, Express.js, MongoDB, Python, Git, and GitHub. I'm also exploring AI-powered applications and learning how AI can be integrated with modern web technologies.",
  "I believe the best way to learn technology is by building. Through projects, experimentation, debugging, and continuous learning, I'm working toward becoming a stronger Full-Stack Developer.",
];

const APPROACH_STEPS = ["Learn", "Build", "Improve", "Grow"];

export function About() {
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
      id="about"
      data-ocid="section.about"
      className="about flex min-h-screen scroll-mt-24 items-center border-b border-border px-4 py-20 md:px-6 md:py-28"
    >
      <div className="about__grid" aria-hidden="true" />
      <div className="orb about__orb about__orb--violet" aria-hidden="true" />
      <div className="orb about__orb about__orb--cyan" aria-hidden="true" />

      <div className="mx-auto w-full max-w-6xl">
        <motion.div {...fadeUp(0)} className="max-w-3xl">
          <p className="font-mono text-xs font-semibold uppercase tracking-widest text-accent">
            #about
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground md:text-5xl">
            About Me
          </h2>
          <p className="mt-4 font-display text-xl font-semibold tracking-tight text-foreground md:text-2xl">
            Hi, I&apos;m Devanath N <span aria-hidden="true">👋</span>
          </p>
        </motion.div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.35fr_1fr] lg:gap-12">
          {/* ------------------------------ Biography ------------------------------ */}
          <motion.div {...fadeUp(0.08)} className="space-y-5">
            {BIO_PARAGRAPHS.map((paragraph) => (
              <p
                key={paragraph.slice(0, 32)}
                className="text-base leading-relaxed text-muted-foreground md:text-lg"
              >
                {paragraph}
              </p>
            ))}

            <div
              data-ocid="about.approach_card"
              className="about__approach mt-8 rounded-xl border border-border bg-card/60 p-5 shadow-subtle md:p-6"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-accent" aria-hidden="true" />
                <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground">
                  My Approach
                </h3>
              </div>
              <ol className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-3">
                {APPROACH_STEPS.map((step, index) => (
                  <li key={step} className="flex items-center gap-2">
                    <span className="rounded-full border border-border bg-secondary px-3 py-1 font-mono text-xs font-semibold text-foreground">
                      {step}
                    </span>
                    {index < APPROACH_STEPS.length - 1 ? (
                      <ArrowRight
                        className="h-3.5 w-3.5 text-accent"
                        aria-hidden="true"
                      />
                    ) : (
                      <span aria-hidden="true">🚀</span>
                    )}
                  </li>
                ))}
              </ol>
            </div>

            <p className="border-l-2 border-accent/60 pl-4 text-base leading-relaxed text-foreground md:text-lg">
              I&apos;m currently open to software development opportunities,
              internships, collaborations, and projects where I can learn,
              contribute, and grow.
            </p>
          </motion.div>

          {/* ----------------------------- Profile card ----------------------------- */}
          <motion.aside
            {...fadeUp(0.16)}
            data-ocid="about.profile_card"
            className="about__card h-fit rounded-2xl border border-border bg-card/60 p-6 shadow-subtle md:p-7"
          >
            <div className="flex items-center gap-4">
              <span className="about__avatar grid h-14 w-14 shrink-0 place-items-center rounded-full text-primary-foreground">
                <img
                  src="/assets/images/devanath-portrait.jpeg"
                  alt="Portrait of Devanath N"
                  width={112}
                  height={112}
                  loading="lazy"
                  decoding="async"
                  className="about__avatar-img"
                />
              </span>
              <div className="min-w-0">
                <p className="font-display text-lg font-semibold tracking-tight text-foreground">
                  Devanath N
                </p>
                <p className="font-mono text-xs uppercase tracking-widest text-accent">
                  Full-Stack Developer
                </p>
              </div>
            </div>

            <ul className="mt-6 space-y-3">
              {PROFILE_FACTS.map(({ label, Icon }) => (
                <li key={label} className="flex items-center gap-3">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-border bg-secondary text-accent">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    {label}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-7 border-t border-border pt-6">
              <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Tech Stack
              </h3>
              <ul
                data-ocid="about.tech_list"
                className="mt-4 flex flex-wrap gap-2"
              >
                {TECH_STACK.map(({ label, Icon }) => (
                  <li
                    key={label}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3 py-1.5 font-mono text-xs font-medium text-foreground transition-smooth hover:border-accent/50 hover:text-foreground",
                    )}
                  >
                    <Icon
                      className="h-3.5 w-3.5 text-accent"
                      aria-hidden="true"
                    />
                    {label}
                  </li>
                ))}
              </ul>
            </div>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}
