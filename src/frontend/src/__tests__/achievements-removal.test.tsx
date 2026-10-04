import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import App from "@/App";
import { NAV_LINKS } from "@/lib/nav-links";
import { scrollToCalls } from "./setup";

/**
 * Cover for the accepted change that removes the Achievements section and its
 * navigation link from the portfolio.
 *
 * These are component/integration tests over the rendered App, not a
 * deployed-browser or backend check. The positive expectations are derived from
 * the exported NAV_LINKS array so they keep protecting the surviving sections,
 * while the negative expectations pin the removal itself: no #achievements
 * anchor anywhere in the rendered site and no Achievements link in either the
 * desktop or the mobile navigation.
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

describe("Achievements removal", () => {
  it("renders no #achievements section or anchor anywhere in the site", () => {
    render(<App />);

    expect(document.getElementById("achievements")).toBeNull();
    expect(document.querySelector('[id="achievements"]')).toBeNull();
    expect(document.querySelector('a[href="#achievements"]')).toBeNull();
  });

  it("does not list an Achievements link in the desktop navigation", () => {
    render(<App />);

    const nav = screen.getByRole("navigation", { name: "Primary" });
    expect(
      within(nav).queryByRole("link", { name: /achievements/i }),
    ).toBeNull();
  });

  it("does not list an Achievements link in the mobile navigation", async () => {
    const user = userEvent.setup();
    setViewportWidth(390);
    render(<App />);

    await user.click(
      screen.getByRole("button", { name: "Open navigation menu" }),
    );

    const panel = document.getElementById("mobile-nav-panel") as HTMLElement;
    expect(panel).not.toBeNull();
    expect(
      within(panel).queryByRole("link", { name: /achievements/i }),
    ).toBeNull();
  });

  it("renders the eight remaining sections in NAV_LINKS order with working anchors", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(NAV_LINKS.map((link) => link.id)).toEqual([
      "home",
      "about",
      "skills",
      "projects",
      "experience",
      "education",
      "certifications",
      "contact",
    ]);

    const renderedIds = Array.from(
      document.querySelectorAll("main section[id]"),
    ).map((section) => section.getAttribute("id"));
    expect(renderedIds.slice(0, NAV_LINKS.length)).toEqual(
      NAV_LINKS.map((link) => link.id),
    );

    const nav = screen.getByRole("navigation", { name: "Primary" });
    for (const link of NAV_LINKS) {
      const anchor = within(nav).getByRole("link", { name: link.label });
      expect(anchor).toHaveAttribute("href", `#${link.id}`);
      expect(document.getElementById(link.id)).toBeInTheDocument();
    }

    const last = NAV_LINKS[NAV_LINKS.length - 1];
    await user.click(within(nav).getByRole("link", { name: last.label }));
    expect(scrollToCalls.at(-1)).toMatchObject({ behavior: "smooth" });
  });
});
