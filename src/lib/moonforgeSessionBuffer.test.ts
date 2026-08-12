import { MoonForgeAnalytics } from "lib/moonforge";

/**
 * `session_start` fires the moment `init` runs, but the game cannot call
 * `identify` until an async session round trip returns. Before buffering, that
 * meant the first events of every session carried the anonymous id and could
 * never be attributed to the account that produced them — which is what made
 * roughly two thirds of players look like single-day visitors.
 */
describe("pre-identification event buffering", () => {
  const ORIGINAL_FETCH = global.fetch;

  let sent: Array<Record<string, unknown>>;

  const sentNames = () =>
    sent.map((body) => (body.payload as { name?: string })?.name);

  const sentIds = () =>
    sent.map((body) => (body.payload as { id?: string })?.id);

  beforeEach(() => {
    jest.useFakeTimers();
    sent = [];
    localStorage.clear();
    MoonForgeAnalytics.resetBuffering();

    global.fetch = jest.fn(async (_url: unknown, init: unknown) => {
      const body = (init as { body?: string })?.body;
      if (body) sent.push(JSON.parse(body));
      return new Response("{}", { status: 200 });
    }) as unknown as typeof fetch;

    MoonForgeAnalytics.init({
      gameId: "11111111-1111-1111-1111-111111111111",
      apiEndpoint: "https://collector.example.com",
      autoTrackSession: false,
    });
  });

  afterEach(() => {
    jest.useRealTimers();
    global.fetch = ORIGINAL_FETCH;
    MoonForgeAnalytics.resetBuffering();
  });

  it("holds events emitted before identification", async () => {
    MoonForgeAnalytics.trackEvent("session_start");
    await Promise.resolve();

    expect(sent).toHaveLength(0);
  });

  it("releases them once the player is identified", async () => {
    MoonForgeAnalytics.trackEvent("session_start");
    MoonForgeAnalytics.trackEvent("crop_planted");
    await Promise.resolve();

    expect(sent).toHaveLength(0);

    MoonForgeAnalytics.identify("account456");
    await Promise.resolve();
    await Promise.resolve();

    expect(sentNames()).toEqual(
      expect.arrayContaining(["session_start", "crop_planted"]),
    );
  });

  // The whole point: the buffered events must carry the account id, not the
  // anonymous one they were created with.
  it("rewrites buffered events to the identified id", async () => {
    MoonForgeAnalytics.trackEvent("session_start");
    await Promise.resolve();

    MoonForgeAnalytics.identify("account456");
    await Promise.resolve();
    await Promise.resolve();

    const sessionStart = sent.find(
      (b) => (b.payload as { name?: string })?.name === "session_start",
    );

    expect((sessionStart?.payload as { id?: string })?.id).toBe("account456");
  });

  it("sends normally once identified, without buffering again", async () => {
    MoonForgeAnalytics.identify("account456");
    await Promise.resolve();
    await Promise.resolve();
    sent = [];

    MoonForgeAnalytics.trackEvent("crop_harvested");
    await Promise.resolve();

    expect(sentNames()).toContain("crop_harvested");
  });

  // A logged-out visitor never identifies. Holding their events forever would
  // lose them entirely, which is worse than an anonymous id.
  it("flushes anonymously when identification never arrives", async () => {
    MoonForgeAnalytics.trackEvent("session_start");
    await Promise.resolve();
    expect(sent).toHaveLength(0);

    jest.advanceTimersByTime(10_000);
    await Promise.resolve();
    await Promise.resolve();

    expect(sentNames()).toContain("session_start");
    expect(sentIds()[0]).not.toBe("account456");
  });

  // session_end is emitted at page teardown. Buffering one loses it outright.
  it("never buffers a beacon event", async () => {
    MoonForgeAnalytics.trackEvent("session_end", {}, { beacon: true });
    await Promise.resolve();

    expect(sentNames()).toContain("session_end");
  });

  it("does not buffer the identify call itself", async () => {
    MoonForgeAnalytics.identify("account456");
    await Promise.resolve();

    expect(sent.some((b) => b.type === "identify")).toBe(true);
  });

  it("stops buffering rather than growing without bound", async () => {
    for (let i = 0; i < 60; i++) {
      MoonForgeAnalytics.trackEvent(`event_${i}`);
    }
    await Promise.resolve();
    await Promise.resolve();

    // Past the cap, events go out immediately rather than accumulating.
    expect(sent.length).toBeGreaterThan(0);
  });

  it("is idempotent — a second identify does not resend the buffer", async () => {
    MoonForgeAnalytics.trackEvent("session_start");
    await Promise.resolve();

    MoonForgeAnalytics.identify("account456");
    await Promise.resolve();
    await Promise.resolve();
    const afterFirst = sentNames().filter((n) => n === "session_start").length;

    MoonForgeAnalytics.identify("account456");
    await Promise.resolve();
    await Promise.resolve();

    expect(
      sentNames().filter((n) => n === "session_start").length,
    ).toBe(afterFirst);
  });
});
