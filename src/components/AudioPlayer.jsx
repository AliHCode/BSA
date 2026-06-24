import React, { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX } from "lucide-react";

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // Streaming lo-fi synthwave track as fallback, local file as primary if loaded
  const audioSource = "/audio/background.mp3"; 
  const fallbackSource = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3";

  useEffect(() => {
    // Instantiate audio
    const audio = new Audio(audioSource);
    audio.loop = true;
    audio.volume = 0.4;
    audioRef.current = audio;

    // Handle potential error if local file does not exist, fall back to streaming
    const handleError = () => {
      console.log("Local audio file not found. Falling back to streaming lo-fi audio.");
      if (audioRef.current) {
        audioRef.current.src = fallbackSource;
        if (isPlaying) {
          audioRef.current.play().catch(e => console.log("Audio play blocked by browser."));
        }
      }
    };

    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("error", handleError);
      audio.pause();
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.error("Playback failed: ", err);
          // Try loading fallback immediately if play fails on local file path
          audioRef.current.src = fallbackSource;
          audioRef.current.play()
            .then(() => setIsPlaying(true))
            .catch(e => console.log("Playback blocked: user must interact first."));
        });
    }
  };

  return (
    <button 
      onClick={togglePlay} 
      className="audio-player-btn"
      title={isPlaying ? "Mute Music" : "Play Music"}
      aria-label="Toggle background music"
    >
      {isPlaying ? <Volume2 size={18} className="text-cyan" /> : <VolumeX size={18} className="text-gray" />}
      <span>{isPlaying ? "MUSIC ON" : "MUSIC OFF"}</span>
      
      {/* Equalizer animation */}
      <div className="equalizer">
        <div className={`eq-bar ${isPlaying ? "active" : ""}`} />
        <div className={`eq-bar ${isPlaying ? "active" : ""}`} />
        <div className={`eq-bar ${isPlaying ? "active" : ""}`} />
        <div className={`eq-bar ${isPlaying ? "active" : ""}`} />
      </div>
    </button>
  );
}
