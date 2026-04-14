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
    history: {},
    points: 0,
  },
};

describe("buyFactionShopItem", () => {
  it("throws an error if a player does not belong to a faction", () => {
    expect(() =>
      buyFactionShopItem({
        state: {
          ...GAME_STATE,
          faction: undefined,
        },
        action: { type: "factionShopItem.bought", item: "Knight Gambit" },
      }),
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
      }),
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
      }),
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
      }),
    ).toThrow("Player does not have enough marks");
  });

  it("throws an error if player does not have required wearable", () => {
    expect(() =>
      buyFactionShopItem({
        state: {
          ...GAME_STATE,
          inventory: {
            Mark: new Decimal(FACTION_SHOP_ITEMS["Goblin Crown"].price),
          },
        },
        action: {
          type: "factionShopItem.bought",
          item: "Goblin Crown",
        },
      }),
    ).toThrow("Player does not have enough required item");
  });

  it("throws an error if required wearable is active", () => {
    expect(() =>
      buyFactionShopItem({
        state: {
          ...GAME_STATE,
          inventory: {
            Mark: new Decimal(FACTION_SHOP_ITEMS["Goblin Crown"].price),
          },
          wardrobe: {
            "Goblin Helmet": 3,
          },
          bumpkin: {
            ...INITIAL_BUMPKIN,
            equipped: { ...INITIAL_BUMPKIN.equipped, hat: "Goblin Helmet" },
          },
        },
        action: {
          type: "factionShopItem.bought",
          item: "Goblin Crown",
        },
      }),
    ).toThrow("Player is using required item");
  });

  it("purchases a crown", () => {
    const state = buyFactionShopItem({
      state: {
        ...GAME_STATE,
        inventory: {
          Mark: new Decimal(FACTION_SHOP_ITEMS["Goblin Crown"].price),
        },
        wardrobe: {
          "Goblin Helmet": 1,
        },
      },
      action: {
        type: "factionShopItem.bought",
        item: "Goblin Crown",
      },
    });

    expect(state.wardrobe["Goblin Helmet"]).toBe(0);
    expect(state.wardrobe["Goblin Crown"]).toBe(1);
    expect(state.inventory.Mark).toStrictEqual(new Decimal(0));
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

  it("throws an error if key already bought today", () => {
    expect(() =>
      buyFactionShopItem({
        state: {
          ...GAME_STATE,
          inventory: {
            "Treasure Key": new Decimal(0),
            Mark: new Decimal(FACTION_SHOP_ITEMS["Treasure Key"].price),
          },
          pumpkinPlaza: {
            keysBought: {
              factionShop: {
                "Treasure Key": {
                  boughtAt: new Date("2024-08-09").getTime(),
                },
              },
              treasureShop: {},
              megastore: {},
            },
          },
        },
        action: {
          type: "factionShopItem.bought",
          item: "Treasure Key",
        },
        createdAt: new Date("2024-08-09").getTime(),
      }),
    ).toThrow("Already bought today");
  });

  it("updates createdAt when key is bought", () => {
    const state = buyFactionShopItem({
      state: {
        ...GAME_STATE,
        inventory: {
          "Treasure Key": new Decimal(0),
          Mark: new Decimal(FACTION_SHOP_ITEMS["Treasure Key"].price),
        },
      },
      action: {
        type: "factionShopItem.bought",
        item: "Treasure Key",
      },
      createdAt: new Date("2024-09-01").getTime(),
    });
    expect(state.inventory["Treasure Key"]).toStrictEqual(new Decimal(1));
    expect(state.inventory.Mark).toStrictEqual(new Decimal(0));
    expect(
      state.pumpkinPlaza.keysBought?.factionShop["Treasure Key"]?.boughtAt,
    ).toEqual(new Date("2024-09-01").getTime());
  });
});
