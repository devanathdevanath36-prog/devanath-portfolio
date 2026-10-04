export interface NavLink {
  label: string;
  id: string;
}

/**
 * Single source of truth for the portfolio navigation.
 * The Navbar, active-section detection, and the page shell all read from here,
 * so adding or reordering a section only requires editing this array.
 */
export const NAV_LINKS: NavLink[] = [
  { label: "Home", id: "home" },
  { label: "About", id: "about" },
  { label: "Skills", id: "skills" },
  { label: "Projects", id: "projects" },
  { label: "Experience", id: "experience" },
  { label: "Education", id: "education" },
  { label: "Certifications", id: "certifications" },
  { label: "Contact", id: "contact" },
];

/** Height of the fixed navbar in pixels, used to offset smooth-scroll targets. */
export const NAVBAR_HEIGHT = 72;
