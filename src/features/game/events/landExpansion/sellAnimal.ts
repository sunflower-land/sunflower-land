import Decimal from "decimal.js-light";
import { getKeys } from "features/game/types/decorations";
import { Animal, ExchangeDeal, GameState } from "features/game/types/game";
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
  deal: ExchangeDeal;
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
  offerId: string;
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
    const deal = game.exchange.deals.find((deal) => deal.id === action.offerId);

    if (!deal) {
      throw new Error("Deal does not exist");
    }

    if (deal.soldAt) {
      throw new Error("Deal already completed");
    }

    const { animals } = deal.name === "Chicken" ? game.henHouse : game.barn;

    const animal = animals[action.animalId];
    if (!animal) {
      throw new Error("Animal does not exist");
    }

    if (!isValidDeal({ animal, deal })) {
      throw new Error("Animal does not meet requirements");
    }

    delete animals[action.animalId];

    if (deal.coins) {
      game.coins += deal.coins;
    }

    getKeys(deal.items ?? {}).forEach((name) => {
      const previous = game.inventory[name] ?? new Decimal(0);
      game.inventory[name] = previous.add(deal.items?.[name] ?? 0);
    });

    deal.soldAt = createdAt;

    return game;
  });
}
