/**
 * Dispatch-parity harness: performs a scripted interaction sequence on the
 * Phaser farm and asserts the events sent to the game machine match the
 * expected payload shapes (hand-derived from the DOM components during the
 * port — the parity reference).
 *
 * Usage:
 *   1. Offline farm running: VITE_API_URL= VITE_ROOM_URL= yarn dev  (port 3000)
 *   2. node docs/phaser-farm-migration/scripts/dispatch-parity.js [playwrightPath]
 *
 * Volatile fields (createdAt, uuid ids) are normalised before comparison.
 * The recorder taps the dev-only window.__gameService.send.
 */
const PLAYWRIGHT = process.argv[2] || "playwright";
const { chromium } = require(PLAYWRIGHT);

/**
 * Expected events per step. `id`/`cropId` values are uuid-normalised to
 * "<uuid>"; fixture-known ids stay literal.
 */
const EXPECTATIONS = [
  {
    step: "harvest sunflower plot 3",
    events: [{ type: "crop.harvested", index: "3" }],
  },
  {
    step: "harvest ready apple patch 1",
    events: [{ type: "fruit.harvested", index: "1" }],
  },
  {
    step: "pick wild mushroom 1",
    events: [{ type: "mushroom.picked", id: "1" }],
  },
  {
    step: "harvest ready flower bed 1",
    events: [{ type: "flower.harvested", id: "1" }],
  },
  {
    step: "harvest full beehive 2",
    events: [{ type: "beehive.harvested", id: "2" }],
  },
  {
    step: "chop tree 2 (3 taps)",
    events: [{ type: "timber.chopped", index: "2", item: "Axe" }],
  },
  {
    // Stone 1 (7,5) shares its tile with Barkley, and the DOM renders pets
    // after resources — the pet owns that click in both implementations.
    step: "mine stone 2 (3 taps)",
    events: [{ type: "stoneRock.mined", index: "2" }],
  },
];

const normalise = (event) => {
  const clone = { ...event };
  delete clone.createdAt;
  for (const key of Object.keys(clone)) {
    const value = clone[key];
    if (
      typeof value === "string" &&
      /^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$|^[0-9a-f]{8}$/.test(value)
    ) {
      clone[key] = "<uuid>";
    }
  }
  return clone;
};

(async () => {
  const browser = await chromium.launch({ channel: "chrome", args: ["--no-sandbox"] });
  const page = await browser.newPage({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 2,
  });
  page.on("console", (m) => {
    if (/CLKDBG/.test(m.text())) console.log(" ", m.text());
  });
  await page.addInitScript(() => {
    localStorage.setItem("phaserFarm", "1");
    ["island", "season", "expansions"].forEach((key) =>
      localStorage.removeItem(`phaserFarm.dev.${key}`),
    );
  });
  await page.goto("http://localhost:3000/#/farm", {
    waitUntil: "domcontentloaded",
    timeout: 60000,
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
  for (let i = 0; i < 5; i++) {
    const x = await page.$('img[src*="close"]');
    if (!x || !(await x.isVisible().catch(() => false))) break;
    await x.click({ force: true, timeout: 3000 }).catch(() => {});
    await page.keyboard.press("Escape").catch(() => {});
    await page.waitForTimeout(600);
  }
  await page.waitForTimeout(2000);
  // Modals gate canvas input; make sure it's back on before clicking.
  await page
    .waitForFunction(() => window.__farmGame?.input?.enabled === true, {
      timeout: 10000,
    })
    .catch(() => {});
  const inputEnabled = await page.evaluate(
    () => window.__farmGame?.input?.enabled,
  );
  console.log("canvas input enabled:", inputEnabled);
  await page.screenshot({ path: __dirname + "/dispatch-parity-precheck.png" });

  // Install the recorder.
  await page.evaluate(() => {
    const service = window.__gameService;
    if (!service) throw new Error("__gameService not exposed (dev build?)");
    window.__events = [];
    const original = service.send.bind(service);
    service.send = (...args) => {
      const event = typeof args[0] === "string" ? { type: args[0], ...(args[1] ?? {}) } : args[0];
      window.__events.push(event);
      return original(...args);
    };
  });

  const takeEvents = () =>
    page.evaluate(() => {
      const events = window.__events;
      window.__events = [];
      // Keep only game-action events (domain.event shape) — the machine also
      // receives SAVE ticks and xstate-internal done.invoke deliveries.
      return events.filter(
        (event) =>
          event &&
          typeof event.type === "string" &&
          event.type.includes(".") &&
          !event.type.startsWith("done.") &&
          !event.type.startsWith("error."),
      );
    });

  // Convert grid cells to CSS click points through the live camera — no
  // hardcoded screen positions to drift.
  const clickGrid = async (gx, gy, offX = 8, offY = 8) => {
    const [cssX, cssY] = await page.evaluate(
      ([gx, gy, offX, offY]) => {
        const game = window.__farmGame;
        const camera = game.scene.scenes[0].cameras.main;
        const DPR = Math.min(4, Math.max(2, Math.round(window.devicePixelRatio)));
        const worldX = gx * 16 + offX;
        const worldY = -gy * 16 + offY;
        const midX = camera.scrollX + camera.width / 2;
        const midY = camera.scrollY + camera.height / 2;
        return [
          ((worldX - midX) * camera.zoom + camera.width / 2) / DPR,
          ((worldY - midY) * camera.zoom + camera.height / 2) / DPR,
        ];
      },
      [gx, gy, offX, offY],
    );
    await page.mouse.click(cssX, cssY);
  };

  const results = [];
  const act = async (step, action) => {
    await action();
    await page.waitForTimeout(800);
    const raw = await page.evaluate(() => window.__events.length);
    const events = (await takeEvents()).map(normalise);
    console.log(`  [${step}] raw events in window: ${raw + events.length}`);
    results.push({ step, events });
  };

  await act("harvest sunflower plot 3", () => clickGrid(0, 0));
  await act("harvest ready apple patch 1", () => clickGrid(-5, 2, 16, 16));
  await act("pick wild mushroom 1", () => clickGrid(-1, 4));
  await act("harvest ready flower bed 1", () => clickGrid(-4, -2));
  await act("harvest full beehive 2", () => clickGrid(2, -2));
  // Trees/minerals fire on the 3rd tap [ResourceNodeRenderer.bumpTouch].
  const tap3 = (gx, gy, offX, offY) => async () => {
    for (let i = 0; i < 3; i++) {
      await clickGrid(gx, gy, offX, offY);
      await page.waitForTimeout(250);
    }
  };
  await act("chop tree 2 (3 taps)", tap3(5, 0, 16, 8));
  await act("mine stone 2 (3 taps)", tap3(3, 6, 8, 8));

  await browser.close();

  let failures = 0;
  for (let i = 0; i < EXPECTATIONS.length; i++) {
    const expected = EXPECTATIONS[i];
    const actual = results[i];
    const match =
      JSON.stringify(actual.events) === JSON.stringify(expected.events);
    console.log(
      `${match ? "PASS" : "FAIL"} ${expected.step}\n  expected: ${JSON.stringify(expected.events)}\n  actual:   ${JSON.stringify(actual.events)}`,
    );
    if (!match) failures++;
  }
  console.log(failures === 0 ? "ALL PASS" : `${failures} FAILURES`);
  process.exit(failures === 0 ? 0 : 1);
})().catch((error) => {
  console.error("FATAL:", error.message);
  process.exit(1);
});
