/**
 * React (DOM) farm vs Phaser farm, same build, same scenarios, measured with
 * Chrome's own tooling (CDP Performance metrics, LayerTree, a devtools
 * timeline trace and per-process CPU time).
 *
 * Usage: node compare.js <url> <react|phaser> [desktop|phone]
 *
 * <url> must be an OFFLINE PRODUCTION build (`npx vite build` with no
 * VITE_API_URL, then serve the output): the dev build's React overhead hides
 * the differences. "react" sets localStorage.phaserFarm = "off". "phone" is a
 * 390x844 @3x touch viewport with the CPU throttled 4x - the GPU is still the
 * host's, so treat it as a main-thread stress test, not a phone GPU test.
 *
 * Needs playwright-core and a Chromium binary (CHROME_PATH, or Playwright's
 * default). Prints one JSON object.
 */
const { chromium } = require("playwright-core");
const [url, mode, device] = [
  process.argv[2],
  process.argv[3],
  process.argv[4] || "desktop",
];
const PHONE = device === "phone";
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
  const ctx = await browser.newContext(
    PHONE
      ? {
          viewport: { width: 390, height: 844 },
          deviceScaleFactor: 3,
          isMobile: true,
          hasTouch: true,
          serviceWorkers: "block",
        }
      : {
          viewport: { width: 1280, height: 800 },
          deviceScaleFactor: 2,
          serviceWorkers: "block",
        },
  );
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  const bcdp = await browser.newBrowserCDPSession();
  await cdp.send("Performance.enable");
  if (PHONE) await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e).slice(0, 120)));
  await page.addInitScript((mode) => {
    try {
      localStorage.setItem("phaserFarm.hooks", "1");
      if (mode === "react") localStorage.setItem("phaserFarm", "off");
    } catch (e) {}
    performance.setResourceTimingBufferSize(10000);
  }, mode);
  const tNav = Date.now();
  await page.goto(url, { waitUntil: "commit" });
  if (mode === "phaser")
    await page.waitForFunction(
      () =>
        performance
          .getEntriesByType("mark")
          .some((m) => m.name === "farm:cover-lift"),
      null,
      { timeout: 180000 },
    );
  else
    await page.waitForFunction(
      () =>
        !!document.getElementById("genesisBlock") &&
        [...document.images].filter((i) => !i.complete).length === 0,
      null,
      { timeout: 180000 },
    );
  const readyMs = Date.now() - tNav;
  await page.waitForTimeout(PHONE ? 12000 : 7000);
  const isPhaser = await page.evaluate(() => !!window.__farmGame);
  if (isPhaser !== (mode === "phaser"))
    throw new Error("wrong renderer mounted: phaser=" + isPhaser);

  // ---- static picture
  const layers = [];
  cdp.on("LayerTree.layerTreeDidChange", (e) => {
    if (e.layers) {
      layers.length = 0;
      layers.push(...e.layers);
    }
  });
  await cdp.send("LayerTree.enable");
  await page.waitForTimeout(800);
  const drawn = layers.filter((l) => l.drawsContent);
  const stat = await page.evaluate(() => {
    const g = window.__farmGame;
    let texBytes = 0;
    if (g) {
      const seen = new Set();
      Object.values(g.textures.list).forEach((t) =>
        t.source.forEach((s) => {
          if (!seen.has(s)) {
            seen.add(s);
            texBytes += s.width * s.height * 4;
          }
        }),
      );
    }
    const c = document.querySelector("canvas");
    return {
      domNodes: document.querySelectorAll("*").length,
      images: document.images.length,
      heapMB: Math.round(performance.memory.usedJSHeapSize / 1048576),
      canvasMB: g && c ? Math.round((c.width * c.height * 4) / 1048576) : 0,
      textureMB: Math.round(texBytes / 1048576),
      animations: document.getAnimations().length,
    };
  });
  stat.compositorLayers = drawn.length;
  stat.layerMB = Math.round(
    drawn.reduce((a, l) => a + l.width * l.height * 4, 0) / 1048576,
  );
  await cdp.send("LayerTree.disable");

  // ---- scenario runner
  await page.evaluate(() => {
    window.__rec = { on: false, frames: [] };
    let last = performance.now();
    const tick = () => {
      const n = performance.now();
      if (window.__rec.on) window.__rec.frames.push(n - last);
      last = n;
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
  const gpuCpu = async () => {
    const { processInfo } = await bcdp.send("SystemInfo.getProcessInfo");
    const by = {};
    processInfo.forEach((p) => {
      by[p.type] = (by[p.type] || 0) + p.cpuTime;
    });
    return by;
  };
  const perf = async () =>
    Object.fromEntries(
      (await cdp.send("Performance.getMetrics")).metrics.map((m) => [
        m.name,
        m.value,
      ]),
    );
  const CATS = [
    "devtools.timeline",
    "disabled-by-default-devtools.timeline",
    "disabled-by-default-devtools.timeline.frame",
  ];
  const scenario = async (name, seconds, fn) => {
    const p0 = await perf();
    const c0 = await gpuCpu();
    await browser.startTracing(page, { categories: CATS });
    await page.evaluate(() => {
      window.__rec.frames = [];
      window.__rec.on = true;
    });
    const t0 = Date.now();
    await fn();
    const wait = seconds * 1000 - (Date.now() - t0);
    if (wait > 0) await page.waitForTimeout(wait);
    const frames = await page.evaluate(() => {
      window.__rec.on = false;
      return window.__rec.frames;
    });
    const trace = JSON.parse((await browser.stopTracing()).toString());
    const p1 = await perf();
    const c1 = await gpuCpu();
    const secs = (Date.now() - t0) / 1000;
    const ev = trace.traceEvents || trace;
    const sum = (n) =>
      ev.filter((e) => e.name === n && e.dur).reduce((a, e) => a + e.dur, 0) /
      1000;
    const count = (n) => ev.filter((e) => e.name === n).length;
    const f = frames.slice().sort((a, b) => a - b);
    const q = (x) =>
      Math.round(f[Math.min(f.length - 1, Math.floor(f.length * x))] * 10) / 10;
    const r1 = (x) => Math.round(x * 10) / 10;
    return {
      name,
      fps: Math.round(frames.length / secs),
      frameP50: q(0.5),
      frameP95: q(0.95),
      frameP99: q(0.99),
      worst: Math.round(f[f.length - 1]),
      framesOver20ms: f.filter((x) => x > 20).length,
      framesOver34ms: f.filter((x) => x > 34).length,
      mainThreadPct: r1((100 * (p1.TaskDuration - p0.TaskDuration)) / secs),
      scriptPct: r1((100 * (p1.ScriptDuration - p0.ScriptDuration)) / secs),
      styleLayoutPct: r1(
        (100 *
          (p1.LayoutDuration -
            p0.LayoutDuration +
            (p1.RecalcStyleDuration - p0.RecalcStyleDuration))) /
          secs,
      ),
      layouts: p1.LayoutCount - p0.LayoutCount,
      styleRecalcs: p1.RecalcStyleCount - p0.RecalcStyleCount,
      gpuProcessCpuPct: r1((100 * ((c1.GPU || 0) - (c0.GPU || 0))) / secs),
      rendererCpuPct: r1(
        (100 * ((c1.renderer || 0) - (c0.renderer || 0))) / secs,
      ),
      gpuTaskMsPerSec: r1(sum("GPUTask") / secs),
      paintMsPerSec: r1(sum("Paint") / secs),
      rasterMsPerSec: r1(sum("RasterTask") / secs),
      paints: count("Paint"),
      droppedFrames: count("DroppedFrame"),
    };
  };
  const cx = PHONE ? 195 : 640,
    cy = PHONE ? 420 : 400;
  const out = { mode, device, readyMs, static: stat, scenarios: [] };
  out.scenarios.push(await scenario("idle", 5, async () => {}));
  out.scenarios.push(
    await scenario("drag pan", 5, async () => {
      await page.mouse.move(cx, cy);
      for (let k = 0; k < 2; k++) {
        await page.mouse.down();
        for (let i = 1; i <= 60; i++) {
          await page.mouse.move(
            cx - i * 3 * (k ? -1 : 1),
            cy - i * 2 * (k ? -1 : 1),
          );
          await page.waitForTimeout(16);
        }
        await page.mouse.up();
        await page.waitForTimeout(500);
        await page.mouse.move(cx, cy);
      }
    }),
  );
  out.scenarios.push(
    await scenario("wheel scroll", 5, async () => {
      await page.mouse.move(cx, cy);
      for (let i = 0; i < 240; i++) {
        const d = i < 120 ? 1 : -1;
        await page.mouse.wheel(6 * d, 4 * d);
        await page.waitForTimeout(16);
      }
    }),
  );
  const act = await page.evaluate(async () => {
    const svc = window.__gameService;
    if (!svc) return null;
    const macrotask = () =>
      new Promise((r) => {
        const c = new MessageChannel();
        c.port1.onmessage = () => r();
        c.port2.postMessage(0);
      });
    const st = svc.getSnapshot().context.state;
    const ids = Object.entries(st.crops)
      .filter(([, p]) => p.crop)
      .map(([id]) => id)
      .slice(0, 30);
    window.__harvestIds = ids.slice(15);
    const total = [];
    for (const id of ids.slice(0, 15)) {
      await new Promise((r) => setTimeout(r, 60));
      const t0 = performance.now();
      try {
        svc.send({ type: "crop.harvested", index: id });
      } catch (e) {
        continue;
      }
      await macrotask();
      total.push(performance.now() - t0);
    }
    total.sort((a, b) => a - b);
    return {
      n: total.length,
      medianMs: Math.round(total[Math.floor(total.length / 2)] * 10) / 10,
    };
  });
  out.harvestMainThread = act;
  out.scenarios.push(
    await scenario("harvest x15", 3, async () => {
      await page.evaluate(async () => {
        const svc = window.__gameService;
        for (const id of window.__harvestIds || []) {
          try {
            svc.send({ type: "crop.harvested", index: id });
          } catch (e) {}
          await new Promise((r) => setTimeout(r, 120));
        }
      });
    }),
  );
  out.errors = errors
    .filter((e) => !/Invalid URL|not valid JSON|play\(\)/.test(e))
    .slice(0, 3);
  console.log(JSON.stringify(out));
  await browser.close();
})().catch((e) => {
  console.error("FAILED " + String(e).slice(0, 400));
  process.exit(1);
});
