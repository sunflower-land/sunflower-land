import { MoonForgeAnalytics, MoonForgeErrorTracker } from "lib/moonforge";
import {
  consumeSignupPending,
  markSignupPending,
  mfAccountCreated,
  mfCurrencyChange,
  mfEconomy,
  mfExperiment,
  mfIapCompleted,
  mfIapInitiated,
  mfIdentify,
  mfScreen,
  mfSetScene,
  mfTrack,
  mfTutorialComplete,
  mfTutorialStart,
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

    const eventOf = () =>
      JSON.parse((fetchMock.mock.calls[0][1] as { body: string }).body).payload;

    const eventsOf = () =>
      fetchMock.mock.calls.map(
        (call) => JSON.parse((call[1] as { body: string }).body).payload,
      );

    describe("mfEconomy", () => {
      it("posts economy_transaction with flattened input and output rows", () => {
        mfEconomy("speed_up_building", {
          inputs: [{ type: "Gem", before: 10, after: 7 }],
          outputs: [{ type: "Basic Building", before: 0, after: 1 }],
        });

        const { name, data } = eventOf();
        expect(name).toBe("economy_transaction");
        expect(data).toMatchObject({
          reason: "speed_up_building",
          input_1_type: "Gem",
          input_1_before: 10,
          input_1_after: 7,
          output_1_type: "Basic Building",
          output_1_before: 0,
          output_1_after: 1,
        });
      });

      it("omits before / after for the ends that are not known", () => {
        mfEconomy("daily_reward", { outputs: [{ type: "Coin", after: 250 }] });

        const { data } = eventOf();
        expect(data).toMatchObject({
          reason: "daily_reward",
          output_1_type: "Coin",
          output_1_after: 250,
        });
        expect(data).not.toHaveProperty("output_1_before");
        expect(data).not.toHaveProperty("input_1_type");
      });

      it("emits every input/output in one event - no cap, nothing dropped", () => {
        mfEconomy("craft_collectible", {
          inputs: [
            { type: "Coin", before: 100, after: 90 },
            { type: "Sunflower", before: 4, after: 3 },
            { type: "Potato", before: 4, after: 3 },
            { type: "Pumpkin", before: 4, after: 3 },
            { type: "Carrot", before: 4, after: 3 },
          ],
          outputs: [{ type: "Scary Mike", before: 0, after: 1 }],
        });

        const events = eventsOf();
        expect(events).toHaveLength(1);
        expect(events[0].name).toBe("economy_transaction");
        expect(events[0].data).toMatchObject({
          reason: "craft_collectible",
          input_1_type: "Coin",
          input_1_before: 100,
          input_1_after: 90,
          input_2_type: "Sunflower",
          input_3_type: "Potato",
          input_4_type: "Pumpkin",
          input_5_type: "Carrot",
          input_5_after: 3,
          output_1_type: "Scary Mike",
        });
      });
    });

    describe("mfCurrencyChange", () => {
      it("puts moved balances on the output side for a grant", () => {
        mfCurrencyChange("daily_reward", "grant", {
          coin: { before: 100, after: 350 },
          sfl: { before: 5, after: 5 },
        });

        const { name, data } = eventOf();
        expect(name).toBe("economy_transaction");
        expect(data).toMatchObject({
          reason: "daily_reward",
          output_1_type: "Coin",
          output_1_before: 100,
          output_1_after: 350,
        });
        // SFL did not move - dropped.
        expect(data).not.toHaveProperty("output_2_type");
      });

      it("puts moved balances on the input side for a spend", () => {
        mfCurrencyChange("speed_up_building", "spend", {
          gem: { before: 10, after: 7 },
        });

        const { data } = eventOf();
        expect(data).toMatchObject({
          reason: "speed_up_building",
          input_1_type: "Gem",
          input_1_before: 10,
          input_1_after: 7,
        });
      });

      it("sends nothing when no balance moved", () => {
        mfCurrencyChange("noop", "grant", { coin: { before: 1, after: 1 } });
        expect(fetchMock).not.toHaveBeenCalled();
      });
    });

    it("mfIapInitiated posts iap_initiated with the required keys", () => {
      mfIapInitiated({ product_id: "gems_500", price: 4.99, currency: "USD" });

      const { name, data } = eventOf();
      expect(name).toBe("iap_initiated");
      expect(data).toMatchObject({
        product_id: "gems_500",
        price: 4.99,
        currency: "USD",
      });
    });

    it("mfIapCompleted includes the transaction_id so a double callback de-dupes", () => {
      mfIapCompleted({
        product_id: "gems_500",
        price: 4.99,
        currency: "USD",
        transaction_id: "txn_abc",
        store: "web",
      });

      const { name, data } = eventOf();
      expect(name).toBe("iap_completed");
      expect(data).toMatchObject({
        product_id: "gems_500",
        transaction_id: "txn_abc",
        store: "web",
      });
    });

    it("mfTutorialStart / mfTutorialComplete send the locked names", () => {
      mfTutorialStart();
      expect(eventOf().name).toBe("tutorial_start");

      fetchMock.mockClear();
      mfTutorialComplete("completed");
      expect(eventOf()).toMatchObject({
        name: "tutorial_complete",
        data: { outcome: "completed" },
      });
    });

    it("mfAccountCreated sends signup_method and optional provider", () => {
      mfAccountCreated({ signup_method: "social", provider: "google" });

      const { name, data } = eventOf();
      expect(name).toBe("account_created");
      expect(data).toMatchObject({
        signup_method: "social",
        provider: "google",
      });
    });

    describe("signup marker (farm-scoped)", () => {
      afterEach(() => localStorage.clear());

      it("consumes only the marker for the matching farm, then clears it", () => {
        markSignupPending(42, { signup_method: "email" });

        expect(consumeSignupPending(99)).toBeUndefined();
        expect(consumeSignupPending(42)).toEqual({ signup_method: "email" });
        // consumed - gone now
        expect(consumeSignupPending(42)).toBeUndefined();
      });

      it("leaves another farm's stale marker untouched", () => {
        markSignupPending(1, { signup_method: "platform" });

        // A different account signs in on the same browser - no false signup.
        expect(consumeSignupPending(2)).toBeUndefined();
        // Farm 1's marker is still there for whenever farm 1 loads.
        expect(consumeSignupPending(1)).toEqual({ signup_method: "platform" });
      });
    });

    it("the locked helpers swallow a rejected trackEvent without an unhandled rejection", async () => {
      const spy = jest
        .spyOn(MoonForgeAnalytics, "trackEvent")
        .mockReturnValue(Promise.reject(new Error("collector down")) as never);

      const unhandled: unknown[] = [];
      const onUnhandled = (e: unknown) => unhandled.push(e);
      process.on("unhandledRejection", onUnhandled);

      expect(() => {
        mfEconomy("daily_reward", { outputs: [{ type: "Coin", after: 1 }] });
        mfIapCompleted({
          product_id: "p",
          price: 1,
          currency: "USD",
          transaction_id: "t",
        });
        mfAccountCreated({ signup_method: "other" });
      }).not.toThrow();

      await new Promise((r) => setTimeout(r, 10));
      process.off("unhandledRejection", onUnhandled);

      expect(unhandled).toHaveLength(0);
      spy.mockRestore();
    });
  });
});
