import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import App from "@/App";
import { NAV_LINKS } from "@/lib/nav-links";

/**
 * Cover for the Hero section.
 *
 * The Hero replaced the #home placeholder body. These tests assert the
 * accepted observable behavior: the section contract, the copy, the social
 * links, the decorative visual, and the scroll-to-explore indicator. The
 * "View My Work" and "Download Resume" CTAs were intentionally removed, so
 * this file asserts their absence rather than their behavior. These tests
 * deliberately avoid animation timing and CSS-class assertions; motion is only
 * checked through the reduced-motion seam.
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

/**
 * jsdom does not implement Element.scrollIntoView. The Hero's CTAs and scroll
 * indicator call it directly, so record the calls to assert the scroll target.
 */
interface ScrollIntoViewCall {
  id: string;
  behavior?: ScrollBehavior;
}

const scrollIntoViewCalls: ScrollIntoViewCall[] = [];

function installScrollIntoView() {
  Element.prototype.scrollIntoView = vi.fn(function (
    this: Element,
    options?: boolean | ScrollIntoViewOptions,
  ) {
    scrollIntoViewCalls.push({
      id: this.id,
      behavior: typeof options === "object" ? options?.behavior : undefined,
    });
  });
}

/**
 * Override matchMedia so framer-motion's `useReducedMotion` reports the
 * requested preference. The default setup file returns `matches: false`.
 */
function setReducedMotion(reduce: boolean) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: (query: string) => ({
      matches: reduce && query.includes("prefers-reduced-motion"),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }),
  });
}

beforeEach(() => {
  scrollIntoViewCalls.length = 0;
  installScrollIntoView();
  vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("Hero section contract", () => {
  it("renders #home with the section.home hook and all nine anchors", () => {
    render(<App />);

    const home = document.getElementById("home");
    expect(home).toBeInTheDocument();
    expect(home).toHaveAttribute("data-ocid", "section.home");

    for (const link of NAV_LINKS) {
      expect(document.getElementById(link.id)).toBeInTheDocument();
    }
  });

  it("renders the hero copy: badge, greeting, name, title, description, and growth line", () => {
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
});

describe("Hero calls to action", () => {
  it("no longer renders the 'View My Work' button or 'Download Resume' link", () => {
    render(<App />);

    expect(
      screen.queryByRole("button", { name: /View My Work/ }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /Download Resume/ }),
    ).not.toBeInTheDocument();
  });

  it("smooth-scrolls to #about from the 'Scroll to explore' indicator", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /Scroll to explore/ }));

    expect(scrollIntoViewCalls.at(-1)).toMatchObject({
      id: "about",
      behavior: "smooth",
    });
  });
});

describe("Hero social links", () => {
  it("opens GitHub and LinkedIn in a new tab with safe rel and aria-labels", () => {
    render(<App />);

    const github = screen.getByRole("link", { name: "GitHub profile" });
    expect(github).toHaveAttribute("href", "https://github.com/Deva-1706");
    expect(github).toHaveAttribute("target", "_blank");
    expect(github).toHaveAttribute("rel", "noopener noreferrer");

    const linkedin = screen.getByRole("link", { name: "LinkedIn profile" });
    expect(linkedin).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/devanathn1706",
    );
    expect(linkedin).toHaveAttribute("target", "_blank");
    expect(linkedin).toHaveAttribute("rel", "noopener noreferrer");
  });
});

describe("Hero developer visual", () => {
  it("renders the CSS visual with rotating rings and technology chips", () => {
    render(<App />);

    const home = document.getElementById("home") as HTMLElement;
    expect(home.querySelector(".hero__visual")).not.toBeNull();
    expect(home.querySelectorAll(".hero__ring").length).toBeGreaterThanOrEqual(
      3,
    );
    expect(home.querySelectorAll(".hero__chip").length).toBeGreaterThanOrEqual(
      5,
    );
  });

  it("renders the portrait photo clipped to a circle inside the hero core", () => {
    render(<App />);

    const home = document.getElementById("home") as HTMLElement;
    const core = home.querySelector(".hero__core") as HTMLElement;
    expect(core).not.toBeNull();

    const portrait = core.querySelector("img") as HTMLImageElement;
    expect(portrait).not.toBeNull();
    // Served from the app's public assets, not inlined base64.
    expect(portrait).toHaveAttribute(
      "src",
      "/assets/images/devanath-portrait.jpeg",
    );
    expect(portrait.getAttribute("src")).not.toMatch(/^data:/);
    // Decorative inside the aria-hidden hero visual: empty alt.
    expect(portrait).toHaveAttribute("alt", "");
    // Responsive: intrinsic dimensions plus a fluid class hook.
    expect(portrait).toHaveAttribute("width", "512");
    expect(portrait).toHaveAttribute("height", "512");
    expect(portrait.className).toContain("hero__portrait");
  });
});

describe("Hero accessibility", () => {
  it("gives every interactive hero control a visible focus ring class", () => {
    render(<App />);

    const controls = [
      screen.getByRole("link", { name: "GitHub profile" }),
      screen.getByRole("link", { name: "LinkedIn profile" }),
      screen.getByRole("button", { name: /Scroll to explore/ }),
    ];

    for (const control of controls) {
      expect(control.className).toContain("focus-visible:ring-2");
    }
  });

  it("keeps the decorative visual hidden from assistive technology", () => {
    render(<App />);

    const home = document.getElementById("home") as HTMLElement;
    const visual = home.querySelector(".hero__visual");
    expect(visual?.closest("[aria-hidden='true']")).not.toBeNull();
  });
});

describe("Hero reduced motion", () => {
  it("still renders the full hero content when prefers-reduced-motion is enabled", () => {
    setReducedMotion(true);
    render(<App />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Devanath N" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "GitHub profile" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Scroll to explore/ }),
    ).toBeInTheDocument();
  });
});

describe("Hero alongside the app shell", () => {
  it("keeps the navbar and theme toggle working next to the hero", async () => {
    const user = userEvent.setup();
    render(<App />);

    const nav = screen.getByRole("navigation", { name: "Primary" });
    expect(within(nav).getByRole("link", { name: "Home" })).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: "Switch to light theme" }),
    );
    expect(document.documentElement).not.toHaveClass("dark");
    expect(
      screen.getByRole("button", { name: "Switch to dark theme" }),
    ).toBeInTheDocument();
  });
});
