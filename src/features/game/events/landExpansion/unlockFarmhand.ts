import { BED_FARMHAND_COUNT } from "features/game/types/beds";
import { Equipped } from "features/game/types/bumpkin";
import { getKeys } from "features/game/types/decorations";
import { GameState } from "features/game/types/game";
import { produce } from "immer";

export const FARMHANDS: Equipped[] = [
  {
    background: "Farm Background",
    body: "Beige Farmer Potion",
    hair: "Brown Rancher Hair",
    shoes: "Black Farmer Boots",
    tool: "Farmer Pitchfork",
    shirt: "Yellow Farmer Shirt",
    pants: "Farmer Overalls",
  },
  {
    background: "Farm Background",
    body: "Dark Brown Farmer Potion",
    hair: "Buzz Cut",
    shoes: "Black Farmer Boots",
    tool: "Farmer Pitchfork",
    shirt: "Red Farmer Shirt",
    pants: "Farmer Overalls",
  },
  {
    background: "Farm Background",
    body: "Light Brown Farmer Potion",
    hair: "Blondie",
    shoes: "Black Farmer Boots",
    tool: "Farmer Pitchfork",
    shirt: "Blue Farmer Shirt",
    pants: "Farmer Overalls",
  },
  {
    background: "Farm Background",
    body: "Goblin Potion",
    hair: "Buzz Cut",
    shoes: "Black Farmer Boots",
    tool: "Farmer Pitchfork",
    shirt: "Yellow Farmer Shirt",
    pants: "Farmer Overalls",
  },
  {
    background: "Farm Background",
    body: "Dark Brown Farmer Potion",
    hair: "Brown Rancher Hair",
    shoes: "Black Farmer Boots",
    tool: "Farmer Pitchfork",
    shirt: "Red Farmer Shirt",
    pants: "Farmer Overalls",
  },
  {
    background: "Farm Background",
    body: "Light Brown Farmer Potion",
    hair: "Basic Hair",
    shoes: "Black Farmer Boots",
    tool: "Farmer Pitchfork",
    shirt: "Blue Farmer Shirt",
    pants: "Farmer Overalls",
  },
  {
    background: "Farm Background",
    body: "Goblin Potion",
    hair: "Blondie",
    shoes: "Black Farmer Boots",
    tool: "Farmer Pitchfork",
    shirt: "Yellow Farmer Shirt",
    pants: "Farmer Overalls",
  },
  {
    background: "Farm Background",
    body: "Light Brown Farmer Potion",
    hair: "Basic Hair",
    shoes: "Black Farmer Boots",
    tool: "Farmer Pitchfork",
    shirt: "Striped Blue Shirt",
    pants: "Farmer Pants",
  },
  {
    background: "Farm Background",
    body: "Beige Farmer Potion",
    hair: "Rancher Hair",
    shoes: "Black Farmer Boots",
    tool: "Farmer Pitchfork",
    shirt: "Striped Red Shirt",
    pants: "Farmer Overalls",
  },
  // 11th farmhand for Pearl Bed (BED_FARMHAND_COUNT 11)
  {
    background: "Farm Background",
    body: "Goblin Potion",
    hair: "Rancher Hair",
    shoes: "Black Farmer Boots",
    tool: "Farmer Pitchfork",
    shirt: "Striped Blue Shirt",
    pants: "Farmer Overalls",
  },
];

export type UnlockFarmhandAction = {
  type: "farmHand.unlocked";
};

type Options = {
  state: Readonly<GameState>;
  action: UnlockFarmhandAction;
  createdAt?: number;
};

export function unlockFarmhand({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (copy) => {
    // #region agent log
    if (typeof fetch !== "undefined") {
      fetch(
        "http://127.0.0.1:7243/ingest/da340b6c-236d-4328-a8af-fce2d80616ce",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Debug-Session-Id": "5c9ff1",
          },
          body: JSON.stringify({
            sessionId: "5c9ff1",
            location: "unlockFarmhand.ts:entry",
            message:
              "unlockFarmhand produce entry – which inputs are null/undefined",
            data: {
              hasState: state != null,
              hasFarmHands: state?.farmHands != null,
              hasBumpkins: state?.farmHands?.bumpkins != null,
              hasCollectibles: state?.collectibles != null,
              hasHome: state?.home != null,
              hasHomeCollectibles: state?.home?.collectibles != null,
              hasCopyWardrobe: copy?.wardrobe != null,
              hasCopyFarmHandsBumpkins: copy?.farmHands?.bumpkins != null,
            },
            timestamp: Date.now(),
            hypothesisId: "A",
          }),
        },
      ).catch(() => {});
    }
    // #endregion
    const farmhands = state.farmHands.bumpkins;
    const collectibles = state.collectibles;
    const homeCollectibles = state.home.collectibles;

    // #region agent log
    if (typeof fetch !== "undefined") {
      fetch(
        "http://127.0.0.1:7243/ingest/da340b6c-236d-4328-a8af-fce2d80616ce",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Debug-Session-Id": "5c9ff1",
          },
          body: JSON.stringify({
            sessionId: "5c9ff1",
            location: "unlockFarmhand.ts:beforeGetKeysFarmhands",
            message: "before getKeys(farmhands)",
            data: {
              farmhandsIsNull: farmhands == null,
              farmhandsType: typeof farmhands,
            },
            timestamp: Date.now(),
            hypothesisId: "B",
          }),
        },
      ).catch(() => {});
    }
    // #endregion
    const bumpkinCount = getKeys(farmhands).length + 1;
    // #region agent log
    if (typeof fetch !== "undefined") {
      fetch(
        "http://127.0.0.1:7243/ingest/da340b6c-236d-4328-a8af-fce2d80616ce",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Debug-Session-Id": "5c9ff1",
          },
          body: JSON.stringify({
            sessionId: "5c9ff1",
            location: "unlockFarmhand.ts:beforeGetKeysCollectibles",
            message: "before getKeys(collectibles)",
            data: { collectiblesIsNull: collectibles == null },
            timestamp: Date.now(),
            hypothesisId: "C",
          }),
        },
      ).catch(() => {});
    }
    // #endregion
    const uniqueBedCollectibles = getKeys(collectibles)
      .filter((collectible) => collectible in BED_FARMHAND_COUNT)
      .filter((collectible) => (collectibles[collectible]?.length ?? 0) > 0);
    // #region agent log
    if (typeof fetch !== "undefined") {
      fetch(
        "http://127.0.0.1:7243/ingest/da340b6c-236d-4328-a8af-fce2d80616ce",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Debug-Session-Id": "5c9ff1",
          },
          body: JSON.stringify({
            sessionId: "5c9ff1",
            location: "unlockFarmhand.ts:beforeGetKeysHomeCollectibles",
            message: "before getKeys(homeCollectibles)",
            data: { homeCollectiblesIsNull: homeCollectibles == null },
            timestamp: Date.now(),
            hypothesisId: "D",
          }),
        },
      ).catch(() => {});
    }
    // #endregion
    const uniqueHomeBedCollectibles = getKeys(homeCollectibles)
      .filter((collectible) => collectible in BED_FARMHAND_COUNT)
      .filter(
        (collectible) => (homeCollectibles[collectible]?.length ?? 0) > 0,
      );
    const uniqueBedCount = new Set([
      ...uniqueBedCollectibles,
      ...uniqueHomeBedCollectibles,
    ]).size;

    if (bumpkinCount >= uniqueBedCount) {
      throw new Error("No beds available");
    }

    // #region agent log
    if (typeof fetch !== "undefined") {
      fetch(
        "http://127.0.0.1:7243/ingest/da340b6c-236d-4328-a8af-fce2d80616ce",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Debug-Session-Id": "5c9ff1",
          },
          body: JSON.stringify({
            sessionId: "5c9ff1",
            location: "unlockFarmhand.ts:beforeObjectKeysCopyBumpkins",
            message: "before Object.keys(copy.farmHands.bumpkins)",
            data: {
              copyFarmHandsBumpkinsIsNull: copy.farmHands?.bumpkins == null,
            },
            timestamp: Date.now(),
            hypothesisId: "E",
          }),
        },
      ).catch(() => {});
    }
    // #endregion
    const id = Object.keys(copy.farmHands.bumpkins).length + 1;
    const equipped = FARMHANDS[id - 1];
    copy.farmHands.bumpkins[id] = {
      equipped,
    };

    // #region agent log
    if (typeof fetch !== "undefined") {
      fetch(
        "http://127.0.0.1:7243/ingest/da340b6c-236d-4328-a8af-fce2d80616ce",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Debug-Session-Id": "5c9ff1",
          },
          body: JSON.stringify({
            sessionId: "5c9ff1",
            location: "unlockFarmhand.ts:beforeGetKeysEquipped",
            message: "before getKeys(equipped)",
            data: {
              id,
              equippedIsNull: equipped == null,
              copyWardrobeIsNull: copy.wardrobe == null,
            },
            timestamp: Date.now(),
            hypothesisId: "F",
          }),
        },
      ).catch(() => {});
    }
    // #endregion
    if (equipped == null) {
      throw new Error(
        `No farmhand outfit for slot ${id}. Max ${FARMHANDS.length} farmhands supported.`,
      );
    }
    getKeys(equipped).forEach((key) => {
      const item = equipped[key];
      if (!item) return;
      copy.wardrobe[item] = (copy.wardrobe[item] ?? 0) + 1;
    });

    return copy;
  });
}
