import React, { useState, useEffect } from "react";
import Lenis from "lenis";
import "./App.css";
import "./App.css";
import Hero from "./components/Hero";
import SquadScroll from "./components/SquadScroll";
import StoryPage from "./components/StoryPage";
import ConfessionsPage from "./components/ConfessionsPage";

export default function App() {
  const [view, setView] = useState("home"); // "home" or "story"

  // Initialize Lenis smooth scroll and handle view shifts
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Reset scroll positions on change
    window.scrollTo(0, 0);
    lenis.scrollTo(0, { immediate: true });

    return () => {
      lenis.destroy();
    };
  }, [view]);

  return (
    <div className="app-container">
      {/* Floating Background Art Blobs (Animations All Around) */}
      <div className="bg-blob bg-blob-1" />
      <div className="bg-blob bg-blob-2" />
      <div className="bg-blob bg-blob-3" />

      {/* Premium Cinematic Overlays */}
      <div className="noise-overlay" />
      <div className="vignette" />

      {/* Floating Header Controls */}
      <nav className="top-nav">
        <div style={{ display: "flex", alignItems: "center", gap: "12px", pointerEvents: "auto" }}>
          <img 
            src="/images/Bsalogo.jpg" 
            alt="BSA" 
            className="nav-logo-img" 
            onClick={() => setView("home")} 
            style={{ height: "45px", width: "45px", cursor: "pointer", objectFit: "cover", borderRadius: "2px", border: "1px solid var(--color-border-active)" }}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
          <div className="nav-logo" onClick={() => setView("home")} style={{ cursor: "pointer", display: "none" }}>
            BSA<span>.</span>
          </div>
        </div>
        <div className="controls-group">
          <button 
            onClick={() => setView("confessions")} 
            className="story-nav-btn"
            style={{ background: "var(--color-accent)", color: "#fff", border: "none", letterSpacing: "2px", fontWeight: "700" }}
          >
            CONFESSIONS
          </button>
          {view === "home" ? (
            <button onClick={() => setView("story")} className="story-nav-btn">
              Our Story
            </button>
          ) : (
            <button onClick={() => setView("home")} className="story-nav-btn">
              The Squad
            </button>
          )}
        </div>
      </nav>

      {/* Main Content Area */}
      {view === "home" ? (
        <div className="snap-container">
          {/* Section 1: Hero entrance with video */}
          <section className="snap-section">
            <Hero onStartClick={() => setView("story")} />
          </section>

          {/* Section 2+: The Squad scroll show */}
          <SquadScroll onStoryClick={() => setView("story")} />
        </div>
      ) : view === "story" ? (
        // Dedicated Story page (Timeline & Polaroid Memories)
        <StoryPage onBackClick={() => setView("home")} />
      ) : (
        // BSA Confessions Page
        <ConfessionsPage onBackClick={() => setView("home")} />
      )}
    </div>
  );
}
