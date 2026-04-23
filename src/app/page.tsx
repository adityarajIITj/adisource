"use client";

import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import SubjectsSection from "@/components/SubjectsSection";
import MindMapsQuizSection from "@/components/MindMapsQuizSection";
import WhyUsSection from "@/components/WhyUsSection";
import WhatWeSolveSection from "@/components/WhatWeSolveSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import ParallaxOrbs from "@/components/ParallaxOrbs";
import ScrollProgress from "@/components/ScrollProgress";

export default function Home() {
  return (
    <div className="relative overflow-hidden bg-surface-primary min-h-screen">
      <ScrollProgress />
      <ParallaxOrbs />
      <Navbar />
      
      <main>
        <HeroSection />
        <SubjectsSection />
        <MindMapsQuizSection />
        <WhyUsSection />
        <WhatWeSolveSection />
        <ContactSection />
      </main>
      
      <Footer />
    </div>
  );
}
