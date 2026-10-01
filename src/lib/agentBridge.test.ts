import { afterEach, describe, expect, it, vi } from "vitest";
import {
  MAX_SCENE_CHARS,
  agentApi,
  registerAgentHandlers,
  unregisterAgentHandlers,
  type AgentHandlers,
} from "./agentBridge";

const scene = JSON.stringify({ type: "excalidraw", version: 2, elements: [], files: {} });

function fakeHandlers(): AgentHandlers {
  return {
    getScene: vi.fn(() => scene),
    setScene: vi.fn(async () => {}),
    exportImage: vi.fn(async (f) => (f === "png" ? "data:image/png;base64,AA==" : "<svg/>")),
  };
}

describe("agentBridge", () => {
  afterEach(() => {
    unregisterAgentHandlers();
  });

  it("throws before handlers register", () => {
    expect(() => agentApi.getScene()).toThrow(/not ready/);
    expect(window.draw).toBeUndefined();
  });

  it("exposes window.draw once registered and removes it on unregister", () => {
    registerAgentHandlers(fakeHandlers());
    expect(window.draw).toBe(agentApi);
    expect(window.draw?.getScene()).toBe(scene);
    unregisterAgentHandlers();
    expect(window.draw).toBeUndefined();
  });

  it("passes valid .excalidraw JSON to setScene", async () => {
    const h = fakeHandlers();
    registerAgentHandlers(h);
    await expect(agentApi.setScene(scene)).resolves.toEqual({ ok: true, length: scene.length });
    expect(h.setScene).toHaveBeenCalledWith(scene);
  });

  it("rejects non-string, invalid, foreign, and oversized scenes", async () => {
    const h = fakeHandlers();
    registerAgentHandlers(h);
    await expect(agentApi.setScene(42 as unknown as string)).rejects.toThrow(/JSON string/);
    await expect(agentApi.setScene("{")).rejects.toThrow(/valid JSON/);
    await expect(agentApi.setScene('{"type":"other","elements":[]}')).rejects.toThrow(/excalidraw/);
    await expect(agentApi.setScene("x".repeat(MAX_SCENE_CHARS + 1))).rejects.toThrow(/20 MB/);
    expect(h.setScene).not.toHaveBeenCalled();
  });

  it("exports png and svg, rejects other formats", async () => {
    registerAgentHandlers(fakeHandlers());
    await expect(agentApi.exportImage("png")).resolves.toMatch(/^data:image\/png/);
    await expect(agentApi.exportImage("svg")).resolves.toBe("<svg/>");
    await expect(agentApi.exportImage("gif" as "png")).rejects.toThrow(/format/);
  });
});
