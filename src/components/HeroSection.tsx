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
      className="relative min-h-screen w-full flex flex-col lg:flex-row bg-surface-primary overflow-hidden"
    >
      {/* LEFT SIDE: Typography & CTA */}
      <div className="w-full lg:w-5/12 min-h-[60vh] lg:min-h-screen flex flex-col justify-center px-8 lg:px-20 border-b lg:border-b-0 lg:border-r border-border relative z-20 bg-surface-primary">
        
        {/* Subtle Index/Label */}
        <div className="absolute top-32 left-8 lg:left-20 flex items-center gap-4">
          <div className="w-8 h-[1px] bg-border-strong"></div>
          <span className="text-[10px] font-bold tracking-[0.2em] text-text-muted uppercase">01 / Welcome</span>
        </div>

        <div className="mt-20 lg:mt-0">
          {/* Decorative badge */}
          <div className="reveal-up mb-8">
            <div className="chip !bg-transparent !border-border-strong !text-text-primary">
              BS Applied AI & Data Science
            </div>
          </div>

          {/* Hero Title */}
          <h1
            ref={titleRef}
            className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-[5.5rem] font-bold tracking-tight text-text-primary leading-[1.05]"
            style={{ overflow: "hidden" }}
          >
            <span className="hero-word block">Notes and</span>
            <span className="hero-word block">Material,</span>
            <span className="hero-word block text-accent">All at</span>
            <span className="hero-word block text-accent">One Place.</span>
          </h1>

          {/* Subtitle */}
          <p
            ref={subtitleRef}
            className="mt-8 text-base lg:text-lg text-text-secondary max-w-sm leading-relaxed"
          >
            Your comprehensive resource hub for the program. Organized by semester, subject, and week — so you never miss a beat.
          </p>

          {/* CTA Button */}
          <div ref={ctaRef} className="mt-12 flex items-center gap-6">
            <button
              onClick={handleGetStarted}
              className="btn-primary !px-8 !py-4"
            >
              <span>Explore Materials</span>
            </button>
            <a href="#about" className="text-sm font-bold text-text-primary hover:text-accent transition-colors underline decoration-border-strong underline-offset-4">
              See details
            </a>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Visuals & Glass Panel */}
      <div className="w-full lg:w-7/12 min-h-[50vh] lg:min-h-screen relative bg-surface-secondary flex items-center justify-center overflow-hidden">
        
        {/* The beautiful 3D books serving as the stark focal point */}
        <div className="absolute inset-0 scale-[0.8] lg:scale-100 flex items-center justify-center">
          <FloatingBooks />
        </div>

        {/* Minimalist Grid Lines overlaying the right side */}
        <div className="absolute inset-0 pointer-events-none flex justify-evenly">
          <div className="w-[1px] h-full bg-border/40"></div>
          <div className="w-[1px] h-full bg-border/40"></div>
        </div>

        {/* Frosted Glass Overlay - intersecting the visual */}
        <div className="absolute bottom-8 left-8 right-8 lg:bottom-16 lg:left-16 lg:right-16 z-30">
          <div className="glass-frost p-6 lg:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              {userProfile && firstName ? (
                <div ref={greetRef}>
                  <p className="text-xs font-bold tracking-widest text-text-muted uppercase mb-1">Authenticated</p>
                  <div className="flex items-center gap-3 text-lg font-bold text-text-primary">
                    <Hand className="w-5 h-5 text-text-primary" />
                    Welcome back, {firstName}.
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-xs font-bold tracking-widest text-text-muted uppercase mb-1">Public Access</p>
                  <p className="text-lg font-bold text-text-primary">Ready to dive in?</p>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-12 text-sm">
              <div>
                <p className="text-xs text-text-muted mb-1 font-bold uppercase tracking-widest">Resources</p>
                <p className="text-text-primary font-medium border-b border-text-primary pb-0.5 inline-block">Curated effectively</p>
              </div>
              <div className="hidden sm:block">
                <p className="text-xs text-text-muted mb-1 font-bold uppercase tracking-widest">Platform</p>
                <p className="text-text-primary font-medium border-b border-text-primary pb-0.5 inline-block">Fast & Accessible</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Prompt Overlay */}
      {showScrollPrompt && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-surface-primary/80 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="flex flex-col items-center gap-6 p-12 bg-white border border-border shadow-2xl">
            <div className="scroll-indicator">
              <ArrowDown className="w-8 h-8 text-accent" />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold tracking-widest text-text-muted uppercase mb-2">Navigating</p>
              <p className="text-2xl font-bold text-text-primary">Scroll to explore</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
