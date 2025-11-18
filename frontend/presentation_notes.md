Moody Player — Presentation Notes

Use these notes as slide text and speaker cues. Each slide includes a short title, the bullet text to put on the slide, and speaker notes (what to say).

Slide 1 — Title
- Title (slide): Moody Player — Emotion-aware Music Discovery
- Subtitle: Privacy-first mood-based music recommendations in the browser

Speaker notes (30s):
- "Welcome. Moody Player recommends and plays music based on your facial expression. It runs face detection locally in the browser, fetches mood-tagged tracks from a lightweight backend, and provides instant previews with a persistent play queue."
- Emphasize the value proposition: immediate, personal, privacy-friendly recommendations.

Slide 2 — Problem & Use Case
- Slide bullets:
  - People want music that matches their current mood.
  - Browsing playlists is slow and manual.
  - Solution: detect mood and show matching tracks instantly.
- Use case highlight: "User stressed before a meeting — app suggests calming tracks immediately."

Speaker notes (45s):
- Describe the problem and paint the user story — low friction mood-based discovery.

Slide 3 — Workflow (6 steps)
- Slide bullets (6-step flow):
  1. User opens the app and navigates to the Mood page.
  2. Browser loads small face models and requests camera access.
  3. Client-side inference produces an expression label (e.g., happy).
  4. Frontend requests `GET /songs?mood=happy` from backend.
  5. Backend returns mood-tagged songs with audio URLs.
  6. User previews tracks, adds to queue, and uses the global player.

Speaker notes (60s):
- Walk through the flow and emphasize that face detection runs locally — no camera frames leave the device.

Slide 4 — Architecture (diagram)
- Slide content: embed the Mermaid diagram (file: architecture.mmd)

Speaker notes (60s):
- Explain components: Browser (App.jsx, FacialExpression, MoodSongs), local models (`/public/models`), Backend (Express routes), DB (MongoDB), and storage (ImageKit). Describe interactions briefly.

Slide 5 — Player Design
- Slide bullets:
  - Central player: `App.jsx` holds queue and a hidden `<audio>` used by the bottom ribbon.
  - Per-item previews for instant listening; synced to global volume.
  - `PlayerContext` exposes `addAndPlay`, `setQueueAndPlay`, `play`, `pause`, `seek`, etc.

Speaker notes (45s):
- Explain why central player: single source of truth for playback. Mention per-item audio convenience vs. duplication tradeoff.

Slide 6 — Model & Privacy
- Slide bullets:
  - Uses `face-api.js` + `@tensorflow/tfjs` for on-device inference.
  - Models stored in `public/models`, downloaded by the browser at runtime.
  - No camera frames are transmitted to the server.

Speaker notes (45s):
- Emphasize privacy advantage and reduced server ML cost.

Slide 7 — API & Data Contract
- Slide bullets:
  - `POST /songs` (multipart): upload audio + fields `title`, `artist`, `mood`; returns created song with `audio` URL.
  - `GET /songs?mood=<mood>`: returns songs matching mood.
  - Audio files are stored in ImageKit; DB stores metadata and `audio` URL.

Speaker notes (45s):
- Give a concrete example of requests and responses. Mention where to find code for these routes (`backend/src/routes/song.routes.js`).

Slide 8 — Current Limitations & Roadmap
- Slide bullets:
  - Current issues: memory-backed uploads (Multer), no auth, wide-open CORS, minimal input validation.
  - Short-term fixes: add validation + error handling, limit upload sizes, switch to disk/stream uploads.
  - Mid-term: auth, rate limiting, persistent user sessions, move previews to central player.

Speaker notes (45s):
- Be candid about risks and show prioritized improvements.

Slide 9 — Demo (script)
- Slide bullets:
  - Steps: open `/mood`, grant camera access, click Detect Mood, preview a suggested track, add to queue, navigate pages.

Speaker notes (60s):
- Run the demo. Mention DevTools console logs for debugging mood values (the app logs mood prop). If demo uses sample data, explain how to seed songs (backend POST /songs).

Slide 10 — Conclusion & Next Steps (strong close)
- Slide bullets:
  - Moody Player provides quick, private mood-aware music recommendations.
  - Value: reduces friction, supports wellness-focused listening, and integrates easily with existing music metadata.
  - Next steps: user testing for model accuracy, backend hardening, UX polish.

Speaker notes (30s):
- Reinforce the use case: "A user feeling anxious finds calming music instantly." Invite questions and propose next experiments.

Appendix — Demo setup commands (for presenter)

From project root (two services):

```bat
cd backend
npm install
set MONGODB_URL=<your-mongo-url>
set IMAGEKIT_PUBLIC_KEY=<key>
set IMAGEKIT_PRIVATE_KEY=<key>
set IMAGEKIT_URL_ENDPOINT=<endpoint>
node server.js

cd ..\frontend
npm install
npm run dev
```

Notes:
- If you want a quick demo without uploading real audio, seed the backend with test song documents that include public audio URLs (e.g., MP3s hosted elsewhere).
- Use the browser console to inspect `MoodSongs` log lines to see the detected mood prop.

Presenter tips
- Keep the demo short (1–2 minutes). Show the detection and one or two previews.
- On the architecture slide, point to the flow from model → label → API → queue.


End of notes — you can copy these directly into slide speaker notes, or I can convert them into a single `presentation.md` or into a slide deck format (PowerPoint) if you want.