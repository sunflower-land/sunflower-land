import Decimal from "decimal.js-light";
import { getKeys } from "features/game/types/decorations";
import { Animal, BountyRequest, GameState } from "features/game/types/game";
import { getSeasonalTicket } from "features/game/types/seasons";
import { produce } from "immer";

// TEMP level function
export function getAnimalLevel({ animal }: { animal: Animal }) {
  if (animal.experience < 5) return 1;

  return 2;
}

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

  if (getAnimalLevel({ animal }) < deal.level) {
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

    if (request.soldAt) {
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

    delete animals[action.animalId];

    if (request.coins) {
      game.coins += request.coins;
    }

    getKeys(request.items ?? {}).forEach((name) => {
      const previous = game.inventory[name] ?? new Decimal(0);
      game.inventory[name] = previous.add(request.items?.[name] ?? 0);
    });

    request.soldAt = createdAt;

    return game;
  });
}
