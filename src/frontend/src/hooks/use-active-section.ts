import { NAV_LINKS } from "@/lib/nav-links";
import { useEffect, useState } from "react";

/**
 * Tracks which portfolio section is currently in view by observing the
 * section elements referenced by NAV_LINKS. Returns the active section id.
 */
export function useActiveSection(): string {
  const [activeId, setActiveId] = useState<string>(NAV_LINKS[0]?.id ?? "");

  useEffect(() => {
    const sections = NAV_LINKS.map((link) =>
      document.getElementById(link.id),
    ).filter((element): element is HTMLElement => element !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-45% 0px -45% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    for (const section of sections) observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return activeId;
}
