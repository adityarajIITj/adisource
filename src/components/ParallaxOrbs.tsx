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
      {/* Indigo orb — top left */}
      <div
        className="orb orb-blue"
        style={{ width: "700px", height: "700px", top: "-15%", left: "-10%" }}
      />
      {/* Amber orb — top right */}
      <div
        className="orb orb-amber"
        style={{ width: "500px", height: "500px", top: "5%", right: "-10%" }}
      />
      {/* Teal orb — middle */}
      <div
        className="orb orb-cyan"
        style={{ width: "450px", height: "450px", top: "50%", left: "45%" }}
      />
      {/* Violet orb — bottom left */}
      <div
        className="orb orb-purple"
        style={{ width: "500px", height: "500px", top: "75%", left: "-5%" }}
      />
      {/* Amber orb — bottom right */}
      <div
        className="orb orb-amber"
        style={{ width: "400px", height: "400px", top: "100%", right: "10%" }}
      />
    </div>
  );
}

