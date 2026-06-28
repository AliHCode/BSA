import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, Skull, Terminal, CheckCircle2, LockKeyhole } from "lucide-react";

export default function ConfessionsPage() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState([]);
  const [inputVal, setInputVal] = useState("");
  const [showMatrix, setShowMatrix] = useState(false);
  const [matrixProgress, setMatrixProgress] = useState(0);
  const [showDeniedScreen, setShowDeniedScreen] = useState(false);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0); // starts immediately at Q1
  const [isBooting, setIsBooting] = useState(false);

  const terminalEndRef = useRef(null);

  const allQuestions = [
    // 10 Selected Complex Questions
    { q: "Which squad member appears quiet and innocent to the outside world, but is completely different according to the BSA boys?", answers: ["ali", "ali hussnain", "meetha", "hussnain"] },
    { q: "Which member follows the strict sequence of first watching an anime, then reading its manga, and finally watching its live-action adaptation?", answers: ["taqi", "muhammad taqi", "shah g", "shahg"] },
    { q: "Which member's birthday celebration marked the exact moment when the BSA was created and everyone got together?", answers: ["abdullah", "muhammad abdullah", "amb"] },
    { q: "Jab wo room mein nahi hota, to sab kuch suna suna lagta hai—who is this positive energy source of BSA?", answers: ["abdullah", "muhammad abdullah", "amb"] },
    { q: "Whenever any rola or conflict occurs in university, whose name is somehow always at the top of the suspect list?", answers: ["qadeer", "muhammad qadeer", "grenade", "summit", "grenade/summit"] },
    { q: "Who is the squad's official Master Chef known for making an amazing Karahi?", answers: ["qadeer", "muhammad qadeer", "grenade", "summit", "grenade/summit"] },
    { q: "Which member would teach the entire syllabus right before exams, no matter the time, without ever expecting anything in return?", answers: ["haseeb", "muhammad haseeb", "rider"] },
    { q: "Who is the owner of the legendary red Suzuki Mehran who is always ready for any adventure and never says no to a plan?", answers: ["hammad khalil", "raja g", "raja", "hammad", "hammadk", "rajag"] },
    { q: "Who is the squad's genius in life discussions who always has a solution for everything, from studies to personal hassles?", answers: ["haris", "muhammad haris", "bawa"] },
    { q: "Which member has a mature and balanced personality, knowing exactly when to focus on career goals and when to enjoy hostel life with the boys?", answers: ["hammad abrar", "baba kuki", "buzurg", "hammad", "hammada", "kuki"] },

    // Nickname Trivia Questions
    { q: "Who is the squad member behind the nickname 'Meetha'?", answers: ["ali", "ali hussnain", "hussnain", "meetha"] },
    { q: "Who is the squad member behind the nickname 'Shah G'?", answers: ["taqi", "muhammad taqi", "shahg", "shah g"] },
    { q: "Who is the squad member behind the nickname 'AMB'?", answers: ["abdullah", "muhammad abdullah", "amb"] },
    { q: "Who is the squad member behind the nickname 'Grenade/Summit'?", answers: ["qadeer", "muhammad qadeer", "grenade", "summit", "grenade/summit"] },
    { q: "Who is the squad member behind the nickname 'Rider'?", answers: ["haseeb", "muhammad haseeb", "rider"] },
    { q: "Who is the squad member behind the nickname 'Raja G'?", answers: ["hammad khalil", "raja", "hammad", "hammadk", "rajag", "raja g"] },
    { q: "Who is the squad member behind the nickname 'Bawa'?", answers: ["haris", "muhammad haris", "bawa"] },
    { q: "Who is the squad member behind the nickname 'Buzurg'?", answers: ["hammad abrar", "kuki", "baba kuki", "buzurg", "hammad", "hammada"] }
  ];

  const [activeQuestions, setActiveQuestions] = useState([]);

  // Select 2 random questions on mount
  useEffect(() => {
    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
    setActiveQuestions(shuffled.slice(0, 2));
  }, []);

  // Auto-scroll terminal to bottom
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [terminalLogs]);

  // Initial terminal bootup logs when user clicks ATTEMPT DECRYPTION
  useEffect(() => {
    if (isUnlocked && terminalLogs.length === 0 && activeQuestions.length > 0) {
      setIsBooting(true);
      const bootLines = [
        "TERMINAL://BSA-MAINFRAME",
        "CLEARANCE_LEVEL: GUEST",
        "BSA SECURITY FRAMEWORK v4.2.0-BSA",
        "SYSTEM SECURITY CHECK: INITIALIZING...",
        "[WARNING] NODE SECURITY DETECTED: LEVEL 3 FIREWALL",
        "[STATUS] DECRYPTION ATTEMPT BLOCKED: Clearance Level Guest.",
        "--------------------------------------------------",
        "[SECURE VERIFICATION PROTOCOL INITIATED]",
        `SECURITY VERIFICATION 1/2: ${activeQuestions[0].q}`
      ];

      let lineIndex = 0;
      let charIndex = 0;

      // Start with an empty line
      setTerminalLogs([""]);

      const typingTimer = setInterval(() => {
        if (lineIndex < bootLines.length) {
          const currentLineText = bootLines[lineIndex];
          if (charIndex < currentLineText.length) {
            const nextChar = currentLineText[charIndex];
            setTerminalLogs((prev) => {
              const updated = [...prev];
              updated[updated.length - 1] = (updated[updated.length - 1] || "") + nextChar;
              return updated;
            });
            charIndex++;
          } else {
            // Move to next line
            lineIndex++;
            charIndex = 0;
            if (lineIndex < bootLines.length) {
              setTerminalLogs((prev) => [...prev, ""]);
            }
          }
        } else {
          // Finished typing all lines
          clearInterval(typingTimer);
          setIsBooting(false);
        }
      }, 12); // Fast and smooth 12ms character speed

      return () => clearInterval(typingTimer);
    }
  }, [isUnlocked, activeQuestions]);

  // Matrix keypress/tap listener to fill progress bar
  useEffect(() => {
    if (!showMatrix) return;
    const handleProgress = () => {
      setMatrixProgress((prev) => {
        const next = prev + Math.floor(Math.random() * 5) + 3;
        if (next >= 100) {
          setShowMatrix(false);
          setShowDeniedScreen(true);
          return 100;
        }
        return next;
      });
    };

    window.addEventListener("keydown", handleProgress);
    window.addEventListener("pointerdown", handleProgress);
    return () => {
      window.removeEventListener("keydown", handleProgress);
      window.removeEventListener("pointerdown", handleProgress);
    };
  }, [showMatrix]);

  const handleUnlockScreen = () => {
    setIsUnlocked(true);
  };

  const triggerFakeFailureLogs = () => {
    setTerminalLogs((prev) => [
      ...prev,
      ">> BRUTE FORCE BYPASS PROTOCOL COMPILED...",
      ">> ATTEMPTING OVERRIDE...",
      ">> ACCESS PORT 0x7E1D BYPASS: SUCCESS",
      ">> DECRYPTING CONFESSIONS VAULT...",
      "[FATAL] OVERRIDE BLOCKED BY CENTRAL ADMINISTRATOR.",
      "SYSTEM LOG: Vault locked down for administrative safety."
    ]);
    setTimeout(() => {
      setShowDeniedScreen(true);
    }, 2200);
  };

  const executeCommand = (cmd) => {
    const cleanCmd = cmd.trim().toLowerCase();
    if (!cleanCmd) return;

    setTerminalLogs((prev) => [...prev, `guest@bsa-mainframe:~$ ${cmd}`]);

    if (activeQuestions.length === 0) return;

    // Handle Question Answer inputs
    const currentQuestion = activeQuestions[activeQuestionIndex];
    if (currentQuestion.answers.includes(cleanCmd)) {
      if (activeQuestionIndex === activeQuestions.length - 1) {
        // All questions correct -> trigger fake override block
        setTerminalLogs((prev) => [
          ...prev,
          "CORRECT ANSWER. INITIATING FIREWALL OVERRIDE...",
          "DECRYPTING DATABASE FILES..."
        ]);
        triggerFakeFailureLogs();
      } else {
        // Next question
        const nextIndex = activeQuestionIndex + 1;
        setActiveQuestionIndex(nextIndex);
        setTerminalLogs((prev) => [
          ...prev,
          "CORRECT ANSWER. VERIFICATION STAGE 1: APPROVED.",
          "--------------------------------------------------",
          `SECURITY VERIFICATION 2/2: ${activeQuestions[nextIndex].q}`
        ]);
      }
    } else {
      // Failed!
      if (activeQuestionIndex === 0) {
        // Failed stage 1: replace Q1 with a new question (different from current Q1 and current Q2)
        const currentQ2Text = activeQuestions[1]?.q;
        const availablePool = allQuestions.filter(
          (q) => q.q !== currentQuestion.q && q.q !== currentQ2Text
        );
        const nextQ1 = availablePool[Math.floor(Math.random() * availablePool.length)];

        setActiveQuestions([nextQ1, activeQuestions[1]]);
        setTerminalLogs((prev) => [
          ...prev,
          "INVALID CRITERIA. SECURITY CHECK RESET.",
          "--------------------------------------------------",
          `SECURITY VERIFICATION 1/2: ${nextQ1.q}`
        ]);
      } else {
        // Failed stage 2: replace Q2 with a new question (different from current Q2 and current Q1)
        const currentQ1Text = activeQuestions[0]?.q;
        const availablePool = allQuestions.filter(
          (q) => q.q !== currentQuestion.q && q.q !== currentQ1Text
        );
        const nextQ2 = availablePool[Math.floor(Math.random() * availablePool.length)];

        setActiveQuestions([activeQuestions[0], nextQ2]);
        setTerminalLogs((prev) => [
          ...prev,
          "INVALID CRITERIA. RESETTING SECOND STAGE PROTOCOL...",
          "--------------------------------------------------",
          `SECURITY VERIFICATION 2/2: ${nextQ2.q}`
        ]);
      }
    }
    setInputVal("");
  };

  const handleInputSubmit = (e) => {
    e.preventDefault();
    executeCommand(inputVal);
  };

  return (
    <div className="confessions-container">
      {/* Styles for CRT terminal effects */}
      <style dangerouslySetInnerHTML={{__html: `
        .hacker-terminal {
          background: #000;
          border: 1px solid #00ff41;
          color: #00ff41;
          padding: 20px;
          border-radius: 6px;
          font-family: 'Courier New', Courier, monospace;
          max-width: 800px;
          width: 90%;
          min-height: 400px;
          max-height: 500px;
          display: flex;
          flex-direction: column;
          box-shadow: 0 0 20px rgba(0, 255, 65, 0.2);
          position: relative;
          overflow: hidden;
        }
        .hacker-terminal::before {
          content: " ";
          display: block;
          position: absolute;
          top: 0; left: 0; bottom: 0; right: 0;
          background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
          z-index: 2;
          background-size: 100% 2px, 3px 100%;
          pointer-events: none;
        }
        .terminal-header {
          display: flex;
          justify-content: space-between;
          border-bottom: 1px solid #00ff41;
          padding-bottom: 8px;
          margin-bottom: 12px;
          font-size: 0.85rem;
          opacity: 0.8;
        }
        .logs-area {
          flex: 1;
          overflow-y: auto;
          margin-bottom: 12px;
          text-shadow: 0 0 4px rgba(0,255,65,0.7);
          line-height: 1.4;
          font-size: 0.95rem;
        }
        .logs-area::-webkit-scrollbar {
          width: 8px;
        }
        .logs-area::-webkit-scrollbar-thumb {
          background: #00ff41;
          border-radius: 4px;
        }
        .input-prompt {
          display: flex;
          align-items: center;
          border-top: 1px solid rgba(0, 255, 65, 0.3);
          padding-top: 8px;
        }
        .terminal-input {
          background: transparent;
          border: none;
          color: #00ff41;
          outline: none;
          font-family: inherit;
          font-size: 1rem;
          flex: 1;
          margin-left: 8px;
        }
        .matrix-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: #000;
          z-index: 1000;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #00ff41;
          font-family: monospace;
        }
        .matrix-bar-container {
          width: 80%;
          max-width: 500px;
          height: 25px;
          border: 1px solid #00ff41;
          border-radius: 4px;
          overflow: hidden;
          margin-top: 20px;
          position: relative;
        }
        .matrix-bar {
          height: 100%;
          background: #00ff41;
          width: 0%;
          transition: width 0.1s ease;
        }
        .binary-rain {
          font-size: 1.5rem;
          opacity: 0.15;
          text-align: center;
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
          pointer-events: none;
          top: 0; left: 0;
        }
      `}} />

      {/* Falling Binary overlay during active matrix override */}
      <AnimatePresence>
        {showMatrix && (
          <motion.div 
            className="matrix-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="binary-rain">
              {Array.from({ length: 15 }).map((_, i) => (
                <div key={i} style={{ animation: `pulse 1.5s infinite ${i * 0.1}s` }}>
                  01101001 01101110 01110100 01110010 01110101 01100100 01100101 01110010
                </div>
              ))}
            </div>
            <h2>OVERRIDING MAINFRAME PROTOCOLS</h2>
            <p style={{ marginTop: "10px", fontSize: "0.9rem", opacity: 0.8 }}>
              RAPIDLY PRESS ANY KEY ON YOUR KEYBOARD TO OVERRIDE FIREWALL
            </p>
            <div className="matrix-bar-container">
              <div className="matrix-bar" style={{ width: `${matrixProgress}%` }} />
            </div>
            <p style={{ marginTop: "12px" }}>{matrixProgress}% Complete</p>
          </motion.div>
        )}
      </AnimatePresence>

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
            <h1 className="warning-title">BSA SECURE VAULT</h1>
            <p className="warning-text">
              WARNING: Entering this area exposes highly chaotic and deeply controversial activities. 
            </p>
            <button className="btn-gta btn-danger unlock-btn" style={{ padding: "12px 24px", fontSize: "0.95rem" }} onClick={handleUnlockScreen}>
              <Skull size={20} /> ATTEMPT DECRYPTION
            </button>
          </motion.div>
        ) : !showDeniedScreen ? (
          <motion.div 
            key="terminal"
            className="unlocked-content"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.8 }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}
          >
            <div className="hacker-terminal">
              <div className="terminal-header">
                <span>TERMINAL://BSA-MAINFRAME</span>
                <span>CLEARANCE_LEVEL: GUEST</span>
              </div>
              <div className="logs-area">
                {terminalLogs.map((log, index) => (
                  <div key={index} style={{ marginBottom: "6px" }}>{log}</div>
                ))}
                <div ref={terminalEndRef} />
              </div>

              {!isBooting ? (
                <form onSubmit={handleInputSubmit} className="input-prompt">
                  <span>guest@bsa-mainframe:~$</span>
                  <input 
                    type="text" 
                    className="terminal-input"
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    autoFocus
                    placeholder="Answer question here..."
                  />
                </form>
              ) : (
                <div className="input-prompt" style={{ opacity: 0.6 }}>
                  <span>guest@bsa-mainframe:~$ SYSTEM LOADING...</span>
                </div>
              )}
            </div>

            {/* Matrix Bypass Button on terminal side for keyboard-less mobile users */}
            <button 
              onClick={() => { setShowMatrix(true); setMatrixProgress(0); }} 
              className="btn-gta"
              style={{ 
                marginTop: "20px", 
                fontSize: "0.9rem", 
                padding: "10px 20px",
                borderColor: "#00ff41",
                color: "#00ff41",
                background: "rgba(0, 255, 65, 0.05)",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#00ff41";
                e.currentTarget.style.color = "#000";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(0, 255, 65, 0.05)";
                e.currentTarget.style.color = "#00ff41";
              }}
            >
              <Terminal size={16} style={{ marginRight: "6px", display: "inline-block", verticalAlign: "middle" }} /> Matrix Bypass (Tap Screen Hack)
            </button>
            
            <div className="disclaimer-footer" style={{ marginTop: "40px" }}>
              <p className="pulse-icon" style={{ color: "#ff2a5f", fontSize: "1.2rem", fontWeight: "bold", letterSpacing: "4px" }}>
                BSA SECURE MAIN CORE
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="denied-screen"
            className="unlocked-content"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", minHeight: "60vh" }}
          >
            <LockKeyhole size={60} color="#ff2a5f" className="pulse-icon" style={{ marginBottom: "20px" }} />
            
            <h1 className="glitch-text" data-text="ACCESS DENIED" style={{ fontSize: "3.5rem", color: "#ff2a5f", fontFamily: "var(--font-title)" }}>
              ACCESS DENIED
            </h1>
            
            <div className="warning-text" style={{ maxWidth: "700px", marginTop: "30px", fontSize: "1.2rem", color: "#fff" }}>
              <p style={{ marginBottom: "20px", color: "#ff2a5f", fontWeight: "bold", letterSpacing: "2px" }}>ERROR: SECURITY SHIELD PREVENTED OVERRIDE</p>
              
              <p style={{ fontStyle: "italic", color: "#ffaa00", fontSize: "1.3rem", lineHeight: "1.6", borderLeft: "4px solid #ffaa00", paddingLeft: "15px", textAlign: "left" }}>
                "Nice try! But degree haath mein aane tak in baaton ko locked hi rehne do, warna administration ne humein seedha farigh kar dena hai!"
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
