import type { CaveMerchantSeenOffers } from "features/game/types/caveMerchant";

const STORAGE_PREFIX = "cave-merchant-seen-v1:";
export const CAVE_MERCHANT_SEEN_EVENT = "cave-merchant-seen";
// Keep this session usable even if the browser refuses storage.
const fallback = new Map<number, string>();

export function readCaveMerchantSeen(farmId: number): string {
  if (fallback.has(farmId)) return fallback.get(farmId)!;
  try {
    return localStorage.getItem(`${STORAGE_PREFIX}${farmId}`) ?? "";
  } catch {
    return fallback.get(farmId) ?? "";
  }
}

export function parseCaveMerchantSeen(
  raw: string,
): CaveMerchantSeenOffers | undefined {
  try {
    const value = JSON.parse(raw);
    if (
      typeof value?.visit === "string" &&
      Array.isArray(value.offers) &&
      value.offers.every((offer: unknown) => typeof offer === "string")
    ) {
      return { visit: value.visit, offers: value.offers };
    }
  } catch {
    // Missing or malformed storage means these offers have not been viewed.
  }
  return undefined;
}

export function writeCaveMerchantSeen(
  farmId: number,
  seen: CaveMerchantSeenOffers,
): void {
  const raw = JSON.stringify(seen);
  if (readCaveMerchantSeen(farmId) === raw) return;
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${farmId}`, raw);
    // Some webviews allow writes but deny reads (or silently discard writes).
    if (localStorage.getItem(`${STORAGE_PREFIX}${farmId}`) === raw) {
      fallback.delete(farmId);
    } else {
      fallback.set(farmId, raw);
    }
  } catch {
    fallback.set(farmId, raw);
    // Fall back to session memory; never interrupt the trade UI.
  }
  window.dispatchEvent(new Event(CAVE_MERCHANT_SEEN_EVENT));
}

export function subscribeCaveMerchantSeen(onChange: () => void): () => void {
  window.addEventListener(CAVE_MERCHANT_SEEN_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CAVE_MERCHANT_SEEN_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}
