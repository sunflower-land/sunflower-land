const LOCAL_STORAGE_KEY = "signedAddress";

export function getSignedAddress() {
  return localStorage.getItem(LOCAL_STORAGE_KEY);
}

export function saveSignedAddress(address: string) {
  return localStorage.setItem(LOCAL_STORAGE_KEY, address);
}
