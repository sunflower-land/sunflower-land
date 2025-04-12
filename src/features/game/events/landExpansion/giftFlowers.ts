import { GameState } from "features/game/types/game";
import { FLOWERS, FlowerName } from "features/game/types/flowers";
import Decimal from "decimal.js-light";
import { NPCName } from "lib/npcs";
import {
  BUMPKIN_FLOWER_BONUSES,
  DEFAULT_FLOWER_POINTS,
} from "features/game/types/gifts";
import { produce } from "immer";
import { hasFeatureAccess } from "lib/flags";
import { getLoveCharmReward } from "features/game/types/loveRushDeliveries";

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

export const calculateRelationshipPoints = (
  points: number,
  game: GameState,
) => {
  const { bumpkin } = game;

  let total = points;

  // Blossom Bonding skill gives +2 points
  if (bumpkin.skills["Blossom Bonding"]) {
    total += 2;
  }

  return total;
};

export function giftFlowers({
  state,
  action,
  createdAt = Date.now(),
}: Options) {
  return produce(state, (game) => {
    if (!(action.flower in FLOWERS)) {
      throw new Error("Item is not a flower");
    }

    if (!(action.bumpkin in BUMPKIN_FLOWER_BONUSES)) {
      throw new Error("Bumpkin does not accept gifts");
    }

    const flowerAmount = game.inventory[action.flower] ?? new Decimal(0);
    if (flowerAmount.lte(0)) {
      throw new Error("Player is missing flower");
    }

    game.inventory[action.flower] = flowerAmount.sub(1);

    let points = calculateRelationshipPoints(
      DEFAULT_FLOWER_POINTS[action.flower],
      game,
    );
    const bonus = BUMPKIN_FLOWER_BONUSES[action.bumpkin]?.[action.flower] ?? 0;
    if (bonus > 0) {
      points += bonus;
    }

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
      giftedAt: createdAt,
    };

    game.npcs = {
      ...game.npcs,
      [action.bumpkin]: npc,
    };

    if (hasFeatureAccess(game, "LOVE_RUSH")) {
      const { loveCharmReward } = getLoveCharmReward({
        name: action.bumpkin,
        flower: action.flower,
        points,
      });
      game.inventory["Love Charm"] = (
        game.inventory["Love Charm"] ?? new Decimal(0)
      ).add(loveCharmReward);
    }

    return game;
  });
}
