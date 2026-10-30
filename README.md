# Cartesia Voice Studio

## Run locally
1. Install Node.js 18+ (Node 20 recommended).
2. Extract the ZIP and open a terminal in this folder.
3. Run `npm install`.
4. Copy `.env.example` to `.env`.
5. Add your Cartesia API key and default voice ID to `.env`.
6. Run `npm start` and open `http://localhost:3000`.

The UI also accepts a Voice ID. Never put your API key in frontend HTML/JavaScript or a public repository.

## Deploy
Deploy this Node app to a Node host such as Render, Railway, or a VPS. Add `CARTESIA_API_KEY` and optionally `CARTESIA_VOICE_ID` as server environment variables. If your current website is on Netlify, host this backend separately and point the frontend fetch URL to its HTTPS API; configure CORS for your domain.

Uses Cartesia `POST /tts/bytes`, model `sonic-3.6`, `generation_config` emotion/speed/volume, WAV output, and `Cartesia-Version: 2026-03-01`. Speed range 0.6–1.5; volume 0.5–2.0. Check your Cartesia account for voice/language availability and billing.
