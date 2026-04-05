import { resolveProduceDurationMs } from "./resolveProduceDuration";
import {
  BurnRule,
  CollectRule,
  DailyActionUsesBucket,
  DailyMintBucket,
  PlayerEconomyActionDefinition,
  PlayerEconomyConfig,
  PlayerEconomyProcessInput,
  PlayerEconomyProcessResult,
  PlayerEconomyRuntimeState,
  MintRule,
  GeneratorRecipeRule,
  RequireRule,
} from "./types";

/** User-facing label for a balance token; uses `items[token].name` when present. */
function itemDisplayName(config: PlayerEconomyConfig, token: string): string {
  const name = config.items?.[token]?.name?.trim();
  if (name) return name;
  return token;
}

export function utcCalendarDay(now: number): string {
  return new Date(now).toISOString().slice(0, 10);
}

export function rolloverDailyMintedIfNeeded(
  bucket: DailyMintBucket,
  now: number,
): void {
  const today = utcCalendarDay(now);
  if (bucket.utcDay !== today) {
    bucket.utcDay = today;
    bucket.minted = {};
  }
}

function dailyMintSubKey(actionId: string, token: string): string {
  return `${actionId}|${token}`;
}

function isRangedMint(rule: MintRule): rule is {
  min: number;
  max: number;
  dailyCap: number;
} {
  return "min" in rule && "max" in rule && "dailyCap" in rule;
}

function isFixedMintWithDailyCap(
  rule: MintRule,
): rule is { amount: number; dailyCap: number } {
  return "amount" in rule && "dailyCap" in rule && !("min" in rule);
}

export function clonePlayerEconomyRuntimeState(
  state: PlayerEconomyRuntimeState,
): PlayerEconomyRuntimeState {
  const uses = state.dailyActionUses;
  const purchases = state.purchaseCounts;
  return {
    balances: { ...state.balances },
    generating: Object.fromEntries(
      Object.entries(state.generating).map(([id, entry]) => [id, { ...entry }]),
    ),
    dailyMinted: {
      utcDay: state.dailyMinted.utcDay,
      minted: { ...state.dailyMinted.minted },
    },
    activity: state.activity,
    dailyActivity: {
      date: state.dailyActivity.date,
      count: state.dailyActivity.count,
    },
    ...(uses
      ? {
          dailyActionUses: {
            utcDay: uses.utcDay,
            byAction: { ...uses.byAction },
          },
        }
      : {}),
    ...(purchases && Object.keys(purchases).length > 0
      ? { purchaseCounts: { ...purchases } }
      : {}),
  };
}

function recordSuccessfulMinigameAction(
  state: PlayerEconomyRuntimeState,
  now: number,
): void {
  const today = utcCalendarDay(now);
  state.activity = (state.activity ?? 0) + 1;
  if (state.dailyActivity.date !== today) {
    state.dailyActivity = { date: today, count: 1 };
  } else {
    state.dailyActivity = {
      date: today,
      count: state.dailyActivity.count + 1,
    };
  }
}

function getBalance(balances: Record<string, number>, token: string): number {
  return balances[token] ?? 0;
}

function applyRequire(
  config: PlayerEconomyConfig,
  balances: Record<string, number>,
  require: Record<string, RequireRule> | undefined,
): string | undefined {
  if (!require) return undefined;
  for (const [token, rule] of Object.entries(require)) {
    if (getBalance(balances, token) < rule.amount) {
      const label = itemDisplayName(config, token);
      return `Requires at least ${rule.amount} ${label}`;
    }
  }
  return undefined;
}

function applyRequireBelow(
  config: PlayerEconomyConfig,
  balances: Record<string, number>,
  requireBelow: Record<string, number> | undefined,
): string | undefined {
  if (!requireBelow) return undefined;
  for (const [token, maxExclusive] of Object.entries(requireBelow)) {
    if (getBalance(balances, token) >= maxExclusive) {
      return `${itemDisplayName(config, token)} is at or above the allowed maximum`;
    }
  }
  return undefined;
}

function applyRequireAbsent(
  config: PlayerEconomyConfig,
  balances: Record<string, number>,
  absent: string[] | undefined,
): string | undefined {
  if (!absent?.length) return undefined;
  for (const token of absent) {
    if (getBalance(balances, token) > 0) {
      return `${itemDisplayName(config, token)} already acquired`;
    }
  }
  return undefined;
}

function isRangedBurn(rule: BurnRule): rule is { min: number; max: number } {
  return "min" in rule && "max" in rule;
}

function applyBurns(
  config: PlayerEconomyConfig,
  balances: Record<string, number>,
  burn: Record<string, BurnRule> | undefined,
  amounts: Record<string, number> | undefined,
): string | undefined {
  if (!burn) return undefined;
  for (const [token, rule] of Object.entries(burn)) {
    const label = itemDisplayName(config, token);
    const have = getBalance(balances, token);
    let sub: number;
    if (isRangedBurn(rule)) {
      const passed = amounts?.[token];
      if (passed === undefined || !Number.isInteger(passed)) {
        return `Missing or invalid burn amount for ${label}`;
      }
      if (passed < rule.min || passed > rule.max) {
        return `Burn for ${label} must be between ${rule.min} and ${rule.max}`;
      }
      sub = passed;
    } else {
      sub = rule.amount;
    }
    if (have < sub) {
      return `Insufficient ${label}`;
    }
  }
  for (const [token, rule] of Object.entries(burn)) {
    const sub = isRangedBurn(rule) ? (amounts?.[token] as number) : rule.amount;
    balances[token] = getBalance(balances, token) - sub;
    if (balances[token] === 0) {
      delete balances[token];
    }
  }
  return undefined;
}

function newProducingJobId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

function applyProduce(
  config: PlayerEconomyConfig,
  balances: Record<string, number>,
  generating: PlayerEconomyRuntimeState["generating"],
  produce: Record<string, GeneratorRecipeRule> | undefined,
  collect: Record<string, CollectRule> | undefined,
  now: number,
): { error?: string; generatorJobId?: string } {
  if (!produce) return {};
  for (const [outputToken, rule] of Object.entries(produce)) {
    const outLabel = itemDisplayName(config, outputToken);
    const activeForOutput = Object.values(generating).filter(
      (p) => p.outputToken === outputToken,
    ).length;
    if (rule.limit !== undefined && activeForOutput >= rule.limit) {
      return { error: `Production limit reached for ${outLabel}` };
    }
    if (rule.requires !== undefined) {
      const reqKey = String(rule.requires).trim();
      const reqLabel = itemDisplayName(config, reqKey);
      const activeForLane = Object.values(generating).filter(
        (p) => p.outputToken === outputToken && p.requires === rule.requires,
      ).length;
      const cap = getBalance(balances, reqKey);
      if (activeForLane >= cap) {
        return {
          error: `Not enough ${reqLabel} capacity for new ${outLabel} production`,
        };
      }
    }
    const id = newProducingJobId();
    const durationMs = resolveProduceDurationMs(outputToken, rule, collect);
    generating[id] = {
      outputToken,
      startedAt: now,
      completesAt: now + durationMs,
      ...(rule.requires !== undefined ? { requires: rule.requires } : {}),
    };
    return { generatorJobId: id };
  }
  return {};
}

function applyMint(
  config: PlayerEconomyConfig,
  balances: Record<string, number>,
  bucket: DailyMintBucket,
  mint: Record<string, MintRule> | undefined,
  actionId: string,
  amounts: Record<string, number> | undefined,
): string | undefined {
  if (!mint) return undefined;
  for (const [token, rule] of Object.entries(mint)) {
    const label = itemDisplayName(config, token);
    let add: number;
    if (isRangedMint(rule)) {
      const passed = amounts?.[token];
      if (passed === undefined || !Number.isInteger(passed)) {
        return `Missing or invalid mint amount for ${label}`;
      }
      if (passed < rule.min || passed > rule.max) {
        return `Amount for ${label} must be between ${rule.min} and ${rule.max}`;
      }
      const key = dailyMintSubKey(actionId, token);
      const used = bucket.minted[key] ?? 0;
      if (used + passed > rule.dailyCap) {
        return `Daily cap exceeded for ${label}`;
      }
      bucket.minted[key] = used + passed;
      add = passed;
    } else if (isFixedMintWithDailyCap(rule)) {
      const key = dailyMintSubKey(actionId, token);
      const used = bucket.minted[key] ?? 0;
      if (used + rule.amount > rule.dailyCap) {
        return `Daily cap exceeded for ${label}`;
      }
      bucket.minted[key] = used + rule.amount;
      add = rule.amount;
    } else {
      add = rule.amount;
    }
    balances[token] = getBalance(balances, token) + add;
  }
  return undefined;
}

/**
 * Temporary client roll until collect outcomes are resolved server-side.
 */
function resolvedCollectGrantAmount(rule: CollectRule): number {
  const chance = rule.chance;
  if (chance === undefined || !Number.isFinite(chance) || chance >= 100) {
    return rule.amount;
  }
  if (chance <= 0) return 0;
  return Math.random() * 100 < chance ? rule.amount : 0;
}

function collectRowWeightsForMultiCollect(
  entries: [string, CollectRule][],
): number[] {
  return entries.map(([, r]) => {
    if (r.chance === undefined) return 100;
    const c = Number(r.chance);
    if (!Number.isFinite(c)) return 100;
    return c;
  });
}

function pickWeightedCollectIndexClient(weights: number[]): number {
  const w = weights.map((x) => {
    const n = Number(x);
    if (!Number.isFinite(n)) return 0;
    return Math.max(0, Math.floor(n));
  });
  let sum = w.reduce((a, b) => a + b, 0);
  const use = sum > 0 ? w : w.map(() => 1);
  sum = use.reduce((a, b) => a + b, 0);
  const roll = Math.floor(Math.random() * sum);
  let acc = 0;
  for (let i = 0; i < use.length; i++) {
    acc += use[i];
    if (roll < acc) return i;
  }
  return use.length - 1;
}

function applyCollect(
  balances: Record<string, number>,
  generating: PlayerEconomyRuntimeState["generating"],
  collect: Record<string, CollectRule> | undefined,
  itemId: string | undefined,
  now: number,
): { error: string } | { grants: { token: string; amount: number }[] } {
  if (!collect) {
    return { error: "Collect is not configured for this action" };
  }
  if (!itemId) {
    return { error: "itemId is required for collect" };
  }
  const job = generating[itemId];
  if (!job) {
    return { error: "Unknown production id" };
  }
  if (now < job.completesAt) {
    return { error: "Production not complete yet" };
  }
  const entries = Object.entries(collect);
  if (entries.length === 0) {
    return { error: "Collect is not configured for this action" };
  }

  if (entries.length === 1) {
    const [token, rule] = entries[0];
    if (token !== job.outputToken) {
      return { error: "Production output does not match this action" };
    }
    const grant = resolvedCollectGrantAmount(rule);
    balances[token] = getBalance(balances, token) + grant;
    delete generating[itemId];
    return { grants: [{ token, amount: grant }] };
  }

  const weights = collectRowWeightsForMultiCollect(entries);
  const idx = pickWeightedCollectIndexClient(weights);
  const [token, rule] = entries[idx];
  const grant = rule.amount;
  balances[token] = getBalance(balances, token) + grant;
  delete generating[itemId];
  return { grants: [{ token, amount: grant }] };
}

function rolloverDailyActionUsesIfNeeded(
  bucket: PlayerEconomyRuntimeState["dailyActionUses"] | undefined,
  now: number,
): DailyActionUsesBucket {
  const today = utcCalendarDay(now);
  if (!bucket || bucket.utcDay !== today) {
    return { utcDay: today, byAction: {} };
  }
  return { utcDay: bucket.utcDay, byAction: { ...bucket.byAction } };
}

function checkPurchaseLimit(
  def: PlayerEconomyActionDefinition,
  actionId: string,
  purchaseCounts: PlayerEconomyRuntimeState["purchaseCounts"],
  itemId: string | undefined,
): string | undefined {
  if (itemId?.trim()) return undefined;
  const cap = def.purchaseLimit;
  if (cap === undefined || !Number.isFinite(cap) || cap <= 0) return undefined;
  const limit = Math.floor(cap);
  const used = purchaseCounts?.[actionId] ?? 0;
  if (used >= limit) {
    return "Purchase limit reached";
  }
  return undefined;
}

function incrementPurchaseCountIfNeeded(
  state: PlayerEconomyRuntimeState,
  def: PlayerEconomyActionDefinition,
  actionId: string,
  itemId: string | undefined,
): void {
  if (itemId?.trim()) return;
  const cap = def.purchaseLimit;
  if (cap === undefined || !Number.isFinite(cap) || cap <= 0) return;
  const prev = state.purchaseCounts ?? {};
  state.purchaseCounts = {
    ...prev,
    [actionId]: (prev[actionId] ?? 0) + 1,
  };
}

function checkMaxUsesPerDay(
  def: PlayerEconomyActionDefinition,
  actionId: string,
  dailyActionUses: PlayerEconomyRuntimeState["dailyActionUses"],
  now: number,
): string | undefined {
  const cap = def.maxUsesPerDay;
  if (cap === undefined || cap <= 0) return undefined;
  const bucket = rolloverDailyActionUsesIfNeeded(dailyActionUses, now);
  const used = bucket.byAction[actionId] ?? 0;
  if (used >= cap) {
    return "Daily limit reached for this action";
  }
  return undefined;
}

function runPhases(
  config: PlayerEconomyConfig,
  def: PlayerEconomyActionDefinition,
  input: PlayerEconomyProcessInput,
  working: PlayerEconomyRuntimeState,
): {
  error?: string;
  generatorJobId?: string;
  collectGrants?: { token: string; amount: number }[];
} {
  const hasProduce = Object.keys(def.produce ?? {}).length > 0;
  const hasCollect = Object.keys(def.collect ?? {}).length > 0;
  const itemId = input.itemId?.trim();

  /** With `itemId`, only the collect phase runs (same action id as start for unified configs). */
  if (itemId) {
    if (!hasCollect) {
      return { error: "itemId is not valid for this action" };
    }
    const collectResult = applyCollect(
      working.balances,
      working.generating,
      def.collect,
      itemId,
      input.now,
    );
    if ("error" in collectResult) {
      return { error: collectResult.error };
    }
    return { collectGrants: collectResult.grants };
  }

  if (hasCollect && !hasProduce) {
    return { error: "itemId is required for collect" };
  }

  const errRequire = applyRequire(config, working.balances, def.require);
  if (errRequire) return { error: errRequire };

  const errBelow = applyRequireBelow(
    config,
    working.balances,
    def.requireBelow,
  );
  if (errBelow) return { error: errBelow };

  const errAbsent = applyRequireAbsent(
    config,
    working.balances,
    def.requireAbsent,
  );
  if (errAbsent) return { error: errAbsent };

  const errBurn = applyBurns(config, working.balances, def.burn, input.amounts);
  if (errBurn) return { error: errBurn };

  const prod = applyProduce(
    config,
    working.balances,
    working.generating,
    def.produce,
    def.collect,
    input.now,
  );
  if (prod.error) return { error: prod.error };

  const errMint = applyMint(
    config,
    working.balances,
    working.dailyMinted,
    def.mint,
    input.actionId,
    input.amounts,
  );
  if (errMint) return { error: errMint };

  return { generatorJobId: prod.generatorJobId };
}

export function processPlayerEconomyAction(
  config: PlayerEconomyConfig,
  state: PlayerEconomyRuntimeState,
  input: PlayerEconomyProcessInput,
): PlayerEconomyProcessResult {
  const def = config.actions[input.actionId];
  if (!def) {
    return { ok: false, error: `Unknown action ${input.actionId}` };
  }

  const working = clonePlayerEconomyRuntimeState(state);
  rolloverDailyMintedIfNeeded(working.dailyMinted, input.now);

  const errCap = checkMaxUsesPerDay(
    def,
    input.actionId,
    working.dailyActionUses,
    input.now,
  );
  if (errCap) {
    return { ok: false, error: errCap };
  }

  const errPurchaseLimit = checkPurchaseLimit(
    def,
    input.actionId,
    working.purchaseCounts,
    input.itemId,
  );
  if (errPurchaseLimit) {
    return { ok: false, error: errPurchaseLimit };
  }

  const { error, generatorJobId, collectGrants } = runPhases(
    config,
    def,
    input,
    working,
  );
  if (error) {
    return { ok: false, error };
  }

  recordSuccessfulMinigameAction(working, input.now);

  if (def.maxUsesPerDay !== undefined && def.maxUsesPerDay > 0) {
    const rolled = rolloverDailyActionUsesIfNeeded(
      working.dailyActionUses,
      input.now,
    );
    const id = input.actionId;
    rolled.byAction[id] = (rolled.byAction[id] ?? 0) + 1;
    working.dailyActionUses = rolled;
  }

  incrementPurchaseCountIfNeeded(working, def, input.actionId, input.itemId);

  return {
    ok: true,
    state: working,
    generatorJobId,
    ...(collectGrants !== undefined ? { collectGrants } : {}),
  };
}

export function emptyPlayerEconomyState(
  now: number = Date.now(),
): PlayerEconomyRuntimeState {
  const day = utcCalendarDay(now);
  return {
    balances: {},
    generating: {},
    dailyMinted: { utcDay: day, minted: {} },
    activity: 0,
    dailyActivity: { date: day, count: 0 },
    dailyActionUses: { utcDay: day, byAction: {} },
    purchaseCounts: {},
  };
}
