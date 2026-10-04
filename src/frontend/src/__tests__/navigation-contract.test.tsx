import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import App from "@/App";
import { NAV_LINKS } from "@/lib/nav-links";
import { scrollToCalls } from "./setup";

/**
 * Characterization baseline for the portfolio's navigation contract.
 *
 * The upcoming change replaces the generic SectionPlaceholder bodies for
 * #experience and #education with real components and adjusts App.tsx's
 * slicing/parity. These tests deliberately do NOT freeze placeholder copy,
 * markup, or the current alternating-background parity — only the invariants
 * that must survive the change: every NAV_LINKS anchor stays present and in
 * order, every navbar link points at its section, and selecting a link
 * smooth-scrolls to that section.
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

function setViewportWidth(width: number) {
  Object.defineProperty(window, "innerWidth", {
    writable: true,
    configurable: true,
    value: width,
  });
  act(() => {
    window.dispatchEvent(new Event("resize"));
  });
}

beforeEach(() => {
  vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
  setViewportWidth(1440);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("Section anchors survive the change", () => {
  it("keeps every NAV_LINKS anchor present and in order", () => {
    render(<App />);

    const ids = Array.from(document.querySelectorAll("section[id]")).map(
      (section) => section.getAttribute("id"),
    );
    expect(ids.slice(0, NAV_LINKS.length)).toEqual(
      NAV_LINKS.map((link) => link.id),
    );
  });

  it("keeps the experience, education, and contact anchors", () => {
    render(<App />);

    // These are the sections the change touches or leaves as placeholders;
    // their ids are the navigation contract regardless of their body content.
    // The Achievements section was intentionally removed, so it is not asserted.
    for (const id of ["experience", "education", "contact"]) {
      expect(document.getElementById(id)).toBeInTheDocument();
    }
  });
});

describe("Navbar links target every section", () => {
  it("points each desktop link at its matching section anchor", () => {
    render(<App />);

    const nav = screen.getByRole("navigation", { name: "Primary" });
    for (const link of NAV_LINKS) {
      const anchor = within(nav).getByRole("link", { name: link.label });
      expect(anchor).toHaveAttribute("href", `#${link.id}`);
      expect(document.getElementById(link.id)).toBeInTheDocument();
    }
  });

  it("smooth-scrolls to the selected section for every link", async () => {
    const user = userEvent.setup();
    render(<App />);

    const nav = screen.getByRole("navigation", { name: "Primary" });
    for (const link of NAV_LINKS) {
      await user.click(within(nav).getByRole("link", { name: link.label }));
      expect(scrollToCalls.at(-1)).toMatchObject({ behavior: "smooth" });
    }
  });
});

describe("Mobile navigation reaches every section", () => {
  it("lists every NAV_LINKS link and scrolls to the chosen section", async () => {
    const user = userEvent.setup();
    setViewportWidth(390);
    render(<App />);

    await user.click(
      screen.getByRole("button", { name: "Open navigation menu" }),
    );

    const panel = document.getElementById("mobile-nav-panel") as HTMLElement;
    expect(panel).not.toBeNull();
    for (const link of NAV_LINKS) {
      expect(
        within(panel).getByRole("link", { name: link.label }),
      ).toBeInTheDocument();
    }

    await user.click(within(panel).getByRole("link", { name: "Experience" }));
    expect(scrollToCalls.at(-1)).toMatchObject({ behavior: "smooth" });
  });
});
