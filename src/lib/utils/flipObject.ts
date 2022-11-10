export type AnyKey = keyof any;

export function flipObject<K extends AnyKey, V extends AnyKey>(
  object: Record<K, V>
) {
  const flipped: Partial<Record<V, K>> = {};

  for (const key in object) {
    flipped[object[key]] = key;
  }

  return flipped as Record<V, K>;
}
