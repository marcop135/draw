#!/usr/bin/env node
/**
 * verify:agent-readiness: static checks for the agent discovery surface.
 * Usage: node scripts/verify-agent-readiness.mjs [baseUrl]
 * Without baseUrl it checks dist/ (run npm run build first) plus the bridge source;
 * with one (e.g. http://localhost:4173 or https://draw.marcopontili.com) it fetches each file.
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");

const requiredFiles = [
  "llms.txt",
  "auth.md",
  "for-agents.html",
  "openapi.json",
  ".well-known/api-catalog",
  ".well-known/ard.json",
  ".well-known/ai-catalog.json",
  ".well-known/agent-skills/index.json",
  ".well-known/agent-skills/draw-scene/SKILL.md",
];

const isJson = (rel) => rel.endsWith(".json") || rel.endsWith("/api-catalog");

const failures = [];
const assert = (ok, msg) => {
  if (!ok) failures.push(msg);
};

function checkText(label, body) {
  assert(body.length >= 100, `${label} body too short`);
  assert(!/^<!doctype/i.test(body.trimStart()), `${label} looks like the SPA shell`);
}

function checkJson(label, body) {
  try {
    JSON.parse(body);
  } catch {
    assert(false, `${label} is not valid JSON`);
  }
}

const baseArg = process.argv[2];

if (baseArg) {
  const base = baseArg.replace(/\/$/, "");
  for (const rel of requiredFiles) {
    const url = `${base}/${rel}`;
    const res = await fetch(url, { redirect: "manual" });
    assert(res.status === 200, `${url} -> HTTP ${res.status}`);
    const ct = (res.headers.get("content-type") || "").toLowerCase();
    const body = await res.text();
    if (rel.endsWith(".html")) {
      assert(ct.includes("text/html"), `${url} content-type ${ct}`);
    } else if (isJson(rel)) {
      checkJson(url, body);
    } else {
      assert(!ct.includes("text/html"), `${url} should not be HTML (got ${ct || "missing"})`);
      checkText(url, body);
    }
  }
} else {
  assert(existsSync(dist), "dist/ missing: run npm run build first");
  for (const rel of requiredFiles) {
    const path = join(dist, rel);
    if (!existsSync(path)) {
      assert(false, `missing ${rel} in dist/`);
      continue;
    }
    const body = readFileSync(path, "utf8");
    if (isJson(rel)) checkJson(rel, body);
    else if (!rel.endsWith(".html")) checkText(rel, body);
  }
  const robots = readFileSync(join(dist, "robots.txt"), "utf8");
  assert(robots.includes("Allow: /llms.txt"), "robots.txt must Allow /llms.txt");
  const bridge = readFileSync(join(root, "src/lib/agentBridge.ts"), "utf8");
  assert(bridge.includes("window.draw = agentApi"), "agentBridge must expose window.draw");
  const app = readFileSync(join(root, "src/App.tsx"), "utf8");
  assert(app.includes("registerAgentHandlers"), "App must register the agent bridge");
  assert(app.includes("/for-agents.html"), "App menu must link /for-agents.html");
}

if (failures.length) {
  console.error("verify:agent-readiness failed:");
  for (const f of failures) console.error(` - ${f}`);
  process.exit(1);
}

console.log(
  baseArg
    ? `verify:agent-readiness OK against ${baseArg}`
    : `verify:agent-readiness OK (dist + source) ${pathToFileURL(dist).href}`,
);
