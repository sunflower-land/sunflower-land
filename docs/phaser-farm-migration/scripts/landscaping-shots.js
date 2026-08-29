/**
 * Landscaping-mode parity shots: captures both engines in landscaping mode
 * (fixture default combo) to /tmp/landscaping-{phaser,react}.png.
 * Usage: node docs/phaser-farm-migration/scripts/landscaping-shots.js [playwrightPath]
 */
const { chromium } = require(process.argv[2] || "playwright");
(async () => {
  const browser = await chromium.launch({ channel: "chrome", args: ["--no-sandbox"] });
  for (const mode of ["phaser", "react"]) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2 });
    await page.addInitScript((mode) => {
      localStorage.setItem("phaserFarm", mode === "react" ? "off" : "1");
      ["island", "season", "expansions", "stress"].forEach((k) => localStorage.removeItem(`phaserFarm.dev.${k}`));
    }, mode);
    await page.goto("http://localhost:3000/#/farm", { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForTimeout(13000);
    if (mode === "react") {
      await page.evaluate(() => {
        document.getElementById("genesisBlock")?.scrollIntoView({ behavior: "instant", block: "center", inline: "center" });
      });
      await page.waitForTimeout(500);
    }
    await page.evaluate(() => window.__gameService.send("LANDSCAPE"));
    await page.waitForTimeout(2500);
    const state = await page.evaluate(() => JSON.stringify(window.__gameService.state.value));
    console.log(`${mode}: machine=${state}`);
    await page.screenshot({ path: `/tmp/landscaping-${mode}.png` });
    await page.close();
  }
  await browser.close();
})().catch((e) => { console.error("FATAL:", e.message); process.exit(1); });
