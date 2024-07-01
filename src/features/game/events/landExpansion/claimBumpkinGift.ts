import cloneDeep from "lodash.clonedeep";
import { GameState } from "features/game/types/game";
import { NPCName } from "lib/npcs";
import { BUMPKIN_GIFTS, BumpkinGift } from "features/game/types/gifts";
import { getKeys } from "features/game/types/craftables";
import Decimal from "decimal.js-light";

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

export function claimGift({ state, action, createdAt = Date.now() }: Options) {
  const game = cloneDeep(state) as GameState;

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

  game.coins = game.coins + nextGift.coins;

  return game;
}
