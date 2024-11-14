import Decimal from "decimal.js-light";
import { INITIAL_STOCK } from "features/game/lib/constants";
import { getKeys } from "features/game/types/decorations";
import { GameState } from "features/game/types/game";
import { SEEDS } from "features/game/types/seeds";
import { TREASURE_TOOLS, WORKBENCH_TOOLS } from "features/game/types/tools";
import { produce } from "immer";
import { translate } from "lib/i18n/translate";
import { NPCName } from "lib/npcs";
import { onboardingAnalytics } from "lib/onboardingAnalytics";

export type RestockNPC = Extract<NPCName, "betty" | "jafar" | "blacksmith">;

export type EnhancedRestockAction = {
  type: "shops.restocked.enhanced";
  npc: RestockNPC;
};

type Options = {
  state: Readonly<GameState>;
  action: EnhancedRestockAction;
};

type RestockObject = {
  restockItem: object;
  gemPrice: number;
  shopName: string;
  category: string;
};

export const RestockItems: Record<RestockNPC, RestockObject> = {
  betty: {
    restockItem: SEEDS(),
    gemPrice: 12,
    shopName: translate("market"),
    category: translate("seeds").toLocaleLowerCase(),
  },
  blacksmith: {
    restockItem: WORKBENCH_TOOLS,
    gemPrice: 8,
    shopName: translate("workbench"),
    category: translate("tools").toLocaleLowerCase(),
  },
  jafar: {
    restockItem: TREASURE_TOOLS,
    gemPrice: 5,
    shopName: translate("treasure.shop"),
    category: translate("tools").toLocaleLowerCase(),
  },
};

export function enhancedRestock({ state, action }: Options): GameState {
  return produce(state, (game) => {
    const gems = game.inventory["Gem"] ?? new Decimal(0);
    const { npc } = action;

    const { restockItem, gemPrice } = RestockItems[npc];

    if (gems.lt(gemPrice)) {
      throw new Error("You do not have enough Gems");
    }

    game.stock = getKeys(INITIAL_STOCK(game)).reduce((acc, name) => {
      return {
        ...acc,
        [name]:
          name in restockItem ? INITIAL_STOCK(game)[name] : game.stock[name],
      };
    }, {});
    game.inventory["Gem"] = gems.sub(gemPrice);

    // https://developers.google.com/analytics/devguides/collection/ga4/reference/events?client_type=gtag#spend_virtual_currency
    onboardingAnalytics.logEvent("spend_virtual_currency", {
      value: gemPrice,
      virtual_currency_name: "Gem",
      item_name: "Restock",
    });

    return game;
  });
}
