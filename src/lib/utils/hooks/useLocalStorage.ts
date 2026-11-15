import { useState, useCallback, useRef } from "react";

export interface UseLocalStorageOptions<T> {
  parse?: (raw: string) => T;
  serialize?: (value: T) => string;
  /** Runs in effect; may read/write localStorage. When present, used instead of readFromStorage for initial sync. */
  migrate?: () => T;
}

function defaultParse<T>(raw: string): T {
  return JSON.parse(raw) as T;
}

function defaultSerialize<T>(value: T): string {
  return JSON.stringify(value);
}

function resolveDefault<T>(defaultValue: T | (() => T)): T {
  return typeof defaultValue === "function"
    ? (defaultValue as () => T)()
    : defaultValue;
}

function readFromStorage<T>(
  key: string,
  defaultValue: T | (() => T),
  parse: (raw: string) => T,
): T {
  if (typeof window === "undefined") return resolveDefault(defaultValue);
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return resolveDefault(defaultValue);
    return parse(raw);
  } catch {
    return resolveDefault(defaultValue);
  }
}

function writeToStorage<T>(
  key: string,
  value: T,
  serialize: (value: T) => string,
): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, serialize(value));
  } catch {
    // Safari private mode, quota exceeded, etc.
  }
}

/**
 * Persists state to localStorage. Drop-in replacement for useState with persistence.
 * SSR-safe; falls back to in-memory state when localStorage is unavailable (e.g. Safari private mode).
 *
 * @param key - localStorage key
 * @param defaultValue - pure initial value when key is missing or parse fails (or lazy function returning it). Must not have side effects.
 * @param options - optional custom parse/serialize (default: JSON), or migrate for one-time migration logic
 */
export function useLocalStorage<T>(
  key: string,
  defaultValue: T | (() => T),
  options?: UseLocalStorageOptions<T>,
): [T, (value: T | ((prev: T) => T)) => void] {
  const parse = options?.parse ?? defaultParse;
  const serialize = options?.serialize ?? defaultSerialize;

  const [state, setState] = useState<T>(() => {
    const value = options?.migrate
      ? options.migrate()
      : readFromStorage(key, defaultValue, parse);

    return value;
  });

  // The latest value, updated synchronously by every set. Each update is
  // resolved against it and written straight away, so storage always matches
  // the final state, even when several sets happen in one tick or the
  // component unmounts before re-rendering (e.g. a modal that closes after
  // saving).
  const latest = useRef(state);

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      const next =
        typeof value === "function"
          ? (value as (prev: T) => T)(latest.current)
          : value;
      latest.current = next;
      writeToStorage(key, next, serialize);
      setState(next);
    },
    [key, serialize],
  );

  return [state, setValue];
}
