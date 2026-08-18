const STORAGE_KEY = "settings.customCursor";

// Experimental pixel art cursor (see the custom cursor rules in styles.css).
// Opt-in via Settings -> Advanced -> Experiments; the rules only apply while
// the `custom-cursor` class is on the root element.

export function isCustomCursorEnabled(): boolean {
  return localStorage.getItem(STORAGE_KEY) === "true";
}

export function setCustomCursorEnabled(enabled: boolean) {
  localStorage.setItem(STORAGE_KEY, String(enabled));
  applyCustomCursor(enabled);
}

export function initialiseCustomCursor() {
  applyCustomCursor(isCustomCursorEnabled());
}

function applyCustomCursor(enabled: boolean) {
  document.documentElement.classList.toggle("custom-cursor", enabled);
}
