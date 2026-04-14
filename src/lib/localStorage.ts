export function readLocalStorageJSON<T>(key: string): T | undefined {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return;
    return JSON.parse(raw) as T;
  } catch {
    return;
  }
}

export function writeLocalStorageJSON(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore quota / serialization / privacy mode errors
  }
}
