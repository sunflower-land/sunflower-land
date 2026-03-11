const KEY_PREFIX = "sunflower_starter_offer_shown";

function getKey(farmId: number): string {
  return `${KEY_PREFIX}_${farmId}`;
}

export function getStarterOfferShown(farmId: number): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(getKey(farmId)) === "1";
  } catch {
    return false;
  }
}

export function setStarterOfferShown(farmId: number): void {
  try {
    localStorage.setItem(getKey(farmId), "1");
  } catch {
    // ignore
  }
}
