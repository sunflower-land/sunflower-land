import type {
  PlayerEconomyActionDefinition,
  PlayerEconomyBalanceItem,
  PlayerEconomyConfig,
  GeneratorRecipeRule,
} from "./types";

export type PlayerEconomyConfigWithLegacy = PlayerEconomyConfig & {
  initialBalances?: Record<string, number>;
  productionCollectByStartId?: Record<string, string>;
  dashboard?: {
    productionCollectByStartId?: Record<string, string>;
    visualTheme?: string;
  };
};

/**
 * APIs may serialize booleans as strings (`"true"` / `"1"`). Returns `undefined` if unknown.
 */
function parseBooleanishFlag(v: unknown): boolean | undefined {
  if (v === true || v === 1) return true;
  if (v === false || v === 0) return false;
  if (typeof v === "string") {
    const s = v.trim().toLowerCase();
    if (["true", "1", "yes"].includes(s)) return true;
    if (["false", "0", "no"].includes(s)) return false;
  }
  return undefined;
}

/** True when an item is a generator cap (APIs may send booleans as strings or omit the flag). */
export function isGeneratorBalanceItem(
  item: PlayerEconomyBalanceItem | undefined,
): boolean {
  return parseBooleanishFlag(item?.generator) === true;
}

function coercePositiveInt(v: unknown): number | undefined {
  if (typeof v === "number" && Number.isFinite(v) && v > 0)
    return Math.floor(v);
  const n = Number(v);
  if (Number.isFinite(n) && n > 0) return Math.floor(n);
  return undefined;
}

/** Maps legacy `producer` JSON to `generator` and drops the old key. */
function normalizeItemGeneratorFromLegacy(
  item: PlayerEconomyBalanceItem,
): PlayerEconomyBalanceItem {
  const record = { ...(item as unknown as Record<string, unknown>) };
  const legacyProducer = parseBooleanishFlag(record.producer) === true;
  delete record.producer;

  const genParsed = parseBooleanishFlag(record.generator);
  delete record.generator;

  const trophyParsed = parseBooleanishFlag(record.trophy);
  delete record.trophy;

  const base = record as unknown as PlayerEconomyBalanceItem;

  let generator: boolean | undefined = genParsed;
  if (legacyProducer) generator = true;

  let out: PlayerEconomyBalanceItem = base;
  if (generator === true) out = { ...out, generator: true };
  else if (generator === false) out = { ...out, generator: false };

  if (trophyParsed === true) out = { ...out, trophy: true };
  else if (trophyParsed === false) out = { ...out, trophy: false };

  return out;
}

export function migrateLegacyPlayerEconomyConfigFields(
  input: PlayerEconomyConfigWithLegacy,
): PlayerEconomyConfig {
  const items: Record<string, PlayerEconomyBalanceItem> = {};
  for (const [k, v] of Object.entries(input.items ?? {})) {
    items[k] = normalizeItemGeneratorFromLegacy(v);
  }

  if (input.initialBalances) {
    for (const [k, v] of Object.entries(input.initialBalances)) {
      const amt = coercePositiveInt(v);
      if (amt == null) continue;
      const cur = items[k];
      const base: PlayerEconomyBalanceItem = cur ?? {
        name: k,
        description: "",
      };
      if (base.initialBalance === undefined) {
        items[k] = { ...base, initialBalance: amt };
      }
    }
  }

  const actions: Record<string, PlayerEconomyActionDefinition> = {
    ...input.actions,
  };

  const prodMap: Record<string, string> = {
    ...(input.dashboard?.productionCollectByStartId ?? {}),
    ...(input.productionCollectByStartId ?? {}),
  };

  for (const [startId, collectId] of Object.entries(prodMap)) {
    const def = actions[startId];
    if (!def?.produce) continue;
    const nextProduce: Record<string, GeneratorRecipeRule> = {};
    for (const [out, rule] of Object.entries(def.produce)) {
      if (rule.requires && rule.collectActionId === undefined) {
        nextProduce[out] = { ...rule, collectActionId: collectId };
      } else {
        nextProduce[out] = { ...rule };
      }
    }
    actions[startId] = { ...def, produce: nextProduce };
  }

  const visualTheme = input.visualTheme ?? input.dashboard?.visualTheme;

  const itemsWithGeneratorInference =
    inferGeneratorFlagsFromGeneratorRecipeRules(items, actions);

  const rawPurchases = input.purchases;
  const purchases =
    rawPurchases &&
    typeof rawPurchases === "object" &&
    !Array.isArray(rawPurchases)
      ? rawPurchases
      : undefined;

  const out: PlayerEconomyConfig = {
    actions,
    ...(Object.keys(itemsWithGeneratorInference).length > 0
      ? { items: itemsWithGeneratorInference }
      : {}),
    ...(purchases && Object.keys(purchases).length > 0 ? { purchases } : {}),
    ...(input.descriptions ? { descriptions: input.descriptions } : {}),
    ...(visualTheme ? { visualTheme } : {}),
    ...(input.playUrl ? { playUrl: input.playUrl } : {}),
    ...(input.mainCurrencyToken?.trim()
      ? { mainCurrencyToken: input.mainCurrencyToken.trim() }
      : {}),
  };

  return out;
}

/**
 * Tokens used as produce `requires` are generators. Sets `generator: true` when missing
 * (APIs often omit `items[requires]` entirely, or omit the flag while `generator: true` lives only on the item record).
 */
function inferGeneratorFlagsFromGeneratorRecipeRules(
  items: Record<string, PlayerEconomyBalanceItem>,
  actions: Record<string, PlayerEconomyActionDefinition>,
): Record<string, PlayerEconomyBalanceItem> {
  const out = { ...items };
  for (const def of Object.values(actions)) {
    if (!def.produce) continue;
    for (const rule of Object.values(def.produce)) {
      const rawReq = rule.requires;
      const req =
        typeof rawReq === "string"
          ? rawReq.trim()
          : String(rawReq ?? "").trim();
      if (!req) continue;
      const cur = out[req];
      if (!cur) {
        out[req] = { name: req, description: "", generator: true };
      } else {
        // Any token used as produce `requires` is a generator building; editor/API mistakes
        // (`generator: false` or string booleans) must not hide it from the production zone.
        out[req] = { ...cur, generator: true };
      }
    }
  }
  return out;
}
