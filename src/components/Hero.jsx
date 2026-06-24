import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";

export default function Hero({ onStartClick }) {
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef(null);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleScrollPrompt = () => {
    const nextSection = document.querySelector(".squad-section");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Scroll animations
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const bgTextY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const bgTextScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const bgTextOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // Different parallax speeds for the floating images
  const img1Y = useTransform(scrollYProgress, [0, 1], ["0%", "-40%"]);
  const img2Y = useTransform(scrollYProgress, [0, 1], ["0%", "-80%"]);
  const img3Y = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const img4Y = useTransform(scrollYProgress, [0, 1], ["0%", "-60%"]);

  // Foreground content parallax and fade
  const foregroundY = useTransform(scrollYProgress, [0, 1], ["0%", "60%"]);
  const foregroundOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            className="hero-loading-screen"
            initial={{ y: 0 }}
            exit={{ y: "-100%", transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] } }}
          >
            <motion.div 
              className="loading-text-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {["B", "S", "A"].map((letter, index) => (
                <motion.span
                  key={index}
                  initial={{ y: 150, opacity: 0, rotate: 10 }}
                  animate={{ y: 0, opacity: 1, rotate: 0 }}
                  transition={{ delay: 0.1 + index * 0.15, duration: 0.8, ease: [0.215, 0.610, 0.355, 1] }}
                  className="loading-letter"
                >
                  {letter}
                </motion.span>
              ))}
            </motion.div>
            <motion.div 
              className="loading-progress"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.8, ease: "easeInOut" }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="hero-wow-container" ref={containerRef}>
        {/* Giant Outline Text */}
        <motion.div className="hero-bg-text-wrapper" style={{ y: bgTextY, scale: bgTextScale, opacity: bgTextOpacity }}>
          <motion.div 
            className="hero-bg-text"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={!isLoading ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 2, ease: "easeOut", delay: 0.2 }}
          >
            BSA
          </motion.div>
        </motion.div>

        {/* Floating Collage Images */}
        <div className="hero-floating-images">
          <motion.div className="hero-float-wrapper img-1-wrapper" style={{ y: img1Y }}>
            <motion.img 
              src="/images/Ali.jpeg" 
              className="hero-float-img img-1" 
              initial={{ opacity: 0, y: 150, rotate: -20, scale: 0.8 }}
              animate={!isLoading ? { opacity: 1, y: 0, rotate: -8, scale: 1 } : {}}
              transition={{ delay: 0.3, duration: 1.2, type: "spring", bounce: 0.4 }}
            />
          </motion.div>

          <motion.div className="hero-float-wrapper img-2-wrapper" style={{ y: img2Y }}>
            <motion.img 
              src="/images/Taqi.jpeg" 
              className="hero-float-img img-2" 
              initial={{ opacity: 0, y: -150, rotate: 20, scale: 0.8 }}
              animate={!isLoading ? { opacity: 1, y: 0, rotate: 5, scale: 1 } : {}}
              transition={{ delay: 0.4, duration: 1.2, type: "spring", bounce: 0.4 }}
            />
          </motion.div>

          <motion.div className="hero-float-wrapper img-3-wrapper" style={{ y: img3Y }}>
            <motion.img 
              src="/images/Haseeb.jpeg" 
              className="hero-float-img img-3" 
              initial={{ opacity: 0, x: 150, rotate: 25, scale: 0.8 }}
              animate={!isLoading ? { opacity: 1, x: 0, rotate: 12, scale: 1 } : {}}
              transition={{ delay: 0.5, duration: 1.2, type: "spring", bounce: 0.4 }}
            />
          </motion.div>

          <motion.div className="hero-float-wrapper img-4-wrapper" style={{ y: img4Y }}>
            <motion.img 
              src="/images/Abdullah.jpeg" 
              className="hero-float-img img-4" 
              initial={{ opacity: 0, y: 150, rotate: -20, scale: 0.8 }}
              animate={!isLoading ? { opacity: 1, y: 0, rotate: -5, scale: 1 } : {}}
              transition={{ delay: 0.6, duration: 1.2, type: "spring", bounce: 0.4 }}
            />
          </motion.div>
        </div>

        {/* Foreground Content */}
        <motion.div className="hero-foreground-wrapper" style={{ y: foregroundY, opacity: foregroundOpacity }}>
          <div className="hero-foreground">
            <motion.div 
              className="hero-badge-container"
              initial={{ opacity: 0, y: -30, filter: "blur(10px)" }}
              animate={!isLoading ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              <span className="hero-badge">EST. FIRST YEAR</span>
              <span className="hero-badge">ROOM 45</span>
            </motion.div>

            <motion.div 
              className="hero-title-container"
              initial="hidden"
              animate={!isLoading ? "visible" : "hidden"}
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.9 } }
              }}
            >
              <motion.div 
                className="title-sub"
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              >
                THE STORY OF
              </motion.div>
              <motion.h1 
                className="hero-editorial-title"
                variants={{ 
                  hidden: { opacity: 0, y: 50, rotateX: -30, scale: 0.9 }, 
                  visible: { opacity: 1, y: 0, rotateX: 0, scale: 1, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } } 
                }}
                style={{ perspective: 1000 }}
              >
                THE <span className="title-italic">Brotherhood</span>
              </motion.h1>
              
              <motion.p 
                className="hero-editorial-desc"
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8 } } }}
              >
                More than just a group of friends. Through four years of changing hostels, shared chaos, and profound debates in Q-Hall, our brotherhood was forged over countless cups of tea. Rooms changed, but the bond remained unbreakable. This is our legacy.
              </motion.p>
              
              <motion.div 
                className="hero-action-buttons"
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8 } } }}
              >
                <button onClick={handleScrollPrompt} className="btn-gta btn-inverted">
                  Meet The Boys
                </button>
                <button onClick={onStartClick} className="btn-gta btn-outline">
                  Read Story
                </button>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          className="hero-scroll-indicator" 
          onClick={handleScrollPrompt}
          initial={{ opacity: 0, y: 20 }}
          animate={!isLoading ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 2, duration: 1 }}
          style={{ opacity: foregroundOpacity }}
        >
          <span className="scroll-text">SCROLL</span>
          <div className="scroll-track">
            <motion.div 
              className="scroll-thumb"
              animate={{ y: ["-100%", "200%"] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            />
          </div>
        </motion.div>
      </div>
    </>
  );
}
