// eslint-disable-next-line @typescript-eslint/no-var-requires
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

export function migrate({ state, action, createdAt = Date.now() }: Options) {
  const stateCopy = cloneDeep(state);
  const { skills } = stateCopy;
  const { farming, gathering } = skills;

  const hasEnoughXP = farming.add(gathering).gte(10000);

  if (!hasEnoughXP) {
    throw new Error("You don't meet the requirements for migrating");
  }
}
