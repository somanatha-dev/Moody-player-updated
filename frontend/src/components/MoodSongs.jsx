import React, { useState, useRef, useEffect, useContext } from "react";
import { FiPlay, FiPause } from "react-icons/fi";
import "./MoodSongs.css";
import { PlayerContext } from "../App.jsx";

const moodEmoji = (m) =>
  ({
    happy: "😄",
    sad: "😕",
    neutral: "🙂",
    angry: "😡",
    surprised: "😮",
    disgusted: "🤢",
    fearful: "😨",
  }[m] || "🎵");

export default function MoodSongs({ Songs = [], mood }) {
  const [isPlaying, setIsPlaying] = useState(null);
  const audioRefs = useRef([]);
  const ctx = useContext(PlayerContext);
  const globalVolume = ctx?.volume ?? 0.85;
  const setGlobalVolume = ctx?.setVolume ?? (() => {});

  useEffect(() => {
    // helpful debug when running locally
    // eslint-disable-next-line no-console
    console.log("[MoodSongs] mood prop:", mood);
  }, [mood]);

  // Support different shapes (string or object) to be robust
  const resolvedMood = (() => {
    if (!mood) return "";
    if (typeof mood === "string") return mood.trim();
    if (typeof mood === "object") {
      return (mood.name || mood.expression || "").toString().trim();
    }
    return String(mood).trim();
  })();

  const handlePlayPause = (index) => {
    if (isPlaying === index) {
      audioRefs.current[index]?.pause();
      setIsPlaying(null);
    } else {
      if (isPlaying !== null) audioRefs.current[isPlaying]?.pause();
      audioRefs.current[index]?.play();
      setIsPlaying(index);
    }
  };

  // track time / duration per audio
  const [positions, setPositions] = useState([]);
  const [durations, setDurations] = useState([]);

  const onTimeUpdate = (index) => {
    const a = audioRefs.current[index];
    if (!a) return;
    // ensure audio element uses the global volume
    a.volume = globalVolume;
    setPositions((p) => {
      const copy = [...p];
      copy[index] = a.currentTime || 0;
      return copy;
    });
  };

  const onLoadedMeta = (index) => {
    const a = audioRefs.current[index];
    if (!a) return;
    a.volume = globalVolume;
    setDurations((d) => {
      const copy = [...d];
      copy[index] = a.duration || 0;
      return copy;
    });
  };

  const onSeek = (index, value) => {
    const a = audioRefs.current[index];
    if (!a) return;
    a.currentTime = Number(value);
    setPositions((p) => {
      const copy = [...p];
      copy[index] = Number(value);
      return copy;
    });
  };

  // Keep audio elements in sync when global volume changes
  useEffect(() => {
    audioRefs.current.forEach((a) => {
      if (a) a.volume = globalVolume;
    });
  }, [globalVolume]);

  return (
    <>
      <h3 className="section-title">Mood & Recommendations</h3>

      {/* Mood Badge */}
      <div className="mood-chip">
        <span className="mood-emoji">{moodEmoji(resolvedMood)}</span>
        <span className="mood-label">
          {resolvedMood ? resolvedMood[0].toUpperCase() + resolvedMood.slice(1) : "No mood detected"}
        </span>
      </div>

      {/* list-local volume control at bottom-right of the list container */}
      <div className="list-volume">
        <span><i className="fa-solid fa-volume-high" /></span>
        <input
          className="range list-range"
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={globalVolume}
          style={{ "--fill": `${globalVolume * 100}%` }}
          onChange={(e) => setGlobalVolume(Number(e.target.value))}
        />
      </div>

      {/* Songs List */}
      <div className="list">
        {Songs.length === 0 && (
          <p className="muted">Click “Detect Mood” to load recommendations.</p>
        )}

        {Songs.map((song, index) => (
          <div className="song-card" key={`${song.title}-${index}`}>
            {/* Cover (fallback to emoji) */}
            {song.image ? (
              <img src={song.image} alt={song.title} className="cover" />
            ) : (
              <div className="cover">{moodEmoji(mood)}</div>
            )}

            {/* Text */}
            <div className="meta">
              <div className="title">{song.title}</div>
              <div className="artist">{song.artist}</div>
            </div>

            {/* Player */}
            <div className="play-pause-button">
              <audio
                ref={(el) => (audioRefs.current[index] = el)}
                src={song.audio}
                onTimeUpdate={() => onTimeUpdate(index)}
                onLoadedMetadata={() => onLoadedMeta(index)}
                onEnded={() => setIsPlaying((s) => (s === index ? null : s))}
              />

              <div className="track-controls">
                <span className="track-time">{formatTime(positions[index] || 0)}</span>
                <input
                  className="track-range"
                  type="range"
                  min="0"
                  max={durations[index] || 0}
                  step="1"
                  value={Math.min(positions[index] || 0, durations[index] || 0)}
                  style={{ "--fill": `${durations[index] ? Math.min(100, ((positions[index] || 0) / durations[index]) * 100) : 0}%` }}
                  onChange={(e) => onSeek(index, e.target.value)}
                />
                <span className="track-time">{formatTime(durations[index] || 0)}</span>
              </div>

              <button className="icon-btn" onClick={() => handlePlayPause(index)} title="Play/Pause">
                {isPlaying === index ? <FiPause /> : <FiPlay />}
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function formatTime(s = 0) {
  const sec = Math.floor(s || 0);
  const m = Math.floor(sec / 60);
  const ss = sec % 60;
  return `${m}:${ss.toString().padStart(2, "0")}`;
}