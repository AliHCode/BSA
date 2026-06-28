import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Calendar, Compass, Coffee, GraduationCap, Video, Image as ImageIcon, ArrowLeft } from "lucide-react";

export default function StoryPage({ onBackClick }) {
  
  // Array of memories for the Polaroid Grid
  const mediaMemories = [
    { id: 1, type: "image", src: "/images/memory_class.jpg", caption: "The First Class", rotation: "-3deg" },
    { id: 2, type: "image", src: "/images/memory_room235.jpg", caption: "Room 235 Shenanigans", rotation: "2deg" },
    { id: 3, type: "image", src: "/images/memory_quetta.jpg", caption: "Quetta Chai Therapy", rotation: "-2deg" },
    { id: 4, type: "image", src: "/images/memory_trip.jpg", caption: "Endless Parties", rotation: "3deg" },
    { id: 5, type: "image", src: "/images/memory_exam.jpg", caption: "Exam Prep Nightmares", rotation: "-1deg" },
    { id: 6, type: "image", src: "/images/memory_lastclass.jpg", caption: "The Final Class", rotation: "4deg" },
    { id: 7, type: "video", src: "/videos/memory_video1.mp4", caption: "Room 235 Karaoke", rotation: "-2deg" },
    { id: 8, type: "video", src: "/videos/memory_video2.mp4", caption: "Late Night Chai Vibe", rotation: "1deg" }
  ];

  const targetRef = useRef(null);
  const timelineRef = useRef(null);
  const [scrollLimit, setScrollLimit] = useState(2400);

  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  useEffect(() => {
    const handleResize = () => {
      if (timelineRef.current) {
        const nodes = timelineRef.current.querySelectorAll(".museum-node");
        if (nodes.length > 1) {
          const firstNode = nodes[0];
          const lastNode = nodes[nodes.length - 1];
          const firstCenter = firstNode.offsetLeft + firstNode.offsetWidth / 2;
          const lastCenter = lastNode.offsetLeft + lastNode.offsetWidth / 2;
          setScrollLimit(lastCenter - firstCenter);
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
  
  // On desktop, scroll horizontally. Mobile will handle it differently via CSS.
  const x = useTransform(scrollYProgress, [0, 1], [0, -scrollLimit]);

  return (
    <div className="story-page">
      {/* Back Button */}
      <button 
        onClick={onBackClick} 
        className="btn-gta"
        style={{ 
          alignSelf: "flex-start", 
          marginBottom: "40px",
          padding: "10px 20px",
          fontSize: "1rem",
          borderColor: "var(--neon-cyan)",
          boxShadow: "0 0 10px rgba(0, 255, 255, 0.2)"
        }}
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
                <h3>First Steps & The Core Group</h3>
                <p style={{ color: "var(--text-gray)", fontSize: "0.9rem", marginBottom: "10px" }}>JBH Hall</p>
                <p>
                  September 2022 mein university life shuru hui. JBH Hall ke room 221 aur aamne-samne ke rooms mein hostelites ne dosti ki shuruaat ki. Shuru mein random groups ban rahe thay, but Taqi (Shah G) aur doston ki frequency match hone se group ka aaghaz hua. Pehlay saal ki late-night discussions aur class skips ne dosti ko mazboot kiya.
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
                  Second year mein boys Ali Hall shift hue. Private mess mein rozana baithte baithte Q-Hall ke baki doston—Qadeer (Grenade), Abdullah (AMB), Hamad Khalil, Hamad Abrar, Haseeb, aur Haris—se connection bana aur Bismillah Student Association (BSA) officially ek group ban kar ubhri. 21 April ko Savour Foods Wah Cantt mein Abdullah ki birthday par usko pool mein phenk kar aur uske kapde chupa kar pehli bari shararat ki gayi!
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
                <h3>Room 235 & The Red Mehran</h3>
                <p style={{ color: "var(--text-gray)", fontSize: "0.9rem", marginBottom: "10px" }}>BSA Formation & Peak Pranks</p>
                <p>
                  Third year mein Room 235 shift hue jo BSA ka main headquarters ban gaya. Day scholars Haris, Haseeb, aur Hamad Khalil bhi sara din hostel mein hi rehte thay. Peak shararaton ka saal tha: juniors ko room mein la kar unke sath shugal lagana, rooms pe patthar marna, day scholars ke phones chupana taake wo ghar na ja sakein, aur Hamad Khalil ki laal Mehran mein 8 doston ka adjust ho kar road trips par nikal jana!
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
                  Final year mein sab dost Room 111 mein stay kar rahe hain. 2 July 2026 ko final project (FYP) presentation hai, aur 15 August tak summer session chalega. Char saal ki hostel life aur unki shugufta shararaton ke baad ab ye group graduation aur aglay safar ke liye tayyar hai, locked in as a family.
                </p>
              </div>
            </div>

          </motion.div>
        </div>
      </div>

      {/* Memory Board Section */}
      <section className="media-grid-section">
        <h2 className="media-grid-title">The Memory Board</h2>
        <p style={{ color: "var(--text-light)", marginBottom: "40px", fontSize: "1.1rem" }}>
          Polaroids and clips from our archives. (Drop your real photos and video files in the project folder to replace placeholders!)
        </p>

        <div className="media-grid">
          {mediaMemories.map((media) => (
            <div 
              key={media.id} 
              className="polaroid-card" 
              style={{ "--rotation": media.rotation }}
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
                  <video 
                    src={media.src} 
                    className="polaroid-video" 
                    controls 
                    muted
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
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
                  {media.type === "image" ? <ImageIcon size={48} /> : <Video size={48} />}
                  <span style={{ fontSize: "0.8rem", marginTop: "12px", letterSpacing: "1px", textTransform: "uppercase" }}>
                    {media.type} FILE
                  </span>
                </div>
              </div>
              <span className="polaroid-caption">{media.caption}</span>
            </div>
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
    </div>
  );
}
