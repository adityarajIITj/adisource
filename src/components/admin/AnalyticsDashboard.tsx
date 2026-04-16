"use client";

import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useCourseData } from "@/context/CourseDataContext";
import { Users, BookOpen, BarChart3, FileText, Clock } from "lucide-react";

interface UserData {
  displayName: string;
  username: string;
  photoURL: string;
  createdAt: string;
}

export default function AnalyticsDashboard() {
  const { semesters } = useCourseData();
  const [userCount, setUserCount] = useState(0);
  const [recentUsers, setRecentUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const usersSnap = await getDocs(collection(db, "users"));
      setUserCount(usersSnap.size);

      const users = usersSnap.docs
        .map((d) => d.data() as UserData)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 10);
      setRecentUsers(users);
    } catch (err) {
      console.error("Analytics error:", err);
    }
    setLoading(false);
  };

  const totalSubjects = semesters.reduce((sum, s) => sum + s.subjects.length, 0);
  const totalMaterials = semesters.reduce(
    (sum, s) =>
      sum +
      s.subjects.reduce(
        (ss, sub) =>
          ss + sub.weeks.reduce((ws, w) => ws + w.materials.length, 0),
        0
      ),
    0
  );

  const stats = [
    { label: "Total Users", value: userCount, icon: Users, color: "text-brand-blue" },
    { label: "Subjects", value: totalSubjects, icon: BookOpen, color: "text-brand-purple" },
    { label: "Materials", value: totalMaterials, icon: FileText, color: "text-brand-cyan" },
    { label: "Semesters", value: semesters.length, icon: BarChart3, color: "text-green-500" },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="glass-card rounded-xl p-5 text-center"
          >
            <stat.icon className={`w-6 h-6 mx-auto mb-3 ${stat.color}`} />
            <p className="text-3xl font-extrabold text-text-primary">
              {loading ? "—" : stat.value}
            </p>
            <p className="text-xs text-text-muted mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Sign-ups */}
      <div>
        <h3 className="text-sm font-bold text-text-primary mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 text-text-muted" />
          Recent Sign-ups
        </h3>
        <div className="space-y-2">
          {recentUsers.map((user, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/30 dark:bg-white/5"
            >
              <img
                src={user.photoURL}
                alt={user.displayName}
                className="w-8 h-8 rounded-full"
                referrerPolicy="no-referrer"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-text-primary truncate">
                  {user.displayName}
                </p>
                <p className="text-xs text-text-muted">@{user.username}</p>
              </div>
              <p className="text-xs text-text-muted">
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
          {recentUsers.length === 0 && !loading && (
            <p className="text-sm text-text-muted text-center py-8">
              No users yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
