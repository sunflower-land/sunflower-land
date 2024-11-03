import Decimal from "decimal.js-light";
import { getAnimalLevel } from "features/game/lib/animals";
import { getKeys } from "features/game/types/decorations";
import { trackFarmActivity } from "features/game/types/farmActivity";
import { Animal, BountyRequest, GameState } from "features/game/types/game";
import { produce } from "immer";

export function isValidDeal({
  animal,
  deal,
}: {
  animal: Animal;
  deal: BountyRequest;
}) {
  if (animal.type !== deal.name) {
    return false;
  }

  if (getAnimalLevel(animal.experience, animal.type) < deal.level) {
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
  return Math.floor(amount * 0.75);
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

    if (!isValidDeal({ animal, deal: request })) {
      throw new Error("Animal does not meet requirements");
    }

    const isSick = animal.state === "sick";

    delete animals[action.animalId];

    if (request.coins) {
      game.coins += isSick
        ? getSickAnimalRewardAmount(request.coins)
        : request.coins;
    }

    getKeys(request.items ?? {}).forEach((name) => {
      const previous = game.inventory[name] ?? new Decimal(0);
      const amount = request.items?.[name] ?? 0;
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
