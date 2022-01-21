const LOCAL_STORAGE_KEY = "signedAddress";

export function getSignedAddress() {
  return localStorage.getItem(LOCAL_STORAGE_KEY);
}

export function saveSignedAddress(data: { hash: string; signature: string }) {
  return localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
}
