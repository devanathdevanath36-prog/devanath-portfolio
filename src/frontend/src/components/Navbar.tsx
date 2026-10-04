import { useActiveSection } from "@/hooks/use-active-section";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTheme } from "@/hooks/use-theme";
import { NAVBAR_HEIGHT, NAV_LINKS } from "@/lib/nav-links";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

/**
 * Matches the Tailwind `xl:` breakpoint used to show/hide the desktop nav.
 * Nine inline links plus the logo and two icon buttons only fit comfortably
 * from 1280px up, so the hamburger panel covers everything below that.
 */
const DESKTOP_BREAKPOINT = 1280;

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

function scrollToSection(id: string) {
  const target = document.getElementById(id);
  if (!target) return;
  const top =
    target.getBoundingClientRect().top + window.scrollY - NAVBAR_HEIGHT + 1;
  window.scrollTo({ top, behavior: "smooth" });
}

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const activeId = useActiveSection();
  const isMobile = useIsMobile(DESKTOP_BREAKPOINT);
  const prefersReducedMotion = useReducedMotion();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu when resizing up to desktop.
  useEffect(() => {
    if (!isMobile) setIsOpen(false);
  }, [isMobile]);

  // Lock background scroll while the mobile menu is open.
  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  // Close on Escape.
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  const handleNavigate = useCallback((id: string) => {
    setIsOpen(false);
    scrollToSection(id);
  }, []);

  return (
    <motion.header
      initial={prefersReducedMotion ? false : { y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={
        prefersReducedMotion
          ? { duration: 0 }
          : { duration: 0.5, ease: "easeOut" }
      }
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        isScrolled ? "glass-nav shadow-subtle" : "border-b border-transparent",
      )}
      style={{ height: NAVBAR_HEIGHT }}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-full max-w-6xl items-center justify-between gap-4 px-4 md:px-6"
      >
        <button
          type="button"
          data-ocid="navbar.brand_link"
          onClick={() => handleNavigate("home")}
          className={cn(
            "rounded-md font-mono text-lg font-semibold tracking-tight transition-opacity hover:opacity-80",
            FOCUS_RING,
          )}
        >
          <span className="text-gradient-aurora">&lt; Devanath /&gt;</span>
        </button>

        <div className="hidden items-center gap-1 xl:flex 2xl:gap-2">
          {NAV_LINKS.map((link) => {
            const isActive = activeId === link.id;
            return (
              <a
                key={link.id}
                href={`#${link.id}`}
                data-ocid={`navbar.link.${link.id}`}
                aria-current={isActive ? "page" : undefined}
                onClick={(event) => {
                  event.preventDefault();
                  handleNavigate(link.id);
                }}
                className={cn(
                  "group relative whitespace-nowrap rounded-full px-2.5 py-2 font-display text-sm font-medium transition-colors duration-300",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                  FOCUS_RING,
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="navbar-active-indicator"
                    className="absolute inset-0 -z-10 rounded-full bg-gradient-aurora-subtle glow-primary"
                    transition={
                      prefersReducedMotion
                        ? { duration: 0 }
                        : { type: "spring", stiffness: 380, damping: 32 }
                    }
                  />
                )}
                <span className="relative">{link.label}</span>
                <span className="absolute inset-x-2.5 -bottom-0.5 h-px origin-left scale-x-0 bg-gradient-aurora transition-transform duration-300 group-hover:scale-x-100" />
              </a>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            data-ocid="navbar.theme_toggle"
            onClick={toggleTheme}
            aria-label={
              theme === "dark"
                ? "Switch to light theme"
                : "Switch to dark theme"
            }
            className={cn(
              "relative grid h-10 w-10 place-items-center rounded-full border border-border bg-card/60 text-foreground transition-colors duration-300 hover:bg-secondary hover:shadow-glow-accent",
              FOCUS_RING,
            )}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={theme}
                initial={
                  prefersReducedMotion
                    ? false
                    : { rotate: -90, opacity: 0, scale: 0.6 }
                }
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={
                  prefersReducedMotion
                    ? { opacity: 0 }
                    : { rotate: 90, opacity: 0, scale: 0.6 }
                }
                transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
                className="grid place-items-center"
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </motion.span>
            </AnimatePresence>
          </button>

          <button
            type="button"
            data-ocid="navbar.menu_toggle"
            onClick={() => setIsOpen((open) => !open)}
            aria-expanded={isOpen}
            aria-controls="mobile-nav-panel"
            aria-label={
              isOpen ? "Close navigation menu" : "Open navigation menu"
            }
            className={cn(
              "grid h-10 w-10 place-items-center rounded-full border border-border bg-card/60 text-foreground transition-colors duration-300 hover:bg-secondary xl:hidden",
              FOCUS_RING,
            )}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={isOpen ? "close" : "open"}
                initial={
                  prefersReducedMotion ? false : { rotate: -90, opacity: 0 }
                }
                animate={{ rotate: 0, opacity: 1 }}
                exit={
                  prefersReducedMotion
                    ? { opacity: 0 }
                    : { rotate: 90, opacity: 0 }
                }
                transition={{ duration: prefersReducedMotion ? 0 : 0.18 }}
                className="grid place-items-center"
              >
                {isOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-nav-panel"
            data-ocid="navbar.mobile_panel"
            initial={prefersReducedMotion ? false : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={
              prefersReducedMotion ? { opacity: 0 } : { opacity: 0, height: 0 }
            }
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : { duration: 0.28, ease: "easeOut" }
            }
            className="glass-nav overflow-hidden xl:hidden"
          >
            <ul className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4 md:px-6">
              {NAV_LINKS.map((link, index) => (
                <motion.li
                  key={link.id}
                  initial={
                    prefersReducedMotion ? false : { opacity: 0, x: -12 }
                  }
                  animate={{ opacity: 1, x: 0 }}
                  transition={
                    prefersReducedMotion
                      ? { duration: 0 }
                      : { delay: 0.05 * index, duration: 0.25 }
                  }
                >
                  <a
                    href={`#${link.id}`}
                    data-ocid={`navbar.mobile_link.${link.id}`}
                    aria-current={activeId === link.id ? "page" : undefined}
                    onClick={(event) => {
                      event.preventDefault();
                      handleNavigate(link.id);
                    }}
                    className={cn(
                      "block rounded-lg px-4 py-3 font-display text-base font-medium transition-colors duration-300",
                      activeId === link.id
                        ? "bg-gradient-aurora-subtle text-foreground"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                      FOCUS_RING,
                    )}
                  >
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
