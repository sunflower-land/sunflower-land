function isPlainObject(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    Object.prototype.toString.call(value) === "[object Object]"
  );
}

/**
 * Deep merge for JSON-ish objects.
 * - Arrays are replaced, not concatenated.
 * - Non-plain objects are replaced.
 */
export function deepMerge<T>(base: T | undefined, patch: unknown): T {
  if (base === undefined) return patch as T;

  if (Array.isArray(base) || Array.isArray(patch)) {
    return patch as T;
  }

  if (isPlainObject(base) && isPlainObject(patch)) {
    const merged: Record<string, unknown> = { ...base };

    for (const [key, value] of Object.entries(patch)) {
      merged[key] = deepMerge((base as any)[key], value);
    }

    return merged as T;
  }

  return patch as T;
}
