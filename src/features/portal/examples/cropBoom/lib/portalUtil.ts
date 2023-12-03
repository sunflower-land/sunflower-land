import { CONFIG } from "lib/config";

export function goHome() {
  if (CONFIG.NETWORK === "mainnet") {
    window.location.href = "https://sunflower-land.com/play";
    return;
  }

  window.location.href = "https://sunflower-land.com/testnet";
}
