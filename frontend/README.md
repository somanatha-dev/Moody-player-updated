# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.
Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
```

# Moody Player — Frontend

This README summarizes how to run the frontend locally, the high-level architecture, and where to find the main code areas.
Quick start

1. Install dependencies:

```bat
cd frontend
npm install
```

2. Run the dev server:

```bat
npm run dev
```

Open http://localhost:5173 (Vite default) to view the app.

What this folder contains (developer view)

- `index.html` — app HTML shell (Vite injects scripts during dev/build).
- `src/main.jsx` — React bootstrap; mounts `App` inside the DOM and wraps it with the router.
- `src/App.jsx` — App shell, routing, and the `PlayerContext` (global player state + controls).
- `src/styles.css` — Global stylesheet used across the app (theme, layout, player ribbon).

Components & pages

- `src/components/FacialExpression.jsx` — Camera / face-expression detection UI. Loads face models from `/public/models` and triggers mood-based recommendations.
- `src/components/MoodSongs.jsx` — Shows mood-based recommendations and per-track controls. Integrates with global volume via `PlayerContext`.
- `src/components/SearchPanel.jsx` — Search input and small UI used on the home page.
- `src/components/*.css` — Component-scoped styles for the corresponding components.
- `src/pages/*.jsx` — Page-level entry points (Search, TopSongs, About, Contact).

Static assets

- `public/models/*` — Pre-trained face-api models loaded by the camera UI.

Developer notes

- The global player lives in `App.jsx` as a hidden `<audio>` with a `queue` and `controls` API exposed via `PlayerContext`.
- Face detection runs client-side using `face-api.js` and `@tensorflow/tfjs`; models are downloaded at runtime.
- Backend APIs (song upload/fetch) are expected at `http://localhost:3000` (see backend README).

Suggested next improvements

- Persist player queue and volume to `localStorage` to survive page reloads.
- Centralize per-item playback to the main player (avoid parallel audio elements).
- Add tests and linter scripts if not already present.

---

If you want, I can also create a short architecture diagram or extend this README with component-level development notes.

```
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
