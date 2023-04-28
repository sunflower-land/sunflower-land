/**
 * Cache selected items in local storage so we can remember next time we open the HUD.
 */
const LOCAL_STORAGE_KEY = "dawnbreaker.visited";

export function setDawnbreakerIslandVisited() {
  localStorage.setItem(LOCAL_STORAGE_KEY, "true");
}

export function hasVisitedDawnbreakerIsland(): boolean {
  return !!localStorage.getItem(LOCAL_STORAGE_KEY) ?? false;
}
