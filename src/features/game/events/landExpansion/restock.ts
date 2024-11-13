import Decimal from "decimal.js-light";
import { INITIAL_STOCK } from "features/game/lib/constants";
import { getKeys } from "features/game/types/decorations";
import { GameState } from "features/game/types/game";
import { SEEDS } from "features/game/types/seeds";
import { TREASURE_TOOLS, WORKBENCH_TOOLS } from "features/game/types/tools";
import { produce } from "immer";
import { NPCName } from "lib/npcs";
import { onboardingAnalytics } from "lib/onboardingAnalytics";

export type RestockNPC = Extract<NPCName, "betty" | "jafar" | "blacksmith">;

export type RestockAction = {
  type: "shops.restocked";
  npc: RestockNPC;
};

type Options = {
  state: Readonly<GameState>;
  action: RestockAction;
};

export const RestockItems: Record<
  RestockNPC,
  { restockItem: any; gemPrice: number }
> = {
  betty: {
    restockItem: SEEDS(),
    gemPrice: 15,
  },
  blacksmith: {
    restockItem: WORKBENCH_TOOLS,
    gemPrice: 10,
  },
  jafar: {
    restockItem: TREASURE_TOOLS,
    gemPrice: 5,
  },
};

export function restock({ state, action }: Options): GameState {
  return produce(state, (game) => {
    const gems = game.inventory["Gem"] ?? new Decimal(0);
    const { npc } = action;

    if (gems.lt(RestockItems[npc]?.gemPrice)) {
      throw new Error("You do not have enough Gems");
    }

    game.stock = getKeys(INITIAL_STOCK(game)).reduce((acc, name) => {
      return {
        ...acc,
        [name]:
          name in RestockItems[npc].restockItem
            ? INITIAL_STOCK(game)[name]
            : game.stock[name],
      };
    }, {});
    game.inventory["Gem"] = gems.sub(RestockItems[npc]?.gemPrice);

    // https://developers.google.com/analytics/devguides/collection/ga4/reference/events?client_type=gtag#spend_virtual_currency
    onboardingAnalytics.logEvent("spend_virtual_currency", {
      value: 1,
      virtual_currency_name: "Gem",
      item_name: "Restock",
    });

    return game;
  });
}
