import { act, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import App from "@/App";
import { NAV_LINKS } from "@/lib/nav-links";
import { scrollToCalls } from "./setup";

/**
 * Controllable IntersectionObserver. jsdom has none, and the active-section
 * hook is the only consumer, so a small registry lets tests drive which
 * section is "in view" without depending on real layout.
 */
type ObserverCallback = IntersectionObserverCallback;

const observers = new Set<{
  callback: ObserverCallback;
  targets: Set<Element>;
}>();

class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | Document | null = null;
  readonly rootMargin: string = "";
  readonly thresholds: ReadonlyArray<number> = [];
  private entry: { callback: ObserverCallback; targets: Set<Element> };

  constructor(callback: ObserverCallback) {
    this.entry = { callback, targets: new Set() };
    observers.add(this.entry);
  }

  observe(target: Element): void {
    this.entry.targets.add(target);
  }
  unobserve(target: Element): void {
    this.entry.targets.delete(target);
  }
  disconnect(): void {
    this.entry.targets.clear();
    observers.delete(this.entry);
  }
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

/** Simulate the given section id becoming the most visible one. */
function enterSection(id: string) {
  const target = document.getElementById(id);
  if (!target) throw new Error(`No section with id ${id}`);
  const entry = {
    target,
    isIntersecting: true,
    intersectionRatio: 1,
    boundingClientRect: target.getBoundingClientRect(),
    intersectionRect: target.getBoundingClientRect(),
    rootBounds: null,
    time: 0,
  } as unknown as IntersectionObserverEntry;
  act(() => {
    for (const observer of observers) {
      if (observer.targets.has(target)) {
        observer.callback([entry], {} as IntersectionObserver);
      }
    }
  });
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

function scrollTo(y: number) {
  Object.defineProperty(window, "scrollY", {
    writable: true,
    configurable: true,
    value: y,
  });
  act(() => {
    window.dispatchEvent(new Event("scroll"));
  });
}

beforeEach(() => {
  observers.clear();
  vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
  setViewportWidth(1440);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("App shell", () => {
  it("renders the navbar and all nine sections without a blank screen", () => {
    render(<App />);

    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(
      screen.getByRole("navigation", { name: "Primary" }),
    ).toBeInTheDocument();
    for (const link of NAV_LINKS) {
      expect(document.getElementById(link.id)).toBeInTheDocument();
    }
  });

  it("renders the < Devanath /> logo", () => {
    render(<App />);
    expect(screen.getByText("< Devanath />")).toBeInTheDocument();
  });
});

describe("Navbar desktop navigation", () => {
  it("shows all nine links inline on a desktop viewport", () => {
    render(<App />);
    const nav = screen.getByRole("navigation", { name: "Primary" });
    for (const link of NAV_LINKS) {
      expect(
        within(nav).getByRole("link", { name: link.label }),
      ).toBeInTheDocument();
    }
  });

  it("smooth-scrolls to the matching section and marks the link active", async () => {
    const user = userEvent.setup();
    render(<App />);

    const nav = screen.getByRole("navigation", { name: "Primary" });
    const projectsLink = within(nav).getByRole("link", { name: "Projects" });
    await user.click(projectsLink);

    expect(scrollToCalls.at(-1)).toMatchObject({ behavior: "smooth" });

    enterSection("projects");
    expect(within(nav).getByRole("link", { name: "Projects" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("updates the active link when a section scrolls into view", () => {
    render(<App />);
    const nav = screen.getByRole("navigation", { name: "Primary" });

    enterSection("skills");
    expect(within(nav).getByRole("link", { name: "Skills" })).toHaveAttribute(
      "aria-current",
      "page",
    );

    enterSection("contact");
    expect(within(nav).getByRole("link", { name: "Contact" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(
      within(nav).getByRole("link", { name: "Skills" }),
    ).not.toHaveAttribute("aria-current");
  });
});

describe("Navbar scroll styling", () => {
  it("is transparent at the top and gains the glass treatment after scrolling", () => {
    render(<App />);
    const header = screen.getByRole("banner");
    expect(header.className).not.toContain("glass-nav");

    scrollTo(200);

    expect(header.className).toContain("glass-nav");
    expect(header.className).toContain("shadow-subtle");
  });
});

describe("Navbar mobile menu", () => {
  it("hides the inline link row and shows the hamburger on a mobile viewport", () => {
    setViewportWidth(390);
    render(<App />);

    // The desktop row is hidden with `hidden xl:flex`; the hamburger with `xl:hidden`.
    const homeLink = screen.getByRole("link", { name: "Home" });
    expect(homeLink.parentElement?.className).toContain("hidden");
    expect(homeLink.parentElement?.className).toContain("xl:flex");

    const toggle = screen.getByRole("button", { name: "Open navigation menu" });
    expect(toggle.className).toContain("xl:hidden");
  });

  it("opens a full-width panel with all nine links, locks scroll, and closes on selection", async () => {
    const user = userEvent.setup();
    setViewportWidth(390);
    render(<App />);

    const toggle = screen.getByRole("button", { name: "Open navigation menu" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    await user.click(toggle);

    expect(toggle).toHaveAttribute("aria-expanded", "true");
    const panel = document.getElementById("mobile-nav-panel");
    expect(panel).not.toBeNull();
    for (const link of NAV_LINKS) {
      expect(
        within(panel as HTMLElement).getByRole("link", { name: link.label }),
      ).toBeInTheDocument();
    }
    expect(document.body.style.overflow).toBe("hidden");

    await user.click(
      within(panel as HTMLElement).getByRole("link", { name: "Education" }),
    );

    await waitFor(() => {
      expect(document.getElementById("mobile-nav-panel")).toBeNull();
    });
    expect(document.body.style.overflow).not.toBe("hidden");
    expect(scrollToCalls.at(-1)).toMatchObject({ behavior: "smooth" });
  });

  it("closes the mobile panel on Escape", async () => {
    const user = userEvent.setup();
    setViewportWidth(390);
    render(<App />);

    await user.click(
      screen.getByRole("button", { name: "Open navigation menu" }),
    );
    expect(document.getElementById("mobile-nav-panel")).not.toBeNull();

    await user.keyboard("{Escape}");
    await waitFor(() => {
      expect(document.getElementById("mobile-nav-panel")).toBeNull();
    });
  });
});

describe("Theme toggle", () => {
  it("defaults to dark mode on first load with no saved preference", () => {
    render(<App />);
    expect(document.documentElement).toHaveClass("dark");
    expect(
      screen.getByRole("button", { name: "Switch to light theme" }),
    ).toBeInTheDocument();
  });

  it("toggles to light mode and persists the choice to localStorage", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(
      screen.getByRole("button", { name: "Switch to light theme" }),
    );

    expect(document.documentElement).not.toHaveClass("dark");
    expect(window.localStorage.getItem("devanath-theme")).toBe("light");
    expect(
      screen.getByRole("button", { name: "Switch to dark theme" }),
    ).toBeInTheDocument();
  });

  it("restores a saved light preference on load", () => {
    window.localStorage.setItem("devanath-theme", "light");
    render(<App />);
    expect(document.documentElement).not.toHaveClass("dark");
    expect(
      screen.getByRole("button", { name: "Switch to dark theme" }),
    ).toBeInTheDocument();
  });
});

describe("Accessibility", () => {
  it("exposes aria-expanded on the hamburger reflecting its state", async () => {
    const user = userEvent.setup();
    setViewportWidth(390);
    render(<App />);

    const toggle = screen.getByRole("button", { name: "Open navigation menu" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(toggle).toHaveAttribute("aria-controls", "mobile-nav-panel");

    await user.click(toggle);
    expect(
      screen.getByRole("button", { name: "Close navigation menu" }),
    ).toHaveAttribute("aria-expanded", "true");
  });

  it("gives interactive controls a visible focus ring class", () => {
    render(<App />);
    const themeToggle = screen.getByRole("button", {
      name: "Switch to light theme",
    });
    expect(themeToggle.className).toContain("focus-visible:ring-2");
  });
});
