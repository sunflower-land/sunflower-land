import { INITIAL_FARM } from "features/game/lib/constants";
import { activateSurge } from "./activateSurge";
import Decimal from "decimal.js-light";

describe("surge.activated", () => {
  const now = new Date("2026-01-01").getTime();
  it("requires chapter is started", () => {
    expect(() =>
      activateSurge({
        action: { type: "surge.activated" },
        state: { ...INITIAL_FARM },
      }),
    ).toThrow("Chapter not started");
  });

  it("requires chapter is active", () => {
    expect(() =>
      activateSurge({
        action: { type: "surge.activated" },
        state: {
          ...INITIAL_FARM,
          chapter: {
            name: "Better Together",
            boughtAt: {},
          },
        },
        createdAt: now,
      }),
    ).toThrow("Chapter not active");
  });

  it("requires player has a surge", () => {
    expect(() =>
      activateSurge({
        action: { type: "surge.activated" },
        state: {
          ...INITIAL_FARM,
          chapter: {
            name: "Paw Prints",
            boughtAt: {},
          },
        },
        createdAt: now,
      }),
    ).toThrow("Missing surge");
  });

  it("applies the surge", () => {
    const state = activateSurge({
      action: { type: "surge.activated" },
      state: {
        ...INITIAL_FARM,
        inventory: {
          "Chapter Surge": new Decimal(2),
        },
        chapter: {
          name: "Paw Prints",
          boughtAt: {},
        },
      },
      createdAt: now,
    });

    expect(state.inventory["Chapter Surge"]).toEqual(new Decimal(1));
    expect(state.chapter?.surge?.power).toEqual(10);
  });
});
