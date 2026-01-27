import Decimal from "decimal.js-light";
import { TEST_FARM } from "features/game/lib/constants";
import { getChapterTicket } from "features/game/types/chapters";
import { claimTrackMilestone } from "./claimTrackMilestone";

describe("claimTrackMilestone", () => {
  // Put ourselves on the Better Together testing tracks
  const now = new Date("2025-09-01T00:00:00.000Z").getTime();
  const ticket = getChapterTicket(now);

  it("requires player has completed the milestone", () => {
    expect(() =>
      claimTrackMilestone({
        state: {
          ...TEST_FARM,
        },
        action: { type: "trackMilestone.claimed", track: "free" },
        createdAt: now,
      }),
    ).toThrow("You do not meet the requirements for milestone 1");
  });

  it("requires track exists", () => {
    const noTrackDate = new Date("2025-06-01T00:00:00.000Z").getTime();

    expect(() =>
      claimTrackMilestone({
        state: {
          ...TEST_FARM,
        },
        action: { type: "trackMilestone.claimed", track: "free" },
        createdAt: noTrackDate,
      }),
    ).toThrow("Track does not exist");
  });

  it("requires player has points for the second milestone", () => {
    expect(() =>
      claimTrackMilestone({
        state: {
          ...TEST_FARM,
          farmActivity: {
            [`Better Together Points Earned`]: 100,
            "Better Together free Milestone Claimed": 1,
          },
        },
        action: { type: "trackMilestone.claimed", track: "free" },
        createdAt: now,
      }),
    ).toThrow("You do not meet the requirements for milestone 2");
  });

  it("requires vip for premium track", () => {
    expect(() =>
      claimTrackMilestone({
        state: {
          ...TEST_FARM,
          farmActivity: {
            [`Better Together Points Earned`]: 50,
          },
        },
        action: { type: "trackMilestone.claimed", track: "premium" },
        createdAt: now,
      }),
    ).toThrow("VIP is required");
  });

  it("does not claim a milestone that is not available (i.e. they've finished the track", () => {
    expect(() =>
      claimTrackMilestone({
        state: {
          ...TEST_FARM,
          farmActivity: {
            [`Better Together Points Earned`]: 200,
            "Better Together free Milestone Claimed": 2,
          },
        },
        action: { type: "trackMilestone.claimed", track: "free" },
        createdAt: now,
      }),
    ).toThrow("Milestone does not exist");
  });

  it("claims the first free milestone", () => {
    const state = claimTrackMilestone({
      state: {
        ...TEST_FARM,
        farmActivity: {
          [`Better Together Points Earned`]: 50,
        },
      },
      action: { type: "trackMilestone.claimed", track: "free" },
      createdAt: now,
    });

    expect(state.inventory.Gold).toEqual(new Decimal(1));
    expect(state.farmActivity["Better Together free Milestone Claimed"]).toBe(
      1,
    );
  });

  it("claims the second free milestone", () => {
    const state = claimTrackMilestone({
      state: {
        ...TEST_FARM,
        farmActivity: {
          [`Better Together Points Earned`]: 150,
          "Better Together free Milestone Claimed": 1,
        },
      },
      action: { type: "trackMilestone.claimed", track: "free" },
      createdAt: now,
    });

    expect(state.wardrobe["Acorn Hat"]).toBe(1);
    expect(state.farmActivity["Better Together free Milestone Claimed"]).toBe(
      2,
    );
  });

  it("claims a premium milestone", () => {
    const state = claimTrackMilestone({
      state: {
        ...TEST_FARM,
        vip: {
          expiresAt: now + 1000,
          bundles: [],
        },
        farmActivity: {
          [`Better Together Points Earned`]: 50,
        },
      },
      action: { type: "trackMilestone.claimed", track: "premium" },
      createdAt: now,
    });

    expect(state.inventory.Crimstone).toEqual(new Decimal(1));
    expect(
      state.farmActivity["Better Together premium Milestone Claimed"],
    ).toBe(1);
  });
});
