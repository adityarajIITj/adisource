"use client";

import { Mail, Phone } from "lucide-react";

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

        {/* Contact info replacing the mail system */}
        <div className="reveal-up">
          <div className="flex flex-col sm:flex-row items-center gap-8 w-full justify-center">
            <a
              href="mailto:b25bs1020@iitj.ac.in"
              className="group flex flex-col items-center p-8 bg-white/5 border border-gray-200 dark:border-white/10 rounded-[2rem] hover:border-brand-blue hover:shadow-xl hover:shadow-brand-blue/10 hover:-translate-y-1 transition-all duration-300 gap-5 min-w-[280px]"
            >
              <div className="p-4 bg-brand-blue/10 rounded-full text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-colors duration-300">
                <Mail className="w-8 h-8" />
              </div>
              <div className="text-center">
                <p className="text-sm text-text-muted mb-1 font-medium">Email me at</p>
                <p className="font-bold text-text-primary text-lg">b25bs1020@iitj.ac.in</p>
              </div>
            </a>
            
            <a
              href="tel:+918882636198"
              className="group flex flex-col items-center p-8 bg-white/5 border border-gray-200 dark:border-white/10 rounded-[2rem] hover:border-purple-500 hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1 transition-all duration-300 gap-5 min-w-[280px]"
            >
              <div className="p-4 bg-purple-500/10 rounded-full text-purple-500 group-hover:bg-purple-500 group-hover:text-white transition-colors duration-300">
                <Phone className="w-8 h-8" />
              </div>
              <div className="text-center">
                <p className="text-sm text-text-muted mb-1 font-medium">Call or Text me</p>
                <p className="font-bold text-text-primary text-lg">+91 8882636198</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
