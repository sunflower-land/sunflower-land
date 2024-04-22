import { GameState } from "features/game/types/game";
import { TEST_FARM } from "features/game/lib/constants";
import { startCropMachine } from "./startCropMachine";

const GAME_STATE: GameState = TEST_FARM;

describe("start Crop Machine", () => {
  const dateNow = Date.now();

  it("throws an error if Crop Machine does not exist", () => {
    expect(() =>
      startCropMachine({
        state: GAME_STATE,
        action: { type: "cropMachine.started" },
      })
    ).toThrow("Crop Machine does not exist");
  });
});
