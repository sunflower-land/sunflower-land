import { Bumpkin } from "features/game/types/game";
import { Equipped } from "features/game/types/bumpkin";

const LOCAL_STORAGE_KEY_PREFIX = "bumpkin.outfit.";

export function cacheOutfit(bumpkin: Bumpkin, outfitName: string) {
  localStorage.setItem(
    LOCAL_STORAGE_KEY_PREFIX + outfitName,
    JSON.stringify(bumpkin.equipped)
  );
}

export function getOutfit(outfitName: string): Equipped | null {
  const cached = localStorage.getItem(LOCAL_STORAGE_KEY_PREFIX + outfitName);
  if (!cached || cached.length == 0) return null;
  return JSON.parse(cached);
}
