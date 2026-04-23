"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import ParallaxOrbs from "@/components/ParallaxOrbs";
import UserManager from "@/components/admin/UserManager";
import AnalyticsDashboard from "@/components/admin/AnalyticsDashboard";
import PlatformSettings from "@/components/admin/PlatformSettings";
import ContentManager from "@/components/admin/ContentManager";
import Announcements from "@/components/admin/Announcements";
import SystemHealth from "@/components/admin/SystemHealth";
import Link from "next/link";
import {
  ArrowLeft,
  Shield,
  Users,
  BarChart3,
  Settings,
  Bell,
  Database,
  Cpu,
} from "lucide-react";

const tabs = [
  { id: "users", label: "Users", icon: Users },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "content", label: "Content", icon: Database },
  { id: "announcements", label: "Announcements", icon: Bell },
  { id: "settings", label: "Settings", icon: Settings },
  { id: "system", label: "System", icon: Cpu },
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
          <div className="flex items-center gap-4 mb-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-brand-purple to-brand-magenta flex items-center justify-center shadow-lg shadow-brand-purple/30">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold">
                Super Admin <span className="gradient-text">Command Center</span>
              </h1>
              <p className="text-text-secondary text-sm">
                Welcome back, {userProfile.displayName.split(" ")[0]} · Full platform control
              </p>
            </div>
          </div>

          {/* Status pills */}
          <div className="flex flex-wrap gap-2 mb-8">
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-green-400/10 text-green-400 border border-green-400/20">
              ● Live
            </span>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-brand-purple/10 text-brand-purple border border-brand-purple/20">
              Superadmin
            </span>
          </div>

          {/* Tab Bar */}
          <div className="glass-card rounded-2xl p-1.5 inline-flex flex-wrap gap-1 mb-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                id={`admin-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                    ? "gradient-brand text-white shadow-lg"
                    : "text-text-secondary hover:text-text-primary hover:bg-white/50 dark:hover:bg-white/5"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="min-h-[500px]">
            {activeTab === "users" && <UserManager />}
            {activeTab === "analytics" && <AnalyticsDashboard />}
            {activeTab === "content" && <ContentManager />}
            {activeTab === "announcements" && <Announcements />}
            {activeTab === "settings" && <PlatformSettings />}
            {activeTab === "system" && <SystemHealth />}
          </div>
        </div>
      </main>
    </div>
  );
}
