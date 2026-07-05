import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const quotes = [
  "Zayada nayi hogya kuch zayada hy hogaya hai",
  "Phaink K dikha",
  "Mana kiya hai nah aik dafa",
  "Yaar tu pagal hai",
  "Haris bhai kambhal side pey kro mainay mouse chalana hai",
  "kash koyi ladki mujh say pyaar krti",
  "onay peela joda payaa siii nalay hina wy layi sii",
  "Frieren",
  "mazzaaa aa gaya",
  "aaaaaaaaaaaaa",
  "Aap nay acha nahi kiya",
  "Pathhhiiiiiiiiii",
  "agar apnay baap ka hai toh Ali pey phaink k dikha",
  "Bhatti saab ki kr rahay ho",
  "Summit class ka topper",
  "Mangoooool",
  "Mature ho gaya hai"
];

function QuoteItem({ quote, index, total, scrollYProgress }) {
  const start = index / total;
  const end = (index + 1) / total;
  const p1 = start + (0.2 / total);
  const p2 = start + (0.8 / total);
  
  const opacity = useTransform(
    scrollYProgress, 
    [start, p1, p2, end], 
    [0, 1, 1, 0]
  );

  const scale = useTransform(
    scrollYProgress, 
    [start, end], 
    [0.7, 1.3]
  );

  const isAccent = index % 2 === 0;

  return (
    <motion.h2
      className={`strobe-quote ${isAccent ? 'strobe-accent' : 'strobe-white'}`}
      style={{
        opacity,
        scale,
        position: "absolute",
        top: "50%",
        left: "50%",
        x: "-50%",
        y: "-50%",
        pointerEvents: "none"
      }}
    >
      {quote}
    </motion.h2>
  );
}

export default function QuotesStrobe() {
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <div ref={containerRef} className="quotes-strobe-container">
      <div className="quotes-strobe-sticky">
        {quotes.map((quote, index) => (
          <QuoteItem 
            key={index} 
            quote={quote} 
            index={index} 
            total={quotes.length} 
            scrollYProgress={scrollYProgress} 
          />
        ))}
      </div>
    </div>
  );
}
