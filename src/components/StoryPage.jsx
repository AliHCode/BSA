import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Calendar, Compass, Coffee, GraduationCap, Video, Image as ImageIcon, ArrowLeft, Grid, Shuffle, X, Maximize2 } from "lucide-react";

const milestones = [
  {
    year: "YEAR 1 (SEP 2022)",
    icon: Calendar,
    color: "var(--neon-cyan)",
    title: "First Steps & The Core Group",
    subtitle: "JBH Hall",
    text: "September 2022 mein university life shuru hui. JBH Hall ke room 221 aur aamne-samne ke rooms mein hostelites ne dosti ki shuruaat ki. Shuru mein random groups ban rahe thay, but Taqi (Shah G) aur doston ki frequency match hone se group ka aaghaz hua. Pehlay saal ki late-night discussions aur class skips ne dosti ko mazboot kiya."
  },
  {
    year: "YEAR 2 (2023 - 2024)",
    icon: Compass,
    color: "var(--neon-pink)",
    title: "Ali Hall & The Circle Grows",
    subtitle: "The Private Mess Gatherings",
    text: "Second year mein boys Ali Hall shift hue. Private mess mein rozana baithte baithte Q-Hall ke baki doston—Qadeer (Grenade), Abdullah (AMB), Hamad Khalil, Hamad Abrar, Haseeb, aur Haris—se connection bana aur Bismillah Student Association (BSA) officially ek group ban kar ubhri. 21 April ko Savour Foods Wah Cantt mein Abdullah ki birthday par usko pool mein phenk kar aur uske kapde chupa kar pehli bari tantri ki gayi!"
  },
  {
    year: "YEAR 3 (2024 - 2025)",
    icon: Coffee,
    color: "var(--neon-gold)",
    title: "Room 235 & The Red Mehran",
    subtitle: "BSA Formation & Peak Pranks",
    text: "Third year mein Room 235 shift hue jo BSA ka main headquarters ban gaya. Day scholars Haris, Haseeb, aur Hamad Khalil bhi sara din hostel mein hi rehte thay. Peak tantriayan ka saal tha: juniors ko room mein la kar unke sath shugal lagana, rooms pe patthar marna, day scholars ke phones chupana taake wo ghar na ja sakein, aur Hamad Khalil ki laal Mehran mein 8 doston ka adjust ho kar road trips par nikal jana!"
  },
  {
    year: "YEAR 4 (THE FINALE)",
    icon: GraduationCap,
    color: "var(--text-white)",
    title: "Room 111 & The Final Chapter",
    subtitle: "June 2026 - Present",
    text: "Final year mein sab dost Room 111 mein stay kar rahe hain. 2 July 2026 ko final project (FYP) presentation hai, aur 15 August tak summer session chalega. Char saal ki hostel life aur unki shugufta tantriayan ke baad ab ye group graduation aur aglay safar ke liye tayyar hai, locked in as a family."
  }
];

function TimeMachineNode({ milestone, index, total, scrollYProgress }) {
  const Icon = milestone.icon;
  const peak = (index + 0.5) / total;
  const start = peak - 0.25;
  const pass = peak + 0.15;
  
  const scale = useTransform(scrollYProgress, (v) => {
    if (v < start) return 0;
    if (v < peak) return (v - start) / (peak - start); // 0 to 1
    if (v < pass) return 1 + 3 * ((v - peak) / (pass - peak)); // 1 to 4
    return 4;
  });
  
  const opacity = useTransform(scrollYProgress, (v) => {
    if (v < start) return 0;
    if (v < peak) return (v - start) / (peak - start); // 0 to 1
    if (v < pass) return 1 - ((v - peak) / (pass - peak)); // 1 to 0
    return 0;
  });
  
  const filter = useTransform(scrollYProgress, (v) => {
    if (v < start) return "blur(20px)";
    if (v < peak) return `blur(${20 - 20 * ((v - start) / (peak - start))}px)`;
    if (v < pass) return `blur(${20 * ((v - peak) / (pass - peak))}px)`;
    return "blur(20px)";
  });

  return (
    <motion.div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        x: "-50%",
        y: "-50%",
        scale,
        opacity,
        filter,
        zIndex: total - index,
        width: "90%",
        maxWidth: "600px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        pointerEvents: "none"
      }}
    >
      <div className="timeline-badge" style={{ "--badge-color": milestone.color, position: "relative", marginBottom: "20px", pointerEvents: "auto" }}>
        <Icon size={16} style={{ marginRight: "6px", verticalAlign: "middle" }} />
        {milestone.year}
      </div>
      <div className="timeline-card glass-panel" style={{ "--badge-color": milestone.color, width: "100%", pointerEvents: "auto" }}>
        <h3 style={{ fontSize: "1.8rem", textAlign: "center", marginBottom: "5px" }}>{milestone.title}</h3>
        <p style={{ color: "var(--text-gray)", fontSize: "0.9rem", marginBottom: "15px", textAlign: "center" }}>{milestone.subtitle}</p>
        <p style={{ textAlign: "justify", lineHeight: "1.6" }}>{milestone.text}</p>
      </div>
    </motion.div>
  );
}

export default function StoryPage({ onBackClick }) {
  
  // Array of memories for the Polaroid Grid / 3D Scatter Board
  const mediaMemories = [
    { id: 1, type: "image", src: "/images/memory_class.jpg", caption: "The First Class" },
    { id: 2, type: "image", src: "/images/memory_room235.jpg", caption: "Room 235 Shenanigans" },
    { id: 3, type: "image", src: "/images/memory_quetta.jpg", caption: "Quetta Chai Therapy" },
    { id: 4, type: "image", src: "/images/memory_trip.jpg", caption: "Endless Hostel Parties" },
    { id: 5, type: "image", src: "/images/memory_exam.jpg", caption: "Exam Prep Nightmares" },
    { id: 6, type: "image", src: "/images/memory_lastclass.jpg", caption: "The Final Class" },
    { id: 7, type: "video", src: "/videos/memory_video1.mp4", caption: "Room 235 Karaoke Jam" },
    { id: 8, type: "video", src: "/videos/memory_video2.mp4", caption: "Late Night Chai Vibe" },
    { id: 9, type: "image", src: "/images/memory_sports.jpg", caption: "Hostel Sports Day" },
    { id: 10, type: "video", src: "/videos/memory_video3.mp4", caption: "Phone Hiding Prank" },
    { id: 11, type: "image", src: "/images/memory_mess.jpg", caption: "JBH Mess Gatherings" },
    { id: 12, type: "video", src: "/videos/memory_video4.mp4", caption: "Corridor Football Chaos" },
    { id: 13, type: "image", src: "/images/memory_mehran.jpg", caption: "Mehran Squeeze Outing" },
    { id: 14, type: "image", src: "/images/memory_lab.jpg", caption: "Late Night Coding Sessions" },
    { id: 15, type: "video", src: "/videos/memory_video5.mp4", caption: "FYP Submission Celebration" },
    { id: 16, type: "image", src: "/images/memory_room111.jpg", caption: "Room 111 Final Vibe" }
  ];

  const targetRef = useRef(null);
  const timelineRef = useRef(null);
  const canvasRef = useRef(null);
  const isDraggingRef = useRef(false);

  const [scrollLimit, setScrollLimit] = useState(2400);
  const [cards, setCards] = useState([]);
  const [viewMode, setViewMode] = useState("scatter"); // "scatter" or "grid"
  const [activeMedia, setActiveMedia] = useState(null); // for lightbox popup

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

  // Initialize random scatter coordinates for the Polaroids
  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    const initialized = mediaMemories.map((item, idx) => {
      // Pick random coordinates within bounds to avoid clustering
      const randomX = Math.random() * (isMobile ? 65 : 82) + 2; // 2% to 84%
      const randomY = Math.random() * (isMobile ? 75 : 80) + 5; // 5% to 85%
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

  // Shuffle board items randomly
  const handleScatter = () => {
    setViewMode("scatter");
    const isMobile = window.innerWidth <= 768;
    setCards(prev => prev.map((c) => ({
      ...c,
      x: Math.random() * (isMobile ? 65 : 82) + 2,
      y: Math.random() * (isMobile ? 75 : 80) + 5,
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

      {/* Z-Axis Time Machine Tunnel */}
      <div ref={targetRef} className="time-machine-wrapper" style={{ height: "400vh", position: "relative" }}>
        <div className="time-machine-sticky" style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", perspective: "1000px" }}>
          {/* Subtle background particles or depth effect could go here */}
          {milestones.map((milestone, index) => (
            <TimeMachineNode
              key={index}
              milestone={milestone}
              index={index}
              total={milestones.length}
              scrollYProgress={scrollYProgress}
            />
          ))}
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
        <div ref={canvasRef} className="polaroid-scatter-canvas">
          {cards.map((media) => (
            <motion.div 
              key={media.id} 
              className="polaroid-card scatter-card" 
              style={{ 
                left: `${media.x}%`, 
                top: `${media.y}%`, 
                zIndex: media.zIndex
              }}
              animate={{ 
                rotate: media.rotate,
                scale: viewMode === "grid" ? 0.95 : 1
              }}
              transition={{ type: "spring", stiffness: 85, damping: 14 }}
              drag
              dragConstraints={canvasRef}
              dragElastic={0.05}
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
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
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
              <span className="polaroid-caption">{media.caption}</span>
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
          >
            <motion.div 
              className="lightbox-content"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="lightbox-close" onClick={() => setActiveMedia(null)}>
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

              <h3 style={{ 
                marginTop: "20px", 
                fontFamily: "var(--font-title)", 
                letterSpacing: "2px", 
                fontSize: "1.2rem", 
                color: "#fff",
                textTransform: "uppercase"
              }}>
                {activeMedia.caption}
              </h3>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
