import cloneDeep from "lodash.clonedeep";
import { GameState } from "features/game/types/game";
import { FLOWERS, FlowerName } from "features/game/types/flowers";
import Decimal from "decimal.js-light";
import { NPCName } from "lib/npcs";
import { BUMPKIN_DESIRES } from "features/game/types/gifts";

export type GiftFlowersAction = {
  type: "flowers.gifted";
  flower: FlowerName;
  bumpkin: NPCName;
};

type Options = {
  state: Readonly<GameState>;
  action: GiftFlowersAction;
  createdAt?: number;
};

const DEFAULT_FRIENDSHIP_POINTS = 1;

export function giftFlowers({
  state,
  action,
  createdAt = Date.now(),
}: Options) {
  const game = cloneDeep(state) as GameState;

  if (!(action.flower in FLOWERS)) {
    throw new Error("Item is not a flower");
  }

  if (!(action.bumpkin in BUMPKIN_DESIRES)) {
    throw new Error("Bumpkin does not accept gifts");
  }

  const flowerAmount = game.inventory[action.flower] ?? new Decimal(0);
  if (flowerAmount.lte(0)) {
    throw new Error("Player is missing flower");
  }

  game.inventory[action.flower] = flowerAmount.sub(1);

  const points =
    BUMPKIN_DESIRES[action.bumpkin]?.[action.flower] ??
    DEFAULT_FRIENDSHIP_POINTS;

  const npc = game.npcs?.[action.bumpkin] ?? {
    deliveryCount: 0,
    friendship: {
      points: 0,
      updatedAt: createdAt,
    },
  };

  npc.friendship = {
    updatedAt: createdAt,
    points: (npc.friendship?.points ?? 0) + points,
    giftClaimedAtPoints: npc.friendship?.giftClaimedAtPoints ?? 0,
  };

  game.npcs = {
    ...game.npcs,
    [action.bumpkin]: npc,
  };

  return game;
}
