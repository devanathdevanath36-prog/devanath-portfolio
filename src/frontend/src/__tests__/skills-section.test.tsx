import { render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import App from "@/App";
import { NAV_LINKS } from "@/lib/nav-links";

/**
 * Characterization baseline for the #skills section.
 *
 * The upcoming change replaces the generic placeholder body of #skills with a
 * real Skills component (five category cards). These tests deliberately do NOT
 * freeze the placeholder copy or markup — only the invariants the Navbar,
 * active-section detection, and page shell depend on: the section id, its
 * data-ocid hook, its position in NAV_LINKS order, its heading, and the fact
 * that #skills renders its own distinct body content.
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

describe("#skills section contract", () => {
  it("keeps the #skills section id and its data-ocid hook", () => {
    render(<App />);

    const skills = document.getElementById("skills");
    expect(skills).toBeInTheDocument();
    expect(skills).toHaveAttribute("data-ocid", "section.skills");
  });

  it("keeps #skills as the third section, immediately after #about", () => {
    render(<App />);

    const sections = Array.from(document.querySelectorAll("section[id]"));
    const skillsIndex = sections.findIndex(
      (section) => section.getAttribute("id") === "skills",
    );
    expect(skillsIndex).toBe(2);
    expect(sections[1]).toHaveAttribute("id", "about");
  });

  it("keeps a level-2 Skills heading and its position in NAV_LINKS order", () => {
    render(<App />);

    const skills = document.getElementById("skills") as HTMLElement;
    // The accepted change replaces the placeholder heading with the real
    // "Skills & Technologies" heading; the level-2 heading contract holds.
    expect(
      within(skills).getByRole("heading", { level: 2, name: /Skills/ }),
    ).toBeInTheDocument();

    const ids = Array.from(document.querySelectorAll("section[id]")).map(
      (section) => section.getAttribute("id"),
    );
    expect(ids.slice(0, NAV_LINKS.length)).toEqual(
      NAV_LINKS.map((link) => link.id),
    );
  });

  it("renders its own body content, distinct from the #about section", () => {
    render(<App />);

    const skills = document.getElementById("skills") as HTMLElement;
    const about = document.getElementById("about") as HTMLElement;

    // #skills owns at least one paragraph of its own copy...
    const skillsParagraphs = Array.from(skills.querySelectorAll("p"));
    expect(skillsParagraphs.length).toBeGreaterThan(0);
    expect(
      skillsParagraphs.some((p) => (p.textContent ?? "").trim().length > 0),
    ).toBe(true);

    // ...and does not duplicate the About heading or its biography copy.
    expect(
      within(skills).queryByRole("heading", { name: "About Me" }),
    ).not.toBeInTheDocument();
    expect(skills).not.toBe(about);
  });

  it("stays reachable from the navbar's Skills link", () => {
    render(<App />);

    const nav = screen.getByRole("navigation", { name: "Primary" });
    const skillsLink = within(nav).getByRole("link", { name: "Skills" });
    expect(skillsLink).toHaveAttribute("href", "#skills");
    expect(document.getElementById("skills")).toBeInTheDocument();
  });
});

/**
 * Accepted behavior for the real Skills section.
 *
 * These assert the observable content the request mandates: five category
 * cards, each with its exact skill list, and SQLite listed under Database.
 * They are component/integration coverage over the rendered App, not a
 * deployed-browser or backend check.
 */
describe("#skills category cards", () => {
  const CATEGORIES: Array<{ title: string; items: string[] }> = [
    {
      title: "Frontend Development",
      items: [
        "HTML5",
        "CSS3",
        "JavaScript",
        "React.js",
        "Responsive Web Design",
      ],
    },
    {
      title: "Backend Development",
      items: ["Node.js", "Express.js", "Python", "REST APIs"],
    },
    {
      title: "Database",
      items: ["MongoDB", "SQL", "SQLite"],
    },
    {
      title: "Tools & Technologies",
      items: ["Git", "GitHub", "VS Code", "MS Office"],
    },
    {
      title: "Currently Exploring",
      items: [
        "MERN Stack",
        "AI-Powered Applications",
        "Full-Stack Development",
        "AI Integration",
      ],
    },
  ];

  function renderSkills(): HTMLElement {
    render(<App />);
    return document.getElementById("skills") as HTMLElement;
  }

  it("renders exactly five category cards", () => {
    const skills = renderSkills();

    const cards = skills.querySelectorAll('[data-ocid^="skills.card."]');
    expect(cards).toHaveLength(5);
  });

  it("renders every category title as a card heading", () => {
    const skills = renderSkills();

    for (const { title } of CATEGORIES) {
      expect(
        within(skills).getByRole("heading", { level: 3, name: title }),
      ).toBeInTheDocument();
    }
  });

  it("lists the exact skills under each category card", () => {
    const skills = renderSkills();

    for (const { title, items } of CATEGORIES) {
      const heading = within(skills).getByRole("heading", {
        level: 3,
        name: title,
      });
      const card = heading.closest("li") as HTMLElement;
      expect(card).not.toBeNull();

      const chips = Array.from(card.querySelectorAll("ul li")).map((li) =>
        (li.textContent ?? "").trim(),
      );
      expect(chips).toEqual(items);
    }
  });

  it("lists MongoDB, SQL, and SQLite under the Database card", () => {
    const skills = renderSkills();

    const heading = within(skills).getByRole("heading", {
      level: 3,
      name: "Database",
    });
    const card = heading.closest("li") as HTMLElement;
    const chips = Array.from(card.querySelectorAll("ul li")).map((li) =>
      (li.textContent ?? "").trim(),
    );

    expect(chips).toContain("SQLite");
    expect(chips).toEqual(["MongoDB", "SQL", "SQLite"]);
  });
});

/**
 * The remaining sections keep their original alternating backgrounds after
 * #skills is promoted from the generic placeholder to a real component.
 * App.tsx maps NAV_LINKS.slice(3) with alternate={index % 2 === 0}, so
 * Projects, Education, and Certifications carry bg-muted/30 while Experience
 * and Contact do not. The Achievements section was intentionally removed, so it
 * is no longer part of the parity contract.
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
