import {
  parseCollectRuleSeconds,
  resolveProduceDurationMs,
} from "features/minigame/lib/resolveProduceDuration";
import {
  migrateLegacyPlayerEconomyConfigFields,
  type PlayerEconomyConfigWithLegacy,
} from "features/minigame/lib/minigameConfigMigration";
import type {
  BurnRule,
  CollectRule,
  PlayerEconomyActionDefinition,
  PlayerEconomyBalanceItem,
  PlayerEconomyConfig,
  PlayerEconomyEditorActionType,
  GeneratorRecipeRule,
  MintRule,
} from "features/minigame/lib/types";

import type {
  ActionForm,
  ActionType,
  CustomBurnRowForm,
  CustomMintRowForm,
  EditorFormState,
  ItemForm,
  MintRuleForm,
} from "./types";
import { EMPTY_MINT_ROW } from "./types";

/** Match formToConfig sentinel for “no per-token daily cap” in the editor. */
const CUSTOM_MINT_UNCAPPED = 999_999_999;

function normalizeProduceRequiresForForm(raw: unknown): string {
  if (raw === undefined || raw === null) return "";
  return String(raw).trim();
}

function sortConfigKeys(a: string, b: string): number {
  const isNum = (k: string) => /^\d+$/.test(k);
  if (isNum(a) && isNum(b)) return Number(a) - Number(b);
  return a.localeCompare(b);
}

export function parseMintRule(key: string, rule: MintRule): MintRuleForm {
  const r = rule as Record<string, number>;
  if ("min" in r && "max" in r) {
    return {
      token: key,
      type: "ranged",
      amount: 0,
      min: r.min ?? 0,
      max: r.max ?? 0,
      dailyCap: r.dailyCap ?? 0,
    };
  }
  if ("dailyCap" in r && "amount" in r) {
    return {
      token: key,
      type: "fixedCapped",
      amount: r.amount ?? 0,
      dailyCap: r.dailyCap ?? 0,
      min: 0,
      max: 0,
    };
  }
  return {
    token: key,
    type: "fixed",
    amount: r.amount ?? 0,
    dailyCap: 0,
    min: 0,
    max: 0,
  };
}

function isPlainFixedMint(rule: MintRule): boolean {
  return (
    typeof rule === "object" &&
    rule !== null &&
    "amount" in rule &&
    !("dailyCap" in rule) &&
    !("min" in rule)
  );
}

function isPlainFixedBurn(rule: BurnRule): boolean {
  return (
    typeof rule === "object" &&
    rule !== null &&
    "amount" in rule &&
    !("min" in rule)
  );
}

function inferActionType(def: PlayerEconomyActionDefinition): ActionType {
  if (Object.keys(def.produce ?? {}).length > 0) return "produce";

  const mint = def.mint ?? {};
  const burn = def.burn ?? {};
  const hasMint = Object.keys(mint).length > 0;
  const hasBurn = Object.keys(burn).length > 0;
  const requireKeys = Object.keys(def.require ?? {});

  const nonPlainMint =
    hasMint && Object.values(mint).some((r) => !isPlainFixedMint(r));
  const nonPlainBurn =
    hasBurn && Object.values(burn).some((r) => !isPlainFixedBurn(r));
  const hasMaxUses =
    typeof def.maxUsesPerDay === "number" && def.maxUsesPerDay > 0;

  if (
    nonPlainMint ||
    nonPlainBurn ||
    hasMaxUses ||
    requireKeys.length > 0 ||
    def.showInShop === false
  ) {
    return "custom";
  }

  /** Burn-only actions (e.g. sink tokens) use the Custom editor; there is no standalone Burn rule. */
  if (hasBurn && !hasMint) return "custom";

  if (hasMint) return "shop";
  return "shop";
}

type DefWithLegacyEditor = PlayerEconomyActionDefinition & {
  /** Pre-rename persisted field; still read for older saved configs. */
  editorRuleKind?: PlayerEconomyEditorActionType;
};

function readPersistedEditorCardType(
  def: PlayerEconomyActionDefinition,
): PlayerEconomyEditorActionType | undefined {
  const d = def as DefWithLegacyEditor;
  if (d.type === "shop" || d.type === "generator" || d.type === "custom") {
    return d.type;
  }
  if (
    d.editorRuleKind === "shop" ||
    d.editorRuleKind === "generator" ||
    d.editorRuleKind === "custom"
  ) {
    return d.editorRuleKind;
  }
  return undefined;
}

/** Prefer persisted `type` (and legacy `editorRuleKind`) so Generate rules never mis-merge as shop/custom. */
function resolveActionType(def: PlayerEconomyActionDefinition): ActionType {
  const k = readPersistedEditorCardType(def);
  if (k === "generator") return "produce";
  if (k === "shop") return "shop";
  if (k === "custom") return "custom";
  return inferActionType(def);
}

function mintToCustomRows(m: Record<string, MintRule>): CustomMintRowForm[] {
  return Object.entries(m).map(([key, rule]) => {
    const r = rule as Record<string, number>;
    if ("min" in r && "max" in r) {
      const dc = r.dailyCap ?? 0;
      return {
        token: key,
        min: r.min ?? 0,
        max: r.max ?? 0,
        dailyCap: dc >= CUSTOM_MINT_UNCAPPED - 1 ? 0 : dc,
      };
    }
    if ("dailyCap" in r && "amount" in r) {
      return {
        token: key,
        min: r.amount ?? 0,
        max: r.amount ?? 0,
        dailyCap: r.dailyCap ?? 0,
      };
    }
    return {
      token: key,
      min: r.amount ?? 0,
      max: r.amount ?? 0,
      dailyCap: 0,
    };
  });
}

function burnToCustomRows(b: Record<string, BurnRule>): CustomBurnRowForm[] {
  return Object.entries(b).map(([key, rule]) => {
    if ("min" in rule) {
      return { token: key, min: rule.min, max: rule.max };
    }
    return { token: key, min: rule.amount, max: rule.amount };
  });
}

function actionEntryToForm(
  id: string,
  def: PlayerEconomyActionDefinition,
): ActionForm {
  const at = resolveActionType(def);
  const customMint = at === "custom" ? mintToCustomRows(def.mint ?? {}) : [];
  const customBurn = at === "custom" ? burnToCustomRows(def.burn ?? {}) : [];

  return {
    actionType: at,
    id,
    showInShop: def.showInShop !== false,
    shopPurchaseLimit:
      at === "shop" &&
      typeof def.purchaseLimit === "number" &&
      def.purchaseLimit > 0
        ? Math.floor(def.purchaseLimit)
        : 0,
    mint:
      at === "custom"
        ? []
        : Object.entries(def.mint ?? {}).map(([key, rule]) =>
            parseMintRule(key, rule),
          ),
    burn:
      at === "custom"
        ? []
        : Object.entries(def.burn ?? {}).map(([key, rule]) => {
            const br = rule as BurnRule;
            return {
              token: key,
              amount: "amount" in br ? br.amount : 0,
            };
          }),
    require:
      at === "custom"
        ? (() => {
            const entries = Object.entries(def.require ?? {});
            if (entries.length === 0) {
              return [{ token: "", amount: 1 }];
            }
            const [key] = entries[0];
            return [{ token: key, amount: 1 }];
          })()
        : Object.entries(def.require ?? {}).map(([key, rule]) => ({
            token: key,
            amount: (rule as { amount: number }).amount,
          })),
    requireBelow: Object.entries(def.requireBelow ?? {}).map(
      ([key, amount]) => ({
        token: key,
        amount: amount as number,
      }),
    ),
    requireAbsent: (def.requireAbsent ?? []) as string[],
    produce: (() => {
      const entries = Object.entries(def.produce ?? {});
      if (entries.length > 0) {
        return entries.map(([key, rule]) => {
          const r = rule as GeneratorRecipeRule;
          return {
            token: key,
            msToComplete: resolveProduceDurationMs(key, r, def.collect),
            limit: r.limit,
            requires: normalizeProduceRequiresForForm(r.requires),
          };
        });
      }
      /** Legacy/broken saves: generator + inline collect but no `produce` (output lived only in collect). */
      if (at === "produce" && Object.keys(def.collect ?? {}).length === 1) {
        const outTok = Object.keys(def.collect ?? {})[0]!;
        const r: GeneratorRecipeRule = {};
        return [
          {
            token: outTok,
            msToComplete: resolveProduceDurationMs(outTok, r, def.collect),
            limit: undefined,
            requires: "",
          },
        ];
      }
      return [];
    })(),
    collect: Object.entries(def.collect ?? {}).map(([key, rule]) => {
      const r = rule as CollectRule;
      const sec = parseCollectRuleSeconds((r as { seconds?: unknown }).seconds);
      return {
        token: key,
        amount: r.amount,
        ...(sec !== undefined ? { seconds: sec } : {}),
      };
    }),
    customMint,
    customBurn,
    customDailyUsesCap: def.maxUsesPerDay ?? 0,
  };
}

function collectRowsToLinkedMintForms(
  cForm: ActionForm,
): ActionForm["linkedCollectMint"] {
  if (cForm.collect.length > 0) {
    return cForm.collect.map((c) => ({
      token: c.token,
      type: "fixed" as const,
      amount: c.amount,
      dailyCap: 0,
      min: 0,
      max: 0,
    }));
  }
  if (cForm.mint.length > 0) return cForm.mint;
  return [{ ...EMPTY_MINT_ROW }];
}

function buildProductionCollectMapFromActions(
  actions: Record<string, PlayerEconomyActionDefinition>,
): Record<string, string> {
  const m: Record<string, string> = {};
  for (const [actionId, def] of Object.entries(actions)) {
    if (!def.produce) continue;
    for (const rule of Object.values(def.produce)) {
      /** `requires` may be absent after API round-trip; `collectActionId` alone defines the editor link. */
      if (rule.collectActionId) {
        m[actionId] = rule.collectActionId;
        break;
      }
    }
  }
  return m;
}

function mergeProduceCollectPairs(
  sortedForms: ActionForm[],
  productionCollectByStartId: Record<string, string>,
): ActionForm[] {
  const byStart = productionCollectByStartId;
  const formById = new Map(sortedForms.map((f) => [f.id, f]));
  const absorbedCollectIds = new Set<string>();

  for (const a of sortedForms) {
    const collectId = byStart[a.id];
    if (!collectId || a.actionType !== "produce") continue;
    const cForm = formById.get(collectId);
    if (cForm) absorbedCollectIds.add(collectId);
  }

  const out: ActionForm[] = [];
  for (const a of sortedForms) {
    if (absorbedCollectIds.has(a.id)) continue;

    const collectId = byStart[a.id];
    const cForm = collectId ? formById.get(collectId) : undefined;

    if (collectId && cForm && a.actionType === "produce") {
      out.push({
        ...a,
        linkedCollectId: collectId,
        linkedCollectMint: collectRowsToLinkedMintForms(cForm),
      });
      continue;
    }

    out.push(a);
  }

  return out;
}

/** Every collect action id referenced by a `produce.collectActionId` link. */
function collectActionIdsTargetedByGenerators(
  actions: Record<string, PlayerEconomyActionDefinition>,
): Set<string> {
  const out = new Set<string>();
  for (const def of Object.values(actions)) {
    if (!def.produce) continue;
    for (const rule of Object.values(def.produce)) {
      if (rule.collectActionId) out.add(rule.collectActionId);
    }
  }
  return out;
}

/**
 * Collect-only stubs merged from Generate saves — hide as their own rule card;
 * the parent Generate card owns them via `collectActionId`.
 */
function isLinkedCollectOnlyAction(
  actionId: string,
  def: PlayerEconomyActionDefinition,
  targetedIds: Set<string>,
): boolean {
  if (!targetedIds.has(actionId)) return false;
  const hasProduce = Object.keys(def.produce ?? {}).length > 0;
  const hasMint = Object.keys(def.mint ?? {}).length > 0;
  const hasBurn = Object.keys(def.burn ?? {}).length > 0;
  const hasRequire = Object.keys(def.require ?? {}).length > 0;
  const hasCollect = Object.keys(def.collect ?? {}).length > 0;
  if (hasProduce || hasMint || hasBurn || hasRequire) return false;
  return hasCollect;
}

/**
 * If merge missed but `produce` still has `collectActionId`, pull collect rows from the
 * saved collect action so the Generate card is complete before we hide the collect stub.
 */
function repairGenerateLinkedCollect(
  forms: ActionForm[],
  actions: Record<string, PlayerEconomyActionDefinition>,
): ActionForm[] {
  return forms.map((f) => {
    if (f.actionType !== "produce") return f;
    if (f.linkedCollectMint?.some((m) => m.token.trim())) return f;
    const def = actions[f.id];
    const inlineCollect = def?.collect && Object.keys(def.collect).length > 0;
    if (inlineCollect && def.collect) {
      return {
        ...f,
        linkedCollectMint: Object.entries(def.collect).map(([key, rule]) => ({
          token: key,
          type: "fixed" as const,
          amount: (rule as { amount: number }).amount,
          dailyCap: 0,
          min: 0,
          max: 0,
        })),
      };
    }
    if (!def?.produce) return f;
    const collectId = Object.values(def.produce).find(
      (r) => r.collectActionId,
    )?.collectActionId;
    if (!collectId?.trim()) return f;
    const collectDef = actions[collectId];
    const collectMap = collectDef?.collect ?? {};
    const entries = Object.entries(collectMap);
    if (entries.length === 0) return f;
    return {
      ...f,
      linkedCollectId: collectId,
      linkedCollectMint: entries.map(([key, rule]) => ({
        token: key,
        type: "fixed" as const,
        amount: (rule as { amount: number }).amount,
        dailyCap: 0,
        min: 0,
        max: 0,
      })),
    };
  });
}

function filterEditorRuleCards(
  merged: ActionForm[],
  actions: Record<string, PlayerEconomyActionDefinition>,
  targetedCollectIds: Set<string>,
): ActionForm[] {
  return merged.filter((form) => {
    const def = actions[form.id];
    if (!def) return true;
    return !isLinkedCollectOnlyAction(form.id, def, targetedCollectIds);
  });
}

export function configToForm(
  slug: string,
  config: PlayerEconomyConfig,
): EditorFormState {
  const cfg = migrateLegacyPlayerEconomyConfigFields(
    config as PlayerEconomyConfigWithLegacy,
  );

  const sortedActionEntries = Object.entries(cfg.actions ?? {}).sort(
    ([a], [b]) => sortConfigKeys(a, b),
  );

  const rawForms = sortedActionEntries.map(([id, value]) =>
    actionEntryToForm(id, value as PlayerEconomyActionDefinition),
  );

  const prodMap = buildProductionCollectMapFromActions(cfg.actions ?? {});
  const targetedCollectIds = collectActionIdsTargetedByGenerators(
    cfg.actions ?? {},
  );
  const merged = mergeProduceCollectPairs(rawForms, prodMap);
  const repaired = repairGenerateLinkedCollect(merged, cfg.actions ?? {});
  const actions = filterEditorRuleCards(
    repaired,
    cfg.actions ?? {},
    targetedCollectIds,
  );

  const sortedItemEntries = Object.entries(cfg.items ?? {}).sort(([a], [b]) =>
    sortConfigKeys(a, b),
  );

  const items: ItemForm[] = sortedItemEntries.map(([entryKey, v]) => {
    const item = v as PlayerEconomyBalanceItem;
    const numericEntry = /^\d+$/.test(entryKey);
    const id =
      item.id !== undefined
        ? item.id
        : numericEntry
          ? Number(entryKey)
          : undefined;
    const key = id !== undefined ? String(id) : entryKey;
    const rawInit = item.initialBalance;
    const initialBalance =
      typeof rawInit === "number" && Number.isFinite(rawInit)
        ? Math.max(0, Math.floor(rawInit))
        : 0;
    return {
      key,
      name: item.name,
      description: item.description,
      image: item.image ?? "",
      id,
      tradeable: item.tradeable === true,
      generator: item.generator === true,
      initialBalance,
    };
  });

  return {
    slug,
    playUrl: cfg.playUrl ?? "",
    descriptionTitle: cfg.descriptions?.title ?? "",
    descriptionSubtitle: cfg.descriptions?.subtitle ?? "",
    descriptionWelcome: cfg.descriptions?.welcome ?? "",
    descriptionRules: cfg.descriptions?.rules ?? "",
    items,
    actions,
  };
}
