"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

const PIGEON_TURN_VIDEO_SRC = "/images/pigeon-turn.mp4";

const HERO_TITLE = "Vidhara";
const HERO_SUBTEXT = "Create. Connect. Grow.";

const EMAIL_ADDRESS = "hello@vidhara.co";

interface MainframeHeroProps {
  /** If true, adjusts positioning container for embedding inside a stacked page section */
  embedded?: boolean;
}

export default function MainframeHero({ embedded = false }: MainframeHeroProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const targetTimeRef = useRef(0.5);
  const isSeekingRef = useRef(false);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [heroTextVisible, setHeroTextVisible] = useState(false);

  // Trigger title/subtext fade-in + slide-up 400ms after component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setHeroTextVisible(true);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  // Pigeon head-turn video scrubbing: the video's currentTime maps directly
  // to the cursor's (or touch point's) absolute horizontal position within
  // the hero, so the head-turn frame always matches where the pointer is —
  // no delta accumulation, no drift.
  const handleSeeked = useCallback(() => {
    isSeekingRef.current = false;
    const video = videoRef.current;
    if (!video || !video.duration) return;

    if (Math.abs(video.currentTime - targetTimeRef.current) > 0.02) {
      isSeekingRef.current = true;
      video.currentTime = targetTimeRef.current;
    }
  }, []);

  const queueSeek = useCallback((newTargetTime: number) => {
    const video = videoRef.current;
    if (!video || !video.duration) return;

    const clampedTime = Math.max(0, Math.min(video.duration, newTargetTime));
    targetTimeRef.current = clampedTime;

    if (!isSeekingRef.current && Math.abs(video.currentTime - clampedTime) > 0.01) {
      isSeekingRef.current = true;
      video.currentTime = clampedTime;
    }
  }, []);

  useEffect(() => {
    const updatePosition = (clientX: number) => {
      const video = videoRef.current;
      if (!video || !video.duration) return;

      const rect = heroRef.current?.getBoundingClientRect();
      const left = rect ? rect.left : 0;
      const width = rect ? rect.width : window.innerWidth;

      const fraction = Math.max(0, Math.min(1, (clientX - left) / width));
      queueSeek(fraction * video.duration);
    };

    const handleMouseMove = (e: MouseEvent) => updatePosition(e.clientX);

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      updatePosition(e.touches[0].clientX);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [queueSeek]);

  return (
    <div
      ref={heroRef}
      className={`relative w-full h-screen min-h-screen overflow-hidden select-none ${
        embedded ? "relative" : ""
      }`}
      style={{ fontFamily: "var(--font-body)" }}
    >
      {/* Background pigeon (head-turn video, scrubbed by cursor position) */}
      <video
        ref={videoRef}
        src={PIGEON_TURN_VIDEO_SRC}
        muted
        playsInline
        preload="auto"
        onSeeked={handleSeeked}
        onLoadedMetadata={() => {
          const video = videoRef.current;
          if (video) {
            targetTimeRef.current = video.duration / 2;
            video.currentTime = targetTimeRef.current;
          }
        }}
        className={`${
          embedded ? "absolute" : "fixed"
        } inset-0 z-0 w-full h-full object-cover pointer-events-none`}
        style={{ objectPosition: "70% center" }}
      />

      {/* NAVBAR (fixed, z-index: 10) */}
      <header
        className={`${
          embedded ? "absolute" : "fixed"
        } top-0 left-0 right-0 z-10 w-full px-5 sm:px-8 py-4 sm:py-5 flex row justify-between items-center`}
      >
        {/* Logo (left) */}
        <div className="flex flex-row items-center gap-3">
          <span
            className="text-[21px] sm:text-[26px] tracking-tight text-black font-medium leading-none"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Vidhara
          </span>
          <span
            className="text-[25px] sm:text-[30px] text-black select-none leading-none tracking-[-0.02em]"
            aria-hidden="true"
          >
            ✳︎
          </span>
        </div>

        {/* Desktop nav links (center, hidden below md) */}
        <nav
          className="hidden md:flex flex-row items-center text-[23px] text-black"
          aria-label="Desktop navigation"
        >
          <a href="#labs" className="hover:opacity-60 transition-opacity">
            Labs
          </a>
          <span className="select-none">,&nbsp;</span>
          <a href="#studio" className="hover:opacity-60 transition-opacity">
            Studio
          </a>
          <span className="select-none">,&nbsp;</span>
          <a href="#openings" className="hover:opacity-60 transition-opacity">
            Openings
          </a>
          <span className="select-none">,&nbsp;</span>
          <a href="#shop" className="hover:opacity-60 transition-opacity">
            Shop
          </a>
        </nav>

        {/* Desktop CTA (right, hidden below md) */}
        <div className="hidden md:block">
          <a
            href={`mailto:${EMAIL_ADDRESS}`}
            className="text-[23px] text-black underline underline-offset-2 hover:opacity-60 transition-opacity"
          >
            Get in touch
          </a>
        </div>

        {/* Mobile hamburger (visible below md) */}
        <button
          type="button"
          aria-label="Toggle navigation menu"
          aria-expanded={isMobileMenuOpen}
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          className="md:hidden flex flex-col justify-center items-center gap-[5px] p-2 z-20 cursor-pointer focus:outline-none"
        >
          <span
            className={`w-6 h-[2px] bg-black transition-all duration-300 transform ${
              isMobileMenuOpen ? "rotate-45 translate-y-[7px]" : ""
            }`}
          />
          <span
            className={`w-6 h-[2px] bg-black transition-all duration-300 ${
              isMobileMenuOpen ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`w-6 h-[2px] bg-black transition-all duration-300 transform ${
              isMobileMenuOpen ? "-rotate-45 -translate-y-[7px]" : ""
            }`}
          />
        </button>
      </header>

      {/* Mobile overlay (z-index: 9) */}
      <div
        className={`fixed inset-0 bg-white/95 backdrop-blur-sm flex flex-col justify-center px-8 gap-8 transition-opacity duration-300 md:hidden z-[9] ${
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <a
          href="#labs"
          onClick={() => setIsMobileMenuOpen(false)}
          className="text-[32px] font-medium text-black hover:opacity-60 transition-opacity"
        >
          Labs
        </a>
        <a
          href="#studio"
          onClick={() => setIsMobileMenuOpen(false)}
          className="text-[32px] font-medium text-black hover:opacity-60 transition-opacity"
        >
          Studio
        </a>
        <a
          href="#openings"
          onClick={() => setIsMobileMenuOpen(false)}
          className="text-[32px] font-medium text-black hover:opacity-60 transition-opacity"
        >
          Openings
        </a>
        <a
          href="#shop"
          onClick={() => setIsMobileMenuOpen(false)}
          className="text-[32px] font-medium text-black hover:opacity-60 transition-opacity"
        >
          Shop
        </a>
        <a
          href={`mailto:${EMAIL_ADDRESS}`}
          onClick={() => setIsMobileMenuOpen(false)}
          className="text-[32px] font-medium text-black underline underline-offset-4 hover:opacity-60 transition-opacity pt-4"
        >
          Get in touch
        </a>
      </div>

      {/* HERO SECTION (z-index: 1) */}
      <main className="relative z-[1] w-full h-full min-h-screen flex flex-col justify-end pb-12 md:justify-center md:pb-0 px-5 sm:px-8 md:px-10 overflow-hidden pointer-events-auto">
        <div
          className={`max-w-xl relative z-10 w-full pointer-events-none select-none transition-all duration-500 ease-out ${
            heroTextVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          }`}
        >
          <h1
            className="text-black font-medium leading-[1.05] mb-3 sm:mb-4"
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(48px, 9vw, 96px)",
            }}
          >
            {HERO_TITLE}
          </h1>
          <p
            className="text-black font-normal"
            style={{
              fontSize: "clamp(18px, 4vw, 26px)",
              lineHeight: 1.35,
            }}
          >
            {HERO_SUBTEXT}
          </p>
        </div>
      </main>

      {/* Credit footer (bottom, z-index: 10) */}
      <div
        className={`${
          embedded ? "absolute" : "fixed"
        } bottom-0 left-0 right-0 z-10 w-full px-5 sm:px-8 py-4 sm:py-5 text-center pointer-events-none`}
      >
        <a
          href="https://rdfad.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[12px] sm:text-[13px] text-black/60 hover:text-black transition-colors pointer-events-auto"
        >
          Designed and developed by RDF
        </a>
      </div>
    </div>
  );
}
