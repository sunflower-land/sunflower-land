/**
 * Acknowledgement of the fish frenzy is stored in local storage.
 */
const LOCAL_STORAGE_KEY = "fishFrenzy.acknowledged";

export function acknowledgeFishFrenzy() {
  const today = new Date().toISOString().split("T")[0];

  localStorage.setItem(LOCAL_STORAGE_KEY, today);
}

export function fishFrenzyAcknowledged(): boolean {
  const today = new Date().toISOString().split("T")[0];
  const acknowledged = localStorage.getItem(LOCAL_STORAGE_KEY);

  return acknowledged === today;
}
