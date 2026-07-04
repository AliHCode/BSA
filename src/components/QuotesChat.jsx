import React from 'react';
import { motion } from 'framer-motion';

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

export default function QuotesChat() {
  return (
    <div className="quotes-chat-container">
      {quotes.map((quote, index) => {
        // Alternate sides for chat bubbles to simulate a conversation
        const isLeft = index % 2 === 0;
        
        return (
          <motion.div 
            key={index}
            className={`chat-bubble-wrapper ${isLeft ? 'chat-left' : 'chat-right'}`}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <div className={`chat-bubble ${isLeft ? 'bubble-received' : 'bubble-sent'}`}>
              <span className="chat-text">{quote}</span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
