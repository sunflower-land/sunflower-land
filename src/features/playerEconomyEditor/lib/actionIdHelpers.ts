import type { ActionType } from "./types";

const PREFIX: Record<ActionType, string> = {
  produce: "generate",
  shop: "shop",
  custom: "custom",
};

/** Safe keys for JSON / portal action ids: letters, digits, underscore, hyphen. */
export function sanitizeActionId(raw: string): string {
  const t = raw.trim().replace(/\s+/g, "_");
  return t.replace(/[^a-zA-Z0-9_-]/g, "");
}

export function actionTypeIdPrefix(type: ActionType): string {
  return PREFIX[type];
}

/**
 * Next unused id like `generate_001`, `shop_002`, using 3-digit suffix.
 */
export function suggestNextActionId(
  type: ActionType,
  existingIds: Iterable<string>,
): string {
  const prefix = PREFIX[type];
  const set = new Set(Array.from(existingIds, (s) => s.trim()).filter(Boolean));
  for (let i = 1; i < 10_000; i++) {
    const cand = `${prefix}_${String(i).padStart(3, "0")}`;
    if (!set.has(cand)) return cand;
  }
  return `${prefix}_${Date.now()}`;
}

export function uniquifyActionId(
  preferred: string,
  forbidden: ReadonlySet<string>,
): string {
  const s = sanitizeActionId(preferred);
  if (!s) return s;
  if (!forbidden.has(s)) return s;
  let n = 2;
  while (forbidden.has(`${s}_${n}`)) n++;
  return `${s}_${n}`;
}
