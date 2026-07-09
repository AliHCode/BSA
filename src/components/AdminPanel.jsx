import React, { useState, useEffect, useRef } from "react";
import { Upload, X, Image as ImageIcon, Video, Home, Scissors } from "lucide-react";
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import initialMemories from "../data/memories.json";

export default function AdminPanel({ onBackClick }) {
  const [memories, setMemories] = useState(initialMemories);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadCaption, setUploadCaption] = useState("");
  const [uploadPosX, setUploadPosX] = useState(50);
  const [uploadPosY, setUploadPosY] = useState(50);
  const [isUploading, setIsUploading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCaption, setEditCaption] = useState("");
  const [editPosX, setEditPosX] = useState(50);
  const [editPosY, setEditPosY] = useState(50);

  const [showVideoEditor, setShowVideoEditor] = useState(false);
  const [trimStart, setTrimStart] = useState("");
  const [trimEnd, setTrimEnd] = useState("");
  const [muteVideo, setMuteVideo] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const ffmpegRef = useRef(new FFmpeg());

  const handleLogin = () => {
    // A simple hardcoded password for local protection
    if (passwordInput === "room235") {
      setIsAuthenticated(true);
      setErrorMsg("");
    } else {
      setErrorMsg("Incorrect Password!");
    }
  };

  const handleUpload = async () => {
    if (!uploadFile || (!uploadTitle && !uploadCaption)) return;
    setIsUploading(true);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Data = reader.result;
      const fileType = uploadFile.type.startsWith("video") ? "video" : "image";
      const fileName = uploadFile.name;

      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileName, fileType, base64Data, caption: uploadCaption, title: uploadTitle, posX: uploadPosX, posY: uploadPosY })
        });

        const data = await response.json();
        if (data.success) {
          setMemories(prev => [...prev, data.memory]);
          setUploadFile(null);
          setUploadCaption("");
          setUploadTitle("");
          setUploadPosX(50);
          setUploadPosY(50);
          alert("Memory successfully added! It will now appear on the public Story board.");
        }
      } catch (err) {
        console.error("Upload failed", err);
        alert("Failed to upload memory.");
      } finally {
        setIsUploading(false);
      }
    };
    reader.readAsDataURL(uploadFile);
  };

  const handleProcessVideo = async () => {
    if (!uploadFile) return;
    setIsProcessing(true);
    try {
      const ffmpeg = ffmpegRef.current;
      if (!ffmpeg.loaded) {
        // Load default from unpkg
        await ffmpeg.load();
      }

      const inputName = 'input.mp4';
      await ffmpeg.writeFile(inputName, await fetchFile(uploadFile));

      const args = ['-i', inputName];
      if (trimStart && !isNaN(trimStart)) {
        args.push('-ss', String(trimStart));
      }
      if (trimEnd && !isNaN(trimEnd)) {
        args.push('-to', String(trimEnd));
      }
      if (muteVideo) {
        args.push('-an');
      }
      args.push('-c', 'copy');
      args.push('output.mp4');

      await ffmpeg.exec(args);
      const data = await ffmpeg.readFile('output.mp4');
      
      const newFile = new File([data.buffer], `edited_${uploadFile.name}`, { type: 'video/mp4' });
      setUploadFile(newFile);
      setShowVideoEditor(false);
      setTrimStart("");
      setTrimEnd("");
      setMuteVideo(false);
      alert("Video processed successfully! You can now upload it.");
    } catch (err) {
      console.error(err);
      alert("Failed to process video. See console for details.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this memory?")) return;
    try {
      const response = await fetch("/api/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      const data = await response.json();
      if (data.success) {
        setMemories(prev => prev.filter(m => m.id !== id));
      } else {
        alert("Delete failed.");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting.");
    }
  };

  const handleStartEdit = (memory) => {
    setEditingId(memory.id);
    // Backward compatibility: If there's no title but there is a caption, the caption was originally the title.
    if (!memory.title && memory.caption) {
      setEditTitle(memory.caption);
      setEditCaption("");
    } else {
      setEditTitle(memory.title || "");
      setEditCaption(memory.caption || "");
    }
    setEditPosX(memory.posX !== undefined ? memory.posX : 50);
    setEditPosY(memory.posY !== undefined ? memory.posY : 50);
  };

  const handleSaveEdit = async (id) => {
    try {
      const response = await fetch("/api/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, title: editTitle, caption: editCaption, posX: editPosX, posY: editPosY })
      });
      const data = await response.json();
      if (data.success) {
        setMemories(prev => prev.map(m => m.id === id ? { ...m, title: editTitle, caption: editCaption, posX: editPosX, posY: editPosY } : m));
        setEditingId(null);
      } else {
        alert("Update failed.");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating.");
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "var(--bg-dark)" }}>
        <div style={{ background: "#111", padding: "40px", borderRadius: "8px", border: "1px solid #333", textAlign: "center", width: "100%", maxWidth: "350px" }}>
          <h2 style={{ fontFamily: "var(--font-title)", color: "var(--color-accent)", marginBottom: "20px", textTransform: "uppercase" }}>Admin Access</h2>
          <input 
            type="password" 
            placeholder="Enter Password" 
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            style={{ width: "100%", padding: "12px", background: "#000", border: "1px solid #333", color: "#fff", borderRadius: "4px", marginBottom: "15px", outline: "none", fontFamily: "var(--font-body)" }}
          />
          {errorMsg && <p style={{ color: "#ff2a5f", fontSize: "0.8rem", marginBottom: "15px" }}>{errorMsg}</p>}
          <button onClick={handleLogin} className="btn-gta" style={{ width: "100%", padding: "12px", borderColor: "var(--color-accent)" }}>LOGIN</button>
          <button onClick={onBackClick} style={{ marginTop: "20px", background: "transparent", color: "var(--text-gray)", border: "none", cursor: "pointer", fontSize: "0.8rem" }}>Cancel & Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px", minHeight: "100vh", background: "var(--bg-dark)", color: "#fff", fontFamily: "var(--font-body)" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px", borderBottom: "1px solid #333", paddingBottom: "20px" }}>
        <h1 style={{ fontFamily: "var(--font-title)", color: "var(--color-accent)", fontSize: "2rem" }}>BSA ADMIN STUDIO</h1>
        <button className="btn-gta" onClick={onBackClick} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Home size={16} /> Exit Admin
        </button>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "40px" }}>
        {/* Upload Form Area */}
        <div style={{ background: "#111", padding: "30px", borderRadius: "8px", border: "1px solid #333", height: "fit-content" }}>
          <h3 style={{ fontFamily: "var(--font-title)", color: "#fff", marginBottom: "20px", fontSize: "1.2rem" }}>ADD NEW MEMORY</h3>
          
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", color: "var(--text-gray)", fontSize: "0.85rem", marginBottom: "8px", textTransform: "uppercase" }}>Select File (Image/Video)</label>
            <input 
              type="file" 
              accept="image/*,video/*"
              onChange={(e) => setUploadFile(e.target.files[0])}
              style={{ width: "100%", padding: "10px", background: "#000", border: "1px solid #333", color: "#fff", borderRadius: "4px" }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", color: "var(--text-gray)", fontSize: "0.85rem", marginBottom: "8px", textTransform: "uppercase" }}>Title</label>
            <input 
              type="text" 
              placeholder="e.g. The Finale"
              value={uploadTitle}
              onChange={(e) => setUploadTitle(e.target.value)}
              style={{ width: "100%", padding: "12px", background: "#000", border: "1px solid #333", color: "#fff", borderRadius: "4px", outline: "none", fontFamily: "var(--font-body)" }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", color: "var(--text-gray)", fontSize: "0.85rem", marginBottom: "8px", textTransform: "uppercase" }}>Description</label>
            <input 
              type="text" 
              placeholder="e.g. Mehran Drifting at 2 AM..."
              value={uploadCaption}
              onChange={(e) => setUploadCaption(e.target.value)}
              style={{ width: "100%", padding: "12px", background: "#000", border: "1px solid #333", color: "#fff", borderRadius: "4px", outline: "none", fontFamily: "var(--font-body)" }}
            />
          </div>

          <div style={{ marginBottom: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
            <div>
              <label style={{ display: "block", color: "var(--text-gray)", fontSize: "0.75rem", marginBottom: "4px" }}>Thumbnail X-Pos ({uploadPosX}%)</label>
              <input type="range" min="0" max="100" value={uploadPosX} onChange={(e) => setUploadPosX(e.target.value)} style={{ width: "100%" }} />
            </div>
            <div>
              <label style={{ display: "block", color: "var(--text-gray)", fontSize: "0.75rem", marginBottom: "4px" }}>Thumbnail Y-Pos ({uploadPosY}%)</label>
              <input type="range" min="0" max="100" value={uploadPosY} onChange={(e) => setUploadPosY(e.target.value)} style={{ width: "100%" }} />
            </div>
          </div>

          {uploadFile && uploadFile.type.startsWith("video") && (
            <div style={{ marginBottom: "20px", background: "#1a1a24", padding: "15px", borderRadius: "4px", border: "1px solid #333" }}>
              <button 
                onClick={() => setShowVideoEditor(!showVideoEditor)}
                className="btn-gta"
                style={{ width: "100%", padding: "10px", fontSize: "0.8rem", display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", borderColor: "#444", marginBottom: showVideoEditor ? "15px" : "0" }}
              >
                <Scissors size={14} /> {showVideoEditor ? "Hide Video Editor" : "Edit Video (Trim/Mute)"}
              </button>

              {showVideoEditor && (
                <div>
                  <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: "0.75rem", color: "#aaa" }}>Start Time (sec)</label>
                      <input type="number" value={trimStart} onChange={e => setTrimStart(e.target.value)} placeholder="0" style={{ width: "100%", padding: "8px", background: "#000", border: "1px solid #333", color: "#fff", borderRadius: "4px" }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: "0.75rem", color: "#aaa" }}>End Time (sec)</label>
                      <input type="number" value={trimEnd} onChange={e => setTrimEnd(e.target.value)} placeholder="End" style={{ width: "100%", padding: "8px", background: "#000", border: "1px solid #333", color: "#fff", borderRadius: "4px" }} />
                    </div>
                  </div>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem", cursor: "pointer", marginBottom: "15px" }}>
                    <input type="checkbox" checked={muteVideo} onChange={e => setMuteVideo(e.target.checked)} /> Mute Video (Remove Audio)
                  </label>
                  <button 
                    onClick={handleProcessVideo} 
                    disabled={isProcessing}
                    style={{ width: "100%", padding: "10px", background: isProcessing ? "#555" : "var(--color-accent)", color: "#000", border: "none", borderRadius: "4px", fontWeight: "bold", cursor: isProcessing ? "not-allowed" : "pointer" }}
                  >
                    {isProcessing ? "Processing Video..." : "Apply Changes"}
                  </button>
                  <p style={{ fontSize: "0.7rem", color: "#777", marginTop: "10px", textAlign: "center" }}>Trimming uses browser memory. Best for short clips.</p>
                </div>
              )}
            </div>
          )}

          <button 
            className="btn-gta" 
            onClick={handleUpload}
            disabled={isUploading || !uploadFile || (!uploadTitle && !uploadCaption)}
            style={{ width: "100%", padding: "15px", display: "flex", justifyContent: "center", alignItems: "center", opacity: (!uploadFile || (!uploadTitle && !uploadCaption)) ? 0.5 : 1, borderColor: "var(--color-accent)" }}
          >
            {isUploading ? "UPLOADING..." : <><Upload size={16} style={{ marginRight: "8px" }} /> UPLOAD TO BOARD</>}
          </button>
        </div>

        {/* Preview Gallery Area */}
        <div>
          <h3 style={{ fontFamily: "var(--font-title)", color: "#fff", marginBottom: "20px", fontSize: "1.2rem", display: "flex", justifyContent: "space-between" }}>
            EXISTING MEMORIES ({memories.length})
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "20px" }}>
            {memories.map((item, idx) => (
              <div key={idx} style={{ background: "#111", border: "1px solid #333", borderRadius: "6px", overflow: "hidden", position: "relative" }}>
                <div style={{ aspectRatio: "1/1", background: "#000", position: "relative" }}>
                  {item.type === "video" ? (
                    <video src={item.src} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: `${editingId === item.id ? editPosX : (item.posX !== undefined ? item.posX : 50)}% ${editingId === item.id ? editPosY : (item.posY !== undefined ? item.posY : 50)}%`, opacity: 0.8 }} />
                  ) : (
                    <img src={item.src} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: `${editingId === item.id ? editPosX : (item.posX !== undefined ? item.posX : 50)}% ${editingId === item.id ? editPosY : (item.posY !== undefined ? item.posY : 50)}%`, opacity: 0.8 }} />
                  )}
                  <div style={{ position: "absolute", top: "8px", right: "8px", background: "rgba(0,0,0,0.7)", padding: "4px 8px", borderRadius: "4px", fontSize: "0.7rem", color: "var(--color-accent)", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "4px" }}>
                    {item.type === "video" ? <Video size={12}/> : <ImageIcon size={12}/>} {item.type}
                  </div>
                </div>
                <div style={{ padding: "12px", fontSize: "0.85rem", color: "#ccc" }}>
                  {editingId === item.id ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <input 
                        type="text" value={editTitle} onChange={e => setEditTitle(e.target.value)} 
                        placeholder="Title..."
                        style={{ padding: "6px", background: "#000", color: "#fff", border: "1px solid #333", borderRadius: "4px" }}
                      />
                      <input 
                        type="text" value={editCaption} onChange={e => setEditCaption(e.target.value)} 
                        placeholder="Description..."
                        style={{ padding: "6px", background: "#000", color: "#fff", border: "1px solid #333", borderRadius: "4px" }}
                      />
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "4px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <label style={{ fontSize: "0.7rem", color: "#888", width: "15px" }}>X:</label>
                          <input type="range" min="0" max="100" value={editPosX} onChange={(e) => setEditPosX(e.target.value)} style={{ flex: 1 }} />
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <label style={{ fontSize: "0.7rem", color: "#888", width: "15px" }}>Y:</label>
                          <input type="range" min="0" max="100" value={editPosY} onChange={(e) => setEditPosY(e.target.value)} style={{ flex: 1 }} />
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
                        <button onClick={() => handleSaveEdit(item.id)} style={{ flex: 1, padding: "6px", background: "var(--color-accent)", color: "#000", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>Save</button>
                        <button onClick={() => setEditingId(null)} style={{ flex: 1, padding: "6px", background: "#333", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div style={{ fontWeight: "bold", color: "#fff", marginBottom: "4px" }}>
                        {item.title || item.caption || "Untitled"}
                      </div>
                      <div style={{ marginBottom: "12px" }}>
                        {item.title ? (item.caption || "No description") : "No description"}
                      </div>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button onClick={() => handleStartEdit(item)} style={{ flex: 1, padding: "6px", background: "#222", color: "#fff", border: "1px solid #444", borderRadius: "4px", cursor: "pointer", fontSize: "0.75rem" }}>Edit</button>
                        <button onClick={() => handleDelete(item.id)} style={{ flex: 1, padding: "6px", background: "#ff2a5f", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "0.75rem" }}>Delete</button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
