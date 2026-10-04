import { motion, useReducedMotion } from "framer-motion";
import {
  Award,
  BadgeCheck,
  Calendar,
  Medal,
  Sparkles,
  Trophy,
} from "lucide-react";
import type { ComponentType } from "react";

import "./Certifications.css";

interface CertificationDetail {
  label: string;
  value: string;
}

interface Certification {
  id: string;
  title: string;
  issuer: string;
  description: string;
  Icon: ComponentType<{ className?: string }>;
  details: CertificationDetail[];
}

/**
 * Reusable certifications data array.
 *
 * Add a new entry here and the section renders it automatically — the card
 * grid, scroll-reveal stagger, and `data-ocid` indices all derive from order.
 */
export const CERTIFICATIONS: Certification[] = [
  {
    id: "genai-mastery",
    title: "GenAI Mastery Workshop",
    issuer: "OpenAI + NxtWave",
    description:
      "Workshop focused on Generative AI concepts and practical applications.",
    Icon: Sparkles,
    details: [],
  },
  {
    id: "mvp-workshop",
    title: "Build and Launch Your MVP Workshop",
    issuer: "NxtWave Academy",
    description:
      "Workshop focused on building and launching a Minimum Viable Product (MVP).",
    Icon: BadgeCheck,
    details: [],
  },
  {
    id: "ai-rpa-workshop",
    title: "AI and Robotic Process Automation Workshop",
    issuer: "NxtWave",
    description:
      "Workshop covering Artificial Intelligence and Robotic Process Automation concepts.",
    Icon: Award,
    details: [],
  },
  {
    id: "dsa-codeverse-31",
    title: "DSA CodeVerse Bi-Weekly Contest #31 — Beginner",
    issuer: "NxtWave",
    description:
      "Participated in the DSA CodeVerse Bi-Weekly Contest and secured Rank 47 in the Beginner category.",
    Icon: Trophy,
    details: [{ label: "Rank", value: "47" }],
  },
  {
    id: "projexus-internship",
    title: "ProjeXus 60-Day Experiential Project-Based Learning Internship",
    issuer: "SADRE Solutions Pvt. Ltd.",
    description:
      "Completed a 60-day experiential, project-based learning internship with a technical project and an excellent performance rating.",
    Icon: Medal,
    details: [
      {
        label: "Technical Project",
        value: "Management Struggles with Scaling Startup Clients",
      },
      { label: "Performance", value: "Excellent" },
      { label: "Certificate ID", value: "PROJEXUS-2026-0003" },
    ],
  },
];

export function Certifications() {
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
      id="certifications"
      data-ocid="section.certifications"
      className="certifications flex min-h-screen scroll-mt-24 items-center border-b border-border bg-muted/30 px-4 py-20 md:px-6 md:py-28"
    >
      <div className="certifications__grid" aria-hidden="true" />
      <div
        className="orb certifications__orb certifications__orb--violet"
        aria-hidden="true"
      />
      <div
        className="orb certifications__orb certifications__orb--cyan"
        aria-hidden="true"
      />

      <div className="mx-auto w-full max-w-6xl">
        <motion.div {...fadeUp(0)} className="max-w-3xl">
          <p className="font-mono text-xs font-semibold uppercase tracking-widest text-accent">
            #certifications
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground md:text-5xl">
            Certifications
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
            Workshops, contests, and internships that sharpened my craft — from
            generative AI and automation to competitive problem solving and
            real-world project delivery.
          </p>
        </motion.div>

        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CERTIFICATIONS.map(
            ({ id, title, issuer, description, Icon, details }, index) => (
              <motion.li
                key={id}
                {...fadeUp(0.06 * index)}
                data-ocid={`certifications.card.${index + 1}`}
                className="certifications__card group flex h-full flex-col rounded-2xl border border-border bg-card/60 p-6 shadow-subtle transition-smooth hover:border-accent/50 md:p-7"
              >
                <div className="flex items-start gap-3">
                  <span className="certifications__icon grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-border bg-secondary text-accent">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-display text-lg font-semibold leading-snug tracking-tight text-foreground">
                      {title}
                    </h3>
                    <p className="mt-1 inline-flex items-center gap-1.5 font-mono text-xs font-medium uppercase tracking-wider text-accent">
                      <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                      {issuer}
                    </p>
                  </div>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {description}
                </p>

                {details.length > 0 && (
                  <dl
                    data-ocid={`certifications.details.${index + 1}`}
                    className="mt-5 space-y-2 border-t border-border pt-4"
                  >
                    {details.map((detail) => (
                      <div
                        key={detail.label}
                        className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1"
                      >
                        <dt className="font-mono text-[0.7rem] font-medium uppercase tracking-wider text-muted-foreground">
                          {detail.label}
                        </dt>
                        <dd className="text-sm font-medium text-foreground">
                          {detail.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                )}
              </motion.li>
            ),
          )}
        </ul>
      </div>
    </section>
  );
}
