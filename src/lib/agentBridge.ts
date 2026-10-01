/**
 * `window.draw`: the control surface for coding agents (Playwriter, CDP).
 * Contract and discovery files: docs/agent-surface.md, public/llms.txt.
 */

/** Cap for `setScene` input; matches a generous `.excalidraw` file with embedded images. */
export const MAX_SCENE_CHARS = 20 * 1024 * 1024;

export type ImageFormat = "png" | "svg";

export type AgentHandlers = {
  /** Current scene as `.excalidraw` JSON. */
  getScene: () => string;
  /** Replace the scene with parsed, validated `.excalidraw` data. */
  setScene: (json: string) => Promise<void>;
  /** PNG data URL or SVG markup of the current scene. */
  exportImage: (format: ImageFormat) => Promise<string>;
};

export type DrawAgentApi = {
  getScene: () => string;
  setScene: (json: string) => Promise<{ ok: true; length: number }>;
  exportImage: (format: ImageFormat) => Promise<string>;
};

declare global {
  interface Window {
    draw?: DrawAgentApi;
  }
}

let handlers: AgentHandlers | null = null;

function ready(): AgentHandlers {
  if (!handlers) throw new Error("draw agent bridge is not ready");
  return handlers;
}

export const agentApi: DrawAgentApi = {
  getScene() {
    return ready().getScene();
  },
  async setScene(json) {
    const h = ready();
    if (typeof json !== "string") throw new Error("scene must be a JSON string");
    if (json.length > MAX_SCENE_CHARS) throw new Error("scene exceeds the 20 MB limit");
    let parsed: unknown;
    try {
      parsed = JSON.parse(json);
    } catch {
      throw new Error("scene is not valid JSON");
    }
    const data = parsed as { type?: unknown; elements?: unknown };
    if (data?.type !== "excalidraw" || !Array.isArray(data.elements)) {
      throw new Error('scene must be .excalidraw JSON with type "excalidraw" and an elements array');
    }
    await h.setScene(json);
    return { ok: true, length: json.length };
  },
  async exportImage(format) {
    const h = ready();
    if (format !== "png" && format !== "svg") {
      throw new Error('format must be "png" or "svg"');
    }
    return h.exportImage(format);
  },
};

export function registerAgentHandlers(next: AgentHandlers): void {
  handlers = next;
  if (typeof window !== "undefined") window.draw = agentApi;
}

export function unregisterAgentHandlers(): void {
  handlers = null;
  if (typeof window !== "undefined") delete window.draw;
}
