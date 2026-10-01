# Agent surface

Maintainer notes for opening draw to coding agents (v1.7.0+). Pattern ported from md2pdf.

## Control contract

After the app mounts, the page exposes `window.draw`:

| Method | Behavior |
| --- | --- |
| `getScene()` | Current scene as `.excalidraw` JSON (`serializeAsJSON`) |
| `setScene(json)` | Validate (`type: "excalidraw"`, `elements` array, max 20 MB), restore via `loadFromBlob`, replace the canvas, fit to content |
| `exportImage("png" \| "svg")` | PNG data URL or SVG markup; throws on an empty canvas |

Implementation: [`src/lib/agentBridge.ts`](../src/lib/agentBridge.ts), registered from [`App.tsx`](../src/App.tsx). The hamburger menu links "For agents" to `/for-agents.html`.

## Discovery URLs

| URL | Role |
| --- | --- |
| `/llms.txt` | When-to-use + control overview |
| `/auth.md` | No auth / no hosted MCP |
| `/for-agents.html` | Portal |
| `/openapi.json` | OpenAPI for static surfaces only |
| `/.well-known/api-catalog` | RFC 9727 linkset |
| `/.well-known/ard.json` | ARD catalog (twin: `ai-catalog.json`; entries carry both `type` and `mediaType`) |
| `/.well-known/agent-skills/index.json` | Skills index -> `draw-scene/SKILL.md` (self-hosted; the repo is private) |

## Constraints

- `robots.txt` keeps `Disallow: /` and every AI-crawler block; only the files above are `Allow`-listed, with `Content-Signal: ai-train=no, search=no, ai-input=yes`.
- The service worker's `navigateFallbackDenylist` keeps these paths from being answered with the app shell.

`npm run verify:agent-readiness` checks `dist/` and the bridge source; pass a base URL to check a running server.
