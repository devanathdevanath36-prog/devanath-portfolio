import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import App from "@/App";
import { NAV_LINKS } from "@/lib/nav-links";
import { scrollToCalls } from "./setup";

/**
 * Accepted behavior for the real #education and #experience sections.
 *
 * These assert the observable content the request mandates: exactly three
 * entries per section in the required order, each with its institution /
 * organization, period, description where present, focus-area chips for
 * experience, and the exact status badges. They also assert the navbar's
 * Experience and Education links scroll to the new sections.
 *
 * They are component/integration coverage over the rendered App, not a
 * deployed-browser or backend check.
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

interface EducationExpectation {
  title: string;
  institution: string;
  period: string;
  percentage: string | null;
  status: string;
}

const EDUCATION: EducationExpectation[] = [
  {
    title: "Master of Computer Applications (MCA)",
    institution: "Hindustan College of Arts and Science, Chennai",
    period: "2026 – Present",
    percentage: null,
    status: "Currently Pursuing",
  },
  {
    title: "B.Sc Computer Science",
    institution: "S.A. College of Arts and Science, Chennai",
    period: "2023 – 2026",
    percentage: "70%",
    status: "Completed",
  },
  {
    title: "Higher Secondary (12th)",
    institution:
      "Bharathidasan Matriculation Higher Secondary School, Kanchipuram",
    period: "2022 – 2023",
    percentage: "65%",
    status: "Completed",
  },
];

interface ExperienceExpectation {
  title: string;
  organization: string;
  period: string;
  status: string;
  focusArea: string;
}

const EXPERIENCE: ExperienceExpectation[] = [
  {
    title: "NxtWave CCBP 4.0",
    organization: "NxtWave",
    period: "Present",
    status: "Currently Learning",
    focusArea: "MERN Stack",
  },
  {
    title: "Full Stack Web Development Intern",
    organization: "Eduversity",
    period: "August 2025 – September 2025",
    status: "Completed",
    focusArea: "Frontend",
  },
  {
    title: "Full-Stack Development Intern",
    organization: "CodeBind Technologies",
    period: "June 23, 2025 – July 23, 2025",
    status: "Completed",
    focusArea: "Backend",
  },
];

function renderEducation(): HTMLElement {
  render(<App />);
  return document.getElementById("education") as HTMLElement;
}

function renderExperience(): HTMLElement {
  render(<App />);
  return document.getElementById("experience") as HTMLElement;
}

describe("#education section", () => {
  it("keeps the #education section id and its data-ocid hook", () => {
    const education = renderEducation();

    expect(education).toBeInTheDocument();
    expect(education).toHaveAttribute("data-ocid", "section.education");
  });

  it("renders a level-2 Education heading", () => {
    const education = renderEducation();

    expect(
      within(education).getByRole("heading", { level: 2, name: "Education" }),
    ).toBeInTheDocument();
  });

  it("renders exactly three education entries in the required order", () => {
    const education = renderEducation();

    const cards = education.querySelectorAll('[data-ocid^="education.card."]');
    expect(cards).toHaveLength(3);

    const headings = within(education)
      .getAllByRole("heading", { level: 3 })
      .map((heading) => heading.textContent);
    expect(headings).toEqual(EDUCATION.map((entry) => entry.title));
  });

  it("renders each entry's institution, period, and status badge", () => {
    const education = renderEducation();

    EDUCATION.forEach((entry, index) => {
      const card = education.querySelector(
        `[data-ocid="education.card.${index + 1}"]`,
      ) as HTMLElement;
      expect(card).not.toBeNull();

      expect(within(card).getByText(entry.institution)).toBeInTheDocument();
      expect(within(card).getByText(entry.period)).toBeInTheDocument();

      const status = card.querySelector(
        `[data-ocid="education.status.${index + 1}"]`,
      ) as HTMLElement;
      expect(status).not.toBeNull();
      expect(status).toHaveTextContent(entry.status);
    });
  });

  it("shows Currently Pursuing for MCA and Completed with 70% / 65% for the rest", () => {
    const education = renderEducation();

    const mcaStatus = education.querySelector(
      '[data-ocid="education.status.1"]',
    ) as HTMLElement;
    expect(mcaStatus).toHaveTextContent("Currently Pursuing");

    const bscStatus = education.querySelector(
      '[data-ocid="education.status.2"]',
    ) as HTMLElement;
    expect(bscStatus).toHaveTextContent("Completed");

    const hscStatus = education.querySelector(
      '[data-ocid="education.status.3"]',
    ) as HTMLElement;
    expect(hscStatus).toHaveTextContent("Completed");

    const bscCard = education.querySelector(
      '[data-ocid="education.card.2"]',
    ) as HTMLElement;
    expect(within(bscCard).getByText("70%")).toBeInTheDocument();

    const hscCard = education.querySelector(
      '[data-ocid="education.card.3"]',
    ) as HTMLElement;
    expect(within(hscCard).getByText("65%")).toBeInTheDocument();
  });

  it("omits the percentage for the MCA entry that has none", () => {
    const education = renderEducation();

    const mcaCard = education.querySelector(
      '[data-ocid="education.card.1"]',
    ) as HTMLElement;
    expect(within(mcaCard).queryByText(/%$/)).not.toBeInTheDocument();
  });
});

describe("#experience section", () => {
  it("keeps the #experience section id and its data-ocid hook", () => {
    const experience = renderExperience();

    expect(experience).toBeInTheDocument();
    expect(experience).toHaveAttribute("data-ocid", "section.experience");
  });

  it("renders a level-2 Experience heading", () => {
    const experience = renderExperience();

    expect(
      within(experience).getByRole("heading", { level: 2, name: "Experience" }),
    ).toBeInTheDocument();
  });

  it("renders exactly three experience entries in the required order", () => {
    const experience = renderExperience();

    const cards = experience.querySelectorAll(
      '[data-ocid^="experience.card."]',
    );
    expect(cards).toHaveLength(3);

    const headings = within(experience)
      .getAllByRole("heading", { level: 3 })
      .map((heading) => heading.textContent);
    expect(headings).toEqual(EXPERIENCE.map((entry) => entry.title));
  });

  it("renders each entry's organization, period, description, and focus chips", () => {
    const experience = renderExperience();

    EXPERIENCE.forEach((entry, index) => {
      const card = experience.querySelector(
        `[data-ocid="experience.card.${index + 1}"]`,
      ) as HTMLElement;
      expect(card).not.toBeNull();

      expect(within(card).getByText(entry.organization)).toBeInTheDocument();
      expect(within(card).getByText(entry.period)).toBeInTheDocument();

      // A non-empty description paragraph.
      const paragraphs = Array.from(card.querySelectorAll("p")).map((p) =>
        (p.textContent ?? "").trim(),
      );
      expect(paragraphs.some((text) => text.length > 0)).toBe(true);

      // Focus-area chips with at least one entry.
      const focus = card.querySelector(
        `[data-ocid="experience.focus.${index + 1}"]`,
      ) as HTMLElement;
      expect(focus).not.toBeNull();
      expect(focus.querySelectorAll("li").length).toBeGreaterThan(0);
      expect(within(focus).getByText(entry.focusArea)).toBeInTheDocument();
    });
  });

  it("shows Currently Learning for NxtWave and Completed for the rest", () => {
    const experience = renderExperience();

    const nxtwaveStatus = experience.querySelector(
      '[data-ocid="experience.status.1"]',
    ) as HTMLElement;
    expect(nxtwaveStatus).toHaveTextContent("Currently Learning");

    const eduversityStatus = experience.querySelector(
      '[data-ocid="experience.status.2"]',
    ) as HTMLElement;
    expect(eduversityStatus).toHaveTextContent("Completed");

    const codebindStatus = experience.querySelector(
      '[data-ocid="experience.status.3"]',
    ) as HTMLElement;
    expect(codebindStatus).toHaveTextContent("Completed");
  });
});

describe("page composition with the new sections", () => {
  it("renders all nine sections exactly once in NAV_LINKS order with no duplicate ids", () => {
    render(<App />);

    const ids = Array.from(document.querySelectorAll("section[id]")).map(
      (section) => section.getAttribute("id"),
    );

    // Exactly the nine NAV_LINKS sections, in NAV_LINKS order.
    expect(ids).toEqual(NAV_LINKS.map((link) => link.id));

    // No duplicate DOM ids anywhere in the document.
    const allIds = Array.from(document.querySelectorAll("[id]")).map(
      (element) => element.id,
    );
    expect(new Set(allIds).size).toBe(allIds.length);
  });

  it("keeps the theme toggle working alongside the new sections", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(document.documentElement).toHaveClass("dark");
    await user.click(
      screen.getByRole("button", { name: "Switch to light theme" }),
    );
    expect(document.documentElement).not.toHaveClass("dark");
    expect(window.localStorage.getItem("devanath-theme")).toBe("light");
  });
});

describe("navbar Experience and Education links", () => {
  it("points the desktop links at the #experience and #education sections", () => {
    render(<App />);

    const nav = screen.getByRole("navigation", { name: "Primary" });
    const experienceLink = within(nav).getByRole("link", {
      name: "Experience",
    });
    const educationLink = within(nav).getByRole("link", { name: "Education" });

    expect(experienceLink).toHaveAttribute("href", "#experience");
    expect(educationLink).toHaveAttribute("href", "#education");
    expect(document.getElementById("experience")).toBeInTheDocument();
    expect(document.getElementById("education")).toBeInTheDocument();
  });

  it("smooth-scrolls to #experience and #education when selected", async () => {
    const user = userEvent.setup();
    render(<App />);

    const nav = screen.getByRole("navigation", { name: "Primary" });

    await user.click(within(nav).getByRole("link", { name: "Experience" }));
    expect(scrollToCalls.at(-1)).toMatchObject({ behavior: "smooth" });

    await user.click(within(nav).getByRole("link", { name: "Education" }));
    expect(scrollToCalls.at(-1)).toMatchObject({ behavior: "smooth" });
  });
});
