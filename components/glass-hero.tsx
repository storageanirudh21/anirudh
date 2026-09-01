"use client";

import { useEffect, useRef, type PointerEvent } from "react";

const NAME = "Anirudh";
const DESKTOP_RADIUS = 235;
const MOBILE_RADIUS = 150;

const CTA_LINK = "mailto:rokkamharishkumar42@gmail.com";
const CTA_LABEL = "Let's talk";
const EXPLORE_LABEL = "Explore my work";

const HEADLINE_LINES = ["Building", "Beyond", "Possible."];
const INTRO =
  "I build thoughtful, products at the intersection of design and engineering.";

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Work", href: "#work" },
  { label: "Process", href: "#process" },
  { label: "Vidhara", href: "#mainframe" },
];

function Monogram() {
  return (
    <svg width="30" height="30" viewBox="0 0 32 32" fill="none" aria-hidden="true" focusable="false">
      <circle cx="16" cy="16" r="14.5" stroke="currentColor" strokeWidth="1" />
      <path
        d="M10.5 22.5 L16 9.5 L21.5 22.5 M12.6 17.5 H19.4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function GlassHero() {
  const heroRef = useRef<HTMLElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);

  const rawRef = useRef({ x: -999, y: -999 });
  const smoothRef = useRef({ x: -999, y: -999 });
  const radiusRef = useRef(0);
  const targetRadiusRef = useRef(0);
  const touchActiveRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotionRef.current = mediaQuery.matches;
    const handleChange = () => {
      reducedMotionRef.current = mediaQuery.matches;
    };
    mediaQuery.addEventListener("change", handleChange);

    const tick = () => {
      const posFactor = reducedMotionRef.current ? 1 : 0.14;
      const radiusFactor = reducedMotionRef.current ? 1 : 0.12;

      const raw = rawRef.current;
      const smooth = smoothRef.current;

      smooth.x += (raw.x - smooth.x) * posFactor;
      smooth.y += (raw.y - smooth.y) * posFactor;
      radiusRef.current += (targetRadiusRef.current - radiusRef.current) * radiusFactor;

      const el = revealRef.current;
      if (el) {
        el.style.setProperty("--reveal-x", `${smooth.x}px`);
        el.style.setProperty("--reveal-y", `${smooth.y}px`);
        el.style.setProperty("--reveal-radius", `${Math.max(radiusRef.current, 0)}px`);
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const getLocalPoint = (e: PointerEvent<HTMLElement>) => {
    const rect = heroRef.current?.getBoundingClientRect();
    if (!rect) return { x: e.clientX, y: e.clientY };
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const handlePointerEnter = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse") return;
    const { x, y } = getLocalPoint(e);
    rawRef.current.x = x;
    rawRef.current.y = y;
    targetRadiusRef.current = DESKTOP_RADIUS;
  };

  const handlePointerMove = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType === "mouse") {
      const { x, y } = getLocalPoint(e);
      rawRef.current.x = x;
      rawRef.current.y = y;
      return;
    }
    if (!touchActiveRef.current) return;
    const { x, y } = getLocalPoint(e);
    rawRef.current.x = x;
    rawRef.current.y = y;
  };

  const handlePointerLeave = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse") return;
    targetRadiusRef.current = 0;
  };

  const handlePointerDown = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType === "mouse") return;
    touchActiveRef.current = true;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // pointer capture unsupported for this input; continue without it
    }
    const { x, y } = getLocalPoint(e);
    rawRef.current.x = x;
    rawRef.current.y = y;
    targetRadiusRef.current = MOBILE_RADIUS;
  };

  const handlePointerEnd = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType === "mouse") return;
    touchActiveRef.current = false;
    targetRadiusRef.current = 0;
  };

  return (
    <main
      ref={heroRef}
      className="hero-root"
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
    >
      <div aria-hidden="true" className="base-layer anim-base" />

      <div ref={revealRef} aria-hidden="true" className="reveal-layer" />

      <div aria-hidden="true" className="tech-grid-desktop">
        {Array.from({ length: 48 }).map((_, i) => (
          <span key={i} className="tech-grid-cell" />
        ))}
        <span className="tech-circle" />
      </div>
      <div aria-hidden="true" className="tech-grid-mobile">
        {Array.from({ length: 24 }).map((_, i) => (
          <span key={i} className="tech-grid-cell" />
        ))}
      </div>

      <section aria-label="Introduction">
        <h1 className="hero-headline" aria-label={HEADLINE_LINES.join(" ")}>
          {HEADLINE_LINES.map((line, i) => (
            <span
              key={line}
              aria-hidden="true"
              className="hero-headline-line anim-rise"
              style={{ animationDelay: `${0.35 + i * 0.08}s` }}
            >
              {line}
            </span>
          ))}
        </h1>

        <div className="hero-bottom anim-rise" style={{ animationDelay: "0.75s" }}>
          <p className="hero-intro">{INTRO}</p>
          <a className="hero-explore-btn" href={CTA_LINK} target="_blank" rel="noreferrer">
            {EXPLORE_LABEL}
          </a>
        </div>
      </section>

      <header className="hero-nav anim-nav">
        <div className="hero-nav-left">
          <a className="hero-brand" href="#top" aria-label={`${NAME} — home`}>
            <Monogram />
            <span className="hero-brand-name">{NAME}</span>
          </a>
          <nav className="hero-nav-links" aria-label="Primary">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
        </div>
        <a className="hero-cta" href={CTA_LINK} target="_blank" rel="noreferrer">
          {CTA_LABEL}
        </a>
      </header>
    </main>
  );
}
