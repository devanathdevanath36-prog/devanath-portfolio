import { motion, useReducedMotion } from "framer-motion";
import { Award, BadgeCheck, Calendar, GraduationCap } from "lucide-react";
import type { ComponentType } from "react";

import "./Education.css";

interface EducationEntry {
  id: string;
  title: string;
  institution: string;
  period: string;
  percentage?: string;
  description?: string;
  status: "Currently Pursuing" | "Completed";
  Icon: ComponentType<{ className?: string }>;
}

/**
 * Reusable education data array.
 *
 * Add a new entry here and the section renders it automatically — the card
 * grid, scroll-reveal stagger, numbered badges, and `data-ocid` indices all
 * derive from order.
 */
export const EDUCATION: EducationEntry[] = [
  {
    id: "mca",
    title: "Master of Computer Applications (MCA)",
    institution: "Hindustan College of Arts and Science, Chennai",
    period: "2026 – Present",
    description:
      "Currently pursuing MCA with a focus on strengthening my knowledge of software development, programming, web technologies, and computer applications.",
    status: "Currently Pursuing",
    Icon: GraduationCap,
  },
  {
    id: "bsc-cs",
    title: "B.Sc Computer Science",
    institution: "S.A. College of Arts and Science, Chennai",
    period: "2023 – 2026",
    percentage: "70%",
    description:
      "Completed a Bachelor's degree in Computer Science with a focus on programming, software development, databases, and computer science fundamentals.",
    status: "Completed",
    Icon: Award,
  },
  {
    id: "hsc",
    title: "Higher Secondary (12th)",
    institution:
      "Bharathidasan Matriculation Higher Secondary School, Kanchipuram",
    period: "2022 – 2023",
    percentage: "65%",
    status: "Completed",
    Icon: BadgeCheck,
  },
];

export function Education() {
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
      id="education"
      data-ocid="section.education"
      className="education flex min-h-screen scroll-mt-24 items-center border-b border-border px-4 py-20 md:px-6 md:py-28"
    >
      <div className="education__grid" aria-hidden="true" />
      <div
        className="orb education__orb education__orb--violet"
        aria-hidden="true"
      />
      <div
        className="orb education__orb education__orb--cyan"
        aria-hidden="true"
      />

      <div className="mx-auto w-full max-w-6xl">
        <motion.div {...fadeUp(0)} className="max-w-3xl">
          <p className="font-mono text-xs font-semibold uppercase tracking-widest text-accent">
            #education
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground md:text-5xl">
            Education
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
            My academic path — from school fundamentals to a computer science
            degree and an ongoing master's in computer applications.
          </p>
        </motion.div>

        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {EDUCATION.map(
            (
              {
                id,
                title,
                institution,
                period,
                percentage,
                description,
                status,
                Icon,
              },
              index,
            ) => {
              const isCurrent = status === "Currently Pursuing";
              return (
                <motion.li
                  key={id}
                  {...fadeUp(0.06 * index)}
                  data-ocid={`education.card.${index + 1}`}
                  className="education__card group flex h-full flex-col rounded-2xl border border-border bg-card/60 p-6 shadow-subtle transition-smooth hover:border-accent/50 md:p-7"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="education__icon grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-border bg-secondary text-accent">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span
                      className="education__index font-mono text-sm font-semibold tracking-widest text-muted-foreground"
                      aria-hidden="true"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <h3 className="mt-5 font-display text-lg font-semibold leading-snug tracking-tight text-foreground">
                    {title}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-muted-foreground">
                    {institution}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
                    <span className="inline-flex items-center gap-1.5 font-mono text-xs font-medium uppercase tracking-wider text-accent">
                      <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                      {period}
                    </span>
                    {percentage && (
                      <span className="inline-flex items-center gap-1.5 font-mono text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        <Award className="h-3.5 w-3.5" aria-hidden="true" />
                        {percentage}
                      </span>
                    )}
                  </div>

                  {description && (
                    <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                      {description}
                    </p>
                  )}

                  <div className="mt-auto pt-5">
                    <span
                      data-ocid={`education.status.${index + 1}`}
                      className={
                        isCurrent
                          ? "education__status education__status--current inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-gradient-aurora-subtle px-3 py-1 font-mono text-[0.7rem] font-semibold uppercase tracking-wider text-accent"
                          : "education__status education__status--done inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3 py-1 font-mono text-[0.7rem] font-semibold uppercase tracking-wider text-muted-foreground"
                      }
                    >
                      <span
                        className="education__status-dot h-1.5 w-1.5 rounded-full"
                        aria-hidden="true"
                      />
                      {status}
                    </span>
                  </div>
                </motion.li>
              );
            },
          )}
        </ul>
      </div>
    </section>
  );
}
