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

/** Maps legacy `producer` JSON to `generator` and drops the old key. */
function normalizeItemGeneratorFromLegacy(
  item: PlayerEconomyBalanceItem,
): PlayerEconomyBalanceItem {
  const record = { ...(item as unknown as Record<string, unknown>) };
  const legacyProducer = record.producer === true;
  delete record.producer;
  const base = record as unknown as PlayerEconomyBalanceItem;
  if (base.generator !== undefined) return base;
  if (legacyProducer) return { ...base, generator: true };
  return base;
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
      if (typeof v !== "number" || !Number.isFinite(v) || v <= 0) continue;
      const cur = items[k];
      const base: PlayerEconomyBalanceItem = cur ?? {
        name: k,
        description: "",
      };
      if (base.initialBalance === undefined) {
        items[k] = { ...base, initialBalance: Math.floor(v) };
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

  const out: PlayerEconomyConfig = {
    actions,
    ...(Object.keys(itemsWithGeneratorInference).length > 0
      ? { items: itemsWithGeneratorInference }
      : {}),
    ...(input.descriptions ? { descriptions: input.descriptions } : {}),
    ...(visualTheme ? { visualTheme } : {}),
    ...(input.playUrl ? { playUrl: input.playUrl } : {}),
    ...(input.mainCurrencyToken?.trim()
      ? { mainCurrencyToken: input.mainCurrencyToken.trim() }
      : {}),
  };

  return out;
}

/** Tokens used as produce `requires` are treated as generators when the flag was omitted (legacy configs). */
function inferGeneratorFlagsFromGeneratorRecipeRules(
  items: Record<string, PlayerEconomyBalanceItem>,
  actions: Record<string, PlayerEconomyActionDefinition>,
): Record<string, PlayerEconomyBalanceItem> {
  const out = { ...items };
  for (const def of Object.values(actions)) {
    if (!def.produce) continue;
    for (const rule of Object.values(def.produce)) {
      const req = rule.requires?.trim();
      if (!req) continue;
      const cur = out[req];
      if (cur && cur.generator === undefined) {
        out[req] = { ...cur, generator: true };
      }
    }
  }
  return out;
}
