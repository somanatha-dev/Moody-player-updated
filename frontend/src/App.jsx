import { useMemo, useRef, useState, useEffect, createContext } from "react";
import { Routes, Route, NavLink, useLocation } from "react-router-dom";
import SearchPage from "./pages/Search.jsx";
import FacialExpression from "./components/FacialExpression.jsx";
import MoodSongs from "./components/MoodSongs.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import TopSongs from "./pages/TopSongs.jsx";
import "./styles.css";
import "regenerator-runtime/runtime"; // for parcel support

export const PlayerContext = createContext(null);

export default function App() {
  const audioRef = useRef(null);
  const location = useLocation();

  // ================= Player state =================
  const [queue, setQueue] = useState([]);
  const [index, setIndex] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [volume, setVolume] = useState(0.85);

  // ================= Moody page state =================
  const [mood, setMood] = useState("");
  const [Songs, setSongs] = useState([]);

  // Route helpers (compute AFTER state is defined)
  const isMood = location.pathname === "/mood";
  const showPlayer = !isMood && queue.length > 0;

  // Volume -> element
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  // Switch track
  useEffect(() => {
    if (!audioRef.current || index < 0 || index >= queue.length) return;
    audioRef.current.src = queue[index].preview || "";
    audioRef.current
      .play()
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false));
  }, [index, queue]);

  const onEnded = () => {
    if (repeat) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      return;
    }
    if (index < queue.length - 1) setIndex(index + 1);
    else setPlaying(false);
  };

  const controls = useMemo(
    () => ({
      addAndPlay(track) {
        const i = queue.findIndex((t) => t.id === track.id);
        if (i >= 0) setIndex(i);
        else {
          const q = [...queue, track];
          setQueue(q);
          setIndex(q.length - 1);
        }
      },
      setQueueAndPlay(list, at = 0) {
        setQueue(list);
        setIndex(at);
      },
      play() {
        audioRef.current?.play();
        setPlaying(true);
      },
      pause() {
        audioRef.current?.pause();
        setPlaying(false);
      },
      next() {
        if (index < queue.length - 1) setIndex(index + 1);
      },
      prev() {
        if (index > 0) setIndex(index - 1);
      },
      seek(s) {
        if (audioRef.current) audioRef.current.currentTime = s;
      },
      clear() {
        if (audioRef.current) audioRef.current.src = "";
        setPlaying(false);
        setQueue([]);
        setIndex(-1);
      },
    }),
    [index, queue]
  );

  // Stop player on /mood
  useEffect(() => {
    if (isMood) {
      // Pause playback while on the Moody Player page, but keep queue/mood intact
      audioRef.current?.pause();
      setPlaying(false);
    }
  }, [isMood]);

  const ctx = useMemo(
    () => ({
      queue,
      index,
      playing,
      repeat,
      volume,
      setQueue,
      setIndex,
      setPlaying,
      setRepeat,
      setVolume,
      controls,
    }),
    [queue, index, playing, repeat, volume, controls]
  );

  return (
    <PlayerContext.Provider value={ctx}>
      <div className="app-shell">
        {/* ===== NAVBAR ===== */}
        <nav className="nav-dark">
          <div className="brand-plain">Moody Player</div>
          <div className="nav-links">
            <NavLink className="nav-link" to="/">Home</NavLink>
            <NavLink className="nav-link" to="/about">About</NavLink>
            <NavLink className="nav-link" to="/contact">Contact</NavLink>
            <NavLink className="nav-link" to="/top">Top Songs</NavLink>
            <NavLink className="nav-link strong" to="/mood">Moody Player</NavLink>
          </div>
        </nav>

        {/* ===== PAGE WRAP (adds .mood-page class only on /mood) ===== */}
        <div className={`page-wrap ${isMood ? "mood-page" : ""}`}>
          <Routes>
            {/* Moody Player route (NO nested page-wrap here) */}
            <Route
              path="/mood"
              element={
                <div className="content" style={{ gridTemplateColumns: "1.15fr .85fr" }}>
                  {/* Left column */}
                  <FacialExpression setSongs={setSongs} setMood={setMood} />
                  {/* Right column */}
                    <div className="panel right-col">
                      <MoodSongs Songs={Songs} mood={mood} />
                    </div>
                </div>
              }
            />

            {/* Regular pages */}
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/top" element={<TopSongs />} />
            <Route path="*" element={<SearchPage />} />
          </Routes>
        </div>

        {/* ===== BOTTOM RIBBON PLAYER (hidden on /mood) ===== */}
        {showPlayer && (
          <div className="player-bar">
            <div className="now">
              {queue[index]?.image ? (
                <img
                  className="cover-mini-img"
                  src={queue[index].image}
                  alt={`${queue[index].name} cover`}
                  loading="eager"
                />
              ) : (
                <div className="cover-mini">🎵</div>
              )}
              <div className="now-meta">
                <div className="now-title">{queue[index]?.name || "Nothing playing"}</div>
                <div className="now-artist">{queue[index]?.artists || ""}</div>
              </div>
            </div>

            <div className="controls">
              <button className="control" onClick={controls.prev} disabled={index <= 0}>
                <i className="fa-solid fa-backward" style={{ color: "#ffffff" }} />
              </button>

              {playing ? (
                <button className="control" onClick={controls.pause}>
                  <i className="fa-solid fa-circle-pause" style={{ color: "#1cb050" }} />
                </button>
              ) : (
                <button className="control" onClick={controls.play}>
                  <i className="fa-solid fa-circle-play" style={{ color: "#1cb050" }} />
                </button>
              )}

              <button className="control" onClick={controls.next} disabled={index >= queue.length - 1}>
                <i className="fa-solid fa-forward" style={{ color: "#ffffff" }} />
              </button>

              <button
                className={`control ${repeat ? "active" : ""}`}
                onClick={() => setRepeat((r) => !r)}
                title="Repeat current"
              >
                <i className="fa-solid fa-repeat" />
              </button>
            </div>

            <PlayerTimeline audioRef={audioRef} onSeek={controls.seek} />

            <div className="volume">
              <span><i className="fa-solid fa-volume-high" /></span>
              <input
                className="range"
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                style={{ "--fill": `${volume * 100}%` }}
                onChange={(e) => setVolume(Number(e.target.value))}
              />
            </div>
          </div>
        )}

        {/* Hidden native audio element */}
        <audio
          ref={audioRef}
          onEnded={onEnded}
          onLoadedMetadata={() => {}}
          style={{ display: "none" }}
        />
        {/* removed fixed global volume — panel-local control handles volume on /mood */}
      </div>
    </PlayerContext.Provider>
  );
}

function PlayerTimeline({ audioRef, onSeek }) {
  const [pos, setPos] = useState(0);
  const [dur, setDur] = useState(0);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onTime = () => setPos(a.currentTime || 0);
    const onMeta = () => setDur(a.duration || 0);
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("loadedmetadata", onMeta);
    return () => {
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("loadedmetadata", onMeta);
    };
  }, [audioRef]);

  const pct = dur ? Math.min(100, (pos / dur) * 100) : 0;

  const fmt = (s = 0) => {
    const m = Math.floor(s / 60);
    const ss = Math.floor(s % 60);
    return `${m}:${ss.toString().padStart(2, "0")}`;
  };

  return (
    <div className="timeline">
      <span className="time">{fmt(pos)}</span>
      <input
        className="range"
        type="range"
        min="0"
        max={dur || 0}
        step="1"
        value={Math.min(pos, dur || 0)}
        style={{ "--fill": `${pct}%` }}
        onChange={(e) => onSeek(Number(e.target.value))}
      />
      <span className="time">{fmt(dur || 0)}</span>
    </div>
  );
}