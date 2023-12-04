import { CONFIG } from "lib/config";

export function goHome() {
  if (window.parent) {
    window.parent.postMessage("closePortal", "*");
  } else {
    if (CONFIG.NETWORK === "mainnet") {
      window.location.href = "https://sunflower-land.com/play";
      return;
    }

    window.location.href = "https://sunflower-land.com/testnet";
  }
}
