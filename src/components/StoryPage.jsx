import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Calendar, Compass, Coffee, GraduationCap, Video, Image as ImageIcon, ArrowLeft } from "lucide-react";

export default function StoryPage({ onBackClick }) {
  
  // Array of memories for the Polaroid Grid
  const mediaMemories = [
    { id: 1, type: "image", src: "/images/memory_class.jpg", caption: "The First Class", rotation: "-3deg" },
    { id: 2, type: "image", src: "/images/memory_room45.jpg", caption: "Room 45 Shenanigans", rotation: "2deg" },
    { id: 3, type: "image", src: "/images/memory_quetta.jpg", caption: "Quetta Chai Therapy", rotation: "-2deg" },
    { id: 4, type: "image", src: "/images/memory_trip.jpg", caption: "Endless Parties", rotation: "3deg" },
    { id: 5, type: "image", src: "/images/memory_exam.jpg", caption: "Exam Prep Nightmares", rotation: "-1deg" },
    { id: 6, type: "image", src: "/images/memory_lastclass.jpg", caption: "The Final Class", rotation: "4deg" },
    { id: 7, type: "video", src: "/videos/memory_video1.mp4", caption: "Room 45 Karaoke", rotation: "-2deg" },
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
                YEAR 1
              </div>
              <div className="timeline-card glass-panel" style={{ "--badge-color": "var(--neon-cyan)" }}>
                <h3>First Steps & The Squad Base</h3>
                <p style={{ color: "var(--text-gray)", fontSize: "0.9rem", marginBottom: "10px" }}>First Year of University</p>
                <p>
                  Ali moved into the hostel and met his roommate on the very first day. Within a few days, a random walk back to the hostel from class led to meeting Taqi (Shah G). 
                  Soon, Abdullah (AMB) and Qadeer (Grenade) joined the circle. 
                  Living in rooms directly opposite to each other laid the foundation for late-night gaming, class-skipping debates, and the beginning of a lifelong brotherhood.
                </p>
              </div>
            </div>

            {/* Milestone 2 */}
            <div className="museum-node">
              <div className="timeline-badge" style={{ "--badge-color": "var(--neon-pink)", bottom: "-40px", top: "auto" }}>
                <Compass size={16} style={{ marginRight: "6px", verticalAlign: "middle" }} />
                YEAR 2
              </div>
              <div className="timeline-card glass-panel" style={{ "--badge-color": "var(--neon-pink)" }}>
                <h3>Room 45, Q Hall Headquarters</h3>
                <p style={{ color: "var(--text-gray)", fontSize: "0.9rem", marginBottom: "10px" }}>Second Year Shifts</p>
                <p>
                  As we entered our second year, hostels shifted. Some stayed in different wings and halls—Taqi, Haseeb (Murshid G), Raja Hammad (Raja G), and Haris Bawa (Bawa G) were spread out. 
                  But geographical boundaries broke in Room 45, Q Hall, hosted by Hammad Abrar (Baba Kookie). 
                  Room 45 became our official central headquarters. The place where we did assignment runs, cooked late-night snacks, hosted endless parties, and solidified our squad.
                </p>
              </div>
            </div>

            {/* Milestone 3 */}
            <div className="museum-node">
              <div className="timeline-badge" style={{ "--badge-color": "var(--neon-gold)", top: "-40px" }}>
                <Coffee size={16} style={{ marginRight: "6px", verticalAlign: "middle" }} />
                EVERY NIGHT
              </div>
              <div className="timeline-card glass-panel" style={{ "--badge-color": "var(--neon-gold)" }}>
                <h3>The Quetta Chronicles</h3>
                <p style={{ color: "var(--text-gray)", fontSize: "0.9rem", marginBottom: "10px" }}>Midnight Therapy</p>
                <p>
                  Quetta Restaurant wasn't just a tea stall; it was a sanctuary. Every late-night session in Room 45 naturally ended with a trip to Quetta. 
                  Over hot cups of doodh patti, we talked about careers, made fun of professors, shared our secrets, and laughed until the sun came up. 
                  Those hours of sitting on plastic chairs under the open sky built a bond that semesters could never teach.
                </p>
              </div>
            </div>

            {/* Milestone 4 */}
            <div className="museum-node">
              <div className="timeline-badge" style={{ "--badge-color": "var(--text-white)", bottom: "-40px", top: "auto" }}>
                <GraduationCap size={16} style={{ marginRight: "6px", verticalAlign: "middle" }} />
                THE FINALE
              </div>
              <div className="timeline-card glass-panel" style={{ "--badge-color": "var(--text-white)" }}>
                <h3>Class Dismissed</h3>
                <p style={{ color: "var(--text-gray)", fontSize: "0.9rem", marginBottom: "10px" }}>June 2026 - Present</p>
                <p>
                  We attended our very last university class yesterday. The books are closed, and only two weeks of finals stand between us and the finish line. 
                  From entering university as confused hostelites to leaving as a family that has stood by each other through exams, parties, and life's shifts—we lived it all. 
                  The era might be ending, but the brotherhood is locked in forever.
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
          Room 45. Quetta. Hostel Nights.<br />
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
