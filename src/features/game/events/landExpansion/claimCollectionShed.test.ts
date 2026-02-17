import Decimal from "decimal.js-light";
import { INITIAL_FARM } from "features/game/lib/constants";
import {
  CollectionChapterName,
  getCurrentChapter,
} from "features/game/types/chapters";
import { CHAPTER_COLLECTIONS } from "features/game/types/collections";
import { GameState, Inventory, Wardrobe } from "features/game/types/game";
import { claimCollectionShed } from "./claimCollectionShed";

describe("claimCollectionShed", () => {
  const now = Date.now();
  const chapter = getCurrentChapter(now);
  it("requires a player to claim a collection shed for the current chapter", () => {
    expect(() => {
      claimCollectionShed({
        state: {
          ...INITIAL_FARM,
        },
        action: {
          type: "collectionShed.claimed",
          chapter: "Paw Prints",
        },
        createdAt: now,
      });
    }).toThrow("You can only claim a collection shed for the current chapter");
  });
  it("requires a player to collect at least 80% of the items in a collection to claim a shed", () => {
    expect(() => {
      claimCollectionShed({
        state: {
          ...INITIAL_FARM,
        },
        action: {
          type: "collectionShed.claimed",
          chapter,
        },
        createdAt: now,
      });
    }).toThrow(
      "You need to collect at least 80% of the items in a collection to claim a shed",
    );
  });

  it("should claim a collection shed", () => {
    let state: GameState = {
      ...INITIAL_FARM,
      inventory: {
        ...Object.values(
          CHAPTER_COLLECTIONS["Crabs and Traps"] ?? {},
        ).reduce<Inventory>((acc, collection) => {
          const { collectibles } = collection;
          if (!collectibles) return acc;
          collectibles.forEach((collectible) => {
            acc[collectible] = new Decimal(1);
          });
          return acc;
        }, {}),
      },
      wardrobe: {
        ...Object.values(
          CHAPTER_COLLECTIONS["Crabs and Traps"] ?? {},
        ).reduce<Wardrobe>((acc, collection) => {
          const { wearables } = collection;
          if (!wearables) return acc;
          wearables.forEach((wearable) => {
            acc[wearable] = 1;
          });
          return acc;
        }, {}),
      },
    };
    state = claimCollectionShed({
      state,
      action: {
        type: "collectionShed.claimed",
        chapter,
      },
      createdAt: now,
    });

    expect(
      state.inventory[`${chapter as CollectionChapterName} Collection Shed`],
    ).toEqual(new Decimal(1));
  });
});
