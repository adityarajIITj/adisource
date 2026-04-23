"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ArrowDown, Sparkles, Hand } from "lucide-react";
import FloatingBooks from "./FloatingBooks";
import { useAuth } from "@/hooks/useAuth";

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const greetRef = useRef<HTMLDivElement>(null);
  const [showScrollPrompt, setShowScrollPrompt] = useState(false);
  const { user, userProfile } = useAuth();

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.5 });

    if (greetRef.current) {
      tl.from(greetRef.current, {
        y: -20,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
      });
    }

    if (titleRef.current) {
      const words = titleRef.current.querySelectorAll(".hero-word");
      tl.from(words, {
        y: 60,
        opacity: 0,
        duration: 0.9,
        stagger: 0.08,
        ease: "power3.out",
      }, greetRef.current ? "-=0.3" : "+=0");
    }

    if (subtitleRef.current) {
      tl.from(
        subtitleRef.current,
        {
          y: 30,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
        },
        "-=0.3"
      );
    }

    if (ctaRef.current) {
      tl.from(
        ctaRef.current,
        {
          y: 20,
          opacity: 0,
          duration: 0.6,
          ease: "power3.out",
        },
        "-=0.2"
      );
    }
  }, [userProfile]);

  const handleGetStarted = () => {
    setShowScrollPrompt(true);

    setTimeout(() => {
      setShowScrollPrompt(false);
      const target = document.getElementById("subjects");
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }, 2200);
  };

  const firstName = userProfile?.displayName?.split(" ")[0];

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center overflow-hidden hero-bg"
    >
      {/* 3D Floating Parallax Books Layer */}
      <FloatingBooks />

      {/* Content wrapper with z-index to stay above floating elements */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Personalized Greeting (logged in users) */}
        {userProfile && firstName && (
          <div ref={greetRef} className="mb-6">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl glass-card text-base font-semibold text-text-primary greeting-glow">
              <Hand className="w-5 h-5 text-amber-400" />
              Hi, {firstName} — What do you want to learn today?
            </div>
          </div>
        )}

        {/* Decorative badge */}
        <div className="reveal-up mb-8">
          <div className="label-indigo">
            <Sparkles className="w-3.5 h-3.5" />
            BS Applied AI &amp; Data Science
          </div>
        </div>

      {/* Hero Title */}
      <h1
        ref={titleRef}
        className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight max-w-5xl leading-[1.08] mt-6"
        style={{ overflow: "hidden", fontFamily: "var(--font-display)" }}
      >
        <span className="hero-word inline-block">Notes</span>{" "}
        <span className="hero-word inline-block">and</span>{" "}
        <span className="hero-word inline-block">Material,</span>
        <br />
        <span className="hero-word inline-block gradient-text">All</span>{" "}
        <span className="hero-word inline-block gradient-text">at</span>{" "}
        <span className="hero-word inline-block gradient-text">One</span>{" "}
        <span className="hero-word inline-block gradient-text">Place.</span>
      </h1>

      {/* Subtitle */}
      <p
        ref={subtitleRef}
        className="mt-6 text-lg md:text-xl text-text-secondary max-w-2xl leading-relaxed"
      >
        Your comprehensive resource hub for the BS Applied AI & Data Science program.
        Organized by semester, subject, and week — so you never miss a beat.
      </p>

        {/* CTA Button */}
        <div ref={ctaRef} className="mt-10">
          <button
            onClick={handleGetStarted}
            className="btn-primary text-lg !py-4 !px-10"
          >
            <span>Get Started</span>
          </button>
        </div>
      </div>

      {/* Scroll Prompt Overlay */}
      {showScrollPrompt && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="flex flex-col items-center gap-4 glass-card rounded-3xl px-12 py-10 shadow-2xl">
            <div className="scroll-indicator">
              <ArrowDown className="w-8 h-8 text-brand-blue" />
            </div>
            <p className="text-lg font-semibold text-text-primary">
              Scroll to explore
            </p>
            <p className="text-sm text-text-muted">
              Dive into your course materials
            </p>
          </div>
        </div>
      )}

      {/* Bottom scroll hint */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
        <div className="scroll-indicator">
          <ArrowDown className="w-5 h-5 text-text-muted" />
        </div>
      </div>
    </section>
  );
}
