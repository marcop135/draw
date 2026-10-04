# Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Dev server on port 5173 |
| `npm run build` | Type-check and build to `dist/` |
| `npm run preview` | Serve `dist/` on port 4173 |
| `npm run lint` | ESLint, zero warnings |
| `npm test` | Vitest unit tests |
| `npm run test:e2e` | Playwright smoke test |
| `npm run verify:agent-readiness` | Check the agent discovery files in `dist/` |
| `npm run assets:brand` | Render favicons and app icons from `public/favicon*.svg` |
| `npm run brand:images` | Render the README, og:image and GitHub social images (`brand:images:check` reports stale ones) |
| `npm run readme:shots` | Recapture the README screenshots (needs `npm run preview`) |
