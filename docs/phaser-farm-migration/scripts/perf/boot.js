/**
 * Cold boot: time from the canvas appearing to the boot cover lifting.
 * Usage: node boot.js <url> [runs=3] [throttle]
 * Pass any 3rd arg to emulate 80ms latency / 10 Mbps.
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
const URL = process.argv[2];
const RUNS = Number(process.argv[3] || 3);
const THROTTLE = process.argv[4];
(async () => {
  const out = [];
  for (let i = 0; i < RUNS; i++) {
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
    if (THROTTLE) {
      const cdp = await ctx.newCDPSession(page);
      await cdp.send("Network.enable");
      await cdp.send("Network.emulateNetworkConditions", {
        offline: false,
        latency: 80,
        downloadThroughput: (10 * 1024 * 1024) / 8,
        uploadThroughput: (2 * 1024 * 1024) / 8,
      });
    }
    await page.addInitScript(() => {
      try {
        localStorage.setItem("phaserFarm.hooks", "1");
      } catch (e) {}
      performance.setResourceTimingBufferSize(10000);
      window.__b = {
        canvasAt: null,
        coverSeenAt: null,
        coverGoneAt: null,
        lt: [],
      };
      try {
        new PerformanceObserver((l) =>
          l
            .getEntries()
            .forEach((e) =>
              window.__b.lt.push([
                Math.round(e.startTime),
                Math.round(e.duration),
              ]),
            ),
        ).observe({ type: "longtask", buffered: true });
      } catch (e) {}
      const iv = setInterval(() => {
        const b = window.__b;
        const n = Math.round(performance.now());
        if (b.canvasAt === null && document.querySelector("canvas"))
          b.canvasAt = n;
        const cover = [...document.body.children].find(
          (d) => d.style && d.style.zIndex === "2000",
        );
        if (cover && b.coverSeenAt === null) b.coverSeenAt = n;
        if (
          b.canvasAt !== null &&
          b.coverSeenAt !== null &&
          !cover &&
          b.coverGoneAt === null
        ) {
          b.coverGoneAt = n;
          clearInterval(iv);
        }
      }, 16);
    });
    await page.goto(URL, { waitUntil: "commit" });
    await page.waitForFunction(
      () => window.__b && window.__b.coverGoneAt !== null,
      null,
      { timeout: 120000 },
    );
    await page.waitForTimeout(3000);
    const r = await page.evaluate(() => {
      const b = window.__b;
      const res = performance.getEntriesByType("resource");
      const during = res.filter(
        (r) => r.startTime >= b.canvasAt && r.startTime <= b.coverGoneAt,
      );
      return {
        canvasAt: b.canvasAt,
        coverGoneAt: b.coverGoneAt,
        engineBootMs: b.coverGoneAt - b.canvasAt,
        requestsDuringBoot: during.length,
        kbDuringBoot: Math.round(
          during.reduce((a, r) => a + (r.transferSize || 0), 0) / 1024,
        ),
        longtasksDuringBoot: b.lt
          .filter((x) => x[0] >= b.canvasAt && x[0] <= b.coverGoneAt + 500)
          .map((x) => x[1]),
        lateRequests: res.filter((r) => r.startTime > b.coverGoneAt).length,
      };
    });
    out.push(r);
    console.log(JSON.stringify(r));
    await browser.close();
  }
  const med = (k) =>
    out.map((o) => o[k]).sort((a, b) => a - b)[Math.floor(out.length / 2)];
  console.log(
    "MEDIAN engineBootMs",
    med("engineBootMs"),
    "coverGoneAt",
    med("coverGoneAt"),
  );
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
