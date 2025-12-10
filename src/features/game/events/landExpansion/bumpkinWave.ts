import { GameState } from "features/game/types/game";
import { produce } from "immer";

export type BumpkinWaveAction = {
  type: "bumpkin.wave";
  /**
   * The farm id of the other player involved in the wave interaction.
   * Used to enforce a maximum of 1 point per player per day.
   */
  otherFarmId: number;
};

type Options = {
  state: Readonly<GameState>;
  action: BumpkinWaveAction;
  createdAt?: number;
};

export function bumpkinWave({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (draft) => {
    const today = new Date(createdAt).toISOString().split("T")[0];

    if (
      !draft.socialFarming.waves ||
      draft.socialFarming.waves.date !== today
    ) {
      draft.socialFarming.waves = {
        date: today,
        farms: [],
      };
    }

    const waves = draft.socialFarming.waves;

    // Enforce 1 point per player per day
    if (waves.farms.includes(action.otherFarmId)) {
      return draft;
    }

    // Enforce a maximum of 20 waves (points) per day
    if (waves.farms.length >= 20) {
      return draft;
    }

    waves.farms.push(action.otherFarmId);

    draft.socialFarming.points += 1;
    draft.socialFarming.weeklyPoints.points += 1;
  });
}
