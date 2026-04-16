"use client";

import { Mail } from "lucide-react";

export default function ContactSection() {
  return (
    <section id="contact" className="relative py-28 px-6">
      <div className="mx-auto max-w-4xl">
        {/* Section Header */}
        <div className="text-center mb-14">
          <h2 className="reveal-up text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            Get in <span className="gradient-text">Touch</span>
          </h2>
          <p className="reveal-up mt-4 text-text-secondary text-lg max-w-xl mx-auto">
            Have suggestions, found a bug, or want to contribute resources?
            We&apos;d love to hear from you.
          </p>
        </div>

        {/* Contact — Email Only */}
        <div className="reveal-up flex justify-center">
          <a
            href="mailto:b25bs1020@iitj.ac.in"
            className="group flex flex-col items-center p-10 bg-white/5 border border-gray-200 dark:border-white/10 rounded-[2rem] hover:border-brand-blue hover:shadow-xl hover:shadow-brand-blue/10 hover:-translate-y-1 transition-all duration-300 gap-5 w-full max-w-md"
          >
            <div className="p-5 bg-brand-blue/10 rounded-full text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-colors duration-300">
              <Mail className="w-10 h-10" />
            </div>
            <div className="text-center">
              <p className="text-sm text-text-muted mb-1 font-medium">Email us at</p>
              <p className="font-bold text-text-primary text-xl">b25bs1020@iitj.ac.in</p>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
