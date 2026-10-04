import { render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import App from "@/App";
import { NAV_LINKS } from "@/lib/nav-links";

/**
 * Characterization baseline for the #projects and #certifications sections.
 *
 * The upcoming change replaces the generic placeholder bodies of #projects and
 * #certifications with real components that render three project cards and five
 * certificate cards from reusable data arrays. These tests deliberately do NOT
 * freeze the placeholder copy or markup — only the invariants the Navbar,
 * active-section detection, and page shell depend on: the section ids, their
 * data-ocid hooks, their positions in NAV_LINKS order, their level-2 headings,
 * their reachability from the navbar, and the alternating background parity
 * that App.tsx assigns to the remaining sections.
 */

/** jsdom has no IntersectionObserver; the active-section hook needs one. */
class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | Document | null = null;
  readonly rootMargin: string = "";
  readonly thresholds: ReadonlyArray<number> = [];
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

beforeEach(() => {
  vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("#projects section contract", () => {
  it("keeps the #projects section id and its data-ocid hook", () => {
    render(<App />);

    const projects = document.getElementById("projects");
    expect(projects).toBeInTheDocument();
    expect(projects).toHaveAttribute("data-ocid", "section.projects");
  });

  it("keeps #projects as the fourth section, immediately after #skills", () => {
    render(<App />);

    const sections = Array.from(document.querySelectorAll("section[id]"));
    const projectsIndex = sections.findIndex(
      (section) => section.getAttribute("id") === "projects",
    );
    expect(projectsIndex).toBe(3);
    expect(sections[2]).toHaveAttribute("id", "skills");
  });

  it("keeps a level-2 Projects heading and its position in NAV_LINKS order", () => {
    render(<App />);

    const projects = document.getElementById("projects") as HTMLElement;
    expect(
      within(projects).getByRole("heading", { level: 2, name: /Projects/ }),
    ).toBeInTheDocument();

    const ids = Array.from(document.querySelectorAll("section[id]")).map(
      (section) => section.getAttribute("id"),
    );
    expect(ids.slice(0, NAV_LINKS.length)).toEqual(
      NAV_LINKS.map((link) => link.id),
    );
  });

  it("renders its own body content, distinct from the #skills section", () => {
    render(<App />);

    const projects = document.getElementById("projects") as HTMLElement;
    const skills = document.getElementById("skills") as HTMLElement;

    // #projects owns at least one paragraph of its own copy...
    const projectsParagraphs = Array.from(projects.querySelectorAll("p"));
    expect(projectsParagraphs.length).toBeGreaterThan(0);
    expect(
      projectsParagraphs.some((p) => (p.textContent ?? "").trim().length > 0),
    ).toBe(true);

    // ...and does not duplicate the Skills heading or its category cards.
    expect(
      within(projects).queryByRole("heading", {
        name: "Skills & Technologies",
      }),
    ).not.toBeInTheDocument();
    expect(projects).not.toBe(skills);
  });

  it("stays reachable from the navbar's Projects link", () => {
    render(<App />);

    const nav = screen.getByRole("navigation", { name: "Primary" });
    const projectsLink = within(nav).getByRole("link", { name: "Projects" });
    expect(projectsLink).toHaveAttribute("href", "#projects");
    expect(document.getElementById("projects")).toBeInTheDocument();
  });
});

describe("#certifications section contract", () => {
  it("keeps the #certifications section id and its data-ocid hook", () => {
    render(<App />);

    const certifications = document.getElementById("certifications");
    expect(certifications).toBeInTheDocument();
    expect(certifications).toHaveAttribute(
      "data-ocid",
      "section.certifications",
    );
  });

  it("keeps #certifications as the seventh section, immediately after #education", () => {
    render(<App />);

    const sections = Array.from(document.querySelectorAll("section[id]"));
    const certificationsIndex = sections.findIndex(
      (section) => section.getAttribute("id") === "certifications",
    );
    expect(certificationsIndex).toBe(6);
    expect(sections[5]).toHaveAttribute("id", "education");
  });

  it("keeps a level-2 Certifications heading and its position in NAV_LINKS order", () => {
    render(<App />);

    const certifications = document.getElementById(
      "certifications",
    ) as HTMLElement;
    expect(
      within(certifications).getByRole("heading", {
        level: 2,
        name: /Certifications/,
      }),
    ).toBeInTheDocument();

    const ids = Array.from(document.querySelectorAll("section[id]")).map(
      (section) => section.getAttribute("id"),
    );
    expect(ids.slice(0, NAV_LINKS.length)).toEqual(
      NAV_LINKS.map((link) => link.id),
    );
  });

  it("renders its own body content, distinct from the #projects section", () => {
    render(<App />);

    const certifications = document.getElementById(
      "certifications",
    ) as HTMLElement;
    const projects = document.getElementById("projects") as HTMLElement;

    // #certifications owns at least one paragraph of its own copy...
    const certificationsParagraphs = Array.from(
      certifications.querySelectorAll("p"),
    );
    expect(certificationsParagraphs.length).toBeGreaterThan(0);
    expect(
      certificationsParagraphs.some(
        (p) => (p.textContent ?? "").trim().length > 0,
      ),
    ).toBe(true);

    // ...and does not duplicate the Projects heading.
    expect(
      within(certifications).queryByRole("heading", { name: /^Projects$/ }),
    ).not.toBeInTheDocument();
    expect(certifications).not.toBe(projects);
  });

  it("stays reachable from the navbar's Certifications link", () => {
    render(<App />);

    const nav = screen.getByRole("navigation", { name: "Primary" });
    const certificationsLink = within(nav).getByRole("link", {
      name: "Certifications",
    });
    expect(certificationsLink).toHaveAttribute("href", "#certifications");
    expect(document.getElementById("certifications")).toBeInTheDocument();
  });
});

/**
 * Accepted behavior for the real #projects section.
 *
 * These assert the observable content the request mandates: exactly three
 * project cards from the reusable data array, each with its title, tech stack,
 * description, and feature list, plus the exact statuses and outbound links.
 * They are component/integration coverage over the rendered App, not a
 * deployed-browser or backend check.
 */
describe("#projects project cards", () => {
  interface ProjectExpectation {
    title: string;
    stack: string;
    status: string;
    demoUrl: string | null;
    repoUrl: string | null;
  }

  const PROJECTS: ProjectExpectation[] = [
    {
      title: "Client Management System",
      stack: "Python · Streamlit · SQLite · Pandas",
      status: "Completed",
      demoUrl: "https://clientproject.streamlit.app/",
      repoUrl:
        "https://github.com/Deva-1706/Management-struggles-with-scaling-startup-clients",
    },
    {
      title: "EduNova AI Platform",
      stack: "AI-Powered Learning Platform · Web Application",
      status: "Completed",
      demoUrl:
        "https://lovable.dev/projects/a61da18c-3788-4b62-baf6-2d7c522dc133",
      repoUrl: "https://github.com/Deva-1706/edunova-ai-platform",
    },
    {
      title: "CareerPilot AI",
      stack: "React · TypeScript · Node.js · Express.js · MongoDB · AI",
      status: "Currently Building",
      demoUrl: null,
      repoUrl: null,
    },
  ];

  function renderProjects(): HTMLElement {
    render(<App />);
    return document.getElementById("projects") as HTMLElement;
  }

  it("renders exactly three project cards", () => {
    const projects = renderProjects();

    const cards = projects.querySelectorAll('[data-ocid^="projects.card."]');
    expect(cards).toHaveLength(3);
  });

  it("renders each project title, tech stack, description, and feature list", () => {
    const projects = renderProjects();

    for (const { title, stack } of PROJECTS) {
      const heading = within(projects).getByRole("heading", {
        level: 3,
        name: title,
      });
      const card = heading.closest("li") as HTMLElement;
      expect(card).not.toBeNull();

      // Tech stack line.
      expect(within(card).getByText(stack)).toBeInTheDocument();

      // A non-empty description paragraph.
      const paragraphs = Array.from(card.querySelectorAll("p")).map((p) =>
        (p.textContent ?? "").trim(),
      );
      expect(paragraphs.some((text) => text.length > 0)).toBe(true);

      // A feature list with at least one entry.
      const features = card.querySelectorAll("ul li");
      expect(features.length).toBeGreaterThan(0);
    }
  });

  it("shows the exact status for each project", () => {
    const projects = renderProjects();

    for (const { title, status } of PROJECTS) {
      const heading = within(projects).getByRole("heading", {
        level: 3,
        name: title,
      });
      const card = heading.closest("li") as HTMLElement;
      expect(within(card).getByText(status)).toBeInTheDocument();
    }
  });

  it("links Client Management System and EduNova AI Platform to their demo and repo in a new tab", () => {
    const projects = renderProjects();

    for (const { title, demoUrl, repoUrl } of PROJECTS) {
      if (demoUrl === null || repoUrl === null) continue;

      const heading = within(projects).getByRole("heading", {
        level: 3,
        name: title,
      });
      const card = heading.closest("li") as HTMLElement;

      const demo = within(card).getByRole("link", { name: /Live Demo/i });
      expect(demo).toHaveAttribute("href", demoUrl);
      expect(demo).toHaveAttribute("target", "_blank");

      const repo = within(card).getByRole("link", { name: /GitHub/i });
      expect(repo).toHaveAttribute("href", repoUrl);
      expect(repo).toHaveAttribute("target", "_blank");
    }
  });

  it("shows Coming Soon for CareerPilot AI with no broken links", () => {
    const projects = renderProjects();

    const heading = within(projects).getByRole("heading", {
      level: 3,
      name: "CareerPilot AI",
    });
    const card = heading.closest("li") as HTMLElement;

    // Both actions are non-link "Coming Soon" treatments.
    expect(within(card).queryAllByRole("link")).toHaveLength(0);
    expect(within(card).getAllByText("Coming Soon")).toHaveLength(2);
  });
});

/**
 * Accepted behavior for the real #certifications section: exactly five
 * certificate cards from the reusable data array, with the correct titles and
 * issuers, and the DSA CodeVerse / ProjeXus detail values.
 */
describe("#certifications certificate cards", () => {
  interface CertificationExpectation {
    title: string;
    issuer: string;
  }

  const CERTIFICATIONS: CertificationExpectation[] = [
    { title: "GenAI Mastery Workshop", issuer: "OpenAI + NxtWave" },
    { title: "Build and Launch Your MVP Workshop", issuer: "NxtWave Academy" },
    {
      title: "AI and Robotic Process Automation Workshop",
      issuer: "NxtWave",
    },
    {
      title: "DSA CodeVerse Bi-Weekly Contest #31 — Beginner",
      issuer: "NxtWave",
    },
    {
      title: "ProjeXus 60-Day Experiential Project-Based Learning Internship",
      issuer: "SADRE Solutions Pvt. Ltd.",
    },
  ];

  function renderCertifications(): HTMLElement {
    render(<App />);
    return document.getElementById("certifications") as HTMLElement;
  }

  it("renders exactly five certificate cards", () => {
    const certifications = renderCertifications();

    const cards = certifications.querySelectorAll(
      '[data-ocid^="certifications.card."]',
    );
    expect(cards).toHaveLength(5);
  });

  it("renders every certificate title and issuer", () => {
    const certifications = renderCertifications();

    for (const { title, issuer } of CERTIFICATIONS) {
      const heading = within(certifications).getByRole("heading", {
        level: 3,
        name: title,
      });
      const card = heading.closest("li") as HTMLElement;
      expect(card).not.toBeNull();
      expect(within(card).getByText(issuer)).toBeInTheDocument();
    }
  });

  it("shows Rank 47 on the DSA CodeVerse card", () => {
    const certifications = renderCertifications();

    const heading = within(certifications).getByRole("heading", {
      level: 3,
      name: "DSA CodeVerse Bi-Weekly Contest #31 — Beginner",
    });
    const card = heading.closest("li") as HTMLElement;

    expect(within(card).getByText("Rank")).toBeInTheDocument();
    expect(within(card).getByText("47")).toBeInTheDocument();
  });

  it("shows Performance Excellent and Certificate ID PROJEXUS-2026-0003 on the ProjeXus card", () => {
    const certifications = renderCertifications();

    const heading = within(certifications).getByRole("heading", {
      level: 3,
      name: "ProjeXus 60-Day Experiential Project-Based Learning Internship",
    });
    const card = heading.closest("li") as HTMLElement;

    expect(within(card).getByText("Performance")).toBeInTheDocument();
    expect(within(card).getByText("Excellent")).toBeInTheDocument();
    expect(within(card).getByText("Certificate ID")).toBeInTheDocument();
    expect(within(card).getByText("PROJEXUS-2026-0003")).toBeInTheDocument();
  });
});

/**
 * The alternating background parity App.tsx assigns to the remaining sections
 * must survive the promotion of #projects and #certifications from the generic
 * placeholder to real components: Projects, Education, and Certifications carry
 * bg-muted/30 while Experience and Contact do not. The Achievements section was
 * intentionally removed, so it is no longer part of the parity contract.
 *
 * The muted background may live on the section element itself or on a wrapper
 * App.tsx places around it (Education is wrapped in a bg-muted/30 div for
 * parity), so the assertion checks the effective background of the section's
 * own element or its immediate wrapper rather than one specific node.
 */
describe("remaining sections keep alternating backgrounds", () => {
  const ALTERNATE_IDS = ["projects", "education", "certifications"];
  const PLAIN_IDS = ["experience", "contact"];

  function hasMutedBackground(id: string): boolean {
    const section = document.getElementById(id) as HTMLElement;
    expect(section).toBeInTheDocument();
    const wrapper = section.parentElement;
    return (
      section.className.includes("bg-muted/30") ||
      (wrapper?.className.includes("bg-muted/30") ?? false)
    );
  }

  it("gives the even-indexed remaining sections the muted background", () => {
    render(<App />);

    for (const id of ALTERNATE_IDS) {
      expect(hasMutedBackground(id)).toBe(true);
    }
  });

  it("leaves the odd-indexed remaining sections without the muted background", () => {
    render(<App />);

    for (const id of PLAIN_IDS) {
      expect(hasMutedBackground(id)).toBe(false);
    }
  });
});
