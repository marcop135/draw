# Security Policy

## Supported versions

Only the latest published release receives security fixes.

## Reporting a vulnerability

Report vulnerabilities privately through GitHub Security Advisories:
[github.com/marcop135/draw/security/advisories/new](https://github.com/marcop135/draw/security/advisories/new).

Do not open a public issue for security reports.

Expect an acknowledgement within 7 days and a status update within 14 days.

## Scope

The app is client-only: scenes stay in the browser, with no backend and no login. Reports that matter most are XSS from Markdown/LaTeX/Mermaid inserts, DOMPurify bypasses, service-worker cache poisoning, and anything that ships scene data off-device.
