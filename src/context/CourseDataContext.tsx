"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { semesters as initialSemesters } from "@/data/courses";
import type { Semester } from "@/data/courses";

interface CourseDataContextType {
  semesters: Semester[];
  loading: boolean;
  refreshData: () => Promise<void>;
}

const CourseDataContext = createContext<CourseDataContextType | undefined>(
  undefined
);

export function CourseDataProvider({ children }: { children: ReactNode }) {
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [loading, setLoading] = useState(true);

  // Load from local static file
  useEffect(() => {
    setSemesters(initialSemesters);
    setLoading(false);
  }, []);

  const refreshData = async () => {
    // For local data, refresh doesn't do much, but we keep the interface
    setSemesters([...initialSemesters]);
  };

  return (
    <CourseDataContext.Provider value={{ semesters, loading, refreshData }}>
      {children}
    </CourseDataContext.Provider>
  );
}

export function useCourseData() {
  const context = useContext(CourseDataContext);
  if (context === undefined) {
    throw new Error(
      "useCourseData must be used within a CourseDataProvider"
    );
  }
  return context;
}
