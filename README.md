# 🚀 Adisource - BS Applied AI & Data Science Resources

> A premium, ultra-fluid learning platform built exclusively for BS Applied AI & Data Science students to seamlessly access course transcripts, notes, and AI overviews all in one place.

Built by a team of **1 person only**.

---

## 📖 Vision & What We're Doing

The existing platforms for accessing lecture content are disjointed. The vision behind **Adisource** is to consolidate hundreds of HTML lecture transcripts into a single, beautifully organized, low-latency interface. 

### Why Adisource?
- **Ultra-Fluid Navigation**: Built with advanced GSAP animations and Lenis smooth scrolling for a native, app-like feel.
- **Glassmorphic Aesthetic**: A distraction-free, modern interface customized with sleek gradient themes per subject.
- **Dynamic Content Injection**: We don't hardcode course files. Simply drop new `.html` documents into the source folder, and the automated pipeline constructs the whole UI.

---

## 🛠️ How It Works (The Data Pipeline)

We rely on a robust ingestion script to minimize maintenance time:

1. **Source Folder**: Add `.html` lecture files into `public/materials/`.
2. **Naming Convention**: A strict naming standard is followed (e.g., `FAIW4L1.html` = Foundations of AI, Week 4, Lecture 1).
3. **Automated Generator**: `npm run build-data` (or explicitly `node scripts/generate_courses.js`) runs a parser that organizes all files into accurate Semester trees, assigns correct Subjects/Weeks, and programmatically estimates the reading time by parsing file size byte counts!
4. **Resulting Model**: The exact JSON architecture is exported directly to `src/data/courses.ts` which populates the Next.js frontend dynamically.

---

## 📅 Roadmap (What's Next)

This is **Version 1** of Adisource. Future updates will focus on:

- [ ] **Real AI Overview Integration**: Swapping local mockup summaries with a connected LLM architecture to automatically translate/summarize loaded transcripts.
- [ ] **Account System & Cloud Notes**: Evolving from `localStorage` sync to a cloud DB so students can carry their highlighted notes across different devices.
- [ ] **Continued Semesters**: Expanding the script's dictionaries to process and display Semester 3 subjects and beyond. 

---

## 💻 Tech Stack

- **Framework:** Next.js (App Router, React 19)
- **Styling:** Tailwind CSS V4
- **Animation Engine:** GSAP (ScrollTrigger) & Lenis Smooth Scroll
- **Icons:** Lucide React
- **Language:** TypeScript

---

## 🚀 Deployment & Installation

### Local Development

1. Clone the repository: `git clone https://github.com/adityarajIITj/adisource.git`
2. Enter the directory: `cd adisource`
3. Install dependencies: `npm install`
4. If you have added new course files offline, rebuild the static paths: `node scripts/generate_courses.js`
5. Run the dev server: `npm run dev`
6. View at `http://localhost:3000`

### Production Deployment (Vercel)

The codebase is fully optimized for immediate edge deployment via Vercel.

1. Connect your GitHub account to [Vercel](https://vercel.com).
2. Select the `adisource` repository in your dashboard.
3. Keep default build settings (`npm run build`).
4. Click **Deploy**. The platform will be globally available in seconds.

*Note: Ensure that your `public/materials` logic respects Vercel's output bundle limits. Extraneous media files (like heavy PDFs and software executables) have been natively ignored via `.gitignore`.*
