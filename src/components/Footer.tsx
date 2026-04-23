"use client";

import Image from "next/image";

export default function Footer() {
  return (
    <footer className="relative py-12 px-6 border-t border-gray-200/50">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <Image
              src="/logo.svg"
              alt="adisource logo"
              width={28}
              height={28}
            />
            <span className="text-lg font-bold tracking-tight text-text-primary">
              adisource
            </span>
          </div>

          {/* Tagline & About */}
          <div className="flex flex-col items-center">
            <p className="text-sm text-text-muted text-center mb-1 italic">
              BS Applied AI & Data Science — Notes & Materials
            </p>
            <p className="text-xs font-bold text-accent">
              An original portal for the DS community.
            </p>
          </div>

          {/* Copyright */}
          <p className="text-sm text-text-muted">
            © {new Date().getFullYear()} adisource
          </p>
        </div>
      </div>
    </footer>
  );
}
