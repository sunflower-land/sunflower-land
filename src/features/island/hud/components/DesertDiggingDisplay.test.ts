import { INITIAL_FARM } from "features/game/lib/constants";
import { getRegularMaxDigs } from "./DesertDiggingDisplay";

describe("getRegularMaxDigs", () => {
  it("adds digs for Meerkat", () => {
    const now = Date.now();
    const maxDigs = getRegularMaxDigs({
      ...INITIAL_FARM,
      collectibles: {
        Meerkat: [
          {
            id: "meerkat",
            createdAt: now,
            coordinates: { x: 0, y: 0 },
            readyAt: now,
          },
        ],
      },
    });

    expect(maxDigs).toEqual(30);
  });
});
