import Decimal from "decimal.js-light";
import { ChapterName, getCurrentChapter } from "features/game/types/chapters";
import { CHAPTER_COLLECTIONS } from "features/game/types/collections";
import { GameState } from "features/game/types/game";
import { produce } from "immer";

export type ClaimCollectionShedAction = {
  type: "collectionShed.claimed";
  chapter: ChapterName;
};

type Options = {
  state: Readonly<GameState>;
  action: ClaimCollectionShedAction;
  createdAt: number;
};

export function claimCollectionShed({
  state,
  action,
  createdAt,
}: Options): GameState {
  return produce(state, (game) => {
    const currentChapter = getCurrentChapter(createdAt);

    if (currentChapter !== action.chapter) {
      throw new Error(
        `You can only claim a collection shed for the current chapter`,
      );
    }

    const chapterCollections = CHAPTER_COLLECTIONS[action.chapter];
    if (!chapterCollections) {
      throw new Error(`Chapter ${action.chapter} collections not found`);
    }

    const collectionItemsRequired = Object.values(chapterCollections).reduce(
      (total, { collectibles, wearables }) => {
        const collectiblesCount = collectibles ? collectibles.length : 0;
        const wearablesCount = wearables ? wearables.length : 0;
        return total.add(collectiblesCount).add(wearablesCount);
      },
      new Decimal(0),
    );

    const collectionItemsInInventory = Object.values(chapterCollections).reduce(
      (acc, collection) => {
        const { collectibles, wearables } = collection;
        if (!collectibles) return acc;
        collectibles.forEach((collectible) => {
          const inventoryQuantity =
            game.inventory[collectible] ?? new Decimal(0);
          acc = acc.add(inventoryQuantity);
        });
        if (!wearables) return acc;
        wearables.forEach((wearable) => {
          const wardrobeQuantity = game.wardrobe[wearable] ?? 0;
          acc = acc.add(wardrobeQuantity);
        });
        return acc;
      },
      new Decimal(0),
    );

    const percentageCollected = collectionItemsInInventory
      .div(collectionItemsRequired)
      .mul(100);

    if (percentageCollected.lt(80)) {
      throw new Error(
        "You need to collect at least 80% of the items in a collection to claim a shed",
      );
    }

    game.inventory[`${action.chapter} Collection Shed`] = new Decimal(1);

    return game;
  });
}
