import Decimal from "decimal.js-light";
import {
  getAnimalLevel,
  getAnimalReadyAt,
  isMaxLevel,
} from "features/game/lib/animals";
import { getKeys } from "lib/object";
import { trackFarmActivity } from "features/game/types/farmActivity";
import type {
  Animal,
  BountyRequest,
  GameState,
} from "features/game/types/game";
import {
  getChapterTicket,
  getCurrentChapter,
} from "features/game/types/chapters";
import { produce } from "immer";
import { generateBountyTicket, generateBountyCoins } from "./sellBounty";
import { getChapterTaskPoints } from "features/game/types/tracks";
import { handleChapterAnalytics } from "features/game/lib/trackAnalytics";

export function isValidDeal({
  animal,
  deal,
  game,
}: {
  animal: Animal;
  deal: BountyRequest;
  game: GameState;
}) {
  if (animal.type !== deal.name) {
    return false;
  }

  const level = getAnimalLevel(animal.experience, animal.type);

  /**
   * A ready animal normally shows its previous level until the yield is
   * claimed, so its effective level for a bounty is one lower. At max level
   * there is no next level to transition into - "ready" only means a produce
   * cycle completed - so the adjustment does not apply. This mirrors the
   * badge, which guards its own `- 1` with `isMaxLevel`.
   */
  const effectiveLevel =
    animal.state === "ready" && !isMaxLevel(animal.type, level)
      ? level - 1
      : level;

  if (effectiveLevel < deal.level) {
    return false;
  }

  // Keep the truthiness guard: an animal that has never slept carries
  // `awakeAt: 0` and no marker, and must stay sellable.
  const readyAt = getAnimalReadyAt(animal, game);
  if (readyAt && readyAt > Date.now()) {
    return false;
  }

  return true;
}

export type SellAnimalAction = {
  type: "animal.sold";
  requestId: string;
  animalId: string;
};

type Options = {
  state: GameState;
  action: SellAnimalAction;
  createdAt?: number;
};

export const SICK_ANIMAL_REWARD_MULTIPLIER = 0.75;

export function getSickAnimalRewardAmount(amount: number) {
  return Math.floor(amount * SICK_ANIMAL_REWARD_MULTIPLIER);
}

export function sellAnimal({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (game) => {
    const request = game.bounties.requests.find(
      (deal) => deal.id === action.requestId,
    );

    if (!request) {
      throw new Error("Bounty does not exist");
    }

    const completed = game.bounties.completed.find(
      (c) => c.id === action.requestId,
    );
    if (completed) {
      throw new Error("Bounty already completed");
    }

    const { animals } = request.name === "Chicken" ? game.henHouse : game.barn;

    const animal = animals[action.animalId];
    if (!animal) {
      throw new Error("Animal does not exist");
    }

    if (!isValidDeal({ animal, deal: request, game })) {
      throw new Error("Animal does not meet requirements");
    }

    const isSick = animal.state === "sick";

    delete animals[action.animalId];

    if (request.coins) {
      const { coins } = generateBountyCoins({
        game: state,
        bounty: request,
      });
      game.coins += isSick ? getSickAnimalRewardAmount(coins) : coins;
    }

    getKeys(request.items ?? {}).forEach((name) => {
      const previous = game.inventory[name] ?? new Decimal(0);
      let amount = request.items?.[name] ?? 0;

      if (name === getChapterTicket(createdAt)) {
        amount = generateBountyTicket({
          game,
          bounty: request,
          now: createdAt,
        });
        const chapter = getCurrentChapter(createdAt);
        const pointsAwarded = getChapterTaskPoints({
          task: "bounty",
          points: amount ?? 0,
        });
        handleChapterAnalytics({
          task: "bounty",
          points: amount ?? 0,
          farmActivity: game.farmActivity,
          createdAt,
        });

        game.farmActivity = trackFarmActivity(
          `${getChapterTicket(createdAt)} Collected`,
          game.farmActivity,
          new Decimal(amount ?? 0),
        );
        game.farmActivity = trackFarmActivity(
          `${chapter} Points Earned`,
          game.farmActivity,
          new Decimal(pointsAwarded),
        );
      }

      game.inventory[name] = previous.add(
        isSick ? getSickAnimalRewardAmount(amount) : amount,
      );
    });

    game.bounties.completed = [
      ...game.bounties.completed,
      {
        id: request.id,
        soldAt: createdAt,
      },
    ];

    game.farmActivity = trackFarmActivity(
      `${animal.type} Bountied`,
      game.farmActivity,
    );

    return game;
  });
}
