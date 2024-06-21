import { InventoryItemName } from "features/game/types/game";
import { CONFIG } from "lib/config";

const isInIframe = window.self !== window.top;

/**
 * A player has finished your game and can claim a prize (if one exists)
 */
export function claimPrize() {
  if (isInIframe) {
    window.parent.postMessage({ event: "claimPrize" }, "*");
  } else {
    alert("You are running in test mode - no prize to claim.");
  }
}

/**
 * Exit the portal
 */
export function goHome() {
  if (isInIframe) {
    window.parent.postMessage({ event: "closePortal" }, "*");
  } else {
    alert("You are running in test mode - no where to go.");
  }
}

/**
 * Allow a player to spend SFL or items in your game
 */
export function purchase({
  sfl,
  items,
}: {
  sfl: number;
  items: Partial<Record<InventoryItemName, number>>;
}) {
  if (!isInIframe) {
    // Auto confirmed - Simulate the event that would come from the parent
    window.postMessage(
      {
        event: "purchased",
        sfl,
        items,
      },
      "*"
    );
  } else {
    // Ask parent to confirm
    window.parent.postMessage({ event: "purchase", sfl, items }, "*");
  }
}

/**
 * When to want to store the score
 */
export function played({ score }: { score: number }) {
  if (!isInIframe) {
    alert(`Sunflower Land running in test mode - score submitted`);
  } else {
    window.parent.postMessage({ event: "played", score }, "*");
  }
}

export function authorisePortal() {
  if (isInIframe) {
    window.parent.postMessage("closePortal", "*");
  } else {
    window.location.href = `${CONFIG.PORTAL_GAME_URL}?portal=${CONFIG.PORTAL_APP}&redirect=${window.location.origin}`;
  }
}

export function isValidRedirect(url: string) {
  // Define a regular expression for localhost URLs
  const localhostRegex = /^http:\/\/localhost:\d+/;

  // Define a regular expression for subdomains of "sunflower-land.com"
  const subdomainRegex = /^https:\/\/([a-z0-9-]+\.)*sunflower-land\.com/;

  // Check if the URL matches either pattern
  return localhostRegex.test(url) || subdomainRegex.test(url);
}
