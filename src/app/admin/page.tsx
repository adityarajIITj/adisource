"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import ParallaxOrbs from "@/components/ParallaxOrbs";
import UserManager from "@/components/admin/UserManager";
import AnalyticsDashboard from "@/components/admin/AnalyticsDashboard";
import PlatformSettings from "@/components/admin/PlatformSettings";
import Link from "next/link";
import {
  ArrowLeft,
  Shield,
  Users,
  BarChart3,
  Settings,
} from "lucide-react";

const tabs = [
  { id: "users", label: "Users", icon: Users },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function AdminPage() {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("users");

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (userProfile && userProfile.role !== "superadmin") {
        router.push("/");
      }
    }
  }, [user, userProfile, loading, router]);

  if (loading || !userProfile || userProfile.role !== "superadmin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-primary">
        <div className="login-spinner" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-surface-primary overflow-hidden">
      <ParallaxOrbs />
      <Navbar />

      <main className="relative z-10 pt-28 pb-20 px-6">
        <div className="mx-auto max-w-6xl">
          {/* Back */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>

          {/* Header */}
          <div className="flex items-center gap-4 mb-10">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-brand-purple to-brand-magenta flex items-center justify-center shadow-lg">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold">
                Admin <span className="gradient-text">Panel</span>
              </h1>
              <p className="text-text-secondary text-sm">
                Welcome back, {userProfile.displayName.split(" ")[0]}
              </p>
            </div>
          </div>

          {/* Tab Bar */}
          <div className="glass-card rounded-2xl p-1.5 inline-flex flex-wrap gap-1 mb-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                    ? "gradient-brand text-white shadow-lg"
                    : "text-text-secondary hover:text-text-primary hover:bg-white/50 dark:hover:bg-white/5"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="min-h-[400px]">
            {activeTab === "users" && <UserManager />}
            {activeTab === "analytics" && <AnalyticsDashboard />}
            {activeTab === "settings" && <PlatformSettings />}
          </div>
        </div>
      </main>
    </div>
  );
}
