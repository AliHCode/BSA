import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Calendar, Compass, Coffee, GraduationCap, Video, Image as ImageIcon, ArrowLeft, Grid, Shuffle, X, Maximize2 } from "lucide-react";
import initialMemories from "../data/memories.json";

export default function StoryPage({ onBackClick }) {
  const isMobileScreen = typeof window !== 'undefined' && window.innerWidth <= 768;
  
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
      const maxX = isMobile ? 60 : 70;
      const maxY = isMobile ? 65 : 70;
      const randomX = Math.random() * maxX + 5; 
      const randomY = Math.random() * maxY + 5; 
      const randomRotate = Math.random() * 30 - 15;
      
      return {
        ...item,
        x: randomX,
        y: randomY,
        rotate: randomRotate,
        zIndex: idx + 1
      };
    });
    setCards(initialized);

    // Preload all media instantly so it's buttery smooth when the user scrolls down
    initialMemories.forEach(media => {
      if (media.type === "image") {
        const img = new Image();
        img.src = media.src;
      }
    });
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
                  Second year tak aate aate humara circle expand hua aur private mess humara ultimate hangout spot ban gaya. Wahan Taqi, Qadeer, Abdullah, dono Hamad, Haris aur Haseeb ke sath jo mehfilein jama hoti theen, unhon ne is squad ko forever solid kar diya. Yehi wo waqt tha jab "Bismillah Student Association (BSA)" ka title officially wujood mein aaya. Hum sirf dost nahi rahe thay, humari ek pakki family ban chuki thi. Har choti baat par party, pranks, aur ek doosre ki taang kheenchna humari pehchaan ban gayi.
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
          An interactive scatter board of our hosteling days. Grab and drag photos around, throw them, or click to view/play in fullscreen!
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
                    src={`/thumbnails/${media.id}.webp`} 
                    alt={media.caption} 
                    className="polaroid-img"
                    loading={isMobileScreen ? "lazy" : "eager"}
                    style={{ objectPosition: `${media.posX !== undefined ? media.posX : 50}% ${media.posY !== undefined ? media.posY : 50}%` }}
                    onError={(e) => {
                      e.target.src = media.src; // Fallback to original if thumbnail fails
                    }}
                  />
                ) : (
                  <div className="polaroid-video-container" style={{ width: "100%", height: "100%", position: "relative" }}>
                    <img 
                      src={`/thumbnails/${media.id}.jpg`} 
                      alt={media.caption} 
                      className="polaroid-video" 
                      loading={isMobileScreen ? "lazy" : "eager"}
                      style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: `${media.posX !== undefined ? media.posX : 50}% ${media.posY !== undefined ? media.posY : 50}%` }}
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
      {/* Epic Movie Credits Finale */}
      <CreditsSection />

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

const CreditsSection = () => {
  const [isLocked, setIsLocked] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [creditsFinished, setCreditsFinished] = useState(false);

  useEffect(() => {
    if (!isLocked || creditsFinished) {
      document.body.classList.remove("hide-nav");
      return;
    }
    
    document.body.classList.add("hide-nav");
    if (window.lenis) window.lenis.stop();
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    const handleAttemptScroll = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 2000);
    };

    const preventKeyScroll = (e) => {
      const keys = ["ArrowUp", "ArrowDown", "Space", "PageUp", "PageDown", "Home", "End"];
      if (keys.includes(e.code)) {
        e.preventDefault();
        e.stopPropagation();
        setShowWarning(true);
        setTimeout(() => setShowWarning(false), 2000);
      }
    };

    window.addEventListener("wheel", handleAttemptScroll, { capture: true, passive: false });
    window.addEventListener("touchmove", handleAttemptScroll, { capture: true, passive: false });
    window.addEventListener("keydown", preventKeyScroll, { capture: true, passive: false });

    const handleDoubleClick = () => {
      setCreditsFinished(true);
      setIsLocked(false);
    };

    window.addEventListener("dblclick", handleDoubleClick);

    return () => {
      document.body.classList.remove("hide-nav");
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      if (window.lenis) window.lenis.start();
      window.removeEventListener("wheel", handleAttemptScroll, { capture: true });
      window.removeEventListener("touchmove", handleAttemptScroll, { capture: true });
      window.removeEventListener("keydown", preventKeyScroll, { capture: true });
      window.removeEventListener("dblclick", handleDoubleClick);
    };
  }, [isLocked, creditsFinished]);

  return (
    <section className="credits-mega-wrapper">
      <div style={{ height: "40vh", background: "#000", width: "100%" }}></div>
      
      <motion.div 
        className="credits-sticky-container"
        onViewportEnter={() => {
          if (!creditsFinished) setIsLocked(true);
        }}
        viewport={{ once: true, amount: 0.9 }}
      >
        <div className="credits-scroll-window">
          <motion.div
            className="credits-content"
            initial={{ y: "0%" }}
            animate={isLocked || creditsFinished ? { y: "-100%" } : { y: "0%" }}
            transition={{ duration: 90, ease: "linear" }}
            onAnimationComplete={() => {
              if (isLocked) {
                setCreditsFinished(true);
                setIsLocked(false);
              }
            }}
          >
            <div className="credit-block">
              <h4 className="credit-role">D I R E C T E D &nbsp; & &nbsp; C R E A T E D &nbsp; B Y</h4>
              <p className="credit-name">Ali Hussnain (Meetha G)</p>
              <p className="credit-desc">Memory Archivist</p>
            </div>
            
            <div className="credit-block">
              <h4 className="credit-role">T H E &nbsp; C O R E &nbsp; S Q U A D</h4>
              
              <p className="credit-name">Muhammad Taqi (Shah G)</p>
              <p className="credit-desc">The Intellectual Anchor. Master of C++, Databases, and an absolute Human Anime Encyclopedia.</p>
              
              <p className="credit-name">Muhammad Abdullah (AMB)</p>
              <p className="credit-desc">The Heart of BSA. The ultimate target of all pranks, spreading pure positive energy whenever he is in the room.</p>
              
              <p className="credit-name">Muhammad Qadeer (Grenade)</p>
              <p className="credit-desc">Master of Chaos. The official squad Chef, Music DJ, and the absolute mastermind of all hostel activities.</p>
              
              <p className="credit-name">Muhammad Haseeb (Rider)</p>
              <p className="credit-desc">Savior of Degrees. The quiet pillar, gaming powerhouse, and the guy who taught us the entire syllabus before exams.</p>
              
              <p className="credit-name">Hammad Khalil (Raja G)</p>
              <p className="credit-desc">The Mehran King. The ultimate adventure enabler, unofficial Qawal, and the funniest talker of the group.</p>
              
              <p className="credit-name">Muhammad Haris (Bawa)</p>
              <p className="credit-desc">The Solution Encyclopedia. The genius anchor who keeps the group bound together through any situation.</p>
              
              <p className="credit-name">Hammad Abrar (Buzurg)</p>
              <p className="credit-desc">The Disciplined Anchor. The ultimate coding expert, tech genius, and our motivation for the future.</p>
            </div>

            <div className="credit-block">
              <h4 className="credit-role">T H E &nbsp; T R U E &nbsp; V I L L A I N S &nbsp; ( A N T A G O N I S T S )</h4>
              <p className="credit-name">The Hostel Mess Food</p>
              <p className="credit-desc">Surviving entirely on watery daal and unidentified gravies.</p>
              <p className="credit-name">The 9 AM Classes</p>
              <p className="credit-desc">The ultimate test of human willpower during freezing winters.</p>
              <p className="credit-name">The University WiFi</p>
              <p className="credit-desc">Exam say aik din pehlay band ho jata tha</p>
            </div>

            <div className="credit-block">
              <h4 className="credit-role">T H E &nbsp; U N S U N G &nbsp; H E R O E S</h4>
              <p className="credit-name">The Legendary Red Suzuki Mehran</p>
              <p className="credit-desc">Defying the laws of physics by fitting 8 grown men inside.</p>
              <p className="credit-name">The Local Photocopier Guy</p>
              <p className="credit-desc">Printing our assignments 5 minutes before the submission time.</p>
              <p className="credit-name">YouTube Indian Tutors</p>
              <p className="credit-desc">The real professors who actually taught us the entire 4-year degree in one night.</p>
            </div>

            <div className="credit-block">
              <h4 className="credit-role">F I L M E D &nbsp; O N &nbsp; L O C A T I O N &nbsp; A T</h4>
              <p className="credit-name">Room 235 & Room 111 (The Headquarters)</p>
              <p className="credit-name">The Back Benches of Lecture Halls</p>
            </div>

            <div className="credit-block">
              <h4 className="credit-role">M E M O R A B L E &nbsp; A R C S &nbsp; & &nbsp; S A G A S</h4>
              <p className="credit-name">The 3 AM Mongol Throat Singing Incident</p>
              <p className="credit-name">The Grand Milads</p>
              <p className="credit-name">The 4th Year Room Initiations</p>
              <p className="credit-name">Late night bomb blasts</p>
              <p className="credit-name">Juniors ko room mein bulwana</p>
              <p className="credit-name">The "We Will Start Studying Tomorrow" Arc (Lasted 4 Years)</p>
            </div>

            <div className="credit-block">
              <h4 className="credit-role">S P E C I A L &nbsp; T H A N K S &nbsp; T O</h4>
              <p className="credit-name">Sabir Bhai & Shah G</p>
              <p className="credit-desc">The real MVP Exam Invigilators. They handed out sheets and silently watched us cheat without ever complaining or stopping us.</p>
              <p className="credit-name">Bawa Haris</p>
              <p className="credit-desc">For constantly forcing me to finish this project when I was about to give up on it.</p>
              <p className="credit-name">Late Night Tea Sessions</p>
              <p className="credit-name">Last-minute Exam Prep by Haseeb</p>
              <p className="credit-name">Every Single Argument That Ended in Laughter</p>
            </div>

            <div className="credit-block">
              <h4 className="credit-role">I N &nbsp; L O V I N G &nbsp; M E M O R Y &nbsp; O F</h4>
              <p className="credit-name">Our Sleep Schedules (2022 - 2026)</p>
              <p className="credit-name">Passing Grades</p>
              <p className="credit-name">The quiet nights before BSA was formed</p>
            </div>

            <div className="credit-block final-credit-logo">
              <p className="credit-desc tagline-final">4 YEARS. 8 BROTHERS. COUNTLESS MEMORIES.</p>
              <p className="credit-name logo-final">BSA.</p>
              <p className="credit-desc">Some eras are too legendary to just live in the past.</p>
            </div>
            
          </motion.div>
        </div>
      </motion.div>
      
      <AnimatePresence>
        {showWarning && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            style={{
              position: "fixed",
              bottom: "30px",
              right: "30px",
              background: "rgba(255, 42, 95, 0.9)",
              color: "#fff",
              padding: "10px 20px",
              borderRadius: "4px",
              fontFamily: "var(--font-title)",
              letterSpacing: "1px",
              textTransform: "uppercase",
              zIndex: 9999,
              boxShadow: "0 4px 20px rgba(0,0,0,0.5)"
            }}
          >
            Please wait. Credits are rolling...
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ height: "50vh", background: "#000", width: "100%" }}></div>
    </section>
  );
};
