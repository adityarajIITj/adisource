"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function ParallaxOrbs() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const orbs = containerRef.current.querySelectorAll(".orb");

    orbs.forEach((orb, i) => {
      gsap.to(orb, {
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.5 + i * 0.5,
        },
        yPercent: -15 - i * 8,
        ease: "none",
      });
    });
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
      {/* Cyan orb — top left */}
      <div
        className="orb orb-cyan"
        style={{
          width: "600px",
          height: "600px",
          top: "-10%",
          left: "-5%",
        }}
      />
      {/* Purple orb — top right */}
      <div
        className="orb orb-purple"
        style={{
          width: "500px",
          height: "500px",
          top: "20%",
          right: "-8%",
        }}
      />
      {/* Blue orb — middle left */}
      <div
        className="orb orb-blue"
        style={{
          width: "450px",
          height: "450px",
          top: "55%",
          left: "10%",
        }}
      />
      {/* Cyan orb — bottom right */}
      <div
        className="orb orb-cyan"
        style={{
          width: "550px",
          height: "550px",
          top: "80%",
          right: "5%",
        }}
      />
      {/* Purple orb — very bottom */}
      <div
        className="orb orb-purple"
        style={{
          width: "400px",
          height: "400px",
          top: "130%",
          left: "30%",
        }}
      />
    </div>
  );
}
