"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { 
  ArrowLeft, Sparkles, Key, CheckCircle2, 
  Trash2, ExternalLink, ShieldCheck, Zap, Save
} from "lucide-react";

export default function SettingsPage() {
  const { user, userProfile, loading } = useAuth();
  const [apiKey, setApiKey] = useState("");
  const [hasApiKey, setHasApiKey] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success">("idle");
  const [savedKey, setSavedKey] = useState("");

  const isChanged = apiKey.trim() !== savedKey;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentKey = localStorage.getItem("gemini_api_key") || "";
      setSavedKey(currentKey);
      if (currentKey) {
        setApiKey(currentKey);
        setHasApiKey(true);
      }
    }
  }, []);

  const handleSaveKey = () => {
    if (!apiKey.trim()) return;
    setSaveStatus("saving");
    
    // Simulate a brief save for UX feedback, then update
    setTimeout(() => {
      localStorage.setItem("gemini_api_key", apiKey.trim());
      setSavedKey(apiKey.trim());
      setHasApiKey(true);
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 2000);
    }, 800);
  };

  const handleDeleteKey = () => {
    if (confirm("Are you sure you want to remove your API key? Gemini features will be disabled.")) {
      localStorage.removeItem("gemini_api_key");
      setSavedKey("");
      setApiKey("");
      setHasApiKey(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-primary">
        <div className="w-8 h-8 rounded-full border-4 border-brand-blue border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!user || !userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-primary p-6 text-center">
        <div>
          <h2 className="text-2xl font-bold mb-4">Sign In Required</h2>
          <Link href="/login" className="btn-primary"><span>Sign In</span></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col pt-24 bg-surface-primary">
      <Navbar />

      <main className="flex-grow px-6 pb-24">
        <div className="mx-auto max-w-3xl">
          
          {/* Breadcrumb */}
          <div className="mb-8 flex items-center gap-2 text-sm text-text-muted">
            <Link href="/" className="hover:text-brand-blue flex items-center gap-1 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Home
            </Link>
            <span>/</span>
            <span>Settings</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-text-primary mb-8">
            Platform <span className="gradient-text">Settings</span>
          </h1>

          <div className="space-y-6">
            
            {/* AI Configuration Section */}
            <div className="glass-card rounded-3xl p-8 relative overflow-hidden border border-purple-500/20 shadow-xl shadow-purple-500/5">
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-text-primary">Gemini AI Setup</h2>
                  <p className="text-sm text-text-secondary">Power quizzes and content explainers with your own API key.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-surface-secondary border border-gray-200 dark:border-white/5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-sm font-bold text-text-primary">
                      <Key className="w-4 h-4 text-purple-500" />
                      Gemini API Key
                    </div>
                    {hasApiKey && (
                      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20">
                        <ShieldCheck className="w-3 h-3" />
                        Active
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="AIzaSy..."
                      className="flex-1 px-4 py-3 rounded-xl bg-surface-primary border border-gray-200 dark:border-white/10 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                    />
                    {isChanged || !hasApiKey ? (
                      <button 
                        onClick={handleSaveKey}
                        disabled={!apiKey.trim() || saveStatus === "saving"}
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-fuchsia-600 text-white font-bold text-sm hover:shadow-lg transition-all disabled:opacity-40 flex items-center gap-2"
                      >
                        {saveStatus === "saving" ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin rounded-full" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            Save Key
                          </>
                        )}
                      </button>
                    ) : (
                      <button 
                        onClick={handleDeleteKey}
                        className="p-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 transition-all hover:text-white"
                        title="Remove Key"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>

                  {saveStatus === "success" && (
                    <div className="mt-3 flex items-center gap-2 text-xs text-green-500 font-medium animate-in fade-in slide-in-from-top-1">
                      <CheckCircle2 className="w-4 h-4" />
                      API Key saved successfully! Site-wide AI activated.
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
                    <p className="text-xs text-text-muted">
                      Don&apos;t have a key? It&apos;s free from Google AI Studio.
                    </p>
                    <a 
                      href="https://aistudio.google.com/app/apikey" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-brand-purple hover:underline flex items-center gap-1"
                    >
                      Get Key <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                {/* Info Card */}
                <div className="p-4 rounded-xl bg-brand-blue/5 border border-brand-blue/10">
                  <div className="flex gap-3">
                    <Zap className="w-5 h-5 text-brand-blue shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-brand-blue mb-1">How it works</h4>
                      <p className="text-xs text-text-secondary leading-relaxed">
                        Your key is stored <strong>locally in your browser</strong>. We never send it to our servers. It is used to call Gemini 1.5 Flash directly from your device to generate quizzes and explain lecture content.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Info (Read-only for now) */}
            <div className="glass-card rounded-3xl p-8">
              <h2 className="text-xl font-bold text-text-primary mb-6">Linked Account</h2>
              <div className="flex items-center gap-4">
                <img 
                  src={user.photoURL || ""} 
                  alt={userProfile.displayName}
                  className="w-16 h-16 rounded-2xl border-2 border-brand-blue/20"
                />
                <div>
                  <h3 className="font-bold text-text-primary">{userProfile.displayName}</h3>
                  <p className="text-sm text-text-secondary">{userProfile.email}</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
