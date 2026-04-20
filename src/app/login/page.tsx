"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import ParallaxOrbs from "@/components/ParallaxOrbs";
import Image from "next/image";
import { Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const { user, userProfile, loading, signInWithGoogle, loginAsGuest } = useAuth();
  const router = useRouter();
  const [authError, setAuthError] = useState("");
  const [signingIn, setSigningIn] = useState(false);

  const handleSignIn = async () => {
    setAuthError("");
    setSigningIn(true);
    try {
      await signInWithGoogle();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("popup-closed") || msg.includes("cancelled")) {
        setAuthError("Sign-in was cancelled.");
      } else if (msg.includes("unauthorized-domain") || msg.includes("invalid-api-key")) {
        setAuthError("This domain isn't authorized in Firebase. Add it to Firebase Console → Auth → Authorized Domains.");
      } else {
        setAuthError("Sign-in failed: " + msg);
      }
    } finally {
      setSigningIn(false);
    }
  };

  useEffect(() => {
    if (!loading && user) {
      if (userProfile) {
        // Existing user — go home or redirect
        const params = new URLSearchParams(window.location.search);
        const redirect = params.get("redirect") || "/";
        router.push(redirect);
      } else {
        // New user — go to onboarding
        router.push("/onboarding");
      }
    }
  }, [user, userProfile, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-primary">
        <div className="login-spinner" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden bg-surface-primary">
      <ParallaxOrbs />

      {/* Back to home */}
      <Link
        href="/"
        className="absolute top-6 left-6 z-20 flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to home
      </Link>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="glass-card rounded-3xl p-10 text-center login-card-enter">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl gradient-brand flex items-center justify-center shadow-lg">
              <Image
                src="/logo.svg"
                alt="adisource"
                width={36}
                height={36}
                className="brightness-0 invert"
              />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-extrabold tracking-tight mb-2">
            Welcome to{" "}
            <span className="gradient-text">adisource</span>
          </h1>
          <p className="text-text-secondary text-sm mb-8 leading-relaxed">
            Sign in to track your progress, save notes, and unlock your personalized learning dashboard.
          </p>

          {/* Decorative badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs font-medium text-text-muted mb-8">
            <Sparkles className="w-3.5 h-3.5 text-brand-cyan" />
            BS Applied AI & Data Science
          </div>

          {/* Google Sign-In Button */}
          <button
            onClick={handleSignIn}
            disabled={signingIn}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-semibold text-sm transition-all duration-300 bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 hover:shadow-lg hover:-translate-y-0.5 text-gray-700 dark:text-white disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
          >
            {signingIn ? (
              <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
            )}
            <span>{signingIn ? "Opening Google…" : "Continue with Google"}</span>
          </button>

          {/* Permanent Guest Mode */}
          <div className="mt-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1 h-px bg-gray-200 dark:bg-white/10" />
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Or</span>
              <div className="flex-1 h-px bg-gray-200 dark:bg-white/10" />
            </div>
            <button
              onClick={loginAsGuest}
              className="w-full py-4 rounded-2xl font-bold text-sm transition-all duration-300 bg-surface-secondary border border-gray-200 dark:border-white/10 text-text-secondary hover:bg-white dark:hover:bg-white/5 hover:border-brand-purple/50 hover:text-brand-purple flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-brand-purple" />
              Continue as Guest
            </button>
            <p className="mt-3 text-[10px] text-text-muted">
              Guest progress is saved locally but won&apos;t sync across devices.
            </p>
          </div>

          {/* Auth error */}
          {authError && (
            <div className="mt-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs text-left leading-relaxed">
              {authError}
            </div>
          )}

          {/* Footer note */}
          <p className="mt-6 text-xs text-text-muted leading-relaxed">
            By signing in, you agree to our terms. We only access your name, email, and profile picture.
          </p>
        </div>

        {/* Decorative glow */}
        <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-r from-brand-cyan/20 via-brand-blue/20 to-brand-purple/20 blur-2xl opacity-60" />
      </div>
    </div>
  );
}
