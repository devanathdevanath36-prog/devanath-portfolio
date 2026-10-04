import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  CheckCircle2,
  Clock,
  ExternalLink,
  Github,
  Hammer,
} from "lucide-react";
import type { ComponentType } from "react";

import "./Projects.css";

type ProjectStatus = "completed" | "building";

interface Project {
  id: string;
  title: string;
  stack: string;
  status: ProjectStatus;
  description: string;
  featuresLabel: string;
  features: string[];
  demoUrl: string | null;
  repoUrl: string | null;
}

export const PROJECTS: Project[] = [
  {
    id: "client-management-system",
    title: "Client Management System",
    stack: "Python · Streamlit · SQLite · Pandas",
    status: "completed",
    description:
      "A client and team management system designed to organize clients, tasks, team members, deadlines, and role-based workflows.",
    featuresLabel: "Key features",
    features: [
      "Role-based access control",
      "Client and team management",
      "Task assignment and tracking",
      "Dashboard analytics",
      "Progress tracking",
      "Deadline management",
    ],
    demoUrl: "https://clientproject.streamlit.app/",
    repoUrl:
      "https://github.com/Deva-1706/Management-struggles-with-scaling-startup-clients",
  },
  {
    id: "edunova-ai-platform",
    title: "EduNova AI Platform",
    stack: "AI-Powered Learning Platform · Web Application",
    status: "completed",
    description:
      "An AI-focused learning platform designed to provide a modern and interactive learning experience with AI-powered capabilities.",
    featuresLabel: "Key features",
    features: [
      "Interactive learning experience",
      "AI-focused learning features",
      "Modern learning interface",
      "Student-focused platform concept",
    ],
    demoUrl:
      "https://lovable.dev/projects/a61da18c-3788-4b62-baf6-2d7c522dc133",
    repoUrl: "https://github.com/Deva-1706/edunova-ai-platform",
  },
  {
    id: "careerpilot-ai",
    title: "CareerPilot AI",
    stack: "React · TypeScript · Node.js · Express.js · MongoDB · AI",
    status: "building",
    description:
      "An AI-powered career and placement assistant designed to help students analyze resumes, identify skill gaps, explore career paths, prepare for interviews, and track job applications.",
    featuresLabel: "Planned features",
    features: [
      "AI Resume Analyzer",
      "ATS-style Resume Analysis",
      "Career Path Explorer",
      "Skill Gap Analysis",
      "AI Interview Preparation",
      "Learning Roadmap",
      "Job Application Tracker",
      "Placement Dashboard",
      "AI Career Assistant",
    ],
    demoUrl: null,
    repoUrl: null,
  },
];

const STATUS_META: Record<
  ProjectStatus,
  {
    label: string;
    Icon: ComponentType<{ className?: string }>;
    className: string;
  }
> = {
  completed: {
    label: "Completed",
    Icon: CheckCircle2,
    className: "projects__status--completed",
  },
  building: {
    label: "Currently Building",
    Icon: Hammer,
    className: "projects__status--building",
  },
};

export function Projects() {
  const prefersReducedMotion = useReducedMotion();

  const fadeUp = (delay: number) => ({
    initial: prefersReducedMotion ? false : { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.15 },
    transition: prefersReducedMotion
      ? { duration: 0 }
      : { duration: 0.55, delay, ease: "easeOut" as const },
  });

  return (
    <section
      id="projects"
      data-ocid="section.projects"
      className="projects flex min-h-screen scroll-mt-24 items-center border-b border-border bg-muted/30 px-4 py-20 md:px-6 md:py-28"
    >
      <div className="projects__grid" aria-hidden="true" />
      <div
        className="orb projects__orb projects__orb--violet"
        aria-hidden="true"
      />
      <div
        className="orb projects__orb projects__orb--cyan"
        aria-hidden="true"
      />

      <div className="mx-auto w-full max-w-6xl">
        <motion.div {...fadeUp(0)} className="max-w-3xl">
          <p className="font-mono text-xs font-semibold uppercase tracking-widest text-accent">
            #projects
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground md:text-5xl">
            Projects
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
            A selection of products I have designed and built end to end — from
            data-driven management tools to AI-powered platforms, with more
            shipping soon.
          </p>
        </motion.div>

        <ul className="mt-12 grid gap-6 lg:grid-cols-3">
          {PROJECTS.map((project, index) => {
            const status = STATUS_META[project.status];
            const StatusIcon = status.Icon;
            const isBuilding = project.status === "building";

            return (
              <motion.li
                key={project.id}
                {...fadeUp(0.08 * index)}
                data-ocid={`projects.card.${index + 1}`}
                className="projects__card group flex h-full flex-col rounded-2xl border border-border bg-card/60 p-6 shadow-subtle transition-smooth hover:border-accent/50 md:p-7"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="projects__icon grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-border bg-secondary text-accent">
                    <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span
                    data-ocid={`projects.status.${index + 1}`}
                    className={`projects__status ${status.className} inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-xs font-medium`}
                  >
                    <StatusIcon className="h-3.5 w-3.5" aria-hidden="true" />
                    {status.label}
                  </span>
                </div>

                <h3 className="mt-5 font-display text-xl font-semibold tracking-tight text-foreground">
                  {project.title}
                </h3>
                <p className="mt-2 font-mono text-xs leading-relaxed text-accent">
                  {project.stack}
                </p>

                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {project.description}
                </p>

                <p className="mt-5 font-mono text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {project.featuresLabel}
                </p>
                <ul
                  data-ocid={`projects.list.${index + 1}`}
                  className="mt-3 flex flex-wrap gap-2"
                >
                  {project.features.map((feature) => (
                    <li
                      key={feature}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3 py-1.5 font-mono text-xs font-medium text-foreground transition-smooth group-hover:border-accent/40"
                    >
                      <span
                        className="h-1.5 w-1.5 rounded-full bg-gradient-aurora"
                        aria-hidden="true"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto flex flex-wrap gap-3 pt-6">
                  {project.demoUrl ? (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Open the live demo of ${project.title} in a new tab`}
                      data-ocid={`projects.demo_link.${index + 1}`}
                      className="projects__action projects__action--primary inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium"
                    >
                      <ExternalLink className="h-4 w-4" aria-hidden="true" />
                      Live Demo
                    </a>
                  ) : (
                    <span
                      data-ocid={`projects.demo_soon.${index + 1}`}
                      className="projects__action projects__action--disabled inline-flex cursor-not-allowed items-center gap-2 rounded-full px-4 py-2 text-sm font-medium"
                    >
                      <Clock className="h-4 w-4" aria-hidden="true" />
                      Coming Soon
                    </span>
                  )}

                  {project.repoUrl ? (
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`View the source code of ${project.title} on GitHub in a new tab`}
                      data-ocid={`projects.repo_link.${index + 1}`}
                      className="projects__action inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium"
                    >
                      <Github className="h-4 w-4" aria-hidden="true" />
                      GitHub
                    </a>
                  ) : (
                    <span
                      data-ocid={`projects.repo_soon.${index + 1}`}
                      className="projects__action projects__action--disabled inline-flex cursor-not-allowed items-center gap-2 rounded-full px-4 py-2 text-sm font-medium"
                    >
                      <Clock className="h-4 w-4" aria-hidden="true" />
                      Coming Soon
                    </span>
                  )}
                </div>

                {isBuilding ? (
                  <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                    Links will be published here once the platform launches.
                  </p>
                ) : null}
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
