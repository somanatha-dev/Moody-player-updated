import React, { useEffect, useRef } from "react";
import * as faceapi from "face-api.js";
import axios from "axios";
import "./FacialExpression.css";

export default function FacialExpression({ setSongs, setMood }) {
  const videoRef = useRef();

  // Detect mood from webcam and fetch songs
  async function detectMood() {
    try {
      const detections = await faceapi
        .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

      if (!detections || detections.length === 0) {
        console.log("No face detected");
        setMood("");
        setSongs([]);
        return;
      }

      // get expression with max probability
      let best = { name: "", prob: 0 };
      const exp = detections[0].expressions || {};
      Object.keys(exp).forEach((k) => {
        if (exp[k] > best.prob) best = { name: k, prob: exp[k] };
      });

      const expression = best.name || "neutral";
      setMood(expression);

      // Fetch songs for that mood
      const res = await axios.get(`http://localhost:3000/songs?mood=${expression}`);

      // Normalize any server shape to what MoodSongs expects
      const raw = Array.isArray(res?.data?.songs) ? res.data.songs : [];
      const normalized = raw.map((s, i) => ({
        title: s.title || s.name || s.song || `Track ${i + 1}`,
        artist: s.artist || s.artists || s.singer || "Unknown Artist",
        audio: s.audio || s.preview || s.url || "",
        image: s.image || s.img || s.cover || "",
      })).filter(x => x.audio); // keep only playable items

      setSongs(normalized);
    } catch (err) {
      console.error("Error detecting mood or fetching songs:", err);
      setSongs([]);
    }
  }

  useEffect(() => {
    const MODEL_URL = "/models";
    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
    };
    const startVideo = () => {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => (videoRef.current.srcObject = stream))
        .catch((err) => console.error("Error accessing webcam:", err));
    };
    loadModels().then(startVideo);
  }, []);

  return (
    <div className="panel camera-wrap">
      <div className="panel-header">
        <h3 className="section-title">Live Camera</h3>
        <button className="primary-btn" onClick={detectMood}>
          <i className="fa-solid fa-face-smile" style={{ marginRight: 8, color: "yellow" }} />
          Detect Mood
        </button>
      </div>

      <div className="live">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="user-video-feed"
        />
      </div>

      <div className="hint-row muted" style={{ marginTop: 8 }}>
        Tip: keep your face centered for best detection.
      </div>
    </div>
  );
}