---
name: draw-scene
description: Drive draw (draw.marcopontili.com or local :5173) with Playwriter. Load .excalidraw JSON via window.draw, read the scene back, export PNG or SVG. Use when building or exporting an Excalidraw scene through the live app.
---

# draw-scene

Browser-only whiteboard at https://draw.marcopontili.com (or `http://127.0.0.1:5173` in development).

Read `/llms.txt` and `/for-agents.html` on the target origin for the live contract.

## Prerequisites

- Playwriter attached to Chrome (extension mode preferred).
- Prefer the **Playwriter CLI** (`playwriter -s <id> -e "..."`).

## Procedure

1. Open the app and wait for the bridge:

```bash
playwriter -s 1 -e "await page.goto('https://draw.marcopontili.com/'); await page.waitForFunction(() => window.draw && typeof window.draw.setScene === 'function');"
```

2. Load a scene (`.excalidraw` JSON string: `type: "excalidraw"`, `elements` array, max 20 MB). This replaces the current canvas:

```bash
playwriter -s 1 -e "console.log(await page.evaluate((json) => window.draw.setScene(json), state.sceneJson));"
```

Put the JSON on `state.sceneJson` in a prior step, or pass a literal string into `evaluate`.

3. Read the scene back (after edits in the UI, for example):

```bash
playwriter -s 1 -e "state.sceneJson = await page.evaluate(() => window.draw.getScene()); console.log(state.sceneJson.length);"
```

4. Export:

```bash
playwriter -s 1 -e "const url = await page.evaluate(() => window.draw.exportImage('png')); require('fs').writeFileSync('scene.png', Buffer.from(url.split(',')[1], 'base64'));"
playwriter -s 1 -e "require('fs').writeFileSync('scene.svg', await page.evaluate(() => window.draw.exportImage('svg')));"
```

`exportImage` throws `Canvas is empty.` when the scene has no live elements.

## Notes

- No auth, no backend: the scene lives in the tab and its localStorage autosave.
- `setScene` validates JSON shape, then restores elements and embedded files through Excalidraw's loader.
