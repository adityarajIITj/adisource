"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import UserMenu from "@/components/UserMenu";

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { user, userProfile, loading } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll);

    // Entrance animation
    if (navRef.current) {
      gsap.from(navRef.current, {
        y: -30,
        opacity: 0,
        duration: 0.8,
        delay: 0.2,
        ease: "power3.out",
      });
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "glass py-3 shadow-sm"
          : "bg-transparent py-5"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <Image
            src="/logo.svg"
            alt="adisource logo"
            width={36}
            height={36}
            className="transition-transform duration-300 group-hover:scale-110"
          />
          <span
            className={`text-xl font-bold tracking-tight transition-colors duration-300 text-text-primary`}
          >
            adi<span className="gradient-text">source</span>
          </span>
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-6">
          <a
            href="#subjects"
            className="text-sm font-medium text-text-secondary hover:text-brand-blue transition-colors duration-200"
          >
            Subjects
          </a>
          <a
            href="#why-us"
            className="text-sm font-medium text-text-secondary hover:text-brand-blue transition-colors duration-200"
          >
            Why Us
          </a>
          <a
            href="#contact"
            className="text-sm font-medium text-text-secondary hover:text-brand-blue transition-colors duration-200"
          >
            Contact
          </a>

          {/* Theme Toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full hover:bg-gray-200/50 dark:hover:bg-gray-800/50 transition-colors text-text-secondary"
              aria-label="Toggle dark mode"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
          )}

          {/* Auth-aware CTA */}
          {!loading && (
            <>
              {user && userProfile ? (
                <UserMenu />
              ) : (
                <Link href="/login" className="btn-primary text-sm !py-2.5 !px-5 ml-2">
                  <span>Get Started</span>
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
