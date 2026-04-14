"use client";

import { User } from "lucide-react";

export default function AboutUsSection() {
  return (
    <section id="about" className="relative py-28 px-6 bg-black/5 dark:bg-white/5">
      <div className="mx-auto max-w-4xl text-center">
        <div className="reveal-scale inline-flex items-center justify-center p-4 bg-brand-blue/10 rounded-full mb-8 text-brand-blue shadow-lg shadow-brand-blue/20">
          <User className="w-10 h-10" />
        </div>
        <h2 className="reveal-up text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-8">
          About <span className="gradient-text">Creator</span>
        </h2>
        <div className="reveal-up relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-blue/20 to-brand-purple/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-50" />
          <p className="relative text-lg md:text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed glass border border-gray-200 dark:border-white/10 rounded-3xl p-8 shadow-xl">
            Adisource is proudly built and maintained by a team of <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 text-2xl px-1">1 person only</span>. 
            <br className="hidden md:block" /><br className="hidden md:block" />
            My motive is to streamline the learning experience, improve overall fluidity, and build a unified, high-performance platform for the BS Applied AI & Data Science community.
          </p>
        </div>
      </div>
    </section>
  );
}
