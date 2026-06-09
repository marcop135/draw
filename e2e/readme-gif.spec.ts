import { expect, test } from "@playwright/test";

/**
 * Run via `npm run capture:readme-gif`; WebM → `docs/readme-demo.gif` via ffmpeg.
 * Tells a short story of what the app does: draw with tools + colours, insert a
 * LaTeX formula and a Markdown note, then flip the theme. Kept ~15s so the
 * resulting gif stays small. Insert/theme steps are best-effort (guarded) so a
 * selector miss never aborts the recording.
 */
test.describe("readme gif artefact", () => {
  test("record short session for ffmpeg gif", async ({ page }) => {
    await page.goto("/");
    await page.locator(".app-toolbar").waitFor({ timeout: 60_000 });
    const canvas = page.locator("#root canvas").last();
    await canvas.waitFor({ state: "visible", timeout: 60_000 });

    const box = await canvas.boundingBox();
    expect(box).not.toBeNull();
    const { x, y, width, height } = box!;

    const dwell = (ms = 350) => page.waitForTimeout(ms);

    // Let the welcome hint overlay read for a beat before we start.
    await dwell(800);

    // Focus the canvas (empty click with the default selection tool is a no-op)
    // so the very first keyboard shortcut registers.
    await page.mouse.click(x + width * 0.5, y + height * 0.5);
    await dwell(150);

    // Pick one of Excalidraw's preset stroke swatches (panel is open while a
    // drawing tool is active). Index maps to the row of preset colours.
    async function pickColor(index: number) {
      try {
        const swatches = page.locator(
          ".color-picker__button:not(.color-picker__button--large)",
        );
        await swatches.nth(index).click({ timeout: 1500 });
      } catch {
        /* keep recording even if the palette layout shifts */
      }
    }

    async function drag(fromX: number, fromY: number, toX: number, toY: number) {
      await page.mouse.move(x + width * fromX, y + height * fromY);
      await page.mouse.down();
      await page.mouse.move(x + width * toX, y + height * toY, { steps: 30 });
      await page.mouse.up();
    }

    // Keep shapes clear of the left properties panel (it overlays ~x<0.22
    // whenever a drawing tool is active).
    // Rectangle in a warm colour.
    await page.keyboard.press("r");
    await pickColor(1);
    await dwell(150);
    await drag(0.3, 0.24, 0.46, 0.44);
    await dwell(350);

    // Ellipse in a cool colour.
    await page.keyboard.press("o");
    await pickColor(3);
    await dwell(150);
    await drag(0.54, 0.24, 0.7, 0.44);
    await dwell(350);

    // Freehand ink stroke in green: a loose flowing squiggle.
    await page.keyboard.press("7");
    await pickColor(2);
    await dwell(150);
    const wave: [number, number][] = [
      [0.3, 0.62],
      [0.36, 0.57],
      [0.42, 0.65],
      [0.48, 0.56],
      [0.54, 0.66],
      [0.6, 0.57],
      [0.66, 0.63],
    ];
    await page.mouse.move(x + width * wave[0][0], y + height * wave[0][1]);
    await page.mouse.down();
    for (const [fx, fy] of wave.slice(1)) {
      await page.mouse.move(x + width * fx, y + height * fy, { steps: 14 });
    }
    await page.mouse.up();
    await dwell(500);

    const insertBtn = page.locator(
      ".app-toolbar .menu-anchor:nth-of-type(1) > button",
    );

    async function insertVia(item: "LaTeX" | "Markdown", settle: number) {
      try {
        await insertBtn.click({ timeout: 2000 });
        await dwell(250);
        await page.getByRole("button", { name: item }).click({ timeout: 2000 });
        const modal = page.locator(".app-modal");
        await modal.waitFor({ timeout: 4000 });
        await dwell(500);
        await modal
          .getByRole("button", { name: /insert/i })
          .click({ timeout: 2000 });
        await modal.waitFor({ state: "hidden", timeout: 8000 });
        await dwell(settle);
      } catch {
        /* skip if the modal flow changes */
      }
    }

    // Insert a LaTeX formula (KaTeX), then a Markdown note (parsed into native,
    // editable shapes). LaTeX first so it doesn't land on the note.
    await insertVia("LaTeX", 700);
    await insertVia("Markdown", 1000);

    // Drop the tool (hides the side panel) and frame the whole scene. The
    // insert auto-scrolls to the new element, so a zoom-to-fit brings every
    // element (including the shapes drawn earlier) back into one clean frame.
    try {
      await page
        .locator('input[name="editor-current-shape"]')
        .first()
        .click({ force: true, timeout: 2000 });
      // Focus the canvas without drawing (selection tool on empty space just
      // deselects) so the Shift+1 zoom-to-fit shortcut reaches Excalidraw.
      await page
        .locator("#root canvas")
        .last()
        .click({ position: { x: width * 0.5, y: height * 0.94 }, force: true });
      await page.keyboard.press("Shift+1");
      await dwell(900);
    } catch {
      /* finale framing is non-critical */
    }

    // Flip to dark theme to show theming.
    try {
      const themeBtn = page.locator(".app-toolbar .theme-toggle");
      for (let i = 0; i < 3; i++) {
        if (await page.locator(".app-shell.dark").count()) break;
        await themeBtn.click({ timeout: 1500 });
        await dwell(450);
      }
      await dwell(1100);
    } catch {
      /* theme toggle is non-critical */
    }

    await expect(page.locator(".app-toolbar")).toBeVisible();
    await page.waitForTimeout(1000);
  });
});
