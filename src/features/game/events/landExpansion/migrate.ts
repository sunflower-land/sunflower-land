import Decimal from "decimal.js-light";
import cloneDeep from "lodash.clonedeep";
import { GameState } from "../../types/game";

export type LandExpansionMigrateAction = {
  type: "game.migrated";
};

type Options = {
  state: Readonly<GameState>;
  action: LandExpansionMigrateAction;
  createdAt?: number;
};

export const canMigrate = (state: GameState) => {
  const { skills, inventory } = state;
  const { farming, gathering } = skills;

  const hasEnoughXP = farming.add(gathering).gte(new Decimal(21700));
  const isWarrior = inventory.Warrior?.gte(1);
  const isMod = inventory["Discord Mod"]?.gte(1);
  const isCoder = inventory.Coder?.gte(1);
  const isArtist = inventory.Artist?.gte(1);

  return !!hasEnoughXP || !!isWarrior || !!isMod || !!isCoder || !!isArtist;
};

export function migrate({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const stateCopy = cloneDeep(state) as GameState;

  stateCopy.migrated = true;

  const rustyShovelCount =
    stateCopy.inventory["Rusty Shovel"] || new Decimal(0);

  stateCopy.inventory["Rusty Shovel"] = rustyShovelCount.add(new Decimal(2));

  return stateCopy;
}
