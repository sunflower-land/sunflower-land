import { GameState } from "features/game/types/game";
import { NPCName } from "lib/npcs";
import { BUMPKIN_GIFTS, BumpkinGift } from "features/game/types/gifts";
import { getKeys } from "features/game/types/craftables";
import Decimal from "decimal.js-light";
import { produce } from "immer";
import { RecipeCollectibleName, RECIPES } from "features/game/lib/crafting";

export type ClaimGiftAction = {
  type: "gift.claimed";
  bumpkin: NPCName;
};

type Options = {
  state: Readonly<GameState>;
  action: ClaimGiftAction;
  createdAt?: number;
};

export function getNextGift({
  game,
  npc,
}: {
  game: GameState;
  npc: NPCName;
}): BumpkinGift | null {
  const bumpkin = BUMPKIN_GIFTS[npc];

  const lastClaimedAt = game.npcs?.[npc]?.friendship?.giftClaimedAtPoints ?? 0;

  if (!bumpkin) {
    return null;
  }

  let gifts = bumpkin.planned ?? [];
  gifts = gifts.sort((a, b) =>
    a.friendshipPoints > b.friendshipPoints ? 1 : -1,
  );

  let nextGift = gifts.find((gift) => gift.friendshipPoints > lastClaimedAt);

  if (!nextGift) {
    nextGift = {
      ...bumpkin.repeats,
      friendshipPoints: lastClaimedAt + bumpkin.repeats.friendshipPoints,
    };
  }

  return nextGift;
}

/*
  Recipes a Bumpkin will reveal at certain friendship points
*/
export function getBumpkinRecipes({
  game,
  npc,
}: {
  game: GameState;
  npc: NPCName;
}): RecipeCollectibleName[] {
  const bumpkin = BUMPKIN_GIFTS[npc];

  if (!bumpkin) {
    return [];
  }

  const friendship = game.npcs?.[npc]?.friendship;

  if (!friendship) {
    return [];
  }

  const points = friendship?.points ?? 0;

  // Grab recipes where player has more points than the gift (in case recipe introduced later)
  const missingRecipes = bumpkin.planned
    ?.filter((gift) => gift.recipe && points >= gift.friendshipPoints)
    // Ensure they don't already have the recipe
    .filter((gift) => !game.craftingBox.recipes[gift.recipe!])
    .map((gift) => gift.recipe!);

  return missingRecipes;
}

export function claimGift({ state, action, createdAt = Date.now() }: Options) {
  return produce(state, (game) => {
    if (!game.npcs?.[action.bumpkin]) {
      throw new Error("Bumpkin does not exist");
    }

    const bumpkin = BUMPKIN_GIFTS[action.bumpkin];
    if (!bumpkin) {
      throw new Error("Bumpkin does not provide gifts");
    }

    const friendship = game.npcs[action.bumpkin]?.friendship;

    if (!friendship) {
      throw new Error("Friendship is not strong enough");
    }

    const points = friendship?.points ?? 0;

    const nextGift = getNextGift({ game, npc: action.bumpkin });

    if (!nextGift) {
      throw new Error("No gift available");
    }

    if (nextGift.friendshipPoints > points) {
      throw new Error("Friendship is not strong enough");
    }

    friendship.giftClaimedAtPoints = nextGift.friendshipPoints;

    // Provide items
    getKeys(nextGift.items).forEach((name) => {
      const previous = game.inventory[name] ?? new Decimal(0);
      game.inventory[name] = previous.add(nextGift.items[name] ?? 0);
    });

    // Provide wearables
    getKeys(nextGift.wearables).forEach((name) => {
      const previous = game.wardrobe[name] ?? 0;
      game.wardrobe[name] = previous + (nextGift.wearables[name] ?? 0);
    });

    // Provide missing recipes
    // Grab recipes where player has more points than the gift (in case recipe introduced later)
    const missingRecipes = getBumpkinRecipes({ game, npc: action.bumpkin });

    if (missingRecipes.length) {
      missingRecipes.forEach((recipe) => {
        if (recipe && RECIPES[recipe]) {
          game.craftingBox.recipes[recipe] = RECIPES[recipe];
        }
      });
    }

    game.coins = game.coins + nextGift.coins;

    return game;
  });
}
