import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

/**
 * jsdom does not implement matchMedia. framer-motion's `useReducedMotion`
 * reads it, so provide a stable "no preference" implementation.
 */
if (!window.matchMedia) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: false,
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

/**
 * jsdom does not implement scrollTo. Record calls so tests can assert that
 * navigation requested a smooth scroll to the right offset.
 */
export interface ScrollToCall {
  top?: number;
  behavior?: ScrollBehavior;
}

export const scrollToCalls: ScrollToCall[] = [];

Object.defineProperty(window, "scrollTo", {
  writable: true,
  value: vi.fn((options?: ScrollToOptions | number, y?: number) => {
    if (typeof options === "number") {
      scrollToCalls.push({ top: y });
      return;
    }
    scrollToCalls.push({ top: options?.top, behavior: options?.behavior });
  }),
});

afterEach(() => {
  cleanup();
  scrollToCalls.length = 0;
  window.localStorage.clear();
  document.documentElement.classList.remove("dark", "light");
  document.documentElement.style.colorScheme = "";
  document.body.style.overflow = "";
});
