import { motion, useReducedMotion } from "framer-motion";
import {
  Briefcase,
  Calendar,
  CheckCircle2,
  Loader2,
  type Sparkles,
} from "lucide-react";

import "./Experience.css";

type ExperienceStatus = "in-progress" | "completed";

interface ExperienceEntry {
  id: string;
  title: string;
  organization: string;
  role?: string;
  period: string;
  description: string;
  focusAreas: string[];
  status: ExperienceStatus;
}

/**
 * Reusable experience data array.
 *
 * Add a new entry here and the section renders it automatically — the numbered
 * index badge, scroll-reveal stagger, and `data-ocid` indices all derive from
 * order.
 */
export const EXPERIENCE: ExperienceEntry[] = [
  {
    id: "nxtwave",
    title: "NxtWave CCBP 4.0",
    organization: "NxtWave",
    role: "CCBP 4.0 Student · Full-Stack Development",
    period: "Present",
    description:
      "Currently pursuing my Full-Stack Development learning journey through NxtWave CCBP 4.0, gaining hands-on experience in programming, web development, problem-solving, and modern technologies.",
    focusAreas: [
      "Full-Stack Development",
      "MERN Stack",
      "Web Development",
      "Programming",
      "Problem Solving",
    ],
    status: "in-progress",
  },
  {
    id: "eduversity",
    title: "Full Stack Web Development Intern",
    organization: "Eduversity",
    period: "August 2025 – September 2025",
    description:
      "Completed a Full Stack Web Development internship at Eduversity, gaining practical exposure to web application development and strengthening my understanding of frontend and backend technologies.",
    focusAreas: [
      "Full-Stack Development",
      "Web Development",
      "Frontend",
      "Backend",
      "Programming",
    ],
    status: "completed",
  },
  {
    id: "codebind",
    title: "Full-Stack Development Intern",
    organization: "CodeBind Technologies",
    period: "June 23, 2025 – July 23, 2025",
    description:
      "Completed a Full-Stack Development internship at CodeBind Technologies, gaining practical exposure to web application development and strengthening my understanding of frontend and backend technologies.",
    focusAreas: [
      "Full-Stack Development",
      "Web Development",
      "Frontend",
      "Backend",
      "Programming",
    ],
    status: "completed",
  },
];

const STATUS_META: Record<
  ExperienceStatus,
  { label: string; Icon: typeof Sparkles }
> = {
  "in-progress": { label: "Currently Learning", Icon: Loader2 },
  completed: { label: "Completed", Icon: CheckCircle2 },
};

export function Experience() {
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
      id="experience"
      data-ocid="section.experience"
      className="experience flex min-h-screen scroll-mt-24 items-center border-b border-border px-4 py-20 md:px-6 md:py-28"
    >
      <div className="experience__grid" aria-hidden="true" />
      <div
        className="orb experience__orb experience__orb--violet"
        aria-hidden="true"
      />
      <div
        className="orb experience__orb experience__orb--cyan"
        aria-hidden="true"
      />

      <div className="mx-auto w-full max-w-6xl">
        <motion.div {...fadeUp(0)} className="max-w-3xl">
          <p className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-widest text-accent">
            <Briefcase className="h-3.5 w-3.5" aria-hidden="true" />
            #experience
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground md:text-5xl">
            Experience
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
            Internships and ongoing learning that shaped how I build — from
            structured full-stack training to real-world web application
            delivery.
          </p>
        </motion.div>

        <ol className="mt-12 grid gap-6 lg:grid-cols-3">
          {EXPERIENCE.map(
            (
              {
                id,
                title,
                organization,
                role,
                period,
                description,
                focusAreas,
                status,
              },
              index,
            ) => {
              const { label, Icon: StatusIcon } = STATUS_META[status];
              const isInProgress = status === "in-progress";

              return (
                <motion.li
                  key={id}
                  {...fadeUp(0.06 * index)}
                  data-ocid={`experience.card.${index + 1}`}
                  className="experience__card group flex h-full flex-col rounded-2xl border border-border bg-card/60 p-6 shadow-subtle transition-smooth hover:border-accent/50 md:p-7"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span
                      className="experience__index font-mono text-sm font-semibold tracking-widest text-accent"
                      aria-hidden="true"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span
                      data-ocid={`experience.status.${index + 1}`}
                      className={
                        isInProgress
                          ? "experience__status experience__status--active inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 font-mono text-[0.7rem] font-semibold uppercase tracking-wider text-accent"
                          : "experience__status inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3 py-1 font-mono text-[0.7rem] font-semibold uppercase tracking-wider text-muted-foreground"
                      }
                    >
                      <StatusIcon
                        className={
                          isInProgress
                            ? "experience__status-icon h-3.5 w-3.5"
                            : "h-3.5 w-3.5"
                        }
                        aria-hidden="true"
                      />
                      {label}
                    </span>
                  </div>

                  <h3 className="mt-4 font-display text-lg font-semibold leading-snug tracking-tight text-foreground">
                    {title}
                  </h3>

                  <p className="mt-1 text-sm font-medium text-foreground/80">
                    {organization}
                  </p>

                  {role && (
                    <p className="mt-1 text-sm text-muted-foreground">{role}</p>
                  )}

                  <p className="mt-3 inline-flex items-center gap-1.5 font-mono text-xs font-medium uppercase tracking-wider text-accent">
                    <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                    {period}
                  </p>

                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    {description}
                  </p>

                  <ul
                    data-ocid={`experience.focus.${index + 1}`}
                    className="mt-5 flex flex-wrap gap-2 border-t border-border pt-4"
                  >
                    {focusAreas.map((area) => (
                      <li
                        key={area}
                        className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3 py-1.5 font-mono text-xs font-medium text-foreground transition-smooth group-hover:border-accent/40"
                      >
                        <span
                          className="h-1.5 w-1.5 rounded-full bg-gradient-aurora"
                          aria-hidden="true"
                        />
                        {area}
                      </li>
                    ))}
                  </ul>
                </motion.li>
              );
            },
          )}
        </ol>
      </div>
    </section>
  );
}
