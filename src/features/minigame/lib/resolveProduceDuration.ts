import type { CollectRule, GeneratorRecipeRule } from "./types";

/**
 * Coerce persisted/API values (numbers or numeric strings) to whole seconds.
 */
export function parseCollectRuleSeconds(raw: unknown): number | undefined {
  if (raw === undefined || raw === null) return undefined;
  const n = typeof raw === "number" ? raw : Number(raw);
  if (!Number.isFinite(n)) return undefined;
  return Math.max(0, Math.floor(n));
}

/**
 * Milliseconds until a produce job completes: prefers `collect[outputToken].seconds`,
 * then the only `collect` entry when there is exactly one (key drift / API quirks),
 * then legacy `produce.msToComplete`.
 */
export function resolveProduceDurationMs(
  outputToken: string,
  produceRule: GeneratorRecipeRule,
  collect: Record<string, CollectRule> | undefined,
): number {
  const secDirect = parseCollectRuleSeconds(collect?.[outputToken]?.seconds);
  if (secDirect !== undefined) return secDirect * 1000;

  const keys = collect ? Object.keys(collect) : [];
  if (keys.length === 1) {
    const k = keys[0];
    const secOnly = parseCollectRuleSeconds(collect?.[k]?.seconds);
    if (secOnly !== undefined) return secOnly * 1000;
  }

  const legacyMs = produceRule.msToComplete;
  if (legacyMs !== undefined) {
    const m = typeof legacyMs === "number" ? legacyMs : Number(legacyMs);
    if (Number.isFinite(m)) return Math.max(0, m);
  }
  return 0;
}
