# Contributing

**draw** is a personal whiteboard. External pull requests are not expected; open an issue first if you still want to propose a change.

## Setup

Node 22 (`.nvmrc`; `nvm use`).

```bash
npm ci
npm run dev      # http://localhost:5173
```

`postinstall` installs Playwright Chromium locally and both Linux and Windows esbuild/rollup
optional binaries so the same `node_modules` works from WSL and from Windows.

## Checks before a PR

```bash
npm run lint && npm test && npm run test:e2e
npm run build
```

## Pull requests

1. Branch from `develop` as `feat/…`, `fix/…`, or `docs/…`.
2. Match existing React, Vite, and TypeScript patterns.
3. Update `CHANGELOG.md` when the change has user-visible or security impact.
4. PR into `develop`. Releases promote `develop` → `main`.

Coding agents use `window.draw`; see [docs/agent-surface.md](docs/agent-surface.md).

See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) and [SECURITY.md](SECURITY.md).
