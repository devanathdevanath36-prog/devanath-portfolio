import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  Github,
  Linkedin,
  type LucideIcon,
  Mail,
  MessageSquare,
  Phone,
} from "lucide-react";

import "./Contact.css";

type ContactKind = "email" | "phone" | "linkedin" | "github";

interface ContactChannel {
  id: ContactKind;
  label: string;
  value: string;
  href: string;
  Icon: LucideIcon;
  /** Opens in a new tab (external profiles only). */
  external: boolean;
  /** Accessible name for the anchor, kept explicit for icon-led links. */
  ariaLabel: string;
}

/**
 * Reusable contact data array.
 *
 * Add a channel here and the section renders it automatically — the card
 * index, scroll-reveal stagger, and `data-ocid` indices all derive from order.
 */
export const CONTACT_CHANNELS: ContactChannel[] = [
  {
    id: "email",
    label: "Email",
    value: "devanathdevanath36@gmail.com",
    href: "mailto:devanathdevanath36@gmail.com",
    Icon: Mail,
    external: false,
    ariaLabel: "Email Devanath N at devanathdevanath36@gmail.com",
  },
  {
    id: "phone",
    label: "Work Phone",
    value: "+91 9043356787",
    href: "tel:+919043356787",
    Icon: Phone,
    external: false,
    ariaLabel: "Call Devanath N at +91 9043356787",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    value: "linkedin.com/in/devanathn1706",
    href: "https://www.linkedin.com/in/devanathn1706/",
    Icon: Linkedin,
    external: true,
    ariaLabel: "LinkedIn profile of Devanath N",
  },
  {
    id: "github",
    label: "GitHub",
    value: "github.com/Deva-1706",
    href: "https://github.com/Deva-1706",
    Icon: Github,
    external: true,
    ariaLabel: "GitHub profile of Devanath N",
  },
];

export function Contact() {
  const prefersReducedMotion = useReducedMotion();

  const fadeUp = (delay: number) => ({
    initial: prefersReducedMotion ? false : { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: prefersReducedMotion
      ? { duration: 0 }
      : { duration: 0.55, delay, ease: "easeOut" as const },
  });

  return (
    <section
      id="contact"
      data-ocid="section.contact"
      className="contact flex min-h-screen scroll-mt-24 items-center border-b border-border px-4 py-20 md:px-6 md:py-28"
    >
      <div className="contact__grid" aria-hidden="true" />
      <div
        className="orb contact__orb contact__orb--violet"
        aria-hidden="true"
      />
      <div className="orb contact__orb contact__orb--cyan" aria-hidden="true" />

      <div className="mx-auto w-full max-w-6xl">
        <motion.div {...fadeUp(0)} className="max-w-3xl">
          <p className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-widest text-accent">
            <MessageSquare className="h-3.5 w-3.5" aria-hidden="true" />
            #contact
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground md:text-5xl">
            Let&rsquo;s Build Something
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
            Open to full-stack roles, internships, and collaborative product
            work. Reach out through any channel below — I usually reply within a
            day.
          </p>
        </motion.div>

        <ul className="mt-12 grid gap-6 sm:grid-cols-2">
          {CONTACT_CHANNELS.map(
            ({ id, label, value, href, Icon, external, ariaLabel }, index) => (
              <motion.li
                key={id}
                {...fadeUp(0.06 * index)}
                data-ocid={`contact.card.${index + 1}`}
                className="contact__card group flex h-full flex-col rounded-2xl border border-border bg-card/60 p-6 shadow-subtle transition-smooth hover:border-accent/50 md:p-7"
              >
                <div className="flex items-start justify-between gap-3">
                  <span
                    className="contact__icon inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-secondary text-accent transition-smooth group-hover:border-accent/40"
                    aria-hidden="true"
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <span
                    className="contact__index font-mono text-sm font-semibold tracking-widest text-accent"
                    aria-hidden="true"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <p className="mt-5 font-mono text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {label}
                </p>

                <a
                  href={href}
                  data-ocid={`contact.link.${index + 1}`}
                  aria-label={ariaLabel}
                  {...(external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="contact__link mt-2 inline-flex min-w-0 items-center gap-1.5 font-display text-base font-semibold tracking-tight text-foreground transition-smooth hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background md:text-lg"
                >
                  <span className="truncate">{value}</span>
                  <ArrowUpRight
                    className="contact__link-icon h-4 w-4 shrink-0 text-accent"
                    aria-hidden="true"
                  />
                </a>
              </motion.li>
            ),
          )}
        </ul>
      </div>
    </section>
  );
}
