import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import App from "@/App";
import { NAV_LINKS } from "@/lib/nav-links";
import { scrollToCalls } from "./setup";

/**
 * Characterization baseline for the portfolio's section-order and in-page
 * anchor contract, written to survive the upcoming removal of the Achievements
 * section and its navigation link.
 *
 * Every expectation here is derived from the exported NAV_LINKS array rather
 * than from a hardcoded count or a hardcoded section id, so the same tests
 * keep protecting the surviving sections after the array shrinks. They
 * deliberately do NOT assert the presence of any specific section that the
 * change removes, and they do not freeze placeholder copy or markup.
 *
 * These are component/integration tests over the rendered App, not a
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

describe("Default route renders without a blank screen", () => {
  it("mounts the app shell with a navbar and a main landmark", () => {
    render(<App />);

    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(
      screen.getByRole("navigation", { name: "Primary" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("main")).toBeInTheDocument();
  });

  it("renders a section element for every NAV_LINKS entry", () => {
    render(<App />);

    for (const link of NAV_LINKS) {
      expect(document.getElementById(link.id)).toBeInTheDocument();
    }
  });
});

describe("Sections render in NAV_LINKS order", () => {
  it("keeps the rendered section ids in the same order as NAV_LINKS", () => {
    render(<App />);

    const renderedIds = Array.from(
      document.querySelectorAll("main section[id]"),
    ).map((section) => section.getAttribute("id"));

    // The page may render extra sections beyond the nav contract; the first
    // NAV_LINKS.length ids must match the nav order exactly.
    expect(renderedIds.slice(0, NAV_LINKS.length)).toEqual(
      NAV_LINKS.map((link) => link.id),
    );
  });

  it("gives every NAV_LINKS section a matching in-page anchor target", () => {
    render(<App />);

    for (const link of NAV_LINKS) {
      const section = document.getElementById(link.id);
      expect(section).not.toBeNull();
      expect(section?.tagName).toBe("SECTION");
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

    const target = NAV_LINKS[NAV_LINKS.length - 1];
    await user.click(within(panel).getByRole("link", { name: target.label }));
    expect(scrollToCalls.at(-1)).toMatchObject({ behavior: "smooth" });
  });
});
