// Matches any Ronin wallet (Ronin Waypoint connector or the Ronin browser
// extension discovered via EIP-6963, e.g. "Ronin Wallet") - case insensitive.
export const isRoninWallet = (walletName?: string) =>
  /ronin/i.test(walletName ?? "");

// Tracks the year + month the Ronin Waypoint migration popup was last
// acknowledged. We store the month against a single key, so the popup reappears
// once each calendar month until the player migrates.
const KEY_PREFIX = "ronin_waypoint_login_popup_shown";

const getMonthKey = (): string => {
  const now = new Date();
  return `${now.getFullYear()}_${now.getMonth() + 1}`;
};

export const getRoninWaypointPopupShown = (): boolean => {
  try {
    return localStorage.getItem(KEY_PREFIX) === getMonthKey();
  } catch {
    return false;
  }
};

export const setRoninWaypointPopupShown = (): void => {
  try {
    localStorage.setItem(KEY_PREFIX, getMonthKey());
  } catch {
    // ignore
  }
};
