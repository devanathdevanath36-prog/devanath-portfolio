import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import App from "@/App";

/**
 * Characterization baseline for hero behaviors adjacent to the accepted
 * requirements that the existing suites do not pin down:
 *
 *  - the hero stays fully rendered and visible after switching to light mode
 *    (the "restyles correctly in both" criterion, beyond the `dark` class);
 *  - the page keeps horizontal-overflow guards so the decorative visual cannot
 *    push the layout sideways;
 *  - the "Scroll to explore" indicator is hidden below the `md` breakpoint.
 *
 * These assert observable structure and state, not animation timing or exact
 * CSS values.
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

describe("Hero theme restyling", () => {
  it("keeps the full hero content rendered after switching to light mode", async () => {
    const user = userEvent.setup();
    render(<App />);

    // Dark is the default; the hero is fully present.
    expect(document.documentElement).toHaveClass("dark");
    expect(
      screen.getByRole("heading", { level: 1, name: "Devanath N" }),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: "Switch to light theme" }),
    );

    // Light mode applied, and the hero content is still all there.
    expect(document.documentElement).not.toHaveClass("dark");
    expect(document.documentElement.style.colorScheme).toBe("light");
    expect(
      screen.getByRole("heading", { level: 1, name: "Devanath N" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "Full-Stack Developer" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Available for opportunities")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "GitHub profile" }),
    ).toBeInTheDocument();

    const home = document.getElementById("home") as HTMLElement;
    expect(home.querySelector(".hero__visual")).not.toBeNull();
  });

  it("restores dark mode when toggled back, keeping the hero intact", async () => {
    const user = userEvent.setup();
    render(<App />);

    const toggle = () =>
      screen.getByRole("button", {
        name: /Switch to (light|dark) theme/,
      });

    await user.click(toggle());
    expect(document.documentElement).not.toHaveClass("dark");

    await user.click(toggle());
    expect(document.documentElement).toHaveClass("dark");
    expect(document.documentElement.style.colorScheme).toBe("dark");
    expect(
      screen.getByRole("heading", { level: 1, name: "Devanath N" }),
    ).toBeInTheDocument();
  });
});

describe("Hero overflow guards", () => {
  it("clips the hero and guards the app root against horizontal overflow", () => {
    render(<App />);

    const home = document.getElementById("home") as HTMLElement;
    // The `.hero` class carries `overflow: hidden`, clipping the decorative
    // layers (orbs, rings, chips) so they cannot spill out of the section.
    expect(home.className).toContain("hero");

    // The app root carries the page-level horizontal-overflow guard.
    const root = home.closest(".overflow-x-hidden");
    expect(root).not.toBeNull();
  });

  it("keeps the developer visual inside the hero section", () => {
    render(<App />);

    const home = document.getElementById("home") as HTMLElement;
    const visual = home.querySelector(".hero__visual");
    expect(visual).not.toBeNull();
    expect(home.contains(visual)).toBe(true);
  });
});

describe("Hero scroll indicator visibility", () => {
  it("hides the 'Scroll to explore' indicator below the md breakpoint", () => {
    render(<App />);

    const indicator = screen.getByRole("button", {
      name: /Scroll to explore/,
    });
    // Hidden below md, shown from md up.
    expect(indicator.className).toContain("hidden");
    expect(indicator.className).toContain("md:flex");
  });
});
