## Cursor Cloud specific instructions

This is a Vite + React + Tailwind CSS single-page application for an HVAC company ("Воздух НСК"). There is no backend — the frontend is fully stateless.

### Services

| Service | Command | Port | Notes |
|---------|---------|------|-------|
| Vite Dev Server | `npm run dev` | 5173 | The only required service |
| n8n (optional) | `npm run n8n` (Docker) or `npm run n8n:run` (npx) | 5678 | Lead form webhook; site works without it |

### Key details

- **Package manager:** npm (lockfile: `package-lock.json`).
- **No linter or test framework** is configured in `package.json`. There are no `lint` or `test` scripts.
- **No database** is required.
- **Environment variables** (`VITE_LEAD_API`, `VITE_GEMINI_API_KEY`) are optional — the app degrades gracefully without them.
- **Build:** `npm run build` produces output in `dist/`.
- See `README.md` for standard setup/run commands.
