import { Decimal } from "decimal.js-light";
import { EXPIRY_COOLDOWNS } from "features/game/lib/collectibleBuilt";
import { getKeys } from "features/game/lib/crafting";
import { PlaceableLocation } from "features/game/types/collectibles";
import { GameState } from "features/game/types/game";
import { PetShrineName } from "features/game/types/pets";
import { PET_SHOP_ITEMS } from "features/game/types/petShop";
import { produce } from "immer";

export type RenewPetShrineAction = {
  type: "petShrine.renewed";
  name: PetShrineName | "Obsidian Shrine";
  location: PlaceableLocation;
  id: string;
};

type Options = {
  state: Readonly<GameState>;
  action: RenewPetShrineAction;
  createdAt?: number;
};

export function renewPetShrine({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (stateCopy) => {
    const collectibleGroup =
      action.location === "home"
        ? stateCopy.home.collectibles[action.name]
        : stateCopy.collectibles[action.name];

    if (!collectibleGroup) {
      throw new Error("Invalid collectible");
    }

    const collectibleToRenew = collectibleGroup.find(
      (collectible) => collectible.id === action.id,
    );

    if (!collectibleToRenew) {
      throw new Error("Collectible does not exist");
    }

    const cooldown = EXPIRY_COOLDOWNS[action.name];

    if ((collectibleToRenew.createdAt ?? 0) + cooldown > createdAt) {
      throw new Error("Collectible is still active");
    }

    const cost = PET_SHOP_ITEMS[action.name];
    const coinCost = cost.coins ?? 0;

    if (stateCopy.coins < coinCost) {
      throw new Error("Insufficient Coins");
    }

    const subtractedInventory = getKeys(cost.ingredients).reduce(
      (inventory, ingredientName) => {
        const count = inventory[ingredientName] || new Decimal(0);
        const totalAmount = cost.ingredients[ingredientName] || new Decimal(0);

        if (count.lessThan(totalAmount)) {
          throw new Error(`Insufficient ingredient: ${ingredientName}`);
        }

        inventory[ingredientName] = count.sub(totalAmount);

        return inventory;
      },
      { ...stateCopy.inventory },
    );

    stateCopy.inventory = subtractedInventory;
    stateCopy.coins -= coinCost;

    // Set the createdAt timestamp to the current time to renew the cooldown
    collectibleToRenew.createdAt = createdAt;

    return stateCopy;
  });
}
