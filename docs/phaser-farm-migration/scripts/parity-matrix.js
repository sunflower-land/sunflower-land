/**
 * Parity-matrix screenshot + perf runner for the Phaser farm.
 *
 * Usage:
 *   1. Start the offline farm: VITE_API_URL= VITE_ROOM_URL= yarn dev  (port 3000)
 *   2. node docs/phaser-farm-migration/scripts/parity-matrix.js [outDir] [playwrightPath] [react]
 *      Pass "react" as the 3rd arg to capture the DOM farm (flag off) for
 *      side-by-side comparison against a Phaser run.
 *
 * Loops island × season × expansion combinations by writing the
 * `phaserFarm.dev.*` localStorage keys (read by applyPhaserDevOverrides in
 * landDataStatic.ts), screenshots each combination, and samples FPS via the
 * dev-only window.__farmGame handle. Compare shots against the React farm by
 * re-running with `phaserFarm` unset.
 */
const path = require("path");

const OUT = process.argv[2] || path.join(__dirname, "parity-out");
const PLAYWRIGHT = process.argv[3] || "playwright";
const REACT_FARM = process.argv[4] === "react";
const { chromium } = require(PLAYWRIGHT);

const MATRIX = [
  // [island, season, expansions] — extend as needed; "" = fixture default.
  ["basic", "spring", "3"],
  ["basic", "summer", "3"],
  ["basic", "autumn", "9"],
  ["basic", "winter", "9"],
  ["spring", "spring", "15"],
  ["spring", "winter", "15"],
  ["desert", "summer", "23"],
  ["desert", "winter", "23"],
  ["volcano", "summer", "42"],
  ["volcano", "winter", "42"],
];

(async () => {
  const fs = require("fs");
  fs.mkdirSync(OUT, { recursive: true });
  // ONLY=basic-spring-3 re-captures a single combination (rapid full-matrix
  // reruns trip CDN 429s).
  const only = process.env.ONLY;
  const combos = only
    ? MATRIX.filter((c) => c.join("-") === only)
    : MATRIX;

  const browser = await chromium.launch({ channel: "chrome", args: ["--no-sandbox"] });
  const results = [];

  for (const [island, season, expansions] of combos) {
    const page = await browser.newPage({
      viewport: { width: 1280, height: 800 },
      deviceScaleFactor: 2,
    });
    await page.addInitScript(
      ({ island, season, expansions, reactFarm }) => {
        if (reactFarm) localStorage.setItem("phaserFarm", "off");
        else localStorage.setItem("phaserFarm", "1");
        localStorage.setItem("phaserFarm.dev.island", island);
        localStorage.setItem("phaserFarm.dev.season", season);
        localStorage.setItem("phaserFarm.dev.expansions", expansions);
      },
      { island, season, expansions, reactFarm: REACT_FARM },
    );
    await page.goto("http://localhost:3000/#/farm", {
      waitUntil: "domcontentloaded",
      timeout: 120000,
    });
    await page.waitForTimeout(9000);
    const agree = await page.$("text=/I have read and agree/i");
    if (agree) {
      await agree.click({ force: true, timeout: 5000 }).catch(() => {});
      await page.waitForTimeout(400);
    }
    const cont = await page.$("text=/^Continue$/i");
    if (cont) {
      await cont.click({ force: true, timeout: 5000 }).catch(() => {});
      await page.waitForTimeout(1200);
    }
    // Remaining intro modals: force-click their close, falling back to
    // Escape (portal overlays can intercept element clicks on the DOM farm).
    for (let i = 0; i < 5; i++) {
      const x = await page.$('img[src*="close"]');
      if (!x || !(await x.isVisible().catch(() => false))) break;
      await x.click({ force: true, timeout: 3000 }).catch(() => {});
      await page.keyboard.press("Escape").catch(() => {});
      await page.waitForTimeout(600);
    }
    await page.waitForTimeout(3000);

    if (REACT_FARM) {
      // The app's boot scrollIntoView(GenesisBlock) races layout; re-centre
      // the world-origin anchor exactly so shots align with the Phaser
      // camera's centerOn(0, 0) for pixel diffs.
      await page.evaluate(() => {
        const el = document.getElementById("genesisBlock");
        if (!el) return;
        el.scrollIntoView({ behavior: "instant", block: "center", inline: "center" });
        const r = el.getBoundingClientRect();
        const dx = r.left + r.width / 2 - window.innerWidth / 2;
        const dy = r.top + r.height / 2 - window.innerHeight / 2;
        let node = el.parentElement;
        while (
          node &&
          node.scrollWidth <= node.clientWidth &&
          node.scrollHeight <= node.clientHeight
        )
          node = node.parentElement;
        if (node) {
          node.scrollLeft += dx;
          node.scrollTop += dy;
        }
      });
      await page.waitForTimeout(600);
    }

    const name = `${island}-${season}-${expansions}`;
    await page.screenshot({ path: path.join(OUT, `${name}.png`) });

    // Sample FPS over 3s via the dev game handle (transient navigations
    // during boot can kill the context — treat as n/a, keep the run going).
    const fps = await page.evaluate(async () => {
      const game = window.__farmGame;
      if (!game) return null;
      const samples = [];
      for (let i = 0; i < 6; i++) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        samples.push(game.loop.actualFps);
      }
      return Math.round(samples.reduce((a, b) => a + b, 0) / samples.length);
    }).catch(() => null);
    results.push({ name, fps });
    console.log(`${name}: fps=${fps ?? "n/a"}`);
    await page.close();
  }

  await browser.close();
  require("fs").writeFileSync(
    path.join(OUT, "results.json"),
    JSON.stringify(results, null, 1),
  );
  console.log("DONE", OUT);
})().catch((error) => {
  console.error("FATAL:", error.message);
  process.exit(1);
});
