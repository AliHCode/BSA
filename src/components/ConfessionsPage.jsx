import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, Skull, LockKeyhole } from "lucide-react";

export default function ConfessionsPage() {
  const [isUnlocked, setIsUnlocked] = useState(false);

  const handleUnlock = () => {
    setIsUnlocked(true);
  };

  return (
    <div className="confessions-container">
      <AnimatePresence mode="wait">
        {!isUnlocked ? (
          <motion.div 
            key="locked"
            className="locked-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            transition={{ duration: 0.5 }}
          >
            <ShieldAlert size={50} color="#ff2a5f" className="pulse-icon" />
            <h1 className="warning-title">BSA CONFESSIONS</h1>
            <p className="warning-text">
              WARNING: Entering this area exposes highly chaotic and deeply controversial activities. 
            </p>
            <button className="btn-gta btn-danger unlock-btn" onClick={handleUnlock}>
              <Skull size={20} /> ATTEMPT DECRYPTION
            </button>
          </motion.div>
        ) : (
          <motion.div 
            key="denied"
            className="unlocked-content"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{ alignItems: "center", justifyContent: "center", textAlign: "center", minHeight: "60vh" }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.6, type: "spring", bounce: 0.6 }}
            >
              <LockKeyhole size={60} color="#ff2a5f" style={{ marginBottom: "20px" }} />
            </motion.div>

            <h1 className="glitch-text" data-text="ACCESS DENIED">ACCESS DENIED</h1>
            
            <div className="warning-text" style={{ maxWidth: "700px", marginTop: "30px", fontSize: "1.2rem", color: "#fff" }}>
              <p style={{ marginBottom: "20px", color: "#ff2a5f", fontWeight: "bold", letterSpacing: "2px" }}>ERROR: CLEARANCE LEVEL TOO LOW</p>
              
              <p style={{ fontStyle: "italic", color: "#ffaa00", fontSize: "1.3rem", lineHeight: "1.6" }}>
                "Bhai, agar abhi ye sab bata diya tou kaafi log seriously offend ho jayenge. Aur rahi baat university administration ki... wo tou seedha nikal denge."
              </p>
              
              <p style={{ marginTop: "30px", color: "#ccc", lineHeight: "1.8" }}>
                We've done some truly chaotic things that are best kept in the shadows. 
                This vault is strictly sealed and will automatically decrypt <strong>ONLY</strong> after we officially graduate and leave the university premises safely.
              </p>
            </div>
            
            <div className="disclaimer-footer" style={{ marginTop: "40px" }}>
              <p className="pulse-icon" style={{ color: "#ff2a5f", fontSize: "1.2rem", fontWeight: "bold", letterSpacing: "4px" }}>
                COMING SOON
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
