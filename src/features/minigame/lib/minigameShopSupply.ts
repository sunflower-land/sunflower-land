import type {
  MintRule,
  PlayerEconomyActionDefinition,
  PlayerEconomyConfig,
} from "./types";

export function maxMintGrantForRule(rule: MintRule): number {
  if ("min" in rule && "max" in rule && "dailyCap" in rule) {
    return Math.max(0, Math.floor(rule.max));
  }
  if ("amount" in rule && "dailyCap" in rule && !("min" in rule)) {
    return Math.max(0, Math.floor((rule as { amount: number }).amount));
  }
  if ("amount" in rule) {
    return Math.max(0, Math.floor((rule as { amount: number }).amount));
  }
  return 0;
}

/** Max minted amount per successful shop invocation, per output token. */
export function mintIncrementsPerShopInvocation(
  def: PlayerEconomyActionDefinition,
): Record<string, number> {
  const mint = def.mint;
  if (!mint) return {};
  return Object.fromEntries(
    Object.entries(mint).map(([k, rule]) => [
      k,
      maxMintGrantForRule(rule as MintRule),
    ]),
  );
}

/** Tightest remaining global “slots” among capped mint outputs; `undefined` if no caps apply. */
export function minSupplyRemainingForShopAction(
  config: PlayerEconomyConfig,
  actionId: string,
  supplies: Record<string, number>,
): number | undefined {
  const def = config.actions[actionId];
  if (!def) return undefined;
  const incs = mintIncrementsPerShopInvocation(def);
  const items = config.items ?? {};
  let minRem: number | undefined;
  for (const [token, inc] of Object.entries(incs)) {
    if (inc <= 0) continue;
    const cap = items[token]?.supply;
    if (typeof cap !== "number" || !Number.isFinite(cap) || cap < 0) continue;
    const used = Math.max(0, Math.floor(supplies[token] ?? 0));
    const rem = Math.max(0, Math.floor(cap) - used);
    minRem = minRem === undefined ? rem : Math.min(minRem, rem);
  }
  return minRem;
}

export function isShopActionGloballySupplyBlocked(
  config: PlayerEconomyConfig,
  actionId: string,
  supplies: Record<string, number>,
): boolean {
  const def = config.actions[actionId];
  if (!def) return false;
  const incs = mintIncrementsPerShopInvocation(def);
  const items = config.items ?? {};
  for (const [token, inc] of Object.entries(incs)) {
    if (inc <= 0) continue;
    const cap = items[token]?.supply;
    if (typeof cap !== "number" || !Number.isFinite(cap) || cap < 0) continue;
    const used = Math.max(0, Math.floor(supplies[token] ?? 0));
    const rem = Math.max(0, Math.floor(cap) - used);
    if (rem < inc) return true;
  }
  return false;
}

export function bumpEconomySuppliesForShopPurchase(
  supplies: Record<string, number>,
  config: PlayerEconomyConfig,
  actionId: string,
): Record<string, number> {
  const def = config.actions[actionId];
  if (!def) return { ...supplies };
  const incs = mintIncrementsPerShopInvocation(def);
  const out = { ...supplies };
  for (const [t, v] of Object.entries(incs)) {
    if (v > 0) out[t] = Math.floor(out[t] ?? 0) + v;
  }
  return out;
}
