"use client";

import Link from "next/link";
import { Map, PenTool, Sparkles, ChevronRight } from "lucide-react";

export default function MindMapsQuizSection() {
  return (
    <section className="relative py-28 px-6">
      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-14">
          <h2 className="reveal-up text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            Learn <span className="accent-underline">Smarter</span>
          </h2>
          <p className="reveal-up mt-4 text-text-secondary text-lg max-w-xl mx-auto">
            Interactive tools to deepen your understanding and test your knowledge.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="reveal-up grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Mind Maps Card */}
          <div className="group relative card-elevated rounded-3xl p-8 overflow-hidden hover:shadow-lg transition-all duration-400 border border-border">
            {/* Background tint */}
            <div className="absolute inset-0 bg-accent-subtle opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center mb-6 shadow-md shadow-accent/20 group-hover:scale-110 transition-transform duration-300">
                <Map className="w-7 h-7 text-white" />
              </div>

              <h3 className="text-xl font-extrabold text-text-primary mb-2">
                Mind Maps
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed mb-6">
                Interactive concept maps for every subject. Visualize connections between topics and build a deeper understanding.
              </p>

              {/* Coming Soon Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-secondary border border-border text-text-muted text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                Coming Soon
              </div>
            </div>
          </div>

          {/* Quizzes Card — NOW ACTIVE */}
          <Link href="/quiz" className="group relative card-elevated rounded-3xl p-8 overflow-hidden hover:shadow-lg transition-all duration-400 block border border-border">
            {/* Background tint */}
            <div className="absolute inset-0 bg-accent-subtle opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center mb-6 shadow-md shadow-accent/20 group-hover:scale-110 transition-transform duration-300">
                <PenTool className="w-7 h-7 text-white" />
              </div>

              <h3 className="text-xl font-extrabold text-text-primary mb-2">
                Quizzes
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed mb-6">
                Test your knowledge with AI-generated quizzes for every chapter. Track your scores and identify weak areas.
              </p>

              {/* Active CTA */}
              <div className="btn-primary !px-5 !py-2.5 !text-xs !rounded-full">
                <Sparkles className="w-3.5 h-3.5" />
                Start Quizzing
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
