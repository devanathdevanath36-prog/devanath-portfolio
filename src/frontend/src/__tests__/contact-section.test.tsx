import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import App from "@/App";
import { CONTACT_CHANNELS } from "@/components/Contact";
import { NAV_LINKS } from "@/lib/nav-links";
import { scrollToCalls } from "./setup";

/**
 * Accepted behavior for the real #contact section.
 *
 * The request replaces the generic SectionPlaceholder body for #contact with a
 * real Contact component that renders the four contact channels with the exact
 * hrefs, external-link hardening, and accessible names. These tests assert the
 * observable contract: the section id and data-ocid hook, the level-2 heading,
 * the four anchors and their attributes, the navbar Contact link, and that the
 * other eight sections still render exactly once in NAV_LINKS order.
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

beforeEach(() => {
  vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

function renderContact(): HTMLElement {
  render(<App />);
  return document.getElementById("contact") as HTMLElement;
}

describe("#contact section", () => {
  it("keeps the #contact section id and its data-ocid hook", () => {
    const contact = renderContact();

    expect(contact).toBeInTheDocument();
    expect(contact).toHaveAttribute("data-ocid", "section.contact");
  });

  it("renders a real Contact component, not the generic placeholder", () => {
    const contact = renderContact();

    // The placeholder renders a dashed empty box; the real component renders
    // the four contact cards.
    expect(
      contact.querySelectorAll('[data-ocid^="contact.card."]'),
    ).toHaveLength(4);
    expect(contact.querySelector(".border-dashed")).not.toBeInTheDocument();
  });

  it("renders a level-2 heading for the section", () => {
    const contact = renderContact();

    expect(
      within(contact).getByRole("heading", { level: 2 }),
    ).toBeInTheDocument();
  });

  it("renders the four contact channels in the required order", () => {
    const contact = renderContact();

    const labels = Array.from(
      contact.querySelectorAll('[data-ocid^="contact.card."]'),
    ).map((card) => {
      const label = card.querySelector("p");
      return (label?.textContent ?? "").trim();
    });

    expect(labels).toEqual(["Email", "Work Phone", "LinkedIn", "GitHub"]);
  });

  it("renders the email as a mailto: anchor", () => {
    const contact = renderContact();

    const email = within(contact).getByRole("link", {
      name: /devanathdevanath36@gmail\.com/i,
    });
    expect(email).toHaveAttribute(
      "href",
      "mailto:devanathdevanath36@gmail.com",
    );
    expect(email).not.toHaveAttribute("target");
  });

  it("renders the work phone as a tel: anchor", () => {
    const contact = renderContact();

    const phone = within(contact).getByRole("link", {
      name: /\+91 9043356787/,
    });
    expect(phone).toHaveAttribute("href", "tel:+919043356787");
    expect(phone).not.toHaveAttribute("target");
  });

  it("renders the LinkedIn anchor with the exact href, new-tab hardening, and aria-label", () => {
    const contact = renderContact();

    const linkedin = within(contact).getByRole("link", {
      name: /linkedin/i,
    });
    expect(linkedin).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/devanathn1706/",
    );
    expect(linkedin).toHaveAttribute("target", "_blank");
    expect(linkedin.getAttribute("rel")).toContain("noopener");
    expect(linkedin.getAttribute("rel")).toContain("noreferrer");
    expect(linkedin).toHaveAttribute("aria-label");
    expect(linkedin.getAttribute("aria-label")).not.toBe("");
  });

  it("renders the GitHub anchor with the exact href, new-tab hardening, and aria-label", () => {
    const contact = renderContact();

    const github = within(contact).getByRole("link", { name: /github/i });
    expect(github).toHaveAttribute("href", "https://github.com/Deva-1706");
    expect(github).toHaveAttribute("target", "_blank");
    expect(github.getAttribute("rel")).toContain("noopener");
    expect(github.getAttribute("rel")).toContain("noreferrer");
    expect(github).toHaveAttribute("aria-label");
    expect(github.getAttribute("aria-label")).not.toBe("");
  });

  it("exposes the four channels through the exported CONTACT_CHANNELS contract", () => {
    expect(CONTACT_CHANNELS.map((channel) => channel.id)).toEqual([
      "email",
      "phone",
      "linkedin",
      "github",
    ]);
    expect(CONTACT_CHANNELS.map((channel) => channel.href)).toEqual([
      "mailto:devanathdevanath36@gmail.com",
      "tel:+919043356787",
      "https://www.linkedin.com/in/devanathn1706/",
      "https://github.com/Deva-1706",
    ]);
  });
});

describe("page composition with the real #contact section", () => {
  it("renders all nine sections exactly once in NAV_LINKS order with no duplicate ids", () => {
    render(<App />);

    const ids = Array.from(document.querySelectorAll("section[id]")).map(
      (section) => section.getAttribute("id"),
    );
    expect(ids).toEqual(NAV_LINKS.map((link) => link.id));

    const allIds = Array.from(document.querySelectorAll("[id]")).map(
      (element) => element.id,
    );
    expect(new Set(allIds).size).toBe(allIds.length);
  });

  it("keeps the other eight sections mounted alongside the new contact section", () => {
    render(<App />);

    for (const link of NAV_LINKS) {
      expect(document.getElementById(link.id)).toBeInTheDocument();
    }
  });
});

describe("navbar Contact link", () => {
  it("points the desktop Contact link at #contact", () => {
    render(<App />);

    const nav = screen.getByRole("navigation", { name: "Primary" });
    const contactLink = within(nav).getByRole("link", { name: "Contact" });

    expect(contactLink).toHaveAttribute("href", "#contact");
    expect(document.getElementById("contact")).toBeInTheDocument();
  });

  it("smooth-scrolls to #contact when selected", async () => {
    const user = userEvent.setup();
    render(<App />);

    const nav = screen.getByRole("navigation", { name: "Primary" });
    await user.click(within(nav).getByRole("link", { name: "Contact" }));

    expect(scrollToCalls.at(-1)).toMatchObject({ behavior: "smooth" });
  });
});
