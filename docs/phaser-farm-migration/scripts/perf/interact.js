/**
 * Frame-time percentiles for idle, pan, zoom, a harvest burst and modal
 * open/close.
 * Usage: node interact.js <url>
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
const URL = process.argv[2] || "http://localhost:3000/";
(async () => {
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
  await page.goto(URL, { waitUntil: "commit" });
  await page.waitForFunction(
    () =>
      performance
        .getEntriesByType("mark")
        .some((m) => m.name === "farm:cover-lift"),
    null,
    { timeout: 90000 },
  );
  await page.waitForTimeout(8000); // let stragglers land
  await page.evaluate(() => {
    window.__rec = { on: false, frames: [], lt: [] };
    let last = performance.now();
    const tick = () => {
      const n = performance.now();
      if (window.__rec.on) window.__rec.frames.push(n - last);
      last = n;
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    new PerformanceObserver((l) =>
      l
        .getEntries()
        .forEach(
          (e) =>
            window.__rec.on && window.__rec.lt.push(Math.round(e.duration)),
        ),
    ).observe({ type: "longtask" });
    window.__start = () => {
      window.__rec.frames = [];
      window.__rec.lt = [];
      window.__rec.on = true;
    };
    window.__stop = () => {
      window.__rec.on = false;
      const f = window.__rec.frames.slice().sort((a, b) => a - b);
      const p = (q) =>
        Math.round(f[Math.min(f.length - 1, Math.floor(f.length * q))] * 10) /
        10;
      return {
        frames: f.length,
        p50: p(0.5),
        p95: p(0.95),
        p99: p(0.99),
        worst: Math.round(f[f.length - 1]),
        over20: f.filter((x) => x > 20).length,
        over34: f.filter((x) => x > 34).length,
        longtasks: window.__rec.lt,
      };
    };
  });
  const run = async (name, fn) => {
    await page.evaluate(() => window.__start());
    await fn();
    await page.waitForTimeout(300);
    console.log(
      name,
      JSON.stringify(await page.evaluate(() => window.__stop())),
    );
  };

  await run("idle 3s", async () => {
    await page.waitForTimeout(3000);
  });
  await run("pan drag", async () => {
    await page.mouse.move(640, 400);
    await page.mouse.down();
    for (let i = 0; i < 60; i++) {
      await page.mouse.move(640 - i * 6, 400 - i * 3);
      await page.waitForTimeout(16);
    }
    await page.mouse.up();
    await page.waitForTimeout(800);
    await page.mouse.move(300, 250);
    await page.mouse.down();
    for (let i = 0; i < 60; i++) {
      await page.mouse.move(300 + i * 6, 250 + i * 3);
      await page.waitForTimeout(16);
    }
    await page.mouse.up();
    await page.waitForTimeout(800);
  });
  await run("wheel zoom", async () => {
    await page.keyboard.down("Control");
    for (let i = 0; i < 30; i++) {
      await page.mouse.wheel(0, 8);
      await page.waitForTimeout(16);
    }
    for (let i = 0; i < 30; i++) {
      await page.mouse.wheel(0, -8);
      await page.waitForTimeout(16);
    }
    await page.keyboard.up("Control");
  });
  // Game events straight through the machine: cost of state change -> renderer sync
  const ev = await page.evaluate(async () => {
    const svc = {
      send: (e) => window.__farmBridge.dispatch(e),
      getSnapshot: () => ({
        context: { state: window.__farmBridge.select((s) => s.context.state) },
      }),
    };
    const st = svc.getSnapshot().context.state;
    const ready = Object.entries(st.crops)
      .filter(([, p]) => p.crop)
      .slice(0, 12)
      .map(([id]) => id);
    const times = [];
    for (const id of ready) {
      const t = performance.now();
      try {
        svc.send({ type: "crop.harvested", index: id });
      } catch (e) {
        times.push("err:" + String(e).slice(0, 60));
        continue;
      }
      times.push(Math.round((performance.now() - t) * 10) / 10);
      await new Promise((r) => requestAnimationFrame(r));
    }
    return {
      plots: Object.keys(st.crops).length,
      withCrop: ready.length,
      sendMs: times,
    };
  });
  console.log("harvest sends", JSON.stringify(ev));
  await run("harvest burst frames", async () => {
    await page.evaluate(async () => {
      const svc = {
        send: (e) => window.__farmBridge.dispatch(e),
        getSnapshot: () => ({
          context: {
            state: window.__farmBridge.select((s) => s.context.state),
          },
        }),
      };
      const st = svc.getSnapshot().context.state;
      const ids = Object.entries(st.crops)
        .filter(([, p]) => p.crop)
        .slice(0, 12)
        .map(([id]) => id);
      for (const id of ids) {
        try {
          svc.send({ type: "crop.harvested", index: id });
        } catch (e) {}
        await new Promise((r) => setTimeout(r, 60));
      }
    });
  });
  await run("open+close modal x3", async () => {
    for (let i = 0; i < 3; i++) {
      await page.evaluate(() => window.__farmBridge.farmModal.open("market"));
      await page.waitForTimeout(500);
      await page.evaluate(
        () =>
          window.__farmBridge.farmModal.close &&
          window.__farmBridge.farmModal.close(),
      );
      await page.keyboard.press("Escape");
      await page.waitForTimeout(400);
    }
  });
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
