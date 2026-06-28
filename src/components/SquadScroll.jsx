import React, { useState, useEffect, useRef } from "react";
import { BookOpen } from "lucide-react";
import { membersData } from "../data/members";
import { motion, useScroll, useTransform } from "framer-motion";

export default function SquadScroll({ onStoryClick }) {
  const [orderedMembers, setOrderedMembers] = useState([]);

  // Shuffle squad members on mount, keeping Ali Hussnain (Meetha) first
  useEffect(() => {
    const ali = membersData.find((m) => m.id === "ali");
    const others = membersData.filter((m) => m.id !== "ali");

    const shuffledOthers = [...others];
    for (let i = shuffledOthers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledOthers[i], shuffledOthers[j]] = [shuffledOthers[j], shuffledOthers[i]];
    }

    setOrderedMembers([ali, ...shuffledOthers]);
  }, []);

  return (
    <div className="snap-container">
      {orderedMembers.map((member, index) => {
        const isLayoutRight = index % 2 !== 0;

        if (member.id === "ali") {
          return <AliModernSection key={member.id} member={member} onStoryClick={onStoryClick} />;
        }

        return (
          <section 
            key={member.id} 
            data-id={member.id}
            className="squad-section"
            style={{ 
              backgroundColor: index === 0 ? "var(--bg-dark)" : "var(--bg-darker)",
            }}
          >
            <div className={`member-slide-container ${isLayoutRight ? "layout-right" : ""}`}>
              
              {/* Animated Image Column */}
              <motion.div 
                className="member-img-column"
                initial={{ opacity: 0, scale: 0.8, rotate: isLayoutRight ? 5 : -5 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
              >
                <div 
                  className="member-img-frame" 
                  style={{ "--accent-color": member.accentColor }}
                >
                  <img 
                    src={member.image} 
                    alt={`${member.name} (${member.nickname})`} 
                    className="member-photo"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentNode.nextSibling.style.display = 'flex';
                    }}
                  />
                  {/* Fallback */}
                  <div 
                    style={{
                      display: 'none',
                      width: '100%',
                      height: '100%',
                      background: `linear-gradient(135deg, var(--bg-darker) 30%, ${member.accentColor} 100%)`,
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <span style={{ fontFamily: 'var(--font-title)', fontSize: '4rem', fontWeight: '800', color: '#fff' }}>
                      {member.nickname}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Animated Content Column */}
              <motion.div 
                className="member-content-column"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.3 }}
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.2 }
                  }
                }}
              >
                <motion.div 
                  className="member-name-group"
                  variants={{
                    hidden: { opacity: 0, x: isLayoutRight ? 50 : -50 },
                    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
                  }}
                >
                  <h2 className="member-name">{member.name}</h2>
                  <span className="member-nickname" style={{ color: member.accentColor }}>"{member.nickname}"</span>
                </motion.div>
                
                <motion.p 
                  className="member-tagline"
                  style={{ borderLeftColor: member.accentColor }}
                  variants={{
                    hidden: { opacity: 0, x: isLayoutRight ? 50 : -50 },
                    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
                  }}
                >
                  {member.tagline}
                </motion.p>

                <motion.div 
                  className="member-letter-card"
                  variants={{
                    hidden: { opacity: 0, y: 50 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
                  }}
                >
                  <p style={{ whiteSpace: "pre-line" }}>{member.letter}</p>
                </motion.div>


              </motion.div>

            </div>
          </section>
        );
      })}

      {/* Outro section */}
      <section 
        data-id="outro"
        className="squad-section outro-section"
      >
        {/* Animated Background Text */}
        <div className="outro-bg-text-container">
          <motion.div 
            className="outro-bg-text"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
          >
            BROTHERHOOD • MEMORIES • ROOM 235 & 111 • QUETTA RESTAURANT • BROTHERHOOD • MEMORIES • ROOM 235 & 111 • QUETTA RESTAURANT • 
          </motion.div>
        </div>

        <motion.div 
          className="outro-content-wrapper"
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 1, type: "spring", bounce: 0.4 }}
        >
          <h2 className="outro-epic-title">
            THE LEGACY.
          </h2>
          
          <div className="outro-action-container">
            <motion.button 
              onClick={onStoryClick} 
              className="btn-epic-story"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="btn-epic-text">UNCOVER OUR STORY</span>
            </motion.button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

const AliModernSection = ({ member, onStoryClick }) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const yImage = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);
  const scaleImage = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.9]);
  const yText = useTransform(scrollYProgress, [0, 1], ["20%", "-20%"]);

  return (
    <section ref={containerRef} data-id={member.id} className="squad-section ali-ultimate-section">
      <motion.div className="ali-bg-typography" style={{ y: yBg }}>
        ALI HUSSNAIN ALI HUSSNAIN
      </motion.div>
      
      <div className="ali-ultimate-content">
        <motion.div className="ali-image-column" style={{ y: yImage, scale: scaleImage }}>
          <div className="ali-image-wrapper">
             <img src={member.image} alt="Ali" />
             <div className="ali-image-overlay"></div>
          </div>
        </motion.div>

        <motion.div className="ali-text-column" style={{ y: yText }}>
           <h2 className="ali-modern-title" style={{ marginBottom: "10px" }}>I AM ALI.</h2>
           <span className="member-nickname" style={{ color: member.accentColor, display: "block", marginBottom: "35px" }}>"{member.nickname}"</span>
              <p className="ali-modern-desc">
                I started university as a quiet and shy kid, but this squad changed me into a confident and positive person. To everyone else, I might look like a quiet and innocent guy, but only the BSA boys know the real me!
                <br /><br />
                A proud member of BSA. While the rest of the boys were busy causing chaos in university and living in the moment, I decided to create this. I built this space because some eras are too legendary to just live in the past.
              </p>
           <button onClick={onStoryClick} className="ali-modern-btn">
             EXPLORE THE ARCHIVES
           </button>
        </motion.div>
      </div>
    </section>
  );
}
