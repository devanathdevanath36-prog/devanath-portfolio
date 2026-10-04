# Project Guidance

## User Preferences

- Dark mode is the default theme
- Purple and cyan accent gradients with subtle glow effects
- Smooth, subtle, professional animations only
- Professional developer-focused visual style
- Use Framer Motion for animations and Lucide React for icons
- Keep the existing premium card styling and reusable data-array structure so more projects can be added later

## Verified Commands

- **typecheck**: `pnpm typecheck`
- **fix**: `pnpm fix`
- **build**: `pnpm build`

## Learnings

- The #certifications section is a real component at src/frontend/src/components/Certifications.tsx + Certifications.css (named export Certifications, exported CERTIFICATIONS data array) with five cards; App.tsx renders <Certifications /> for #certifications.
- With real components for home/about/skills/projects/certifications, App.tsx maps NAV_LINKS.slice(4,7) with alternate={index % 2 === 1} and slice(8) with alternate={index % 2 === 0} so education keeps bg-muted/30 while experience/achievements/contact stay plain.
- Projects.tsx and Certifications.tsx mirror Skills.tsx card styling (rounded-2xl border bg-card/60 shadow-subtle hover:border-accent/50) and gate framer-motion whileInView on useReducedMotion().
- Projects.css and Certifications.css mirror Skills.css (grid background, violet/cyan orbs, glass card, gradient-subtle hover) and reuse the shared .orb utility and semantic OKLCH tokens.
- The #education section is a real component at src/frontend/src/components/Education.tsx + Education.css (named export Education, exported EDUCATION array) with three entries; App.tsx wraps it in a bg-muted/30 div to preserve parity.
- The #experience section is a real component at src/frontend/src/components/Experience.tsx + Experience.css (named export Experience, exported EXPERIENCE array) with three entries, focus-area chips, and status badges.
- App.tsx renders all nine sections in NAV_LINKS order: Hero, About, Skills, Projects, Experience, Education, achievements placeholder, Certifications, contact placeholder. When a real component sits between two placeholder sections, split the NAV_LINKS filter into one map per section rather than a combined slice/filter.
- An off-by-one NAV_LINKS slice silently drops or duplicates a section; verify the rendered section id order against NAV_LINKS after promoting any section to a real component.
- CSS keyframe pulses need an explicit @media (prefers-reduced-motion: reduce) guard that sets animation: none; gating framer-motion alone does not stop CSS animations.
- The hero core now renders the user's portrait (public/assets/images/devanath-portrait.jpeg) as a circular avatar in place of the '</>' glyph; the About profile card avatar renders the same portrait.
- A gradient ring on an <img> works via border: 2px solid transparent + background-clip: padding-box, border-box with a solid layer first and the gradient second; a gradient on a wrapper span is hidden when the child img fills 100%x100%.
- The hero visual is aria-hidden, so its portrait uses alt="" (decorative); the About avatar is in the accessible tree and uses alt="Portrait of Devanath N".
- hero.test.tsx was updated to accept the portrait <img> in the hero visual while preserving ring/chip counts and containment/aria-hidden assertions.
- The hero CTA row ('View My Work' scroll button and 'Download Resume' anchor) was removed at the user's request; the social-links row is now the intro column's final element at mt-9, and the ArrowRight/Download icon imports were trimmed with it.
- Hero SOCIAL_LINKS now point to the real profiles: GitHub https://github.com/Deva-1706 and LinkedIn https://www.linkedin.com/in/devanathn1706, both target=_blank with rel=noopener noreferrer and the shared FOCUS_RING class.
- hero.test.tsx and hero-theme-overflow.test.tsx were updated to assert the new social URLs and the absence of the removed CTAs; hero-social-and-content.test.tsx (added during characterization) protects the surviving hero content.
- The #contact section is now a real component at src/frontend/src/components/Contact.tsx + Contact.css (named export Contact, exported CONTACT_CHANNELS array) with four channel cards: Email (mailto:devanathdevanath36@gmail.com), Work Phone (tel:+919043356787), LinkedIn (https://www.linkedin.com/in/devanathn1706/), GitHub (https://github.com/Deva-1706).
- Contact.tsx mirrors Experience.tsx: fadeUp(delay) gated on useReducedMotion, whileInView viewport {once:true}, section id='contact' data-ocid='section.contact', glass cards, grid + violet/cyan orbs; Contact.css reuses the shared .orb utility and semantic OKLCH tokens.
- External anchors get target=_blank + rel=noopener noreferrer via a conditional spread only when external is true; mailto:/tel: anchors correctly omit them. All four anchors carry aria-labels.
- App.tsx renders <Contact /> directly as the final section (no NAV_LINKS slice change needed) while the achievements placeholder filter stays untouched; #contact stays plain (no bg-muted/30) per the alternating-background parity contract.
- The Achievements section was removed entirely at the user's request: its NAV_LINKS entry in lib/nav-links.ts and its inline SectionPlaceholder render block plus SECTION_NOTES copy in App.tsx are gone. The site now has eight sections: Home, About, Skills, Projects, Experience, Education, Certifications, Contact.
- App.tsx no longer needs the SectionPlaceholder component, SECTION_NOTES map, or NAV_LINKS/cn imports now that no placeholder sections remain; leaving them causes unused-symbol lint failures.
- Removing a NAV_LINKS entry automatically drops the section from desktop nav, mobile nav, and active-section tracking, since Navbar and use-active-section both map that array.
- After removing a NAV_LINKS entry, grep the test suite for hardcoded section indices (toBe(7), sections[6]) and removed ids in PLAIN_IDS/ALTERNATE_IDS arrays; those are the common stale assertions. Tests that iterate NAV_LINKS auto-adjust.
- Alternating-background parity tests check the section's own className or its immediate wrapper, so a section can satisfy parity either inline (Projects/Certifications) or via an App.tsx wrapper div (Education).
