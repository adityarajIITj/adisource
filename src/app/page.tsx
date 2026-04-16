"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import SubjectsSection from "@/components/SubjectsSection";
import MindMapsQuizSection from "@/components/MindMapsQuizSection";
import WhyUsSection from "@/components/WhyUsSection";
import WhatWeSolveSection from "@/components/WhatWeSolveSection";
import ContactSection from "@/components/ContactSection";
import AboutUsSection from "@/components/AboutUsSection";
import Footer from "@/components/Footer";
import ParallaxOrbs from "@/components/ParallaxOrbs";
import ScrollProgress from "@/components/ScrollProgress";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    // Sync Lenis with GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // Delay reveal animations slightly to let content load
    const initTimeout = setTimeout(() => {
      const revealElements = gsap.utils.toArray<HTMLElement>(".reveal-up");
      revealElements.forEach((el) => {
        gsap.to(el, {
          scrollTrigger: {
            trigger: el,
            start: "top 95%",
            toggleActions: "play none none none",
          },
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
        });
      });

      const revealLeft = gsap.utils.toArray<HTMLElement>(".reveal-left");
      revealLeft.forEach((el) => {
        gsap.to(el, {
          scrollTrigger: {
            trigger: el,
            start: "top 95%",
            toggleActions: "play none none none",
          },
          x: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
        });
      });

      const revealRight = gsap.utils.toArray<HTMLElement>(".reveal-right");
      revealRight.forEach((el) => {
        gsap.to(el, {
          scrollTrigger: {
            trigger: el,
            start: "top 95%",
            toggleActions: "play none none none",
          },
          x: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
        });
      });

      const revealScale = gsap.utils.toArray<HTMLElement>(".reveal-scale");
      revealScale.forEach((el) => {
        gsap.to(el, {
          scrollTrigger: {
            trigger: el,
            start: "top 95%",
            toggleActions: "play none none none",
          },
          scale: 1,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
        });
      });
    }, 300);

    return () => {
      clearTimeout(initTimeout);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
      gsap.ticker.remove(() => {});
    };
  }, []);

  return (
    <div ref={mainRef} className="relative overflow-hidden">
      <ScrollProgress />
      <ParallaxOrbs />
      <Navbar />
      <main>
        <HeroSection />
        <SubjectsSection />
        <MindMapsQuizSection />
        <WhyUsSection />
        <WhatWeSolveSection />
        <AboutUsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
