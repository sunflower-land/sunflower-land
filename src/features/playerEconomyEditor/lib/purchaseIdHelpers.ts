/** Next unused id like `p_1`, `p_2`. */
export function suggestNextPurchaseId(existingIds: Iterable<string>): string {
  const set = new Set(Array.from(existingIds, (s) => s.trim()).filter(Boolean));
  for (let i = 1; i < 100_000; i++) {
    const cand = `p_${i}`;
    if (!set.has(cand)) return cand;
  }
  return `p_${Date.now()}`;
}
