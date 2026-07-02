import Decimal from "decimal.js-light";
import {
  GREENHOUSE_COMPOST,
  type GreenhouseCompostName,
} from "features/game/types/composters";
import type { GameState, GreenhousePlant } from "features/game/types/game";
import { produce } from "immer";
import { getGreenhouseReadyAt, isGreenhouseReady } from "./greenhouseReadiness";
import { MAX_POTS } from "./plantGreenhouse";

/**
 * Legacy (baked) model only: shifts `plantedAt` so the remaining grow time is
 * multiplied by 0.8 (−20%). Windowed plants (`baseDurationMs` set) get NO
 * mutation — the pot's open-ended `[fertilisedAt, ∞)` Greenhouse Glow window
 * (see getGreenhouseGlowWindows) speeds up the remaining grow live instead.
 */
function applyGreenhouseGlowToRemainingGrowTime(
  game: GameState,
  plant: GreenhousePlant,
  now: number,
): GreenhousePlant {
  if (plant.baseDurationMs !== undefined) return plant;

  const readyAt = getGreenhouseReadyAt(plant, game);
  if (now < readyAt) {
    const timeReduction = (readyAt - now) * 0.2;
    return { ...plant, plantedAt: plant.plantedAt - timeReduction };
  }
  return plant;
}

export enum FERTILISE_GREENHOUSE_ERRORS {
  NO_BUMPKIN = "No Bumpkin",
  NO_GREENHOUSE = "Greenhouse does not exist",
  INVALID_POT = "Pot does not exist",
  GREENHOUSE_ALREADY_FERTILISED = "Greenhouse pot is already fertilised!",
  NO_FERTILISER_SELECTED = "No fertiliser selected!",
  NOT_A_FERTILISER = "Not a fertiliser!",
  NOT_ENOUGH_FERTILISER = "Not enough fertiliser!",
  READY_TO_HARVEST = "Plant is ready to harvest!",
}

export type FertiliseGreenhouseAction = {
  type: "greenhouse.fertilised";
  id: number;
  fertiliser: GreenhouseCompostName;
};

type Options = {
  state: Readonly<GameState>;
  action: FertiliseGreenhouseAction;
  createdAt?: number;
};

export function fertiliseGreenhouse({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (game) => {
    if (!game.bumpkin) {
      throw new Error(FERTILISE_GREENHOUSE_ERRORS.NO_BUMPKIN);
    }

    if (
      !game.buildings.Greenhouse?.some((building) => !!building.coordinates)
    ) {
      throw new Error(FERTILISE_GREENHOUSE_ERRORS.NO_GREENHOUSE);
    }

    const potId = action.id;
    if (!Number.isInteger(potId) || potId <= 0 || potId > MAX_POTS) {
      throw new Error(FERTILISE_GREENHOUSE_ERRORS.INVALID_POT);
    }

    const pot = game.greenhouse.pots[potId] ?? {};

    if (pot.fertiliser) {
      throw new Error(
        FERTILISE_GREENHOUSE_ERRORS.GREENHOUSE_ALREADY_FERTILISED,
      );
    }

    if (!action.fertiliser) {
      throw new Error(FERTILISE_GREENHOUSE_ERRORS.NO_FERTILISER_SELECTED);
    }

    if (!(action.fertiliser in GREENHOUSE_COMPOST)) {
      throw new Error(FERTILISE_GREENHOUSE_ERRORS.NOT_A_FERTILISER);
    }

    const fertiliserAmount =
      game.inventory[action.fertiliser] ?? new Decimal(0);

    if (fertiliserAmount.lessThan(1)) {
      throw new Error(FERTILISE_GREENHOUSE_ERRORS.NOT_ENOUGH_FERTILISER);
    }

    const plant = pot.plant;
    if (isGreenhouseReady(createdAt, pot, game)) {
      throw new Error(FERTILISE_GREENHOUSE_ERRORS.READY_TO_HARVEST);
    }

    let nextPlant = plant;
    if (plant && action.fertiliser === "Greenhouse Glow") {
      nextPlant = applyGreenhouseGlowToRemainingGrowTime(
        game,
        plant,
        createdAt,
      );
    }

    game.greenhouse.pots[potId] = {
      ...pot,
      ...(nextPlant !== plant && nextPlant ? { plant: nextPlant } : {}),
      fertiliser: {
        name: action.fertiliser,
        fertilisedAt: createdAt,
      },
    };

    game.inventory[action.fertiliser] = fertiliserAmount.minus(1);

    return game;
  });
}
