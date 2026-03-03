# AGENTS.md

## Cursor Cloud specific instructions

This is a frontend-only Vite + React + Tailwind CSS marketing website ("Воздух НСК"). There is no backend, database, or test framework.

### Running the app

- `npm run dev` — starts the Vite dev server on port **5173** with HMR.
- `npm run build` — production build to `dist/`.
- `npm run preview` — preview the production build.

### Environment variables (optional)

Create a `.env` file in the repo root. Both are optional; the app degrades gracefully without them:

- `VITE_LEAD_API` — URL for the lead/contact form backend.
- `VITE_GEMINI_API_KEY` — Google Gemini API key for the AI chat assistant feature.

### Notes

- No lockfile is committed; `npm install` generates `package-lock.json` locally.
- No linting or test tooling is configured in this project.
- The entire application lives in `src/App.jsx` (~1600 lines).
- Images are loaded from Unsplash CDN, so internet access is required for full rendering.
