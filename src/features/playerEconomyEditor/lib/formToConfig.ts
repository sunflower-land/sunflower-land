import type {
  BurnRule,
  CollectRule,
  PlayerEconomyActionDefinition,
  PlayerEconomyConfig,
  GeneratorRecipeRule,
  MintRule,
} from "features/minigame/lib/types";

import type {
  ActionForm,
  CustomMintRowForm,
  EditorFormState,
  ItemForm,
  MintRuleForm,
} from "./types";
import {
  sanitizeActionId,
  suggestNextActionId,
  uniquifyActionId,
} from "./actionIdHelpers";

const CUSTOM_MINT_UNCAPPED_DAILY = 999_999_999;

/** 0–100 for form fields; values ≥100 omit `chance` on saved collect rules. */
function formChanceToSavedCollect(
  raw: number | undefined | null,
): number | undefined {
  if (raw === undefined || raw === null) return undefined;
  const n = Math.round(Number(raw));
  if (!Number.isFinite(n)) return undefined;
  const c = Math.max(0, Math.min(100, n));
  return c >= 100 ? undefined : c;
}

function normalizeGeneratorRequires(raw: unknown): string {
  if (raw === undefined || raw === null) return "";
  return String(raw).trim();
}

function customMintRowToCollectAmount(row: CustomMintRowForm): number {
  const mi = Math.max(0, Math.floor(row.min ?? 0));
  const ma = Math.max(0, Math.floor(row.max ?? 0));
  return Math.max(mi, ma);
}

function linkedMintRuleToCustomMintRow(m: MintRuleForm): CustomMintRowForm {
  const amt = Math.max(0, Math.floor(m.amount ?? 0));
  return {
    token: m.token,
    min: amt,
    max: amt,
    dailyCap: m.dailyCap ?? 0,
    chance: m.collectChance ?? 100,
  };
}

/** Legacy editor stored collect payouts in `linkedCollectMint`; mint rows are the source of truth now. */
function resolveMintLikeRowsForTimedCollect(
  row: ActionForm,
): CustomMintRowForm[] {
  if (row.customMint.some((m) => m.token.trim())) {
    return row.customMint;
  }
  return (row.linkedCollectMint ?? []).map(linkedMintRuleToCustomMintRow);
}

function buildCollectMapFromCustomMint(
  rows: CustomMintRowForm[],
  seconds: number,
  norm: (t: string) => string,
): Record<string, CollectRule> {
  const map: Record<string, CollectRule> = {};
  for (const row of rows) {
    const tok = norm(row.token.trim());
    if (!tok) continue;
    const amount = customMintRowToCollectAmount(row);
    const entry: CollectRule = { amount, seconds };
    const ch = formChanceToSavedCollect(row.chance);
    if (ch !== undefined) entry.chance = ch;
    map[tok] = entry;
  }
  return map;
}

function hasTimedCustomCollectFromMint(row: ActionForm): boolean {
  if (row.actionType !== "custom") return false;
  if (!row.produce.length) return false;
  if ((row.produce[0]?.msToComplete ?? 0) <= 0) return false;
  return resolveMintLikeRowsForTimedCollect(row).some((m) =>
    Boolean(m.token?.trim()),
  );
}

function buildTokenRemap(items: ItemForm[]): Map<string, string> {
  const m = new Map<string, string>();
  for (const it of items) {
    if (it.deleted) continue;
    if (it.id === undefined) continue;
    const sid = String(it.id);
    m.set(sid, sid);
    if (it.key.trim()) m.set(it.key.trim(), sid);
  }
  return m;
}

function rowToDefinition(
  row: ActionForm,
  norm: (t: string) => string,
): PlayerEconomyActionDefinition {
  const def: PlayerEconomyActionDefinition = {};

  if (row.actionType !== "shop") {
    if (row.actionType === "custom") {
      const first = row.require[0];
      const tok = first ? norm(first.token) : "";
      if (tok) {
        def.require = { [tok]: { amount: 1 } };
      }
    } else {
      const require = row.require.reduce(
        (map, t) => {
          const tok = norm(t.token);
          if (!tok) return map;
          map[tok] = { amount: Math.max(0, t.amount || 0) };
          return map;
        },
        {} as Record<string, { amount: number }>,
      );
      if (Object.keys(require).length) def.require = require;
    }
  }

  const requireBelow = row.requireBelow.reduce(
    (map, t) => {
      const tok = norm(t.token);
      if (!tok) return map;
      map[tok] = Math.max(0, t.amount || 0);
      return map;
    },
    {} as Record<string, number>,
  );
  if (Object.keys(requireBelow).length) def.requireBelow = requireBelow;

  const requireAbsent = row.requireAbsent.map((s) => norm(s)).filter(Boolean);
  if (requireAbsent.length) def.requireAbsent = requireAbsent;

  if (row.actionType === "custom") {
    const customBurn = row.customBurn.reduce(
      (map, r) => {
        const tok = norm(r.token);
        if (!tok) return map;
        const min = Math.max(0, Math.floor(r.min || 0));
        const max = Math.max(0, Math.floor(r.max || 0));
        if (max < min) return map;
        if (min === max) {
          map[tok] = { amount: min };
        } else {
          map[tok] = { min, max };
        }
        return map;
      },
      {} as Record<string, BurnRule>,
    );
    if (Object.keys(customBurn).length) def.burn = customBurn;

    const customMint = row.customMint.reduce(
      (map, r) => {
        const tok = norm(r.token);
        if (!tok) return map;
        const min = Math.max(0, Math.floor(r.min || 0));
        const max = Math.max(0, Math.floor(r.max || 0));
        const dailyCap = Math.max(0, Math.floor(r.dailyCap || 0));
        const mintChance = formChanceToSavedCollect(r.chance);
        if (max < min) return map;
        if (min === max && dailyCap <= 0) {
          map[tok] =
            mintChance !== undefined
              ? ({ amount: min, chance: mintChance } as MintRule)
              : { amount: min };
        } else {
          map[tok] = {
            min,
            max,
            dailyCap: dailyCap > 0 ? dailyCap : CUSTOM_MINT_UNCAPPED_DAILY,
            ...(mintChance !== undefined ? { chance: mintChance } : {}),
          } as MintRule;
        }
        return map;
      },
      {} as Record<string, MintRule>,
    );
    if (Object.keys(customMint).length) def.mint = customMint;

    def.showInShop = false;
    const cap = row.customDailyUsesCap ?? 0;
    if (cap > 0) {
      def.maxUsesPerDay = Math.max(0, Math.floor(cap));
    }
  } else {
    const burn = row.burn.reduce(
      (map, t) => {
        const tok = norm(t.token);
        if (!tok) return map;
        map[tok] = { amount: Math.max(0, t.amount || 0) };
        return map;
      },
      {} as Record<string, { amount: number }>,
    );
    if (Object.keys(burn).length) def.burn = burn;

    const mint = row.mint.reduce(
      (map, t) => {
        const tok = norm(t.token);
        if (!tok) return map;
        if (t.type === "ranged") {
          map[tok] = {
            min: Math.max(0, t.min || 0),
            max: Math.max(0, t.max || 0),
            dailyCap: Math.max(0, t.dailyCap || 0),
          };
        } else if (t.type === "fixedCapped") {
          map[tok] = {
            amount: Math.max(0, t.amount || 0),
            dailyCap: Math.max(0, t.dailyCap || 0),
          };
        } else {
          map[tok] = { amount: Math.max(0, t.amount || 0) };
        }
        return map;
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {} as Record<string, any>,
    );
    if (Object.keys(mint).length) {
      if (row.actionType === "shop") {
        const key = Object.keys(mint)[0];
        def.mint = { [key]: mint[key] };
      } else {
        def.mint = mint;
      }
    }
  }

  const produce = row.produce.reduce(
    (map, p) => {
      const tok = norm(p.token);
      if (!tok) return map;
      const rule: GeneratorRecipeRule = {
        msToComplete: Math.max(0, p.msToComplete || 0),
      };
      if (p.limit !== undefined && p.limit > 0) rule.limit = p.limit;
      const reqStr = normalizeGeneratorRequires(p.requires);
      if (reqStr) rule.requires = norm(reqStr);
      map[tok] = rule;
      return map;
    },
    {} as Record<string, GeneratorRecipeRule>,
  );
  if (Object.keys(produce).length) def.produce = produce;

  const collect = row.collect.reduce(
    (map, c) => {
      const tok = norm(c.token);
      if (!tok) return map;
      const entry: CollectRule = { amount: Math.max(0, c.amount || 0) };
      if (c.seconds !== undefined) {
        entry.seconds = Math.max(0, Math.floor(c.seconds));
      }
      const ch = formChanceToSavedCollect(c.chance);
      if (ch !== undefined) entry.chance = ch;
      map[tok] = entry;
      return map;
    },
    {} as Record<string, CollectRule>,
  );
  if (Object.keys(collect).length) def.collect = collect;

  if (row.actionType === "shop" && row.showInShop === false) {
    def.showInShop = false;
  }

  const shopLim = Math.max(0, Math.floor(row.shopPurchaseLimit ?? 0));
  if (row.actionType === "shop" && shopLim > 0) {
    def.purchaseLimit = shopLim;
  }

  def.type = row.actionType === "produce" ? "generator" : row.actionType;

  return def;
}

function isDefinitionEmpty(def: PlayerEconomyActionDefinition): boolean {
  return (
    Object.keys(def).filter((k) => k !== "type" && k !== "editorRuleKind")
      .length === 0
  );
}

function buildActionsFromForm(
  rows: ActionForm[],
  norm: (t: string) => string,
): PlayerEconomyConfig["actions"] {
  const actions: PlayerEconomyConfig["actions"] = {};
  const usedKeys = new Set<string>();

  for (const row of rows) {
    const def = rowToDefinition(row, norm);
    if (isDefinitionEmpty(def)) continue;

    let primaryId = sanitizeActionId(row.id);
    if (!primaryId) {
      primaryId = suggestNextActionId(row.actionType, usedKeys);
    } else {
      primaryId = uniquifyActionId(primaryId, usedKeys);
    }
    usedKeys.add(primaryId);

    if (hasTimedCustomCollectFromMint(row)) {
      const seconds = Math.max(
        0,
        Math.floor((row.produce[0]?.msToComplete ?? 0) / 1000),
      );
      const mintLike = resolveMintLikeRowsForTimedCollect(row);
      const collectMap = buildCollectMapFromCustomMint(mintLike, seconds, norm);
      if (Object.keys(collectMap).length) {
        def.collect = collectMap;
        delete def.mint;
        const p0 = row.produce[0];
        const reqStr = normalizeGeneratorRequires(p0?.requires);
        const ordered = mintLike
          .map((m) => norm(m.token.trim()))
          .filter(Boolean);
        const firstOut = ordered[0];
        if (firstOut) {
          def.produce = {
            [firstOut]: {
              ...(reqStr ? { requires: norm(reqStr) } : {}),
              ...(p0?.limit !== undefined && p0.limit > 0
                ? { limit: p0.limit }
                : {}),
            },
          };
        }
      }
    }

    actions[primaryId] = def;
  }

  return actions;
}

export function formToConfig(form: EditorFormState): PlayerEconomyConfig {
  const normToken = buildTokenRemap(form.items);
  const norm = (t: string) => {
    const s = t.trim();
    return normToken.get(s) ?? s;
  };

  const actions = buildActionsFromForm(form.actions, norm);

  const items = form.items.reduce(
    (acc, item) => {
      if (item.deleted) return acc;
      if (item.id === undefined) return acc;
      const k = String(item.id);
      const init = item.initialBalance ?? 0;
      acc[k] = {
        name: item.name,
        description: item.description,
        ...(item.image.trim() ? { image: item.image.trim() } : {}),
        id: item.id,
        ...(item.tradeable ? { tradeable: true } : {}),
        ...(item.generator ? { generator: true } : {}),
        ...(item.trophy ? { trophy: true } : {}),
        ...(init > 0 ? { initialBalance: Math.max(0, Math.floor(init)) } : {}),
      };
      return acc;
    },
    {} as NonNullable<PlayerEconomyConfig["items"]>,
  );

  const tradeableKeys = new Set(
    form.items
      .filter((i) => !i.deleted && i.tradeable && i.id !== undefined)
      .map((i) => String(i.id)),
  );
  const mct = form.mainCurrencyToken.trim();

  const purchasesRecord = form.purchases.reduce(
    (acc, row) => {
      const pid = row.id.trim();
      if (!pid) return acc;
      const flower = Math.floor(Number(row.flower));
      const amount = Math.floor(Number(row.amount));
      const itemId = Math.floor(Number(row.itemId));
      if (
        !Number.isFinite(flower) ||
        flower < 1 ||
        flower > 100 ||
        !Number.isFinite(amount) ||
        amount < 1 ||
        !Number.isFinite(itemId)
      ) {
        return acc;
      }
      acc[pid] = { flower, amount, itemId };
      return acc;
    },
    {} as NonNullable<PlayerEconomyConfig["purchases"]>,
  );

  const config: PlayerEconomyConfig = {
    actions,
    ...(Object.keys(items).length ? { items } : {}),
    ...(Object.keys(purchasesRecord).length > 0
      ? { purchases: purchasesRecord }
      : {}),
    descriptions: {
      title: form.descriptionTitle || undefined,
      subtitle: form.descriptionSubtitle || undefined,
      welcome: form.descriptionWelcome || undefined,
      rules: form.descriptionRules || undefined,
    },
    ...(form.playUrl.trim() ? { playUrl: form.playUrl.trim() } : {}),
    ...(mct && tradeableKeys.has(mct) ? { mainCurrencyToken: mct } : {}),
  };

  return config;
}
