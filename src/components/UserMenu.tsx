"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { User, LogOut, Shield, ChevronDown, Settings } from "lucide-react";

export default function UserMenu() {
  const { user, userProfile, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (!user || !userProfile) return null;

  return (
    <div ref={menuRef} className="relative">
      {/* Avatar Button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2.5 px-2 py-1.5 rounded-full hover:bg-white/30 dark:hover:bg-white/5 transition-all duration-200 group"
      >
        <img
          src={user.photoURL || ""}
          alt={userProfile.displayName}
          className="w-8 h-8 rounded-full border-2 border-brand-blue/30 shadow-sm"
          referrerPolicy="no-referrer"
        />
        <span className="hidden sm:block text-sm font-semibold text-text-primary max-w-[100px] truncate">
          {userProfile.displayName.split(" ")[0]}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-text-muted transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-64 glass-card rounded-2xl shadow-2xl overflow-hidden usermenu-enter z-[999]">
          {/* User info header */}
          <div className="px-5 py-4 border-b border-white/10">
            <p className="text-sm font-bold text-text-primary truncate">
              {userProfile.displayName}
            </p>
            <p className="text-xs text-text-muted mt-0.5">
              @{userProfile.username}
            </p>
          </div>

          {/* Menu items */}
          <div className="py-2">
            <Link
              href="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-5 py-3 text-sm text-text-secondary hover:text-text-primary hover:bg-white/30 dark:hover:bg-white/5 transition-all"
            >
              <User className="w-4 h-4" />
              My Profile
            </Link>

            <Link
              href="/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-5 py-3 text-sm text-text-secondary hover:text-text-primary hover:bg-white/30 dark:hover:bg-white/5 transition-all"
            >
              <Settings className="w-4 h-4" />
              Settings
            </Link>

            {userProfile.role === "superadmin" && (
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-5 py-3 text-sm text-brand-purple hover:bg-white/30 dark:hover:bg-white/5 transition-all font-medium"
              >
                <Shield className="w-4 h-4" />
                Admin Panel
              </Link>
            )}
          </div>

          {/* Logout */}
          <div className="border-t border-white/10 py-2">
            <button
              onClick={() => {
                setOpen(false);
                logout();
              }}
              className="w-full flex items-center gap-3 px-5 py-3 text-sm text-red-400 hover:text-red-500 hover:bg-red-500/5 transition-all"
            >
              <LogOut className="w-4 h-4" />
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
