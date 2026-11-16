/**
 * Surface hops (farm <-> home <-> barn): image requests, worst frame and long
 * tasks per hop, and whether the canvas was rebuilt. Works on any build.
 * Usage: node hops.js <url> [<url> ...]
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
    const ctx = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      deviceScaleFactor: 2,
      serviceWorkers: "block",
    });
    const page = await ctx.newPage();
    await page.addInitScript(() => {
      performance.setResourceTimingBufferSize(10000);
    });
    await page.goto(url, { waitUntil: "commit" });
    await page.waitForFunction(() => !!document.querySelector("canvas"), null, {
      timeout: 90000,
    });
    await page.waitForTimeout(9000);
    const out = [];
    for (const hash of ["#/home", "#/", "#/home", "#/", "#/barn", "#/"]) {
      out.push(
        await page.evaluate(async (hash) => {
          const lt = [];
          const po = new PerformanceObserver((l) =>
            l.getEntries().forEach((e) => lt.push(Math.round(e.duration))),
          );
          po.observe({ type: "longtask" });
          performance.clearResourceTimings();
          const c0 = document.querySelector("canvas");
          const t0 = performance.now();
          let last = t0,
            worst = 0,
            over34 = 0;
          location.hash = hash;
          await new Promise((res) => {
            const tick = () => {
              const n = performance.now();
              const d = n - last;
              worst = Math.max(worst, d);
              if (d > 34) over34++;
              last = n;
              if (n - t0 > 2500) res();
              else requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
          });
          po.disconnect();
          const res = performance.getEntriesByType("resource");
          const img = res.filter((r) =>
            /\.(png|webp|gif|jpg|jpeg)(\?|$)/.test(r.name),
          );
          return {
            hash,
            imageRequests: img.length,
            lastImageAt: Math.round(
              Math.max(0, ...img.map((r) => r.responseEnd)) - t0,
            ),
            worstFrameMs: Math.round(worst),
            framesOver34: over34,
            longtasks: lt,
            newCanvas: document.querySelector("canvas") !== c0,
          };
        }, hash),
      );
      await page.waitForTimeout(300);
    }
    console.log(url);
    out.forEach((o) => console.log(" ", JSON.stringify(o)));
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
