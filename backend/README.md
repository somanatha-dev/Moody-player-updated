# Moody Player — Backend

This README explains how to run the backend, what each API endpoint does, which environment variables are required, and recommended improvements.

Quick start (Windows `cmd`)

1. Install dependencies:

```bat
cd backend
npm install
```

2. Create a `.env` file in `backend/` with the required variables (see below).

3. Start the server:

```bat
node server.js
```

The server will listen on port `3000` by default (see `server.js`).

Required environment variables

- `MONGODB_URL` — MongoDB connection string used by Mongoose.
- `IMAGEKIT_PUBLIC_KEY` — ImageKit public key (for uploading files).
- `IMAGEKIT_PRIVATE_KEY` — ImageKit private key.
- `IMAGEKIT_URL_ENDPOINT` — ImageKit URL endpoint.

API endpoints (current implementation)

- POST /songs
  - Purpose: upload a new song (audio file) and store metadata.
  - Request: multipart/form-data with fields:
    - `title` (string)
    - `artist` (string)
    - `mood` (string)
    - `audio` (file)
  - Response (success): 201 JSON `{ message: "Song Creates Successfully", song: { ... } }`

- GET /songs?mood={mood}
  - Purpose: return an array of songs filtered by `mood`.
  - Response: 200 JSON `{ message: "Songs fetched success", songs: [ ... ] }`

Where files are uploaded

- Uploaded audio files are sent to ImageKit using the `imagekit` SDK. The returned `url` is saved in the `audio` field of the song document.

Notes & current limitations

- Multer is configured with `memoryStorage` (files are buffered in memory before upload). This is simple but can cause high memory usage for large files.
- There is minimal input validation and not all errors are handled gracefully (some routes do not use try/catch). Add validation and robust error handling.
- CORS is enabled for all origins (`app.use(cors())`). Lock this down for production.
- No authentication: endpoints are currently open to anyone who can reach the server.

Recommended next steps (short-term prioritization)

1. Add input validation and explicit error handling (try/catch) in routes.
2. Limit upload size in Multer (`limits.fileSize`) and consider using `diskStorage` or streaming to storage to avoid buffering large files.
3. Add authentication/authorization if uploads should be restricted.
4. Harden Mongoose schema: mark required fields and add `timestamps`, plus indexes on `mood`.
5. Add logging (morgan) and error monitoring (Sentry or similar).
6. Add a `start` script and optionally `dev` script with `nodemon` in `package.json`.

Developer notes

- Entry point: `server.js` (connects DB and starts the Express app imported from `src/app.js`).
- The app registers routes from `src/routes/song.routes.js` where upload and fetch logic lives.
- Storage integration is implemented in `src/service/storage.service.js` (ImageKit wrapper).
- Data model is `src/models/song.model.js` (Mongoose schema).

If you want, I can implement one of the recommended improvements (add validation + error handling, switch to disk storage for uploads, or add a `start/dev` script). Which should I do next?