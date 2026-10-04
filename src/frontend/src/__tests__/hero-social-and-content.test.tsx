import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import App from "@/App";

/**
 * Characterization baseline for the hero behaviors that must survive the
 * accepted change.
 *
 * The request intentionally changes two things in the hero: the GitHub and
 * LinkedIn destination URLs, and the removal of the "View My Work" and
 * "Download Resume" controls. This file deliberately does NOT assert the
 * current URL values or the presence of those two controls — those are the
 * behaviors being changed, and freezing them here would fight the request.
 *
 * What it does protect is the adjacent, unchanged contract:
 *
 *  - the hero still renders its badge, greeting, name, title, description,
 *    growth line, portrait visual, and "Scroll to explore" indicator;
 *  - the two social icons remain anchors that open in a new tab with a safe
 *    `rel`, with their accessible names intact, regardless of where they point;
 *  - the app still renders a non-blank default route.
 *
 * These are component/integration assertions over the rendered App, not a
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

describe("Hero surviving content", () => {
  it("renders the badge, greeting, name, title, description, and growth line", () => {
    render(<App />);

    expect(screen.getByText("Available for opportunities")).toBeInTheDocument();
    expect(screen.getByText("Hello, I'm")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 1, name: "Devanath N" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "Full-Stack Developer" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/I design and ship fast, accessible web products/),
    ).toBeInTheDocument();
    // The arrows are separate spans, so match on the paragraph's full text.
    expect(
      screen.getByText((_content, element) =>
        element?.tagName === "P"
          ? /Learn\s*→\s*Build\s*→\s*Improve\s*→\s*Grow/.test(
              element.textContent ?? "",
            )
          : false,
      ),
    ).toBeInTheDocument();
  });

  it("keeps the portrait visual and the 'Scroll to explore' indicator", () => {
    render(<App />);

    const home = document.getElementById("home") as HTMLElement;
    const portrait = home.querySelector(".hero__core img") as HTMLImageElement;
    expect(portrait).not.toBeNull();
    expect(portrait).toHaveAttribute(
      "src",
      "/assets/images/devanath-portrait.jpeg",
    );

    expect(
      screen.getByRole("button", { name: /Scroll to explore/ }),
    ).toBeInTheDocument();
  });
});

describe("Hero social links survive the URL change", () => {
  it("keeps exactly the GitHub and LinkedIn icons as accessible links", () => {
    render(<App />);

    const github = screen.getByRole("link", { name: "GitHub profile" });
    const linkedin = screen.getByRole("link", { name: "LinkedIn profile" });
    expect(github).toBeInTheDocument();
    expect(linkedin).toBeInTheDocument();
  });

  it("opens both social links in a new tab with a safe rel", () => {
    render(<App />);

    for (const name of ["GitHub profile", "LinkedIn profile"]) {
      const link = screen.getByRole("link", { name });
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
      // A real destination is present; the exact URL is intentionally not
      // frozen here because the request changes it.
      expect(link.getAttribute("href")).toMatch(/^https:\/\//);
    }
  });
});

describe("Default route renders without a blank screen", () => {
  it("mounts the hero and the app shell on first render", () => {
    render(<App />);

    expect(document.getElementById("home")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 1, name: "Devanath N" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });
});
