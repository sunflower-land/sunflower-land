import { SUNNYSIDE } from "assets/sunnyside";
import Decimal from "decimal.js-light";
import { INITIAL_STOCK } from "features/game/lib/constants";
import { getKeys } from "features/game/types/decorations";
import { GameState } from "features/game/types/game";
import { SEEDS } from "features/game/types/seeds";
import { TREASURE_TOOLS, WORKBENCH_TOOLS } from "features/game/types/tools";
import { CROP_LIFECYCLE } from "features/island/plots/lib/plant";
import { produce } from "immer";
import { translate } from "lib/i18n/translate";
import { NPCName } from "lib/npcs";
import { onboardingAnalytics } from "lib/onboardingAnalytics";

export type RestockNPC = Extract<NPCName, "betty" | "jafar" | "blacksmith">;

export type NPCRestockAction = {
  type: "npc.restocked";
  npc: RestockNPC;
};

type Options = {
  state: Readonly<GameState>;
  action: NPCRestockAction;
};

type Restock = {
  restockItem: object;
  gemPrice: number;
  shopName: string;
  categoryLabel: {
    labelText: string;
    icon: string;
  };
};

export const RestockItems: Record<RestockNPC, Restock> = {
  betty: {
    restockItem: SEEDS(),
    gemPrice: 15,
    shopName: translate("market"),
    categoryLabel: {
      labelText: translate("seeds"),
      icon: CROP_LIFECYCLE.Sunflower.seed,
    },
  },
  blacksmith: {
    restockItem: WORKBENCH_TOOLS,
    gemPrice: 10,
    shopName: translate("workbench"),
    categoryLabel: {
      labelText: translate("tools"),
      icon: SUNNYSIDE.tools.axe,
    },
  },
  jafar: {
    restockItem: TREASURE_TOOLS,
    gemPrice: 5,
    shopName: translate("treasure.shop"),
    categoryLabel: {
      labelText: translate("digging"),
      icon: SUNNYSIDE.tools.sand_shovel,
    },
  },
};

export function npcRestock({ state, action }: Options): GameState {
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
