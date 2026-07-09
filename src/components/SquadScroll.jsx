import React, { useState, useEffect, useRef } from "react";
import { BookOpen } from "lucide-react";
import { membersData } from "../data/members";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import QuotesStrobe from "./QuotesStrobe";

export default function SquadScroll({ onStoryClick }) {
  const [orderedMembers, setOrderedMembers] = useState([]);
  const videoSectionRef = useRef(null);
  const isVideoInView = useInView(videoSectionRef, { amount: 0.1, once: false });

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
                viewport={{ once: false, amount: 0.2 }}
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.1 }
                  }
                }}
              >
                <motion.div 
                  className="member-name-group"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
                  }}
                >
                  <h2 className="member-name">{member.name}</h2>
                  <span className="member-nickname" style={{ color: member.accentColor }}>"{member.nickname}"</span>
                </motion.div>
                
                <motion.p 
                  className="member-tagline"
                  style={{ borderLeftColor: member.accentColor }}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
                  }}
                >
                  {member.tagline}
                </motion.p>

                <motion.div 
                  className="member-letter-card"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
                  }}
                >
                  <p style={{ whiteSpace: "pre-line" }}>{member.letter}</p>
                </motion.div>


              </motion.div>

            </div>
          </section>
        );
      })}

      {/* Option 2: Split Layout (Text Left, Video Right) */}
      <div style={{ height: '40vh', width: '100vw', backgroundColor: '#000', marginLeft: 'calc(50% - 50vw)' }}></div>
      <section className="video-split-section" style={{ margin: 0, padding: 0, border: 'none', width: '100vw', marginLeft: 'calc(50% - 50vw)' }}>
         <div className="video-split-container">
            <div className="video-split-video-col">
               <motion.video 
                 className="video-split-video" 
                 autoPlay muted loop playsInline
                 initial={{ opacity: 0, scale: 0.9 }}
                 whileInView={{ opacity: 1, scale: 1 }}
                 transition={{ duration: 1 }}
                 viewport={{ once: false, amount: 0.3 }}
               >
                  <source src="/videos/bsa-montage.mp4" type="video/mp4" />
               </motion.video>
            </div>
            <div className="video-split-text-col">
               <motion.h1 
                  className="video-split-text"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, amount: 0.5 }}
                  variants={{
                    visible: { transition: { staggerChildren: 0.2 } }
                  }}
               >
                 {["B", "S", "A"].map((letter, i) => (
                   <motion.span 
                     key={i}
                     variants={{
                       hidden: { opacity: 0, x: 50 },
                       visible: { opacity: 1, x: 0, transition: { type: "spring", damping: 12, stiffness: 100 } }
                     }}
                   >
                     {letter}
                   </motion.span>
                 ))}
               </motion.h1>
            </div>
         </div>
      </section>

      {/* Option 1: Quotes Strobe */}
      <QuotesStrobe />

      {/* Featured Stories: Pen Day & The Last Stand */}
      <FeaturedStories />

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
                A proud member of BSA. I started university as a quiet and shy kid, but this squad changed me into a confident and positive person. To everyone else, I might look like a quiet and innocent guy, but only the BSA boys know the real me!
                <br /><br />
                While the rest of the boys were busy causing chaos in university and living in the moment, I decided to create this. I built this space because some eras are too legendary to just live in the past.
              </p>
        </motion.div>
      </div>
    </section>
  );
}

const AnimatedTitle = ({ text, highlightWords = [] }) => {
  const words = text.split(" ");
  return (
    <motion.h2
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.5 }}
      variants={{
        visible: { transition: { staggerChildren: 0.05 } }
      }}
    >
      {words.map((word, i) => {
        const isHighlight = highlightWords.includes(word);
        const letters = word.split("");
        return (
          <span key={i} style={{ display: "inline-block", marginRight: "0.3em", color: isHighlight ? "var(--color-accent)" : "inherit", fontWeight: isHighlight ? 800 : 300 }}>
            {letters.map((char, j) => (
              <motion.span
                key={j}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { type: "spring", damping: 12, stiffness: 100 } }
                }}
                style={{ display: "inline-block" }}
              >
                {char}
              </motion.span>
            ))}
          </span>
        );
      })}
    </motion.h2>
  );
};

const FeaturedStories = () => {
  return (
    <div className="featured-stories-container">
      {/* Pen Day Story */}
      <section className="featured-story-section">
        <div className="sticky-image-container">
           <img src="/images/92.jpeg" alt="Pen Day Cover-up" />
           <div className="overlay"></div>
        </div>
        <div className="scrolling-text-container">
           <div className="story-text-card">
              <AnimatedTitle text="Pen Day (Front View Only)" highlightWords={["(Front", "View", "Only)"]} />
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.5 }}
                transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
              >
                The boys looked sharp on Pen Day! Please do not ask to see the back of our shirts. We drew unspeakable things on each other and spent the whole day walking with our hands covering our backs.
              </motion.p>
           </div>
        </div>
      </section>
      
      {/* The Last Stand Story */}
      <section className="featured-story-section">
        <div className="sticky-image-container">
           <img src="/images/103.jpeg" alt="The Last Stand" />
           <div className="overlay"></div>
        </div>
        <div className="scrolling-text-container">
           <div className="story-text-card">
              <AnimatedTitle text="The Last Stand" highlightWords={["Stand"]} />
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.5 }}
                transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
              >
                The final day. The final picture. We survived the exams, the open house, and the university life together. What an absolute ride it has been with these boys.
              </motion.p>
           </div>
        </div>
      </section>
    </div>
  );
}
