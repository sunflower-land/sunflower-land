import Decimal from "decimal.js-light";
import { INITIAL_FARM, TEST_FARM } from "../constants";
import { isDailyRewardReady } from "../../events/landExpansion/claimDailyReward";
import { OFFLINE_FARM } from "../landData";
import { encodeJsonParam } from "./previewLink";
import {
  PREVIEW_FIXTURE_NAMES,
  PREVIEW_USERNAME,
  applyPreviewLocalStorage,
  getPreviewFarm,
  getPreviewFixture,
} from "./previewState";

const NOW = Date.UTC(2026, 9, 7, 12, 0, 0);

const fakeStorage = () => {
  const data = new Map<string, string>();
  return {
    data,
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => void data.set(key, value),
  };
};

describe("getPreviewFarm", () => {
  it("boots the plain offline farm with no params", () => {
    expect(getPreviewFarm({ params: {}, now: NOW })).toBe(OFFLINE_FARM);
  });

  it("picks a fixture and skips the boot gates", () => {
    const farm = getPreviewFarm({ params: { fixture: "test" }, now: NOW });

    expect(farm.inventory).toEqual(TEST_FARM.inventory);
    expect(farm.tcsAcknowledged).toBe(NOW);
    expect(farm.farmActivity["welcome Bonus Claimed"]).toBe(1);
  });

  it("marks the daily chest as claimed today and names the Bumpkin", () => {
    // TEST_FARM has neither, so both gates would otherwise fire.
    expect(TEST_FARM.username).toBeUndefined();
    expect(TEST_FARM.dailyRewards?.chest).toBeUndefined();

    const farm = getPreviewFarm({ params: { fixture: "test" }, now: NOW });

    expect(farm.username).toBe(PREVIEW_USERNAME);
    expect(farm.dailyRewards?.chest).toEqual({ collectedAt: NOW, code: 0 });
    expect(farm.dailyRewards?.streaks).toBe(TEST_FARM.dailyRewards?.streaks);
    expect(
      isDailyRewardReady({
        bumpkinExperience: 1_000_000,
        ascensionLevel: 0,
        dailyRewards: farm.dailyRewards,
        now: NOW,
      }),
    ).toBe(false);
  });

  it("respects a username or daily chest the fixture or patch sets", () => {
    const patch = encodeJsonParam({
      username: "Chester",
      dailyRewards: { chest: { collectedAt: "$now-1d", code: 7 } },
    });
    const farm = getPreviewFarm({
      params: { fixture: "test", patch },
      now: NOW,
    });

    expect(farm.username).toBe("Chester");
    expect(farm.dailyRewards?.chest).toEqual({
      collectedAt: NOW - 24 * 60 * 60 * 1000,
      code: 7,
    });

    // INITIAL_FARM already carries a (random) username: leave it alone.
    const newFarm = getPreviewFarm({ params: { fixture: "new" }, now: NOW });
    expect(newFarm.username).toBe(INITIAL_FARM.username);
  });

  it("keeps the boot gates with ?intro=1", () => {
    const farm = getPreviewFarm({
      params: { fixture: "test", intro: "1" },
      now: NOW,
    });

    expect(farm.tcsAcknowledged).toBe(TEST_FARM.tcsAcknowledged);
    expect(farm.farmActivity["welcome Bonus Claimed"]).toBeUndefined();
    expect(farm.username).toBeUndefined();
    expect(farm.dailyRewards?.chest).toBeUndefined();
  });

  it("applies a patch with Decimal coercion and time tokens", () => {
    const patch = encodeJsonParam({
      coins: 777,
      inventory: { Sunflower: 12, "Hen House": 1 },
      henHouse: { animals: { "0": { awakeAt: "$now-2h" } } },
    });
    const farm = getPreviewFarm({
      params: { fixture: "test", patch },
      now: NOW,
    });

    expect(farm.coins).toBe(777);
    expect(farm.inventory.Sunflower).toBeInstanceOf(Decimal);
    expect(farm.inventory.Sunflower?.toNumber()).toBe(12);
    expect(farm.inventory["Hen House"]?.toNumber()).toBe(1);
    expect(farm.henHouse.animals["0"].awakeAt).toBe(NOW - 2 * 60 * 60 * 1000);
  });

  it("ignores a bad patch or unknown fixture instead of throwing", () => {
    const warnings: { param: string; message: string }[] = [];
    const farm = getPreviewFarm({
      params: { fixture: "nope", patch: "not-json" },
      now: NOW,
      warnings,
    });

    expect(warnings.map((w) => w.param)).toEqual(["fixture", "patch"]);
    expect(farm.inventory).toEqual(OFFLINE_FARM.inventory);
  });

  it("returns the same fixture object on repeated calls", () => {
    // Island builders randomise node ids; the game machine must see one farm.
    expect(getPreviewFixture("test")).toBe(getPreviewFixture("test"));
    expect(PREVIEW_FIXTURE_NAMES).toEqual(
      expect.arrayContaining(["default", "new", "test", "static", "spring"]),
    );
  });
});

describe("applyPreviewLocalStorage", () => {
  it("does nothing without preview params", () => {
    const storage = fakeStorage();
    applyPreviewLocalStorage({ params: {}, storage, now: NOW });
    expect(storage.data.size).toBe(0);
  });

  it("seeds ?ls= values and the notice stamps", () => {
    const storage = fakeStorage();
    applyPreviewLocalStorage({
      params: {
        fixture: "test",
        ls: encodeJsonParam({ mmo_server: "main", lastRead: "$date-1d" }),
      },
      storage,
      now: NOW,
    });

    expect(storage.getItem("mmo_server")).toBe("main");
    expect(storage.getItem("lastRead")).toBe(
      new Date(NOW - 24 * 60 * 60 * 1000).toISOString(),
    );
    expect(storage.getItem("islesIntroduction")).toBe(
      new Date(NOW).toISOString(),
    );
    expect(storage.getItem("vipIsRead")).toBe(new Date(NOW).toISOString());
  });

  it("leaves the notice stamps alone with ?intro=1", () => {
    const storage = fakeStorage();
    applyPreviewLocalStorage({
      params: { fixture: "test", intro: "1" },
      storage,
      now: NOW,
    });
    expect(storage.data.size).toBe(0);
  });
});
