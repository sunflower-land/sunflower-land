import { MoonForgeAnalytics, MoonForgeErrorTracker } from "lib/moonforge";
import {
  mfExperiment,
  mfIdentify,
  mfScreen,
  mfSetScene,
  mfTrack,
} from "./moonforgeAnalytics";

const TEST_GAME_ID = "00000000-0000-4000-8000-000000000000";

describe("moonforgeAnalytics", () => {
  let fetchMock: jest.Mock;

  beforeEach(() => {
    fetchMock = jest.fn(async () => ({
      ok: true,
      status: 200,
      json: async () => ({ cache: "token" }),
    }));
    (globalThis as { fetch?: unknown }).fetch = fetchMock;
    jest.spyOn(console, "warn").mockImplementation(() => undefined);
    jest.spyOn(console, "log").mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("before the SDK is initialised", () => {
    it("no-ops without throwing and sends nothing", () => {
      expect(() => {
        mfTrack("crop_harvested", { crop_type: "Sunflower" });
        mfScreen("PlazaScene");
        mfIdentify("account1");
        mfSetScene("PlazaScene");
      }).not.toThrow();

      expect(fetchMock).not.toHaveBeenCalled();
    });
  });

  describe("after the SDK is initialised", () => {
    // Events are buffered until the player is identified, so that
    // session_start and other boot-time events can be attributed to the
    // account rather than an anonymous id. These cases assert the envelope
    // and delivery, so they start from the identified state.
    beforeEach(() => {
      MoonForgeAnalytics.markIdentified();
    });

    beforeAll(() => {
      MoonForgeAnalytics.init({
        gameId: TEST_GAME_ID,
        autoTrackSession: false,
      });
    });

    it("mfTrack posts the event envelope to the collector", () => {
      mfTrack("crop_harvested", { crop_type: "Sunflower", amount: 1 });

      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [url, init] = fetchMock.mock.calls[0];
      expect(String(url)).toBe("https://collector.moonforge.co/api/send");

      const body = JSON.parse((init as { body: string }).body);
      expect(body.type).toBe("event");
      expect(body.payload.game).toBe(TEST_GAME_ID);
      expect(body.payload.name).toBe("crop_harvested");
      expect(body.payload.data).toMatchObject({
        crop_type: "Sunflower",
        amount: 1,
      });
    });

    it("sends unix-second timestamps (collector rejects milliseconds)", () => {
      mfTrack("crop_harvested", { crop_type: "Sunflower" });

      const body = JSON.parse(
        (fetchMock.mock.calls[0][1] as { body: string }).body,
      );
      expect(body.payload.timestamp).toBeGreaterThan(1e9);
      expect(body.payload.timestamp).toBeLessThan(1e11);
    });

    it("mfScreen posts a screen_view with the scene name", () => {
      mfScreen("BeachScene");

      const body = JSON.parse(
        (fetchMock.mock.calls[0][1] as { body: string }).body,
      );
      expect(body.payload.name).toBe("screen_view");
      expect(body.payload.data.screen_name).toBe("BeachScene");
    });

    it("mfSetScene tags the error tracker's game state", () => {
      mfSetScene("KingdomScene");

      expect(MoonForgeErrorTracker.getGameState()).toMatchObject({
        sceneName: "KingdomScene",
      });
    });

    it("never throws into game code even if the SDK throws", () => {
      const spy = jest
        .spyOn(MoonForgeAnalytics, "trackEvent")
        .mockImplementation(() => {
          throw new Error("boom");
        });

      expect(() => mfTrack("crop_harvested")).not.toThrow();

      spy.mockRestore();
    });

    it("identifies with a farm-scoped id so sessions join across visits", () => {
      const spy = jest.spyOn(MoonForgeAnalytics, "identify");

      mfIdentify("account123", { farmId: 456 });

      expect(spy).toHaveBeenCalledWith("account123", {
        farmId: 456,
      });

      spy.mockRestore();
    });

    it("sends with keepalive so a backgrounded mobile tab still delivers", () => {
      mfTrack("session_start");

      const init = fetchMock.mock.calls[0][1];
      expect(init.keepalive).toBe(true);
    });

    it("records experiment assignment so a holdout can be analysed later", () => {
      mfExperiment("purchase_prompt_holdout", "control");

      const body = JSON.parse(
        (fetchMock.mock.calls[0][1] as { body: string }).body,
      );
      expect(body.payload.name).toBe("experiment_assigned");
      expect(body.payload.data).toMatchObject({
        experiment_id: "purchase_prompt_holdout",
        variant: "control",
      });
    });

    // trackEvent returns postEvent's promise, so a collector failure rejects
    // rather than throwing. A try/catch alone leaves that unhandled in the
    // player's browser.
    it("mfExperiment handles a rejected trackEvent without an unhandled rejection", async () => {
      const spy = jest
        .spyOn(MoonForgeAnalytics, "trackEvent")
        .mockReturnValue(Promise.reject(new Error("collector down")) as never);

      const unhandled: unknown[] = [];
      const onUnhandled = (e: unknown) => unhandled.push(e);
      process.on("unhandledRejection", onUnhandled);

      expect(() => mfExperiment("exp", "control")).not.toThrow();

      await new Promise((r) => setTimeout(r, 10));
      process.off("unhandledRejection", onUnhandled);

      expect(unhandled).toHaveLength(0);
      spy.mockRestore();
    });

    it("mfExperiment never throws into game code even if the SDK throws", () => {
      const spy = jest
        .spyOn(MoonForgeAnalytics, "trackEvent")
        .mockImplementation(() => {
          throw new Error("boom");
        });

      expect(() =>
        mfExperiment("purchase_prompt_holdout", "control"),
      ).not.toThrow();

      spy.mockRestore();
    });
  });
});
