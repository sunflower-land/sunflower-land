/**
 * Main-thread cost of one in-world action (a harvest): the synchronous
 * dispatch, and the total including the React work it triggers.
 * Usage: node action.js <url> [<url> ...]
 *
 * Measure a PRODUCTION build (`npx vite build`, then serve dist/): React's dev
 * build costs several frames per action on its own and the dev server starves
 * image requests, so dev numbers say nothing about smoothness. The scripts
 * set localStorage["phaserFarm.hooks"] so the engine exposes __farmGame /
 * __farmScene / __farmBridge on a production build.
 *
 * Needs playwright-core (`npm i playwright-core` somewhere on NODE_PATH) and a
 * Chromium binary: set CHROME_PATH, or it falls back to Playwright's default.
 * Runs headless with the real GPU (ANGLE/Metal on macOS).
 */
const { chromium } = require("playwright-core");
(async () => {
  for (const url of process.argv.slice(2)) {
    const browser = await chromium.launch({
      executablePath: process.env.CHROME_PATH || undefined,
      headless: true,
      args: [
        "--mute-audio",
        "--use-angle=metal",
        "--enable-gpu",
        "--ignore-gpu-blocklist",
      ],
    });
    const page = await browser.newPage({
      viewport: { width: 1280, height: 800 },
      deviceScaleFactor: 2,
    });
    await page.addInitScript(() => {
      try {
        localStorage.setItem("phaserFarm.hooks", "1");
      } catch (e) {}
    });
    await page.goto(url, { waitUntil: "commit" });
    await page.waitForFunction(
      () => !!window.__farmBridge && !!window.__farmScene,
      null,
      { timeout: 90000 },
    );
    await page.waitForTimeout(9000);
    const r = await page.evaluate(async () => {
      const b = window.__farmBridge;
      const macrotask = () =>
        new Promise((r) => {
          const c = new MessageChannel();
          c.port1.onmessage = () => r();
          c.port2.postMessage(0);
        });
      const st = b.select((s) => s.context.state);
      const ids = Object.entries(st.crops)
        .filter(([, p]) => p.crop)
        .map(([id]) => id)
        .slice(0, 40);
      const sync = [],
        total = [];
      for (const id of ids) {
        await new Promise((r) => setTimeout(r, 50));
        const t0 = performance.now();
        try {
          b.dispatch({ type: "crop.harvested", index: id });
        } catch (e) {
          continue;
        }
        const t1 = performance.now();
        await macrotask();
        const t2 = performance.now();
        sync.push(t1 - t0);
        total.push(t2 - t0);
      }
      const med = (a) => {
        const s = a.slice().sort((x, y) => x - y);
        return Math.round(s[Math.floor(s.length / 2)] * 10) / 10;
      };
      const mean = (a) =>
        Math.round((a.reduce((x, y) => x + y, 0) / a.length) * 10) / 10;
      return {
        n: total.length,
        dispatchSyncMedian: med(sync),
        totalWithReactMedian: med(total),
        totalMean: mean(total),
        totalMax: Math.round(Math.max(...total)),
      };
    });
    console.log(url, JSON.stringify(r));
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
