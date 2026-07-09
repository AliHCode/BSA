import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Calendar, Compass, Coffee, GraduationCap, Video, Image as ImageIcon, ArrowLeft, Grid, Shuffle, X, Maximize2 } from "lucide-react";
import initialMemories from "../data/memories.json";

export default function StoryPage({ onBackClick }) {
  
  // Array of memories for the Polaroid Grid / 3D Scatter Board
  const [mediaMemories, setMediaMemories] = useState(initialMemories);

  const targetRef = useRef(null);
  const timelineRef = useRef(null);
  const canvasRef = useRef(null);
  const isDraggingRef = useRef(false);

  const [scrollLimit, setScrollLimit] = useState(2400);
  const [cards, setCards] = useState([]);
  const [viewMode, setViewMode] = useState("scatter"); // "scatter" or "grid"
  const [activeMedia, setActiveMedia] = useState(null); // for lightbox popup
  const [shuffleTrigger, setShuffleTrigger] = useState(0);

  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  // Calculate layout offset values
  useEffect(() => {
    const handleResize = () => {
      if (timelineRef.current) {
        const nodes = timelineRef.current.querySelectorAll(".museum-node");
        if (nodes.length > 1) {
          const firstNode = nodes[0];
          const lastNode = nodes[nodes.length - 1];
          const firstCenter = firstNode.offsetLeft + firstNode.offsetWidth / 2;
          const lastCenter = lastNode.offsetLeft + lastNode.offsetWidth / 2;
          const isMobile = window.innerWidth <= 768;
          setScrollLimit(lastCenter - firstCenter + (isMobile ? 350 : 0));
        }
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    const timer = setTimeout(handleResize, 100);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timer);
    };
  }, []);

  // Block scroll when lightbox is active (handles native & virtual/Lenis scroll via capture phase)
  useEffect(() => {
    if (!activeMedia) return;

    const preventScroll = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const preventKeyScroll = (e) => {
      const keys = ["ArrowUp", "ArrowDown", "Space", "PageUp", "PageDown", "Home", "End"];
      if (keys.includes(e.code)) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    // Lock styles
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    if (window.lenis) window.lenis.stop();

    // Block all mouse wheel, trackpad, touch, & key gestures globally in the CAPTURING phase
    window.addEventListener("wheel", preventScroll, { capture: true, passive: false });
    window.addEventListener("touchmove", preventScroll, { capture: true, passive: false });
    window.addEventListener("keydown", preventKeyScroll, { capture: true, passive: false });

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      if (window.lenis) window.lenis.start();
      window.removeEventListener("wheel", preventScroll, { capture: true });
      window.removeEventListener("touchmove", preventScroll, { capture: true });
      window.removeEventListener("keydown", preventKeyScroll, { capture: true });
    };
  }, [activeMedia]);

  // Initialize random scatter coordinates for the Polaroids
  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    const initialized = mediaMemories.map((item, idx) => {
      // Pick random coordinates within bounds to avoid clustering
      // Constraining coordinates tightly to prevent overflow
      const maxX = isMobile ? 60 : 70; // Safe limits so they don't overflow
      const maxY = isMobile ? 65 : 70;
      const randomX = Math.random() * maxX + 5; 
      const randomY = Math.random() * maxY + 5; 
      const randomRotate = Math.random() * 30 - 15; // -15deg to 15deg
      return {
        ...item,
        x: randomX,
        y: randomY,
        rotate: randomRotate,
        zIndex: idx + 1
      };
    });
    setCards(initialized);
  }, []);

  const handleScatter = () => {
    setViewMode("scatter");
    setShuffleTrigger(prev => prev + 1);
    const isMobile = window.innerWidth <= 768;
    setCards(prev => prev.map((c) => ({
      ...c,
      x: Math.random() * (isMobile ? 60 : 70) + 5,
      y: Math.random() * (isMobile ? 65 : 70) + 5,
      rotate: Math.random() * 30 - 15
    })));
  };

  // Organize items in a grid layout
  const handleGrid = () => {
    setViewMode("grid");
    const isMobile = window.innerWidth <= 768;
    const cols = isMobile ? 3 : 5; // 3 columns on mobile, 5 on desktop
    const colWidth = isMobile ? 30 : 18;
    const rowHeight = isMobile ? 14 : 22; // vertical spacing percentage
    const topMargin = isMobile ? 5 : 6;

    setCards(prev => prev.map((c, idx) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      return {
        ...c,
        x: col * colWidth + (isMobile ? 5 : 8),
        y: row * rowHeight + topMargin,
        rotate: 0
      };
    }));
  };

  // Push clicked card to top zIndex so it lays over other cards
  const bringToFront = (id) => {
    setCards(prev => {
      const maxZ = Math.max(...prev.map(c => c.zIndex), 0);
      return prev.map(c => c.id === id ? { ...c, zIndex: maxZ + 1 } : c);
    });
  };

  const handleCardClick = (media) => {
    if (isDraggingRef.current) return;
    bringToFront(media.id);
    setActiveMedia(media);
  };
  
  // On desktop, scroll horizontally. Mobile will handle it differently via CSS.
  const x = useTransform(scrollYProgress, [0, 1], [0, -scrollLimit]);

  return (
    <div className="story-page">
      {/* Back Button */}
      <button 
        onClick={onBackClick} 
        className="btn-gta story-back-btn"
      >
        <ArrowLeft size={16} />
        Back To Squad
      </button>

      {/* Story Header */}
      <header className="story-header">
        <h2 className="story-title">
          Our <span>Chronicles</span>
        </h2>
        <p className="story-subtitle">The four-year timeline of the BSA Crew</p>
      </header>

      {/* Horizontal Museum Timeline */}
      <div ref={targetRef} className="museum-scroll-wrapper">
        <div className="museum-sticky-container">
          <motion.div ref={timelineRef} style={{ x }} className="museum-horizontal-timeline">
            
            <div className="timeline-horizontal-line" />

            {/* Milestone 1 */}
            <div className="museum-node">
              <div className="timeline-badge" style={{ "--badge-color": "var(--neon-cyan)", top: "-40px" }}>
                <Calendar size={16} style={{ marginRight: "6px", verticalAlign: "middle" }} />
                YEAR 1 (SEP 2022)
              </div>
              <div className="timeline-card glass-panel" style={{ "--badge-color": "var(--neon-cyan)" }}>
                <h3>The Unknown Origins</h3>
                <p style={{ color: "var(--text-gray)", fontSize: "0.9rem", marginBottom: "10px" }}>The Calm Before The Storm</p>
                <p>
                  Shuru mein humara aapas mein koi connection nahi tha. Hum sirf strangers thay jo ek hi university mein parh rahe thay, alag alag logon ke sath uthna baithna tha. Kisi ko andaza nahi tha ke kuch waqt baad yahi random log mil kar ek aisi vibe create karenge jisay poori university hamesha yaad rakhegi.
                </p>
              </div>
            </div>

            {/* Milestone 2 */}
            <div className="museum-node">
              <div className="timeline-badge" style={{ "--badge-color": "var(--neon-pink)", bottom: "-40px", top: "auto" }}>
                <Compass size={16} style={{ marginRight: "6px", verticalAlign: "middle" }} />
                YEAR 2 (2023 - 2024)
              </div>
              <div className="timeline-card glass-panel" style={{ "--badge-color": "var(--neon-pink)" }}>
                <h3>Ali Hall & The Circle Grows</h3>
                <p style={{ color: "var(--text-gray)", fontSize: "0.9rem", marginBottom: "10px" }}>The Private Mess Gatherings</p>
                <p>
                  Second year tak aate aate humara circle expand hua aur private mess humara ultimate hangout spot ban gaya. Wahan Taqi, Qadeer, Abdullah, dono Hamad, Haris aur Haseeb ke sath jo mehfilein jama hoti theen, unhon ne is squad ko forever solid kar diya. Yehi wo waqt tha jab "Bismillah Student Association (BSA)" ka title officially wujood mein aaya. Hum sirf dost nahi rahe thay, hum ek brotherhood ban chuke thay. Har choti baat par party, pranks, aur ek doosre ki taang kheenchna humari pehchaan ban gayi.
                </p>
              </div>
            </div>

            {/* Milestone 3 */}
            <div className="museum-node">
              <div className="timeline-badge" style={{ "--badge-color": "var(--neon-gold)", top: "-40px" }}>
                <Coffee size={16} style={{ marginRight: "6px", verticalAlign: "middle" }} />
                YEAR 3 (2024 - 2025)
              </div>
              <div className="timeline-card glass-panel" style={{ "--badge-color": "var(--neon-gold)" }}>
                <h3>Room 235</h3>
                <p style={{ color: "var(--text-gray)", fontSize: "0.9rem", marginBottom: "10px" }}>BSA Formation & Peak Pranks</p>
                <p>
                  BSA ne humari university life ko boring se nikal kar ek movie mein badal diya. Room 235 humara undisputed headquarters tha jahan day-scholars aur hostelites ka farq khatam ho gaya. Hamad Khalil ki iconic laal Mehran par aadhi raat ko unplanned long drives par nikal jana, poori poori raat jaag kar useless topics par endless behas karna, aur doston ke phones chupa kar unko waheen rok lena—ye saari memories humari life ka sabse khoobsurat hissa ban chuki hain. BSA ka impact ye tha ke koi ek din bhi stress mein nahi guzra.
                </p>
              </div>
            </div>

            {/* Milestone 4 */}
            <div className="museum-node">
              <div className="timeline-badge" style={{ "--badge-color": "var(--text-white)", bottom: "-40px", top: "auto" }}>
                <GraduationCap size={16} style={{ marginRight: "6px", verticalAlign: "middle" }} />
                YEAR 4 (THE FINALE)
              </div>
              <div className="timeline-card glass-panel" style={{ "--badge-color": "var(--text-white)" }}>
                <h3>Room 111 & The Final Chapter</h3>
                <p style={{ color: "var(--text-gray)", fontSize: "0.9rem", marginBottom: "10px" }}>June 2026 - Present</p>
                <p>
                  Degree mukammal ho chuki hai, FYP done, aur ab hum Room 111 bhi chhor chuke hain. Lekin udhar guzari hui har raat aur wo sari yaadein hamesha zinda rahengi. In char saalon ne humein sirf degree nahi di, balke ek aisi family di hai jo har mushkil mein sath khari hogi. Hostel ki deewarein choot gayi hain, lekin BSA ka bond aur humari unhinged memories hamesha humare sath rahengi. The era of BSA never ends.
                </p>
              </div>
            </div>

          </motion.div>
        </div>
      </div>

      {/* Memory Board Section */}
      <section className="media-grid-section" style={{ overflow: "visible" }}>
        <h2 className="media-grid-title">The Memory Board</h2>
        <p style={{ color: "var(--text-light)", marginBottom: "15px", fontSize: "1.1rem" }}>
          An interactive scatter board of our hosteling days. Grab and drag photos around, throw them, or click to view/play in fullscreen! (Supports unlimited photos and videos).
        </p>

        {/* Board Controls */}
        <div className="board-controls">
          <button 
            onClick={handleScatter} 
            className={`btn-gta ${viewMode === "scatter" ? "btn-active" : ""}`}
            style={{ fontSize: "0.8rem", padding: "8px 16px" }}
          >
            <Shuffle size={14} style={{ marginRight: "6px", display: "inline-block", verticalAlign: "middle" }} /> Scatter Deck
          </button>
          <button 
            onClick={handleGrid} 
            className={`btn-gta ${viewMode === "grid" ? "btn-active" : ""}`}
            style={{ fontSize: "0.8rem", padding: "8px 16px" }}
          >
            <Grid size={14} style={{ marginRight: "6px", display: "inline-block", verticalAlign: "middle" }} /> Clean Grid
          </button>
        </div>

        {/* 3D Scatter Canvas */}
        <div ref={canvasRef} className={`polaroid-scatter-canvas ${viewMode === "grid" ? "grid-mode" : ""}`}>
          {cards.map((media) => (
            <motion.div 
              key={`${viewMode}-${shuffleTrigger}-${media.id}`} 
              className="polaroid-card scatter-card" 
              style={{ 
                position: viewMode === "grid" ? "relative" : "absolute",
                left: viewMode === "grid" ? "auto" : `${media.x}%`, 
                top: viewMode === "grid" ? "auto" : `${media.y}%`, 
                zIndex: media.zIndex
              }}
              animate={{ 
                rotate: media.rotate,
                scale: viewMode === "grid" ? 0.95 : 1
              }}
              transition={{ type: "spring", stiffness: 85, damping: 14 }}
              drag
              dragConstraints={canvasRef}
              dragElastic={0}
              dragMomentum={true}
              whileDrag={{ scale: 1.08, zIndex: 9999 }}
              onDragStart={() => {
                isDraggingRef.current = true;
                bringToFront(media.id);
              }}
              onDragEnd={() => {
                setTimeout(() => {
                  isDraggingRef.current = false;
                }, 50);
              }}
              onClick={() => handleCardClick(media)}
            >
              <div className="polaroid-media-wrapper">
                {media.type === "image" ? (
                  <img 
                    src={media.src} 
                    alt={media.caption} 
                    className="polaroid-img"
                    style={{ objectPosition: `${media.posX !== undefined ? media.posX : 50}% ${media.posY !== undefined ? media.posY : 50}%` }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : (
                  <div className="polaroid-video-container" style={{ width: "100%", height: "100%", position: "relative" }}>
                    <video 
                      src={media.src} 
                      className="polaroid-video" 
                      style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: `${media.posX !== undefined ? media.posX : 50}% ${media.posY !== undefined ? media.posY : 50}%` }}
                      muted
                      loop
                      playsInline
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentNode.nextSibling.style.display = 'flex';
                      }}
                    />
                    {/* Retro VHS play indicator */}
                    <div style={{
                      position: "absolute",
                      bottom: "10px",
                      left: "10px",
                      background: "rgba(0,0,0,0.6)",
                      color: "#00ff41",
                      fontFamily: "monospace",
                      fontSize: "0.65rem",
                      padding: "2px 6px",
                      borderRadius: "2px",
                      letterSpacing: "1px",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px"
                    }}>
                      <Video size={10} /> PLAY
                    </div>
                  </div>
                )}

                {/* Fallback Graphic Overlay */}
                <div style={{
                  display: 'none',
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#1a1a24',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'rgba(255,255,255,0.2)'
                }}>
                  {media.type === "image" ? <ImageIcon size={32} /> : <Video size={32} />}
                  <span style={{ fontSize: "0.6rem", marginTop: "8px", letterSpacing: "1px", textTransform: "uppercase" }}>
                    {media.type} FILE
                  </span>
                </div>
              </div>
              <span className="polaroid-caption">{media.title || media.caption}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Emotional Footer Quote */}
      <footer className="story-footer">
        <h3 className="footer-quote">
          Room 235 & 111. Quetta. Hostel Nights.<br />
          <span>We lived it.</span>
        </h3>
        
        <div className="footer-btn-container">
          <button onClick={onBackClick} className="btn-gta">
            Back to Squad
          </button>
        </div>

        <p className="footer-sub">BSA GROUP PORTAL &bull; EST. FIRST YEAR</p>
      </footer>

      {/* Lightbox Modal Overlay */}
      <AnimatePresence>
        {activeMedia && (
          <motion.div 
            className="lightbox-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveMedia(null)}
            data-lenis-prevent
            style={{ overscrollBehavior: "none", touchAction: "none" }}
          >
            <motion.div 
              className="lightbox-content"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              data-lenis-prevent
            >
              <button className="lightbox-close" style={{ color: "#ffffff", borderColor: "rgba(255,255,255,0.3)" }} onClick={() => setActiveMedia(null)}>
                <X size={18} /> CLOSE
              </button>

              {activeMedia.type === "image" ? (
                <img 
                  src={activeMedia.src} 
                  alt={activeMedia.caption} 
                  className="lightbox-media"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : (
                <video 
                  src={activeMedia.src} 
                  className="lightbox-media"
                  controls 
                  autoPlay
                  loop
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              )}

              {/* Fallback Graphic Overlay for lightbox */}
              <div style={{
                display: 'none',
                width: '100%',
                height: '400px',
                backgroundColor: '#1a1a24',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'rgba(255,255,255,0.2)',
                borderRadius: "4px"
              }}>
                {activeMedia.type === "image" ? <ImageIcon size={64} /> : <Video size={64} />}
                <span style={{ fontSize: "0.8rem", marginTop: "12px", letterSpacing: "1px", textTransform: "uppercase" }}>
                  {activeMedia.type} PLACEHOLDER FILE
                </span>
              </div>

              <div style={{ textAlign: "center", width: "100%" }}>
                <h2 style={{ 
                  marginTop: "20px", 
                  fontFamily: "var(--font-title)", 
                  letterSpacing: "2px", 
                  fontSize: "1.4rem", 
                  color: "#fff",
                  textTransform: "uppercase"
                }}>
                  {activeMedia.title || activeMedia.caption}
                </h2>
                
                {activeMedia.title && activeMedia.caption && (
                  <h3 style={{ 
                    marginTop: "8px", 
                    fontFamily: "var(--font-title)", 
                    letterSpacing: "1px", 
                    fontSize: "1.1rem", 
                    color: "var(--color-accent)",
                    textTransform: "uppercase",
                    fontWeight: 400
                  }}>
                    {activeMedia.caption}
                  </h3>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
