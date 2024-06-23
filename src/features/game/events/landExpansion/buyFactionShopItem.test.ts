import Decimal from "decimal.js-light";
import { INITIAL_BUMPKIN, INITIAL_FARM } from "features/game/lib/constants";
import {
  FactionShopItemName,
  FACTION_SHOP_ITEMS,
} from "features/game/types/factionShop";
import { GameState, Faction } from "features/game/types/game";
import { buyFactionShopItem } from "./buyFactionShopItem";

const GAME_STATE: GameState = {
  ...INITIAL_FARM,
  bumpkin: INITIAL_BUMPKIN,
  faction: {
    name: "goblins",
    pledgedAt: 0,
    donated: {
      daily: {
        resources: {},
        sfl: {},
      },
      totalItems: {},
    },
    points: 0,
  },
};

describe("buyFactionShopItem", () => {
  it("throws an error if there is no bumpkin", () => {
    expect(() =>
      buyFactionShopItem({
        state: {
          ...GAME_STATE,
          bumpkin: undefined,
        },
        action: {
          type: "factionShopItem.bought",
          item: "Motley",
        },
      })
    ).toThrow("Bumpkin not found");
  });

  it("throws an error if a player does not belong to a faction", () => {
    expect(() =>
      buyFactionShopItem({
        state: {
          ...GAME_STATE,
          faction: undefined,
        },
        action: { type: "factionShopItem.bought", item: "Motley" },
      })
    ).toThrow("Player does not belong to a faction");
  });

  it("throws an error if the item does not exist", () => {
    expect(() =>
      buyFactionShopItem({
        state: GAME_STATE,
        action: {
          type: "factionShopItem.bought",
          item: "Test Item" as FactionShopItemName,
        },
      })
    ).toThrow("This item does not exist");
  });

  it("throws an error if the player is not in the required faction", () => {
    expect(() =>
      buyFactionShopItem({
        state: {
          ...GAME_STATE,
        },
        action: {
          type: "factionShopItem.bought",
          item: "Nightshade Armor",
        },
      })
    ).toThrow("Player is not in the required faction");
  });

  it("throws an error if the player doesn't have enough marks", () => {
    expect(() =>
      buyFactionShopItem({
        state: {
          ...GAME_STATE,
        },
        action: {
          type: "factionShopItem.bought",
          item: "Goblin Armor",
        },
      })
    ).toThrow("Player does not have enough marks");
  });

  it("purchases a wearable", () => {
    const state = buyFactionShopItem({
      state: {
        ...GAME_STATE,
        inventory: {
          Mark: new Decimal(FACTION_SHOP_ITEMS["Goblin Armor"].price),
        },
      },
      action: {
        type: "factionShopItem.bought",
        item: "Goblin Armor",
      },
    });

    expect(state.wardrobe["Goblin Armor"]).toBe(1);
    expect(state.inventory.Mark).toStrictEqual(new Decimal(0));
  });

  it("purchases a collectible", () => {
    const state = buyFactionShopItem({
      state: {
        ...GAME_STATE,
        faction: {
          ...(GAME_STATE.faction as Faction),
          name: "bumpkins",
        },
        inventory: {
          Mark: new Decimal(FACTION_SHOP_ITEMS["Bumpkin Charm Egg"].price),
        },
      },
      action: {
        type: "factionShopItem.bought",
        item: "Bumpkin Charm Egg",
      },
    });

    expect(state.inventory["Bumpkin Charm Egg"]).toStrictEqual(new Decimal(1));
    expect(state.inventory.Mark).toStrictEqual(new Decimal(0));
  });
});
