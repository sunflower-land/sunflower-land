import Decimal from "decimal.js-light";
import {
  getAnimalReadyAt,
  getBountyLevel,
  getPigBristles,
  makeAnimalBuildingKey,
  SICK_ANIMAL_REWARD_MULTIPLIER,
} from "features/game/lib/animals";
import { updateBoostUsed } from "features/game/types/updateBoostUsed";
import { ANIMALS, type AnimalType } from "features/game/types/animals";
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

  // A ready animal counts one level lower until its yield is claimed.
  const effectiveLevel = getBountyLevel(animal);

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

    // `request` is the full BountyRequest union, so `name` may be a flower, a
    // fish, an Obsidian... Guard explicitly rather than indexing a building by
    // elimination: the old `Chicken ? henHouse : barn` routed every non-Chicken
    // bounty at the barn and relied on the lookup below to throw.
    if (!(request.name in ANIMALS)) {
      throw new Error("Animal does not exist");
    }

    const { buildingRequired } = ANIMALS[request.name as AnimalType];
    const { animals } = game[makeAnimalBuildingKey(buildingRequired)];

    const animal = animals[action.animalId];
    if (!animal) {
      throw new Error("Animal does not exist");
    }

    if (!isValidDeal({ animal, deal: request, game })) {
      throw new Error("Animal does not meet requirements");
    }

    const isSick = animal.state === "sick";

    // A Pig also pays its level's Bristles (#7721) - the generic produce boosts,
    // Bristle Payout and the sickness cut are all inside `getPigBristles`. Read
    // before the delete so the Pig is still on the draft.
    const bristles =
      animal.type === "Pig"
        ? getPigBristles({ game: state, pig: animal })
        : undefined;

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

    if (bristles && bristles.amount > 0) {
      game.inventory["Pig Bristles"] = (
        game.inventory["Pig Bristles"] ?? new Decimal(0)
      ).add(bristles.amount);
      game.farmActivity = trackFarmActivity(
        "Pig Bristles Collected",
        game.farmActivity,
      );
      game.boostsUsedAt = updateBoostUsed({
        game,
        boostNames: bristles.boostsUsed,
        createdAt,
      });
    }

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
