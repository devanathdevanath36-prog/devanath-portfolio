import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import App from "@/App";

/**
 * Cover for the hero overflow fix.
 *
 * The change pulls the decorative layers (rings, floating chips, code card)
 * inward so they sit inside the padded `.hero__visual` box instead of at
 * negative offsets that spilled past the section edge. jsdom does not evaluate
 * the CSS cascade, so these tests pin the structural contract the fix depends
 * on rather than computed positions:
 *
 *  - every decorative layer is a descendant of the single `.hero__visual`
 *    container, so the section's `overflow: hidden` clips it;
 *  - the visual lives inside the `#home` section, which carries the clipping
 *    class, and inside the app root's page-level overflow guard;
 *  - the visual keeps its reserved padding box (the class hook the CSS uses to
 *    inset the rings and chips).
 *
 * If a future iteration moves a chip or the code card outside the visual, or
 * drops the padding container, the section can no longer contain it and these
 * fail before the overflow reaches a user.
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

describe("Hero visual containment", () => {
  it("keeps every decorative layer inside the single hero visual container", () => {
    render(<App />);

    const home = document.getElementById("home") as HTMLElement;
    const visual = home.querySelector(".hero__visual");
    expect(visual).not.toBeNull();

    // The rings, core, chips, and code card are all children of the visual, so
    // the section's overflow guard clips them as one box.
    const decorative = home.querySelectorAll(
      ".hero__ring, .hero__core, .hero__chip, .hero__code",
    );
    expect(decorative.length).toBeGreaterThanOrEqual(3 + 1 + 5 + 1);
    for (const layer of Array.from(decorative)) {
      expect(visual?.contains(layer)).toBe(true);
    }
  });

  it("nests the visual inside the clipping hero section and the page overflow guard", () => {
    render(<App />);

    const home = document.getElementById("home") as HTMLElement;
    const visual = home.querySelector(".hero__visual") as HTMLElement;

    // The `.hero` class carries `overflow: hidden`; the visual must be inside it.
    expect(home.className).toContain("hero");
    expect(home.contains(visual)).toBe(true);

    // The app root carries the page-level horizontal-overflow guard.
    expect(home.closest(".overflow-x-hidden")).not.toBeNull();
  });

  it("keeps the reserved padding box on the visual so the layers are inset", () => {
    render(<App />);

    const home = document.getElementById("home") as HTMLElement;
    const visual = home.querySelector(".hero__visual") as HTMLElement;

    // The CSS insets the rings and chips relative to this padded box; the class
    // hook must survive so the fix keeps applying.
    expect(visual.className).toContain("hero__visual");
    expect(
      visual.querySelectorAll(".hero__chip").length,
    ).toBeGreaterThanOrEqual(5);
  });

  it("renders the orb, rotating rings, and floating chips on the right side of the hero", () => {
    render(<App />);

    const home = document.getElementById("home") as HTMLElement;
    // The orb layers are direct children of the section (background decoration).
    expect(home.querySelectorAll(".hero__orb").length).toBeGreaterThanOrEqual(
      2,
    );
    // The rotating rings and floating technology chips render in the visual.
    expect(home.querySelectorAll(".hero__ring").length).toBeGreaterThanOrEqual(
      3,
    );
    expect(home.querySelectorAll(".hero__chip").length).toBeGreaterThanOrEqual(
      5,
    );
    // The visual is the second grid column, ordered last on large screens.
    const visualWrapper = home.querySelector(".hero__visual")?.parentElement;
    expect(visualWrapper?.className).toContain("lg:order-last");
  });
});
