"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const bookData = [
  { id: 1, text: "AI", icon: "🤖", gradient: "from-cyan-500 to-teal-500", top: "15%", left: "8%", speed: -1.5, initRotate: -15, endRotate: -5, scale: 1, blur: "" },
  { id: 2, text: "MATH", icon: "📐", gradient: "from-purple-500 to-pink-500", top: "25%", left: "82%", speed: -2, initRotate: 20, endRotate: 35, scale: 1.1, blur: "" },
  { id: 3, text: "STATS", icon: "📊", gradient: "from-blue-500 to-indigo-500", top: "65%", left: "12%", speed: -1.2, initRotate: -10, endRotate: -25, scale: 0.9, blur: "" },
  { id: 4, text: "CODE", icon: "💻", gradient: "from-indigo-500 to-purple-500", top: "70%", left: "78%", speed: -1.8, initRotate: 15, endRotate: 0, scale: 1, blur: "" },
  { id: 5, text: "", icon: "🧠", gradient: "from-cyan-400 to-blue-400", top: "85%", left: "25%", speed: -2.5, initRotate: 30, endRotate: 45, scale: 0.6, blur: "blur-[2px]" },
  { id: 6, text: "", icon: "⚡", gradient: "from-fuchsia-500 to-pink-500", top: "40%", left: "88%", speed: -0.8, initRotate: -25, endRotate: -10, scale: 0.7, blur: "blur-[1px]" },
  { id: 7, text: "", icon: "🔍", gradient: "from-blue-400 to-cyan-400", top: "10%", left: "70%", speed: -0.5, initRotate: 45, endRotate: 60, scale: 0.5, blur: "blur-sm" },
  { id: 8, text: "", icon: "📈", gradient: "from-purple-400 to-indigo-400", top: "50%", left: "5%", speed: -2.2, initRotate: -35, endRotate: -20, scale: 0.6, blur: "blur-[2px]" },
];

export default function FloatingBooks() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const books = containerRef.current.querySelectorAll(".floating-book");

    // Initial load animation (bursting out)
    gsap.fromTo(
      books,
      { opacity: 0, scale: 0, y: 100 },
      {
        opacity: 0.9,
        scale: (i) => bookData[i].scale,
        y: 0,
        duration: 1.5,
        stagger: 0.1,
        ease: "back.out(1.5)",
        delay: 0.3,
      }
    );

    // Parallax scroll animation
    books.forEach((book, i) => {
      const data = bookData[i];
      gsap.to(book, {
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
        y: () => window.innerHeight * data.speed,
        rotation: data.endRotate,
        ease: "none",
      });
    });
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      {bookData.map((book) => (
        <div
          key={book.id}
          className={`floating-book absolute flex flex-col items-center justify-center rounded-xl shadow-2xl border border-white/20 transition-all ${book.blur}`}
          style={{
            top: book.top,
            left: book.left,
            width: book.text ? "100px" : "60px",
            height: book.text ? "130px" : "80px",
            transform: `rotate(${book.initRotate}deg)`,
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
          }}
          data-speed={book.speed}
          data-rotate={book.endRotate}
        >
          {/* Book Spine Simulation */}
          <div className={`absolute left-0 top-0 bottom-0 w-2 rounded-l-xl bg-gradient-to-b ${book.gradient} opacity-80 shadow-[inset_-1px_0_2px_rgba(0,0,0,0.2)]`} />
          
          {/* Cover Design */}
          <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${book.gradient} flex items-center justify-center shadow-lg mb-2`}>
            <span className={book.text ? "text-xl" : "text-2xl"}>{book.icon}</span>
          </div>
          
          {book.text && (
            <span className="text-xs font-bold text-text-primary tracking-widest bg-white/40 dark:bg-black/30 px-2 py-0.5 rounded-full">
              {book.text}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
