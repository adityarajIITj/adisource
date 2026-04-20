"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Cpu, Network, Sparkles, UserCheck, ArrowDown } from "lucide-react";
import "./who-are-we.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const LAYERS = [
  {
    type: "hero",
    title: "WHO ARE WE?",
    subtitle: "A NEW ERA OF DIGITAL LEARNING",
  },
  {
    type: "hologram",
    src: "/assets/who-are-we/ai-core.png",
    title: "AI INTELLIGENCE",
    content: "Neural-powered resource processing for the modern student.",
    icon: Cpu,
    id: "0X-AI-CORE",
  },
  {
    type: "hologram",
    src: "/assets/who-are-we/tech-nodes.png",
    title: "CORE ARCHITECTURE",
    content: "Engineered for speed, stability, and seamless exploration.",
    icon: Network,
    id: "0X-NODE-STRUC",
  },
  {
    type: "hologram",
    src: "/assets/who-are-we/community.png",
    title: "SYNERGIZED COMMUNITY",
    content: "Decentralized knowledge. Unified performance.",
    icon: UserCheck,
    id: "0X-COM-NETWORK",
  },
];

export default function WhoAreWeSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeID, setActiveID] = useState(LAYERS[0].id || "INIT");

  useEffect(() => {
    const ctx = gsap.context(() => {
      const layers = layerRefs.current.filter(Boolean) as HTMLDivElement[];
      
      // Main 3D Scroll Timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=5000", // LONG scroll distance for "proper" fly-through
          pin: true,     // CRITICAL: Pin the stage
          scrub: 1.5,    // Smooth momentum
          anticipatePin: 1,
          onUpdate: (self) => {
             // Subtle camera shake on scroll
             gsap.set(sceneRef.current, {
               x: Math.sin(self.progress * 100) * 2,
               y: Math.cos(self.progress * 100) * 2,
             });
          }
        },
      });

      // Camera Fly-Through Logic
      layers.forEach((layer, i) => {
        // Initial setup - deep in the background
        gsap.set(layer, {
          z: -i * 2500 - 1000,
          opacity: 0,
          scale: 0.8,
          filter: "blur(20px)",
        });

        const sectionProgress = i / layers.length;

        // ANIMATION SEQUENCE
        // 1. Approach from distance
        tl.to(layer, {
          z: 0,
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          ease: "power2.out",
          duration: 1,
        }, i * 0.8)
        
        // 2. Fly past camera
        .to(layer, {
          z: 2500,
          opacity: 0,
          scale: 1.5,
          filter: "blur(10px)",
          ease: "power2.in",
          duration: 1,
        }, i * 0.8 + 0.8);

        // Update active layer info for HUD
        tl.call(() => {
          if (LAYERS[i].id) setActiveID(LAYERS[i].id!);
        }, [], i * 0.8 + 0.4);
      });

      // Mouse Parallax (Tilting the stage)
      const handleMouseMove = (e: MouseEvent) => {
        const { clientX, clientY } = e;
        const x = (clientX - window.innerWidth / 2) / 100;
        const y = (clientY - window.innerHeight / 2) / 100;
        
        gsap.to(sceneRef.current, {
          rotateY: x,
          rotateX: -y,
          duration: 2,
          ease: "power3.out",
        });
      };

      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="who-are-we-3d-wrapper">
      <div ref={stageRef} className="who-3d-stage">
        {/* Constant UI / HUD Elements */}
        <div className="absolute inset-0 pointer-events-none z-50">
          <div className="hud-corner corner-tl" />
          <div className="hud-corner corner-tr" />
          <div className="hud-corner corner-bl" />
          <div className="hud-corner corner-br" />
          <div className="hud-details">
            <span>SEC_ID: {activeID}</span>
            <span>FREQ: 2.4GHZ</span>
            <span>CAM_Z: STABLE</span>
          </div>
        </div>

        <div ref={sceneRef} className="who-3d-scene">
          {LAYERS.map((layer, i) => (
            <div
              key={i}
              ref={(el) => (layerRefs.current[i] = el)}
              className="who-3d-layer"
            >
              {layer.type === "hero" ? (
                <div className="who-intro-hero">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm font-medium text-brand-cyan mb-8 border border-brand-cyan/20">
                    <Sparkles className="w-4 h-4" />
                    SYSTEM_INIT_SUCCESS
                  </div>
                  <h1 className="gradient-text">{layer.title}</h1>
                  <p className="text-xl text-text-secondary tracking-[0.3em] font-light">
                    {layer.subtitle}
                  </p>
                  <div className="scroll-hint">
                    <div className="scroll-line" />
                    <span className="text-xs tracking-widest text-brand-cyan/60 font-mono">SCROLL_DOWN</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-8">
                  <div className="hologram-container">
                    <div className="hologram-overlay" />
                    <div className="hologram-flicker" />
                    <img
                      src={layer.src}
                      alt={layer.title}
                      className="hologram-image"
                    />
                  </div>
                  
                  <div className="who-info-card">
                    <div className="w-20 h-20 mx-auto bg-brand-blue/10 rounded-3xl flex items-center justify-center mb-8 border border-white/5 shadow-inner">
                      {layer.icon && <layer.icon className="w-10 h-10 text-brand-cyan" />}
                    </div>
                    <h2 className="gradient-text">{layer.title}</h2>
                    <p>{layer.content}</p>
                    <div className="mt-8 text-[10px] font-mono text-brand-cyan/40 tracking-[0.5em]">
                      ENCRYPTED_STREAM_ACTIVE
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
