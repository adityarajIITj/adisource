import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

/* ─── Display / Heading Font ───────────────────────────────────────────────── */
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

/* ─── Body / UI Font ────────────────────────────────────────────────────────── */
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/context/AuthContext";
import { CourseDataProvider } from "@/context/CourseDataContext";

export const metadata: Metadata = {
  title: "adisource — BS Applied AI & Data Science Resources",
  description:
    "Your one-stop resource platform for the BS Applied AI and Data Science program. Notes, materials, and AI-powered learning tools.",
  keywords: ["AI", "Data Science", "Notes", "Resources", "adisource"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${plusJakartaSans.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased text-text-primary bg-surface-primary transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <AuthProvider>
            <CourseDataProvider>
              {children}
            </CourseDataProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
