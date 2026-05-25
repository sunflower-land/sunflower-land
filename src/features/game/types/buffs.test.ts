import Decimal from "decimal.js-light";

import { TEST_BUMPKIN } from "features/game/lib/bumpkinData";
import { INITIAL_FARM } from "features/game/lib/constants";
import { CROPS } from "features/game/types/crops";
import { GameState } from "features/game/types/game";
import { applyBuff } from "./buffs";

const dateNow = Date.now();

describe("applyBuff", () => {
  it("moves Basic Scarecrow AOE availability when Power hour speeds up an existing crop", () => {
    const cropTime = CROPS["Sunflower"].harvestSeconds * 1000;
    const remainingTime = 30 * 1000;
    const timeReduction = remainingTime / 2;
    const plantedAt = dateNow + remainingTime - cropTime;
    const readyAt = dateNow + remainingTime;

    const state: GameState = {
      ...INITIAL_FARM,
      bumpkin: TEST_BUMPKIN,
      inventory: { "Sunflower Seed": new Decimal(1) },
      collectibles: {
        "Basic Scarecrow": [
          {
            id: "123",
            createdAt: dateNow,
            coordinates: { x: 0, y: 0 },
            readyAt: dateNow - 12 * 60 * 1000,
          },
        ],
      },
      aoe: {
        "Basic Scarecrow": {
          0: {
            "-2": readyAt,
          },
        },
      },
      crops: {
        0: {
          createdAt: dateNow,
          x: 0,
          y: -2,
          crop: {
            name: "Sunflower",
            plantedAt,
          },
        },
      },
    };

    const stateWithPowerHour = applyBuff({
      buff: "Power hour",
      game: state,
      now: dateNow,
    });

    expect(stateWithPowerHour.crops[0].crop?.boostedTime).toBe(timeReduction);
    expect(stateWithPowerHour.aoe["Basic Scarecrow"]?.[0]?.["-2"]).toBe(
      dateNow + timeReduction,
    );
  });
});
