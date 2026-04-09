import Decimal from "decimal.js-light";
import { GameState } from "features/game/types/game";
import {
  SALT_SCULPTURE_MAX_LEVEL,
  SALT_SCULPTURE_UPGRADES,
} from "features/game/types/saltSculpture";
import { populateSaltFarm } from "features/game/types/salt";
import { produce } from "immer";
import { hasFeatureAccess } from "lib/flags";

export type UpgradeSaltSculptureAction = {
  type: "saltSculpture.upgraded";
};

type Options = {
  state: Readonly<GameState>;
  action: UpgradeSaltSculptureAction;
  createdAt?: number;
};

export function upgradeSaltSculpture({
  state,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (game) => {
    const currentLevel = game.sculptures?.["Salt Sculpture"]?.level ?? 1;
    const nextLevel = currentLevel + 1;

    if (nextLevel > SALT_SCULPTURE_MAX_LEVEL) {
      throw new Error("Salt Sculpture is already max level");
    }

    const upgrade = SALT_SCULPTURE_UPGRADES[nextLevel];

    if (game.coins < upgrade.coins) {
      throw new Error("Insufficient coins");
    }

    for (const [item, amount] of Object.entries(upgrade.ingredients)) {
      const count =
        game.inventory[item as keyof typeof game.inventory] ?? new Decimal(0);
      if (count.lt(amount as Decimal)) {
        throw new Error(`Insufficient ${item}`);
      }
    }

    game.coins -= upgrade.coins;

    for (const [item, amount] of Object.entries(upgrade.ingredients)) {
      const count =
        game.inventory[item as keyof typeof game.inventory] ?? new Decimal(0);
      game.inventory[item as keyof typeof game.inventory] = count.sub(
        amount as Decimal,
      );
    }

    if (hasFeatureAccess(game, "SALT_FARM")) {
      populateSaltFarm({ game, now: createdAt });
    }

    if (!game.sculptures) game.sculptures = {};
    game.sculptures["Salt Sculpture"] = {
      level: nextLevel,
      upgradedAt: createdAt,
    };
  });
}
