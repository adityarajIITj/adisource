"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import ParallaxOrbs from "@/components/ParallaxOrbs";
import { Check, X, Loader2, AtSign, ArrowRight, Sparkles } from "lucide-react";

export default function OnboardingPage() {
  const { user, userProfile, loading, refreshProfile } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [usernameStatus, setUsernameStatus] = useState<
    "idle" | "checking" | "available" | "taken" | "invalid"
  >("idle");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Redirect if not logged in or already has profile
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (userProfile) {
        router.push("/");
      }
    }
  }, [user, userProfile, loading, router]);

  // Debounced username availability check
  const checkUsername = useCallback(async (name: string) => {
    if (name.length < 3) {
      setUsernameStatus("invalid");
      return;
    }

    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(name)) {
      setUsernameStatus("invalid");
      return;
    }

    setUsernameStatus("checking");

    try {
      const usernameDoc = await getDoc(doc(db, "usernames", name.toLowerCase()));
      setUsernameStatus(usernameDoc.exists() ? "taken" : "available");
    } catch {
      setUsernameStatus("idle");
    }
  }, []);

  useEffect(() => {
    if (!username) {
      setUsernameStatus("idle");
      return;
    }

    const timer = setTimeout(() => checkUsername(username), 500);
    return () => clearTimeout(timer);
  }, [username, checkUsername]);

  const handleSubmit = async () => {
    if (usernameStatus !== "available" || !user) return;

    setSubmitting(true);
    setError("");

    try {
      const lowerUsername = username.toLowerCase();

      // Double-check availability
      const usernameDoc = await getDoc(doc(db, "usernames", lowerUsername));
      if (usernameDoc.exists()) {
        setUsernameStatus("taken");
        setSubmitting(false);
        return;
      }

      // Create user profile
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || "User",
        photoURL: user.photoURL || "",
        username: lowerUsername,
        role: "user",
        createdAt: new Date().toISOString(),
      });

      // Reserve the username
      await setDoc(doc(db, "usernames", lowerUsername), {
        uid: user.uid,
      });

      // Refresh context and navigate
      await refreshProfile();
      router.push("/");
    } catch (err) {
      console.error("Onboarding error:", err);
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-primary">
        <div className="login-spinner" />
      </div>
    );
  }

  const firstName = user.displayName?.split(" ")[0] || "there";

  return (
    <div className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden bg-surface-primary">
      <ParallaxOrbs />

      <div className="relative z-10 w-full max-w-lg">
        <div className="glass-card rounded-3xl p-10 login-card-enter">
          {/* Avatar */}
          {user.photoURL && (
            <div className="flex justify-center mb-6">
              <img
                src={user.photoURL}
                alt={user.displayName || "User"}
                className="w-20 h-20 rounded-full border-4 border-white/30 shadow-xl"
                referrerPolicy="no-referrer"
              />
            </div>
          )}

          {/* Welcome text */}
          <h1 className="text-2xl font-extrabold text-center mb-2">
            Welcome, <span className="gradient-text">{firstName}</span>! 👋
          </h1>
          <p className="text-text-secondary text-sm text-center mb-8">
            Choose a unique username to get started. This is how others will see you.
          </p>

          {/* Username input */}
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
                <AtSign className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, ""))
                }
                placeholder="pick_a_username"
                maxLength={20}
                className="w-full pl-12 pr-12 py-4 rounded-2xl bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue transition-all text-sm font-medium"
                disabled={submitting}
              />
              {/* Status indicator */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                {usernameStatus === "checking" && (
                  <Loader2 className="w-5 h-5 text-brand-blue animate-spin" />
                )}
                {usernameStatus === "available" && (
                  <Check className="w-5 h-5 text-green-500" />
                )}
                {usernameStatus === "taken" && (
                  <X className="w-5 h-5 text-red-500" />
                )}
                {usernameStatus === "invalid" && username.length > 0 && (
                  <X className="w-5 h-5 text-yellow-500" />
                )}
              </div>
            </div>

            {/* Status message */}
            <div className="h-5 text-xs font-medium px-1">
              {usernameStatus === "available" && (
                <span className="text-green-500 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> @{username.toLowerCase()} is yours!
                </span>
              )}
              {usernameStatus === "taken" && (
                <span className="text-red-500">This username is already taken</span>
              )}
              {usernameStatus === "invalid" && username.length > 0 && (
                <span className="text-yellow-500">
                  3–20 characters, letters, numbers, and underscores only
                </span>
              )}
            </div>

            {error && (
              <p className="text-red-500 text-xs font-medium px-1">{error}</p>
            )}

            {/* Submit button */}
            <button
              onClick={handleSubmit}
              disabled={usernameStatus !== "available" || submitting}
              className="w-full btn-primary !py-4 !rounded-2xl disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
            >
              <span className="flex items-center justify-center gap-2">
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating your account...
                  </>
                ) : (
                  <>
                    Let&apos;s Go
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </span>
            </button>
          </div>
        </div>

        {/* Decorative glow */}
        <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-r from-brand-cyan/20 via-brand-blue/20 to-brand-purple/20 blur-2xl opacity-60" />
      </div>
    </div>
  );
}
