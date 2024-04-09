import { isAndroid } from "mobile-device-detect";

/**
 * There is a bug in the pwa-install element that causes the text to have a text-shadow.
 * This function removes the text-shadow from the install prompt.
 * @returns void
 */
export function fixInstallPromptTextStyles() {
  const pwaEl = document.querySelector("pwa-install");

  if (!pwaEl?.shadowRoot) return;

  const deviceSpecificSelector = isAndroid
    ? ".install-dialog.chrome.mobile"
    : ".install-dialog.apple";

  const shadowInstallEl = pwaEl.shadowRoot.querySelector(
    `#pwa-install-element > ${deviceSpecificSelector}`
  ) as HTMLElement | null;

  if (!shadowInstallEl) return;

  shadowInstallEl.style.textShadow = "none";
}
