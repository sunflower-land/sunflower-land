import { useContext, useState } from "react";

import { Context } from "features/game/GameProvider";
import { isValidDeal } from "features/game/events/landExpansion/sellAnimal";
import type {
  AnimalBounty,
  AnimalBuildingKey,
  GameState,
} from "features/game/types/game";

/**
 * Bulk sell mode for the quick-sell panel: bounty id -> animal id. Picking an
 * animal for a bounty marks the pair instead of selling it, and every marked
 * pair sells at once from the panel's confirm button.
 */
export const useBountySaleSelection = (buildingKey: AnimalBuildingKey) => {
  const { gameService } = useContext(Context);
  const [bulkMode, setBulkModeState] = useState(false);
  const [pending, setPending] = useState<Record<string, string>>({});

  const pendingAnimalIds = new Set(Object.values(pending));

  const canSell = (game: GameState, dealId: string, animalId: string) => {
    const deal = game.bounties.requests.find(
      (request) => request.id === dealId,
    ) as AnimalBounty | undefined;
    const animal = game[buildingKey].animals[animalId];
    const isCompleted = game.bounties.completed.some(
      (completed) => completed.id === dealId,
    );

    // A sick animal earns a reduced bounty, which needs the AnimalDeal
    // confirmation - never sell it from a mark made while it was healthy.
    return (
      !!deal &&
      !!animal &&
      animal.state !== "sick" &&
      !isCompleted &&
      isValidDeal({ animal, deal, game })
    );
  };

  /** Mark (or re-mark) an animal for a bounty. One animal per bounty. */
  const select = (dealId: string, animalId: string) => {
    setPending((prev) => {
      const next = Object.fromEntries(
        Object.entries(prev).filter(([, id]) => id !== animalId),
      );
      next[dealId] = animalId;
      return next;
    });
  };

  const unselect = (dealId: string) => {
    setPending((prev) => {
      const { [dealId]: _removed, ...rest } = prev;
      return rest;
    });
  };

  const sell = (pairs: [string, string][]) => {
    const game = gameService.getSnapshot().context.state;

    pairs
      .filter(([dealId, animalId]) => canSell(game, dealId, animalId))
      .forEach(([dealId, animalId]) => {
        gameService.send("animal.sold", { requestId: dealId, animalId });
      });

    setPending((prev) =>
      Object.fromEntries(
        Object.entries(prev).filter(
          ([dealId]) => !pairs.some(([sold]) => sold === dealId),
        ),
      ),
    );
  };

  const sellAll = () => sell(Object.entries(pending));

  const clear = () => setPending({});

  /** Leaving bulk mode drops every marked pair. */
  const setBulkMode = (enabled: boolean) => {
    setBulkModeState(enabled);
    if (!enabled) setPending({});
  };

  return {
    bulkMode,
    setBulkMode,
    pending,
    pendingAnimalIds,
    select,
    unselect,
    sellAll,
    clear,
  };
};
