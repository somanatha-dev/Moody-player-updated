// About.jsx
export default function About() {
  return (
    <div className="container-narrow card-pane">
      <h1 className="page-title">About Moody Player</h1>

      <p className="lead">
        Moody Player is a lightweight, privacy-conscious music explorer that recommends
        tracks based on your facial expressions. It combines simple search with an
        emotion-aware recommendation experience so you can quickly find music that
        matches how you feel.
      </p>

      <h3 className="page-title" style={{ fontSize: 18 }}>Key Features</h3>
      <ul>
        <li>Detects facial expressions using on-device models and suggests matching songs.</li>
        <li>Search for songs with instant previews and add them to a persistent play queue.</li>
        <li>Local playback controls, per-track seek, and a global volume control for convenience.</li>
        <li>Designed for simplicity — minimal UI, responsive layout, and no unnecessary permissions.</li>
      </ul>

      <h3 className="page-title" style={{ fontSize: 18 }}>Privacy & Notes</h3>
      <p className="lead">
        Face detection runs locally in your browser (models are loaded from the app), and we
        do not send camera frames to any external service. The app may request network access
        to fetch song metadata and preview files when you search or request recommendations.
      </p>

      <h3 className="page-title" style={{ fontSize: 18 }}>Contributing</h3>
      <p className="lead">
        This project is open for improvements. If you'd like help with UI tweaks, model
        updates, or backend integrations, open an issue or submit a pull request on the repo.
      </p>
    </div>
  );
}
