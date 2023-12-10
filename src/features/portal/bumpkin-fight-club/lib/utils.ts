import { CONFIG } from "lib/config";

const isInIframe = window.self !== window.top;

export function goHome() {
  if (isInIframe) {
    window.parent.postMessage("closePortal", "*");
  } else {
    window.location.href = CONFIG.PORTAL_GAME_URL;
  }
}

export function authorisePortal() {
  if (isInIframe) {
    window.parent.postMessage("closePortal", "*");
  } else {
    window.location.href = `${CONFIG.PORTAL_GAME_URL}?portal=${CONFIG.PORTAL_APP}`;
  }
}

export const hasReadRules = () => {
  return !!localStorage.getItem("rules.read");
};

export const acknowledgeRules = () => {
  localStorage.setItem("rules.read", new Date().toISOString());
};
