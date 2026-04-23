"use client";

import { User } from "lucide-react";

export default function AboutUsSection() {
  return (
    <section id="about" className="relative py-28 px-6 bg-surface-secondary border-y border-border">
      <div className="mx-auto max-w-4xl text-center">
        <div className="reveal-scale inline-flex items-center justify-center p-4 bg-accent-subtle rounded-full mb-8 text-accent border border-accent-border">
          <User className="w-10 h-10" />
        </div>
        <h2 className="reveal-up text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-8">
          About <span className="accent-underline">Creator</span>
        </h2>
        <div className="reveal-up relative group">
          <p className="relative text-lg md:text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed card-elevated border border-border rounded-3xl p-10 bg-white">
            Adisource is proudly built and maintained by a team of <span className="font-extrabold text-accent text-2xl underline decoration-accent-border/30 underline-offset-4">1 person only</span>. 
            <br className="hidden md:block" /><br className="hidden md:block" />
            My motive is to streamline the learning experience, improve overall fluidity, and build a unified, high-performance platform for the BS Applied AI & Data Science community.
          </p>
        </div>
      </div>
    </section>
  );
}
