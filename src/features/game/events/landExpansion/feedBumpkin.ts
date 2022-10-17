import Decimal from "decimal.js-light";
import { MAX_STAMINA } from "features/game/lib/constants";
import { getBumpkinLevel } from "features/game/lib/level";
import { trackActivity } from "features/game/types/bumpkinActivity";
import { ConsumableName, CONSUMABLES } from "features/game/types/consumables";
import { GameState } from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";
import { replenishStamina } from "./replenishStamina";

export type FeedBumpkinAction = {
  type: "bumpkin.feed";
  food: ConsumableName;
};

type Options = {
  state: Readonly<GameState>;
  action: FeedBumpkinAction;
  createdAt?: number;
};

export function feedBumpkin({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const replenishedState = replenishStamina({
    state,
    action: { type: "bumpkin.replenishStamina" },
    createdAt,
  });
  const stateCopy = cloneDeep(replenishedState);

  const bumpkin = stateCopy.bumpkin;
  const inventory = stateCopy.inventory;
  const quantity = inventory[action.food] ?? new Decimal(0);

  if (bumpkin === undefined) {
    throw new Error("You do not have a Bumpkin");
  }

  const maxStamina = MAX_STAMINA[getBumpkinLevel(bumpkin.experience)];

  if (quantity.lte(0)) {
    throw new Error("You have none of this food type");
  }

  inventory[action.food] = quantity.sub(1);

  let foodExperience = CONSUMABLES[action.food].experience;

  if (bumpkin.skills["Kitchen Hand"]) {
    foodExperience += 0.1;
  }

  bumpkin.experience += foodExperience;
  bumpkin.stamina.value = Math.min(
    bumpkin.stamina.value + CONSUMABLES[action.food].stamina,
    maxStamina
  );

  bumpkin.activity = trackActivity(`${action.food} Fed`, bumpkin.activity);

  return stateCopy;
}
