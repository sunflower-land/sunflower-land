import { INITIAL_BUMPKIN, INITIAL_FARM } from "features/game/lib/constants";
import { replenishStamina } from "./replenishStamina";

describe("replenishStamina", () => {
  const dateNow = Date.now();
  it("updates the replenished timestamp to the current time", () => {
    const initialState = { ...INITIAL_FARM, bumpkin: INITIAL_BUMPKIN };

    const state = replenishStamina({
      state: initialState,
      action: { type: "bumpkin.replenishStamina" },
      createdAt: dateNow,
    });

    expect(initialState.bumpkin.stamina.replenishedAt).toBe(0);
    expect(state.bumpkin?.stamina.replenishedAt).toBe(dateNow);
  });
});
