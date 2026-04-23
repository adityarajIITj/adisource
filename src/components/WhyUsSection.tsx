"use client";

import { BookOpenCheck, Brain, Clock, FolderSearch } from "lucide-react";

const features = [
  {
    icon: FolderSearch,
    title: "Everything Organized",
    description:
      "Resources neatly sorted by semester, subject, and week. No more digging through WhatsApp groups or random folders.",
    gradient: "from-cyan-500 to-blue-500",
  },
  {
    icon: Brain,
    title: "AI-Powered Summaries",
    description:
      "Get instant AI overviews of any PDF. Ask questions about the material and get clear, context-aware answers.",
    gradient: "from-blue-500 to-indigo-500",
  },
  {
    icon: BookOpenCheck,
    title: "Integrated Note-Taking",
    description:
      "Write your own notes directly beside the study material. No tab-switching, no separate apps needed.",
    gradient: "from-indigo-500 to-purple-500",
  },
  {
    icon: Clock,
    title: "Time Estimates",
    description:
      "Know how long each resource takes before you start. Plan your study sessions with confidence.",
    gradient: "from-purple-500 to-fuchsia-500",
  },
];

export default function WhyUsSection() {
  return (
    <section id="why-us" className="relative py-28 px-6">
      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="reveal-up text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            Why <span className="accent-underline">adisource</span>?
          </h2>
          <p className="reveal-up mt-4 text-text-secondary text-lg max-w-xl mx-auto">
            Built by students, for students. We know what it takes to make studying less painful.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="reveal-up card-elevated rounded-2xl p-8 group transition-all duration-400 border border-border"
                style={{ transitionDelay: `${index * 80}ms` }}
              >
                {/* Icon */}
                <div
                  className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent-subtle text-accent mb-5 group-hover:scale-110 transition-transform duration-300 border border-accent-border"
                >
                  <Icon className="w-6 h-6" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-text-primary mb-2">
                  {feature.title}
                </h3>
                <p className="text-text-secondary leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
