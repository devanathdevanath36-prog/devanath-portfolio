import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import App from "@/App";
import { NAV_LINKS } from "@/lib/nav-links";

/**
 * Characterization baseline for the #home section.
 *
 * The upcoming change replaces the #home placeholder body with a Hero
 * component. These tests deliberately do NOT freeze the placeholder's copy or
 * markup — only the invariants the Navbar and active-section detection depend
 * on: the section id, its data-ocid hook, its position as the first section,
 * and the presence of the other eight anchors.
 */

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

describe("#home section contract", () => {
  it("keeps the #home section id and its data-ocid hook", () => {
    render(<App />);

    const home = document.getElementById("home");
    expect(home).toBeInTheDocument();
    expect(home).toHaveAttribute("data-ocid", "section.home");
  });

  it("keeps #home as the first section in the document", () => {
    render(<App />);

    const sections = Array.from(document.querySelectorAll("section[id]"));
    expect(sections.length).toBeGreaterThanOrEqual(NAV_LINKS.length);
    expect(sections[0]).toHaveAttribute("id", "home");
  });

  it("keeps all nine section anchors present and in NAV_LINKS order", () => {
    render(<App />);

    const ids = Array.from(document.querySelectorAll("section[id]")).map(
      (section) => section.getAttribute("id"),
    );
    expect(ids.slice(0, NAV_LINKS.length)).toEqual(
      NAV_LINKS.map((link) => link.id),
    );
  });

  it("keeps the navbar and theme toggle mounted alongside the home section", () => {
    render(<App />);

    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(
      screen.getByRole("navigation", { name: "Primary" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Switch to light theme" }),
    ).toBeInTheDocument();
  });
});
