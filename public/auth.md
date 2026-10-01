# Authentication

draw does **not** require authentication.

- No user accounts
- No API keys
- No OAuth or OpenID Connect
- No hosted MCP server

The product is a client-only Progressive Web App. Scenes stay in the browser (localStorage). Agents drive the live UI with Playwriter and `window.draw` (see `/llms.txt` and `/for-agents.html`).

There is no remote endpoint to authorize.
