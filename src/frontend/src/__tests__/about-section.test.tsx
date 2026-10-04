import { render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import App from "@/App";
import { NAV_LINKS } from "@/lib/nav-links";

/**
 * Characterization baseline for the #about section.
 *
 * The upcoming change replaces the generic placeholder body of #about with the
 * owner's real biography, background, tech stack, and approach line. These
 * tests deliberately do NOT freeze the placeholder copy or markup — only the
 * invariants the Navbar, active-section detection, and page shell depend on:
 * the section id, its data-ocid hook, its position in NAV_LINKS order, the
 * heading, and the fact that #about renders its own distinct body content.
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

describe("#about section contract", () => {
  it("keeps the #about section id and its data-ocid hook", () => {
    render(<App />);

    const about = document.getElementById("about");
    expect(about).toBeInTheDocument();
    expect(about).toHaveAttribute("data-ocid", "section.about");
  });

  it("keeps #about as the second section, immediately after #home", () => {
    render(<App />);

    const sections = Array.from(document.querySelectorAll("section[id]"));
    const aboutIndex = sections.findIndex(
      (section) => section.getAttribute("id") === "about",
    );
    expect(aboutIndex).toBe(1);
    expect(sections[0]).toHaveAttribute("id", "home");
  });

  it("keeps the About heading and its position in NAV_LINKS order", () => {
    render(<App />);

    const about = document.getElementById("about") as HTMLElement;
    expect(
      within(about).getByRole("heading", { level: 2, name: "About Me" }),
    ).toBeInTheDocument();

    const ids = Array.from(document.querySelectorAll("section[id]")).map(
      (section) => section.getAttribute("id"),
    );
    expect(ids.slice(0, NAV_LINKS.length)).toEqual(
      NAV_LINKS.map((link) => link.id),
    );
  });

  it("renders its own body content, distinct from the #home hero", () => {
    render(<App />);

    const about = document.getElementById("about") as HTMLElement;
    const home = document.getElementById("home") as HTMLElement;

    // #about owns at least one paragraph of its own copy...
    const aboutParagraphs = Array.from(about.querySelectorAll("p"));
    expect(aboutParagraphs.length).toBeGreaterThan(0);
    expect(
      aboutParagraphs.some((p) => (p.textContent ?? "").trim().length > 0),
    ).toBe(true);

    // ...and does not duplicate the hero's level-1 heading or its CTAs.
    expect(
      within(about).queryByRole("heading", { level: 1 }),
    ).not.toBeInTheDocument();
    expect(
      within(about).queryByRole("button", { name: /View My Work/ }),
    ).not.toBeInTheDocument();
    expect(home).not.toBe(about);
  });

  it("stays reachable from the navbar's About link", () => {
    render(<App />);

    const nav = screen.getByRole("navigation", { name: "Primary" });
    const aboutLink = within(nav).getByRole("link", { name: "About" });
    expect(aboutLink).toHaveAttribute("href", "#about");
    expect(document.getElementById("about")).toBeInTheDocument();
  });
});

/**
 * Accepted behavior for the owner's real biography in #about.
 *
 * These assert the observable content the request mandates: the heading and
 * greeting, all four biography paragraphs verbatim, the "My Approach" block,
 * the closing availability line, the profile card facts, and the tech-stack
 * chips. They are component/integration coverage over the rendered App, not a
 * deployed-browser or backend check.
 */
describe("#about biography content", () => {
  const BIO_PARAGRAPHS = [
    "I'm a Full-Stack Development learner and Computer Science graduate passionate about building modern, practical, and user-friendly web applications.",
    "I'm currently pursuing my Master of Computer Applications (MCA) and continuing my development journey as an NxtWave CCBP 4.0 student, where I'm strengthening my skills in web development, programming, and problem-solving.",
    "I enjoy working with technologies such as HTML, CSS, JavaScript, React, Node.js, Express.js, MongoDB, Python, Git, and GitHub. I'm also exploring AI-powered applications and learning how AI can be integrated with modern web technologies.",
    "I believe the best way to learn technology is by building. Through projects, experimentation, debugging, and continuous learning, I'm working toward becoming a stronger Full-Stack Developer.",
  ];

  const TECH_STACK = [
    "HTML",
    "CSS",
    "JavaScript",
    "React",
    "Node.js",
    "Express.js",
    "MongoDB",
    "Python",
    "Git",
    "GitHub",
  ];

  const PROFILE_FACTS = [
    "Full-Stack Developer",
    "Computer Science Graduate",
    "MCA Student",
    "Currently Learning & Building",
  ];

  function renderAbout(): HTMLElement {
    render(<App />);
    return document.getElementById("about") as HTMLElement;
  }

  it("shows the 'About Me' heading and the owner's greeting", () => {
    const about = renderAbout();

    expect(
      within(about).getByRole("heading", { level: 2, name: "About Me" }),
    ).toBeInTheDocument();
    expect(within(about).getByText(/Hi, I'm Devanath N/)).toBeInTheDocument();
  });

  it("renders all four biography paragraphs verbatim", () => {
    const about = renderAbout();

    for (const paragraph of BIO_PARAGRAPHS) {
      expect(within(about).getByText(paragraph)).toBeInTheDocument();
    }
  });

  it("shows the 'My Approach' block with the Learn → Build → Improve → Grow steps", () => {
    const about = renderAbout();

    const approach = about.querySelector(
      '[data-ocid="about.approach_card"]',
    ) as HTMLElement;
    expect(approach).toBeInTheDocument();
    expect(
      within(approach).getByRole("heading", { name: "My Approach" }),
    ).toBeInTheDocument();

    const steps = Array.from(approach.querySelectorAll("li")).map((li) =>
      (li.textContent ?? "").replace("🚀", "").trim(),
    );
    expect(steps).toEqual(["Learn", "Build", "Improve", "Grow"]);
  });

  it("shows the closing availability line", () => {
    const about = renderAbout();

    expect(
      within(about).getByText(
        /I'm currently open to software development opportunities, internships, collaborations, and projects where I can learn, contribute, and grow\./,
      ),
    ).toBeInTheDocument();
  });

  it("shows the profile card with all four facts", () => {
    const about = renderAbout();

    const card = about.querySelector(
      '[data-ocid="about.profile_card"]',
    ) as HTMLElement;
    expect(card).toBeInTheDocument();

    for (const fact of PROFILE_FACTS) {
      expect(within(card).getAllByText(fact).length).toBeGreaterThan(0);
    }
  });

  it("shows a tech-stack chip for every listed technology", () => {
    const about = renderAbout();

    const techList = about.querySelector(
      '[data-ocid="about.tech_list"]',
    ) as HTMLElement;
    expect(techList).toBeInTheDocument();

    const chips = Array.from(techList.querySelectorAll("li")).map((li) =>
      (li.textContent ?? "").trim(),
    );
    expect(chips).toEqual(TECH_STACK);
  });
});

/**
 * Accepted behavior for the profile-card portrait.
 *
 * The About profile card now renders the owner's portrait photo clipped to a
 * circle, with a meaningful alt text (unlike the decorative hero portrait).
 * These assert the observable image contract: the public-asset source, the
 * circular avatar wrapper, the responsive class hook, and the accessible name.
 */
describe("#about profile-card portrait", () => {
  it("renders the portrait photo clipped to a circle in the profile card", () => {
    render(<App />);

    const about = document.getElementById("about") as HTMLElement;
    const card = about.querySelector(
      '[data-ocid="about.profile_card"]',
    ) as HTMLElement;
    expect(card).toBeInTheDocument();

    const avatar = card.querySelector(".about__avatar") as HTMLElement;
    expect(avatar).not.toBeNull();

    const portrait = avatar.querySelector("img") as HTMLImageElement;
    expect(portrait).not.toBeNull();
    // Same public asset as the hero, not inlined base64.
    expect(portrait).toHaveAttribute(
      "src",
      "/assets/images/devanath-portrait.jpeg",
    );
    expect(portrait.getAttribute("src")).not.toMatch(/^data:/);
    // Meaningful alt text in the About card.
    expect(portrait).toHaveAttribute("alt", "Portrait of Devanath N");
    // Responsive: intrinsic dimensions plus the circular class hook.
    expect(portrait).toHaveAttribute("width", "112");
    expect(portrait).toHaveAttribute("height", "112");
    expect(portrait.className).toContain("about__avatar-img");
  });

  it("exposes the portrait as an accessible image with its alt text", () => {
    render(<App />);

    expect(
      screen.getByRole("img", { name: "Portrait of Devanath N" }),
    ).toBeInTheDocument();
  });
});
