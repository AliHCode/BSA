import React, { useEffect, useRef, useState } from 'react';

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

export default function QuotesGlobe() {
  const containerRef = useRef(null);
  const requestRef = useRef();
  
  // Create initial points on a sphere using Fibonacci spiral
  const [points, setPoints] = useState(() => {
    const pts = [];
    const n = quotes.length;
    const phi = Math.PI * (3 - Math.sqrt(5)); // golden angle
    
    for (let i = 0; i < n; i++) {
      const y = 1 - (i / (n - 1)) * 2; // y goes from 1 to -1
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phi * i;
      
      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;
      
      pts.push({ x, y, z, text: quotes[i] });
    }
    return pts;
  });

  const rotationRef = useRef({ rx: 0, ry: 0 });
  const targetRotationRef = useRef({ rx: 0.002, ry: 0.002 }); // default spin

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Calculate distance from center (-1 to 1)
      const dx = (e.clientX - centerX) / (rect.width / 2);
      const dy = (e.clientY - centerY) / (rect.height / 2);
      
      // Adjust target rotation based on mouse
      targetRotationRef.current.ry = dx * 0.02;
      targetRotationRef.current.rx = -dy * 0.02;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const updateRotation = () => {
      // Lerp current rotation towards target for smooth movement
      rotationRef.current.rx += (targetRotationRef.current.rx - rotationRef.current.rx) * 0.1;
      rotationRef.current.ry += (targetRotationRef.current.ry - rotationRef.current.ry) * 0.1;
      
      setPoints(prev => prev.map(p => {
        // Rotate around X axis
        let y1 = p.y * Math.cos(rotationRef.current.rx) - p.z * Math.sin(rotationRef.current.rx);
        let z1 = p.y * Math.sin(rotationRef.current.rx) + p.z * Math.cos(rotationRef.current.rx);
        
        // Rotate around Y axis
        let x2 = p.x * Math.cos(rotationRef.current.ry) + z1 * Math.sin(rotationRef.current.ry);
        let z2 = -p.x * Math.sin(rotationRef.current.ry) + z1 * Math.cos(rotationRef.current.ry);
        
        return { ...p, x: x2, y: y1, z: z2 };
      }));
      
      requestRef.current = requestAnimationFrame(updateRotation);
    };
    
    requestRef.current = requestAnimationFrame(updateRotation);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  return (
    <div ref={containerRef} className="quotes-globe">
      {points.map((p, i) => {
        const radius = typeof window !== 'undefined' && window.innerWidth < 768 ? 140 : 250;
        const x = p.x * radius;
        const y = p.y * radius;
        const z = p.z; // -1 to 1
        
        const scale = (z + 2) / 3; // 0.33 to 1
        const opacity = (z + 1.5) / 2.5; // 0.2 to 1
        
        return (
          <span 
            key={i}
            className="quote-item"
            style={{
              transform: `translate(-50%, -50%) translate(${x}px, ${y}px) scale(${scale})`,
              opacity: Math.max(0.1, opacity),
              zIndex: Math.round(z * 100),
            }}
          >
            {p.text}
          </span>
        );
      })}
    </div>
  );
}
