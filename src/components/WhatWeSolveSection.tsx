"use client";

import { ArrowRight, X, Check } from "lucide-react";

const problems = [
  "Scattered notes across WhatsApp, Drive, and emails",
  "No structure — unsure what to study first",
  "PDFs with zero context or summaries",
  "Missing resources for specific weeks",
  "No way to take notes alongside reading",
];

const solutions = [
  "One centralized, beautifully organized platform",
  "Week-by-week breakdown with time estimates",
  "AI-generated overviews for every resource",
  "Complete coverage for every semester & subject",
  "Built-in note editor right beside your PDFs",
];

export default function WhatWeSolveSection() {
  return (
    <section className="relative py-28 px-6">
      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="reveal-up text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            What are we <span className="gradient-text">solving</span>?
          </h2>
          <p className="reveal-up mt-4 text-text-secondary text-lg max-w-xl mx-auto">
            We took the most frustrating parts of studying in this program and fixed them.
          </p>
        </div>

        {/* Problem → Solution Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr,auto,1fr] gap-8 items-start">
          {/* Problems */}
          <div className="reveal-left">
            <div className="glass-card rounded-2xl p-8">
              <h3 className="text-lg font-bold text-red-500/80 mb-6 flex items-center gap-2">
                <X className="w-5 h-5" />
                The Problem
              </h3>
              <ul className="space-y-4">
                {problems.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-text-secondary"
                  >
                    <span className="flex-shrink-0 mt-1 w-5 h-5 rounded-full bg-red-100 text-red-400 flex items-center justify-center text-xs">
                      ✕
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Arrow */}
          <div className="reveal-scale hidden lg:flex items-center justify-center pt-20">
            <div className="gradient-brand rounded-full p-3">
              <ArrowRight className="w-6 h-6 text-white" />
            </div>
          </div>

          {/* Solutions */}
          <div className="reveal-right">
            <div className="glass-card rounded-2xl p-8 ring-1 ring-green-200/50">
              <h3 className="text-lg font-bold text-green-600 mb-6 flex items-center gap-2">
                <Check className="w-5 h-5" />
                Our Solution
              </h3>
              <ul className="space-y-4">
                {solutions.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-text-secondary"
                  >
                    <span className="flex-shrink-0 mt-1 w-5 h-5 rounded-full bg-green-100 text-green-500 flex items-center justify-center text-xs">
                      ✓
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
